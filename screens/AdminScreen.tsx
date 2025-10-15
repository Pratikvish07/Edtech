import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  Dimensions,
  Animated,
  RefreshControl,
  Switch,
  Platform,
  FlatList,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Video, ResizeMode } from 'expo-av';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

// ----- Types -----
interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  price: number;
  discount?: number;
  demoVideo: string;
  lessons: number;
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  category: 'Mobile' | 'Web' | 'Programming' | 'Design' | 'Data Science' | 'AI';
  students: number;
  featured?: boolean;
  ratings?: number;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'instructor' | 'student';
  status: 'active' | 'blocked';
}

// ----- Utils -----
const saveData = async (key: string, value: any) => { await AsyncStorage.setItem(key, JSON.stringify(value)); };
const getData = async (key: string) => { const val = await AsyncStorage.getItem(key); return val ? JSON.parse(val) : null; };

// ----- Toast -----
const Toast = ({ message, type, onHide }: { message: string; type: 'success' | 'error'; onHide: () => void }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
      Animated.delay(2000),
      Animated.timing(fadeAnim, { toValue: 0, duration: 300, useNativeDriver: true }),
    ]).start(() => onHide());
  }, [message]);

  return (
    <Animated.View
      style={{ opacity: fadeAnim, transform: [{ translateY: fadeAnim.interpolate({ inputRange: [0, 1], outputRange: [50, 0] }) }] }}
      className={`absolute bottom-8 left-1/2 -ml-24 w-48 p-3 rounded-lg shadow-lg items-center z-50 ${type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}
    >
      <Text className="text-white font-semibold text-center">{message}</Text>
    </Animated.View>
  );
};

// ----- AdminDashboard -----
export default function AdminDashboard({ navigation }: any) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'courses' | 'users'>('courses');
  const [courses, setCourses] = useState<Course[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [newCourse, setNewCourse] = useState<Partial<Course>>({});
  const [newUser, setNewUser] = useState<Partial<User>>({});
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showAddCourseModal, setShowAddCourseModal] = useState(false);
  const [showEditCourseModal, setShowEditCourseModal] = useState(false);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const fadeAnim = useState(new Animated.Value(0))[0];
  const slideAnim = useState(new Animated.Value(50))[0];
  const [selectedCourseIds, setSelectedCourseIds] = useState<string[]>([]);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [filterCategory, setFilterCategory] = useState<'all' | Course['category']>('all');
  const [sortBy, setSortBy] = useState<'none' | 'price-asc' | 'price-desc' | 'title-asc' | 'title-desc'>('none');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const courseCategories: Course['category'][] = ['Mobile', 'Web', 'Programming', 'Design', 'Data Science', 'AI'];
  const courseLevels: Course['level'][] = ['Beginner', 'Intermediate', 'Advanced'];

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 800, useNativeDriver: true }),
    ]).start();
  }, []);

  // Load sample data
  useEffect(() => {
    const loadData = async () => {
      const storedCourses = await getData('courses');
      if (storedCourses) setCourses(storedCourses);
      else {
        const defaultCourses: Course[] = [
          { id: '1', title: 'React Native Masterclass', description: 'Build cross-platform apps', instructor: 'John Doe', price: 99, discount: 20, demoVideo: 'https://www.w3schools.com/html/mov_bbb.mp4', lessons: 42, duration: '8 weeks', level: 'Intermediate', category: 'Mobile', students: 1247, featured: true, ratings: 4.8 },
          { id: '2', title: 'Advanced JavaScript', description: 'Deep dive into JS', instructor: 'Jane Smith', price: 79, demoVideo: 'https://www.w3schools.com/html/mov_bbb.mp4', lessons: 36, duration: '6 weeks', level: 'Advanced', category: 'Programming', students: 892, ratings: 4.5 },
          { id: '3', title: 'Web Development Basics', description: 'Learn HTML, CSS, JS', instructor: 'Mike Ross', price: 49, demoVideo: 'https://www.w3schools.com/html/mov_bbb.mp4', lessons: 20, duration: '4 weeks', level: 'Beginner', category: 'Web', students: 2500, ratings: 4.2 },
        ];
        setCourses(defaultCourses);
        await saveData('courses', defaultCourses);
      }

      const defaultUsers: User[] = [
        { id: 'u1', name: 'Alice Johnson', email: 'alice@example.com', role: 'student', status: 'active' },
        { id: 'u2', name: 'Bob Williams', email: 'bob@example.com', role: 'instructor', status: 'active' },
        { id: 'u3', name: 'Charlie Brown', email: 'charlie@example.com', role: 'student', status: 'blocked' },
      ];
      setUsers(defaultUsers);
    };
    loadData();
  }, []);

  const showToast = (message: string, type: 'success' | 'error') => setToast({ message, type });

  // --- Filter & Sort ---
  const filteredAndSortedCourses = courses
    .filter(course => course.title.toLowerCase().includes(searchQuery.toLowerCase()) && (filterCategory === 'all' || course.category === filterCategory))
    .sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'title-asc') return a.title.localeCompare(b.title);
      if (sortBy === 'title-desc') return b.title.localeCompare(a.title);
      return 0;
    });

  const filteredUsers = users.filter(user => user.name.toLowerCase().includes(searchQuery.toLowerCase()) || user.email.toLowerCase().includes(searchQuery.toLowerCase()));

  // --- Course Handlers ---
  const handleAddCourse = async () => {
    if (!newCourse.title || !newCourse.price || !newCourse.category || !newCourse.level || !newCourse.instructor) {
      return Alert.alert('Error', 'Title, Price, Category, Level, and Instructor are required');
    }
    const courseToAdd: Course = {
      ...newCourse as Course,
      id: Date.now().toString(),
      students: 0,
      lessons: 0,
      duration: newCourse.duration || 'N/A',
      demoVideo: newCourse.demoVideo || 'https://www.w3schools.com/html/mov_bbb.mp4',
      ratings: newCourse.ratings || 0,
    };
    const updatedCourses = [...courses, courseToAdd];
    setCourses(updatedCourses);
    await saveData('courses', updatedCourses);
    setShowAddCourseModal(false);
    setNewCourse({});
    showToast('Course added successfully!', 'success');
  };

  const handleEditCourse = async () => {
    if (!selectedCourse || !newCourse.title || !newCourse.price || !newCourse.category || !newCourse.level || !newCourse.instructor) {
      return Alert.alert('Error', 'All fields are required');
    }
    const updatedCourse: Course = { ...selectedCourse, ...newCourse };
    const updatedCourses = courses.map(c => c.id === selectedCourse.id ? updatedCourse : c);
    setCourses(updatedCourses);
    await saveData('courses', updatedCourses);
    setShowEditCourseModal(false);
    setSelectedCourse(null);
    setNewCourse({});
    showToast('Course updated successfully!', 'success');
  };

  // --- User Handlers ---
  const handleAddUser = async () => {
    if (!newUser.name || !newUser.email || !newUser.role) {
      return Alert.alert('Error', 'Name, Email, and Role are required');
    }
    const userToAdd: User = {
      ...newUser as User,
      id: Date.now().toString(),
      status: newUser.status || 'active',
    };
    const updatedUsers = [...users, userToAdd];
    setUsers(updatedUsers);
    await saveData('users', updatedUsers);
    setShowAddUserModal(false);
    setNewUser({});
    showToast('User added successfully!', 'success');
  };

  const handleEditUser = async () => {
    if (!selectedUser || !newUser.name || !newUser.email || !newUser.role) {
      return Alert.alert('Error', 'All fields are required');
    }
    const updatedUser: User = { ...selectedUser, ...newUser };
    const updatedUsers = users.map(u => u.id === selectedUser.id ? updatedUser : u);
    setUsers(updatedUsers);
    await saveData('users', updatedUsers);
    setShowEditUserModal(false);
    setSelectedUser(null);
    setNewUser({});
    showToast('User updated successfully!', 'success');
  };

  const handleDeleteUser = (id: string) => {
    Alert.alert('Delete User', 'Are you sure you want to delete this user?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => { const updatedUsers = users.filter(u => u.id !== id); setUsers(updatedUsers); await saveData('users', updatedUsers); showToast('User deleted!', 'success'); } }
    ]);
  };

  const toggleSelectUser = (id: string) => setSelectedUserIds(prev => prev.includes(id) ? prev.filter(userId => userId !== id) : [...prev, id]);
  const handleBulkDeleteUsers = () => {
    if (selectedUserIds.length === 0) return showToast('No users selected.', 'error');
    Alert.alert('Bulk Delete', `Delete ${selectedUserIds.length} users?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => { const updatedUsers = users.filter(u => !selectedUserIds.includes(u.id)); setUsers(updatedUsers); await saveData('users', updatedUsers); setSelectedUserIds([]); showToast('Users deleted!', 'success'); } }
    ]);
  };

  const handleDeleteCourse = (id: string) => {
    Alert.alert('Delete Course', 'Are you sure you want to delete this course?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => { const updatedCourses = courses.filter(c => c.id !== id); setCourses(updatedCourses); await saveData('courses', updatedCourses); showToast('Course deleted!', 'success'); } }
    ]);
  };

  const toggleSelectCourse = (id: string) => setSelectedCourseIds(prev => prev.includes(id) ? prev.filter(courseId => courseId !== id) : [...prev, id]);
  const handleBulkDelete = () => {
    if (selectedCourseIds.length === 0) return showToast('No courses selected.', 'error');
    Alert.alert('Bulk Delete', `Delete ${selectedCourseIds.length} courses?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => { const updatedCourses = courses.filter(c => !selectedCourseIds.includes(c.id)); setCourses(updatedCourses); await saveData('courses', updatedCourses); setSelectedCourseIds([]); showToast('Courses deleted!', 'success'); } }
    ]);
  };

  // --- Render Card ---
  const renderCourseCard = (course: Course) => {
    const discountedPrice = course.discount ? course.price * (1 - course.discount / 100) : course.price;
    const isSelected = selectedCourseIds.includes(course.id);

    return (
      <Animated.View key={course.id} style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }} className={`bg-white rounded-3xl shadow-lg mb-4 overflow-hidden ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <TouchableOpacity onPress={() => toggleSelectCourse(course.id)} className={`absolute top-3 left-3 z-10 ${isDarkMode ? 'bg-gray-700' : 'bg-white'} rounded-full p-1`}>
          <Ionicons name={isSelected ? 'checkbox-outline' : 'square-outline'} size={24} color={isSelected ? 'blue' : (isDarkMode ? 'white' : 'gray')} />
        </TouchableOpacity>
        <LinearGradient colors={['#4F46E5', '#7C73E6']} className="p-4 pt-10">
          <View className="flex-row justify-between items-start">
            <View className="flex-1">
              <Text className="text-xl font-bold text-white">{course.title}</Text>
              <Text className="text-blue-100 text-sm">by {course.instructor}</Text>
              {course.featured && <View className="bg-yellow-400 px-2 py-1 rounded-full mt-1 self-start"><Text className="text-xs text-white">Featured</Text></View>}
            </View>
            <View className="flex-row space-x-2">
              <TouchableOpacity onPress={() => { setSelectedCourse(course); setNewCourse(course); setShowEditCourseModal(true); }} className="bg-yellow-500 p-2 rounded-full"><Ionicons name="pencil" size={16} color="white" /></TouchableOpacity>
              <TouchableOpacity onPress={() => handleDeleteCourse(course.id)} className="bg-red-500 p-2 rounded-full"><Ionicons name="trash" size={16} color="white" /></TouchableOpacity>
            </View>
          </View>
        </LinearGradient>
        <View className="p-4">
          <Text className={`text-sm mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{course.description}</Text>
          {course.demoVideo && <Video source={{ uri: course.demoVideo }} rate={1.0} volume={1.0} useNativeControls resizeMode={ResizeMode.COVER} className="w-full h-40 rounded-2xl mb-3" />}
          <View className="flex-row justify-between items-center mb-2">
            <Text className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>${discountedPrice.toFixed(0)}</Text>
            <View className="flex-row items-center">
              <FontAwesome name="star" size={14} color="#FACC15" />
              <Text className={`text-sm ml-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>{course.ratings?.toFixed(1) || 'N/A'}</Text>
            </View>
            <Text className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>{course.category}</Text>
          </View>
        </View>
      </Animated.View>
    );
  };

  const renderUserCard = (user: User) => {
    const isSelected = selectedUserIds.includes(user.id);

    return (
      <Animated.View key={user.id} style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }} className={`bg-white rounded-3xl shadow-lg mb-4 overflow-hidden ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <TouchableOpacity onPress={() => toggleSelectUser(user.id)} className={`absolute top-3 left-3 z-10 ${isDarkMode ? 'bg-gray-700' : 'bg-white'} rounded-full p-1`}>
          <Ionicons name={isSelected ? 'checkbox-outline' : 'square-outline'} size={24} color={isSelected ? 'blue' : (isDarkMode ? 'white' : 'gray')} />
        </TouchableOpacity>
        <LinearGradient colors={['#10B981', '#34D399']} className="p-4 pt-10">
          <View className="flex-row justify-between items-start">
            <View className="flex-1">
              <Text className="text-xl font-bold text-white">{user.name}</Text>
              <Text className="text-green-100 text-sm">{user.email}</Text>
              <View className="flex-row items-center mt-1">
                <Text className="text-green-200 text-xs bg-green-600 px-2 py-1 rounded-full">{user.role}</Text>
                <Text className={`text-xs ml-2 px-2 py-1 rounded-full ${user.status === 'active' ? 'bg-blue-500 text-white' : 'bg-red-500 text-white'}`}>{user.status}</Text>
              </View>
            </View>
            <View className="flex-row space-x-2">
              <TouchableOpacity onPress={() => { setSelectedUser(user); setNewUser(user); setShowEditUserModal(true); }} className="bg-yellow-500 p-2 rounded-full"><Ionicons name="pencil" size={16} color="white" /></TouchableOpacity>
              <TouchableOpacity onPress={() => handleDeleteUser(user.id)} className="bg-red-500 p-2 rounded-full"><Ionicons name="trash" size={16} color="white" /></TouchableOpacity>
            </View>
          </View>
        </LinearGradient>
        <View className="p-4">
          <Text className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>ID: {user.id}</Text>
        </View>
      </Animated.View>
    );
  };

  return (
    <View className={`flex-1 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <View className="flex-row justify-between items-center px-6 py-4 mb-4">
        <Text className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Admin Dashboard
        </Text>
        <View className="flex-row items-center space-x-4">
          <TouchableOpacity
            onPress={() => activeTab === 'courses' ? setShowAddCourseModal(true) : setShowAddUserModal(true)}
            className="p-2 rounded"
          >
            <Ionicons name="add-circle-outline" size={28} color={isDarkMode ? 'white' : 'gray'} />
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={() => navigation.navigate('Login')}
            className="bg-red-500 px-4 py-2 rounded flex-row items-center"
          >
            <Ionicons name="log-out-outline" size={18} color="white" />
            <Text className="text-white font-semibold ml-2">Logout</Text>
          </TouchableOpacity>
          <Switch value={isDarkMode} onValueChange={setIsDarkMode} className="ml-2" />
        </View>
      </View>

      {/* Search & Tabs */}
      <View className="px-4 mb-2">
        <TextInput placeholder={`Search ${activeTab === 'courses' ? 'Courses' : 'Users'}...`} value={searchQuery} onChangeText={setSearchQuery} className={`border p-2 rounded-xl ${isDarkMode ? 'border-gray-700 bg-gray-800 text-white' : 'border-gray-300 bg-white text-gray-900'}`} />
        <View className="flex-row justify-around mt-2">
          <TouchableOpacity onPress={() => setActiveTab('courses')} className={`p-2 rounded-xl ${activeTab === 'courses' ? 'bg-blue-500' : 'bg-gray-300'}`}><Text className="text-white">Courses</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => setActiveTab('users')} className={`p-2 rounded-xl ${activeTab === 'users' ? 'bg-blue-500' : 'bg-gray-300'}`}><Text className="text-white">Users</Text></TouchableOpacity>
        </View>
      </View>

      {/* List */}
      <ScrollView className="px-4" refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); setTimeout(() => setRefreshing(false), 1500); }} />}>
        {activeTab === 'courses' ? (
          <>
            {filteredAndSortedCourses.map(renderCourseCard)}
            {selectedCourseIds.length > 0 && <TouchableOpacity onPress={handleBulkDelete} className="bg-red-600 p-3 rounded-xl mb-5"><Text className="text-white text-center font-bold">Delete Selected ({selectedCourseIds.length})</Text></TouchableOpacity>}
          </>
        ) : (
          <>
            {filteredUsers.map(renderUserCard)}
            {selectedUserIds.length > 0 && <TouchableOpacity onPress={handleBulkDeleteUsers} className="bg-red-600 p-3 rounded-xl mb-5"><Text className="text-white text-center font-bold">Delete Selected ({selectedUserIds.length})</Text></TouchableOpacity>}
          </>
        )}
      </ScrollView>

      {/* Modals */}
      {/* Add Course Modal */}
      <Modal visible={showAddCourseModal} animationType="slide" transparent>
        <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
          <View className="w-4/5 max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden">
            <LinearGradient colors={['#FFFFFF', '#F9FAFB']} className="p-4">
              <View className="flex-row justify-between items-center mb-4">
                <Text className="text-lg font-bold text-gray-900">Add Course</Text>
                <TouchableOpacity onPress={() => setShowAddCourseModal(false)}>
                  <Ionicons name="close" size={24} color="gray" />
                </TouchableOpacity>
              </View>
              <ScrollView showsVerticalScrollIndicator={false} className="max-h-96">
                <View className="relative mb-3">
                  <Ionicons name="book-outline" size={18} color="gray" className="absolute left-3 top-3 z-10" />
                  <TextInput placeholder="Title" value={newCourse.title || ''} onChangeText={(text) => setNewCourse({ ...newCourse, title: text })} className="pl-10 border border-gray-300 bg-white text-gray-900 p-2 rounded-lg text-sm" />
                </View>
                <View className="relative mb-3">
                  <Ionicons name="document-text-outline" size={18} color="gray" className="absolute left-3 top-3 z-10" />
                  <TextInput placeholder="Description" value={newCourse.description || ''} onChangeText={(text) => setNewCourse({ ...newCourse, description: text })} className="pl-10 border border-gray-300 bg-white text-gray-900 p-2 rounded-lg text-sm" multiline />
                </View>
                <View className="relative mb-3">
                  <Ionicons name="person-outline" size={18} color="gray" className="absolute left-3 top-3 z-10" />
                  <TextInput placeholder="Instructor" value={newCourse.instructor || ''} onChangeText={(text) => setNewCourse({ ...newCourse, instructor: text })} className="pl-10 border border-gray-300 bg-white text-gray-900 p-2 rounded-lg text-sm" />
                </View>
                <View className="relative mb-3">
                  <Ionicons name="cash-outline" size={18} color="gray" className="absolute left-3 top-3 z-10" />
                  <TextInput placeholder="Price" value={newCourse.price?.toString() || ''} onChangeText={(text) => setNewCourse({ ...newCourse, price: parseFloat(text) || 0 })} keyboardType="numeric" className="pl-10 border border-gray-300 bg-white text-gray-900 p-2 rounded-lg text-sm" />
                </View>
                <View className="mb-3">
                  <Text className="text-xs font-semibold mb-1 text-gray-900">Category</Text>
                  <Picker
                    selectedValue={newCourse.category || ''}
                    onValueChange={(itemValue) => setNewCourse({ ...newCourse, category: itemValue as Course['category'] })}
                    style={{ color: 'black', backgroundColor: 'white', borderRadius: 8, borderWidth: 1, borderColor: '#D1D5DB', padding: 8, fontSize: 14 }}
                  >
                    <Picker.Item label="Select Category" value="" />
                    {courseCategories.map(cat => <Picker.Item key={cat} label={cat} value={cat} />)}
                  </Picker>
                </View>
                <View className="mb-3">
                  <Text className="text-xs font-semibold mb-1 text-gray-900">Level</Text>
                  <Picker
                    selectedValue={newCourse.level || ''}
                    onValueChange={(itemValue) => setNewCourse({ ...newCourse, level: itemValue as Course['level'] })}
                    style={{ color: 'black', backgroundColor: 'white', borderRadius: 8, borderWidth: 1, borderColor: '#D1D5DB', padding: 8, fontSize: 14 }}
                  >
                    <Picker.Item label="Select Level" value="" />
                    {courseLevels.map(lvl => <Picker.Item key={lvl} label={lvl} value={lvl} />)}
                  </Picker>
                </View>
                <View className="flex-row justify-between mt-4">
                  <LinearGradient colors={['#3B82F6', '#1D4ED8']} className="flex-1 mr-1 rounded-lg">
                    <TouchableOpacity onPress={handleAddCourse} className="p-2 items-center">
                      <Text className="text-white text-center font-bold text-sm">Add Course</Text>
                    </TouchableOpacity>
                  </LinearGradient>
                  <TouchableOpacity onPress={() => setShowAddCourseModal(false)} className="flex-1 ml-1 p-2 rounded-lg bg-gray-300">
                    <Text className="text-center font-bold text-gray-900 text-sm">Cancel</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </LinearGradient>
          </View>
        </View>
      </Modal>

      {/* Edit Course Modal */}
      <Modal visible={showEditCourseModal} animationType="slide" transparent>
        <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
          <LinearGradient colors={isDarkMode ? ['#374151', '#1F2937'] : ['#FFFFFF', '#F9FAFB']} className="w-11/12 p-6 rounded-2xl shadow-2xl">
            <View className="flex-row justify-between items-center mb-4">
              <Text className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Edit Course</Text>
              <TouchableOpacity onPress={() => setShowEditCourseModal(false)}>
                <Ionicons name="close" size={24} color={isDarkMode ? 'white' : 'gray'} />
              </TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View className="relative mb-4">
                <Ionicons name="book-outline" size={20} color={isDarkMode ? 'white' : 'gray'} className="absolute left-3 top-3 z-10" />
                <TextInput placeholder="Title" value={newCourse.title || ''} onChangeText={(text) => setNewCourse({ ...newCourse, title: text })} className={`pl-10 border p-3 rounded-xl ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-900'}`} />
              </View>
              <View className="relative mb-4">
                <Ionicons name="document-text-outline" size={20} color={isDarkMode ? 'white' : 'gray'} className="absolute left-3 top-3 z-10" />
                <TextInput placeholder="Description" value={newCourse.description || ''} onChangeText={(text) => setNewCourse({ ...newCourse, description: text })} className={`pl-10 border p-3 rounded-xl ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-900'}`} multiline />
              </View>
              <View className="relative mb-4">
                <Ionicons name="person-outline" size={20} color={isDarkMode ? 'white' : 'gray'} className="absolute left-3 top-3 z-10" />
                <TextInput placeholder="Instructor" value={newCourse.instructor || ''} onChangeText={(text) => setNewCourse({ ...newCourse, instructor: text })} className={`pl-10 border p-3 rounded-xl ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-900'}`} />
              </View>
              <View className="relative mb-4">
                <Ionicons name="cash-outline" size={20} color={isDarkMode ? 'white' : 'gray'} className="absolute left-3 top-3 z-10" />
                <TextInput placeholder="Price" value={newCourse.price?.toString() || ''} onChangeText={(text) => setNewCourse({ ...newCourse, price: parseFloat(text) || 0 })} keyboardType="numeric" className={`pl-10 border p-3 rounded-xl ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-900'}`} />
              </View>
              <View className="mb-4">
                <Text className={`text-sm font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Category</Text>
                <Picker
                  selectedValue={newCourse.category || ''}
                  onValueChange={(itemValue) => setNewCourse({ ...newCourse, category: itemValue as Course['category'] })}
                  style={{ color: isDarkMode ? 'white' : 'black', backgroundColor: isDarkMode ? '#374151' : 'white', borderRadius: 12, borderWidth: 1, borderColor: isDarkMode ? '#4B5563' : '#D1D5DB', padding: 12 }}
                >
                  <Picker.Item label="Select Category" value="" />
                  {courseCategories.map(cat => <Picker.Item key={cat} label={cat} value={cat} />)}
                </Picker>
              </View>
              <View className="mb-4">
                <Text className={`text-sm font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Level</Text>
                <Picker
                  selectedValue={newCourse.level || ''}
                  onValueChange={(itemValue) => setNewCourse({ ...newCourse, level: itemValue as Course['level'] })}
                  style={{ color: isDarkMode ? 'white' : 'black', backgroundColor: isDarkMode ? '#374151' : 'white', borderRadius: 12, borderWidth: 1, borderColor: isDarkMode ? '#4B5563' : '#D1D5DB', padding: 12 }}
                >
                  <Picker.Item label="Select Level" value="" />
                  {courseLevels.map(lvl => <Picker.Item key={lvl} label={lvl} value={lvl} />)}
                </Picker>
              </View>
              <View className="flex-row justify-between mt-6">
                <LinearGradient colors={['#3B82F6', '#1D4ED8']} className="flex-1 mr-2 rounded-xl">
                  <TouchableOpacity onPress={handleEditCourse} className="p-3 items-center">
                    <Text className="text-white text-center font-bold">Update Course</Text>
                  </TouchableOpacity>
                </LinearGradient>
                <TouchableOpacity onPress={() => setShowEditCourseModal(false)} className={`flex-1 ml-2 p-3 rounded-xl ${isDarkMode ? 'bg-gray-600' : 'bg-gray-300'}`}>
                  <Text className={`text-center font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </LinearGradient>
        </View>
      </Modal>

      {/* Add User Modal */}
      <Modal visible={showAddUserModal} animationType="slide" transparent>
        <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
          <LinearGradient colors={isDarkMode ? ['#374151', '#1F2937'] : ['#FFFFFF', '#F9FAFB']} className="w-11/12 p-6 rounded-2xl shadow-2xl">
            <View className="flex-row justify-between items-center mb-4">
              <Text className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Add User</Text>
              <TouchableOpacity onPress={() => setShowAddUserModal(false)}>
                <Ionicons name="close" size={24} color={isDarkMode ? 'white' : 'gray'} />
              </TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View className="relative mb-4">
                <Ionicons name="person-outline" size={20} color={isDarkMode ? 'white' : 'gray'} className="absolute left-3 top-3 z-10" />
                <TextInput placeholder="Name" value={newUser.name || ''} onChangeText={(text) => setNewUser({ ...newUser, name: text })} className={`pl-10 border p-3 rounded-xl ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-900'}`} />
              </View>
              <View className="relative mb-4">
                <Ionicons name="mail-outline" size={20} color={isDarkMode ? 'white' : 'gray'} className="absolute left-3 top-3 z-10" />
                <TextInput placeholder="Email" value={newUser.email || ''} onChangeText={(text) => setNewUser({ ...newUser, email: text })} keyboardType="email-address" className={`pl-10 border p-3 rounded-xl ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-900'}`} />
              </View>
              <View className="mb-4">
                <Text className={`text-sm font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Role</Text>
                <Picker
                  selectedValue={newUser.role || ''}
                  onValueChange={(itemValue) => setNewUser({ ...newUser, role: itemValue as User['role'] })}
                  style={{ color: isDarkMode ? 'white' : 'black', backgroundColor: isDarkMode ? '#374151' : 'white', borderRadius: 12, borderWidth: 1, borderColor: isDarkMode ? '#4B5563' : '#D1D5DB', padding: 12 }}
                >
                  <Picker.Item label="Select Role" value="" />
                  <Picker.Item label="Admin" value="admin" />
                  <Picker.Item label="Instructor" value="instructor" />
                  <Picker.Item label="Student" value="student" />
                </Picker>
              </View>
              <View className="mb-4">
                <Text className={`text-sm font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Status</Text>
                <Picker
                  selectedValue={newUser.status || 'active'}
                  onValueChange={(itemValue) => setNewUser({ ...newUser, status: itemValue as User['status'] })}
                  style={{ color: isDarkMode ? 'white' : 'black', backgroundColor: isDarkMode ? '#374151' : 'white', borderRadius: 12, borderWidth: 1, borderColor: isDarkMode ? '#4B5563' : '#D1D5DB', padding: 12 }}
                >
                  <Picker.Item label="Active" value="active" />
                  <Picker.Item label="Blocked" value="blocked" />
                </Picker>
              </View>
              <View className="flex-row justify-between mt-6">
                <LinearGradient colors={['#10B981', '#059669']} className="flex-1 mr-2 rounded-xl">
                  <TouchableOpacity onPress={handleAddUser} className="p-3 items-center">
                    <Text className="text-white text-center font-bold">Add User</Text>
                  </TouchableOpacity>
                </LinearGradient>
                <TouchableOpacity onPress={() => setShowAddUserModal(false)} className={`flex-1 ml-2 p-3 rounded-xl ${isDarkMode ? 'bg-gray-600' : 'bg-gray-300'}`}>
                  <Text className={`text-center font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </LinearGradient>
        </View>
      </Modal>

      {/* Edit User Modal */}
      <Modal visible={showEditUserModal} animationType="slide" transparent>
        <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
          <LinearGradient colors={isDarkMode ? ['#374151', '#1F2937'] : ['#FFFFFF', '#F9FAFB']} className="w-11/12 p-6 rounded-2xl shadow-2xl">
            <View className="flex-row justify-between items-center mb-4">
              <Text className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Edit User</Text>
              <TouchableOpacity onPress={() => setShowEditUserModal(false)}>
                <Ionicons name="close" size={24} color={isDarkMode ? 'white' : 'gray'} />
              </TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View className="relative mb-4">
                <Ionicons name="person-outline" size={20} color={isDarkMode ? 'white' : 'gray'} className="absolute left-3 top-3 z-10" />
                <TextInput placeholder="Name" value={newUser.name || ''} onChangeText={(text) => setNewUser({ ...newUser, name: text })} className={`pl-10 border p-3 rounded-xl ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-900'}`} />
              </View>
              <View className="relative mb-4">
                <Ionicons name="mail-outline" size={20} color={isDarkMode ? 'white' : 'gray'} className="absolute left-3 top-3 z-10" />
                <TextInput placeholder="Email" value={newUser.email || ''} onChangeText={(text) => setNewUser({ ...newUser, email: text })} keyboardType="email-address" className={`pl-10 border p-3 rounded-xl ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-900'}`} />
              </View>
              <View className="mb-4">
                <Text className={`text-sm font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Role</Text>
                <Picker
                  selectedValue={newUser.role || ''}
                  onValueChange={(itemValue) => setNewUser({ ...newUser, role: itemValue as User['role'] })}
                  style={{ color: isDarkMode ? 'white' : 'black', backgroundColor: isDarkMode ? '#374151' : 'white', borderRadius: 12, borderWidth: 1, borderColor: isDarkMode ? '#4B5563' : '#D1D5DB', padding: 12 }}
                >
                  <Picker.Item label="Select Role" value="" />
                  <Picker.Item label="Admin" value="admin" />
                  <Picker.Item label="Instructor" value="instructor" />
                  <Picker.Item label="Student" value="student" />
                </Picker>
              </View>
              <View className="mb-4">
                <Text className={`text-sm font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Status</Text>
                <Picker
                  selectedValue={newUser.status || 'active'}
                  onValueChange={(itemValue) => setNewUser({ ...newUser, status: itemValue as User['status'] })}
                  style={{ color: isDarkMode ? 'white' : 'black', backgroundColor: isDarkMode ? '#374151' : 'white', borderRadius: 12, borderWidth: 1, borderColor: isDarkMode ? '#4B5563' : '#D1D5DB', padding: 12 }}
                >
                  <Picker.Item label="Active" value="active" />
                  <Picker.Item label="Blocked" value="blocked" />
                </Picker>
              </View>
              <View className="flex-row justify-between mt-6">
                <LinearGradient colors={['#3B82F6', '#1D4ED8']} className="flex-1 mr-2 rounded-xl">
                  <TouchableOpacity onPress={handleEditUser} className="p-3 items-center">
                    <Text className="text-white text-center font-bold">Update User</Text>
                  </TouchableOpacity>
                </LinearGradient>
                <TouchableOpacity onPress={() => setShowEditUserModal(false)} className={`flex-1 ml-2 p-3 rounded-xl ${isDarkMode ? 'bg-gray-600' : 'bg-gray-300'}`}>
                  <Text className={`text-center font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </LinearGradient>
        </View>
      </Modal>

      {/* Toast */}
      {toast && <Toast message={toast.message} type={toast.type} onHide={() => setToast(null)} />}
    </View>
  );
}
