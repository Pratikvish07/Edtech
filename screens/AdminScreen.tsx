import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Modal, Alert, Dimensions, Animated, RefreshControl, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Video, ResizeMode } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';
import { cssInterop } from 'nativewind';
import { saveData, getData } from '../utils/storage';

const { width, height } = Dimensions.get('window');

const StyledLinear = cssInterop(LinearGradient, { className: 'className' });

type Course = {
  id: string;
  title: string;
  description: string;
  instructor: string;
  price: number;
  image: string;
  demoVideo: string;
  lessons: number;
  duration: string;
  level: string;
  language: string;
  rating: number;
  reviews: number;
  category: string;
  students: number;
  discount?: number;
  featured?: boolean;
  upcoming?: boolean;
  demo?: boolean;
};

type User = {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'instructor' | 'admin';
};

type CartItem = {
  course: Course;
  quantity: number;
};

type EnrolledCourse = {
  course: Course;
  progress: number;
  enrolledDate: string;
};

export default function AdminScreen({ navigation, route }: any) {
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([]);
  const [activeTab, setActiveTab] = useState('all');
  const [refreshing, setRefreshing] = useState(false);

  const [notifications, setNotifications] = useState([
    { id: '1', title: '🔥 New Course Added', message: 'Learn AI in 4 weeks!', time: '2 hours ago', read: false, type: 'new_course' },
    { id: '2', title: '💰 Discount Offer', message: 'Get 30% off React Native course.', time: '1 day ago', read: false, type: 'discount' },
    { id: '3', title: '🎉 Welcome Bonus', message: 'Get 20% off your first course!', time: '2 days ago', read: true, type: 'welcome' },
    { id: '4', title: '📚 Doubt Session', message: 'Live doubt clearing session tomorrow at 6 PM', time: '3 days ago', read: false, type: 'doubt_session' },
  ]);

  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [newCourse, setNewCourse] = useState<Partial<Course>>({});
  const [showDoubtSession, setShowDoubtSession] = useState(false);

  const [user] = useState<User>(route?.params?.user || {
    id: '1',
    name: 'Pratik',
    email: 'pratik@gmail.com',
    role: 'student',
  });

  const isAdmin = user.role === 'admin';

  // Animation values
  const fadeAnim = useState(new Animated.Value(0))[0];
  const slideAnim = useState(new Animated.Value(50))[0];

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 800, useNativeDriver: true }),
    ]).start();
  }, []);

  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    const loadCourses = async () => {
      const storedCourses = await getData('courses');
      if (storedCourses) {
        setCourses(storedCourses);
      } else {
        const defaultCourses = [
          { id: '1', title: 'React Native Masterclass', description: 'Build cross-platform apps with React Native.', instructor: 'John Doe', price: 99, discount: 20, image: '📱', demoVideo: 'https://www.w3schools.com/html/mov_bbb.mp4', lessons: 42, duration: '8 weeks', level: 'Intermediate', language: 'English', rating: 4.8, reviews: 120, category: 'Mobile Development', students: 1247, featured: true },
          { id: '2', title: 'Advanced JavaScript', description: 'Deep dive into JS concepts, closures, prototypes.', instructor: 'Jane Smith', price: 79, image: '⚡', demoVideo: 'https://www.w3schools.com/html/mov_bbb.mp4', lessons: 36, duration: '6 weeks', level: 'Advanced', language: 'English', rating: 4.6, reviews: 95, category: 'Programming', students: 892 },
          { id: '3', title: 'AI & Machine Learning', description: 'Complete guide to AI and ML with Python.', instructor: 'Dr. Alex Johnson', price: 149, discount: 15, image: '🤖', demoVideo: 'https://www.w3schools.com/html/mov_bbb.mp4', lessons: 52, duration: '10 weeks', level: 'Advanced', language: 'English', rating: 4.9, reviews: 210, category: 'AI & ML', students: 1567, upcoming: true },
          { id: '4', title: 'Web Development Bootcamp', description: 'Full stack web development with React.', instructor: 'Mike Wilson', price: 89, image: '💻', demoVideo: 'https://www.w3schools.com/html/mov_bbb.mp4', lessons: 48, duration: '12 weeks', level: 'Beginner', language: 'English', rating: 4.7, reviews: 178, category: 'Web Development', students: 2341, demo: true },
        ];
        setCourses(defaultCourses);
        await saveData('courses', defaultCourses);
      }
    };
    loadCourses();
  }, []);

  const categories = ['all', 'Featured', 'Mobile Development', 'Web Development', 'AI & ML', 'Data Science', 'Design', 'Programming'];

  const onRefresh = () => { setRefreshing(true); setTimeout(() => setRefreshing(false), 2000); };

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) || course.instructor.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || (selectedCategory === 'Featured' ? course.featured : course.category === selectedCategory);
    if (activeTab === 'upcoming') return matchesSearch && course.upcoming;
    if (activeTab === 'demo') return matchesSearch && course.demo;
    if (activeTab === 'enrolled') return enrolledCourses.some(ec => ec.course.id === course.id);
    return matchesSearch && matchesCategory;
  });

  // CRUD handlers
  const handleAddCourse = async () => {
    if (!newCourse.title || !newCourse.price) { Alert.alert('Error', 'Title and Price are required'); return; }
    const updatedCourses = [...courses, { ...newCourse, id: Date.now().toString(), students: 0, lessons: 0, rating: 0, reviews: 0 } as Course];
    setCourses(updatedCourses);
    await saveData('courses', updatedCourses);
    setNewCourse({}); setShowAddModal(false);
  };

  const handleEditCourse = async () => {
    if (!selectedCourse) return;
    const updatedCourses = courses.map(c => c.id === selectedCourse.id ? { ...selectedCourse, ...newCourse } as Course : c);
    setCourses(updatedCourses);
    await saveData('courses', updatedCourses);
    setSelectedCourse(null); setNewCourse({}); setShowEditModal(false);
  };

  const handleDeleteCourse = (id: string) => {
    Alert.alert('Delete Course', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => {
        const updatedCourses = courses.filter(c => c.id !== id);
        setCourses(updatedCourses);
        await saveData('courses', updatedCourses);
      }},
    ]);
  };

  // Student features
  const toggleFavorite = (courseId: string) => setFavorites(prev => prev.includes(courseId) ? prev.filter(id => id !== courseId) : [...prev, courseId]);
  const addToCart = (course: Course) => {
    const existing = cart.find(item => item.course.id === course.id);
    if (existing) setCart(prev => prev.map(item => item.course.id === course.id ? { ...item, quantity: item.quantity + 1 } : item));
    else setCart(prev => [...prev, { course, quantity: 1 }]);
    Alert.alert('🎉 Added to Cart', `${course.title} added to your cart!`);
  };
  const removeFromCart = (courseId: string) => setCart(prev => prev.filter(item => item.course.id !== courseId));
  const getCartTotal = () => cart.reduce((total, item) => total + (item.course.discount ? item.course.price * (1 - item.course.discount / 100) : item.course.price) * item.quantity, 0);

  const handleEnroll = (course: Course) => {
    Alert.alert('Enroll Now', `Ready to start "${course.title}"?`, [
      { text: 'Later', style: 'cancel' },
      { text: 'Enroll Now', onPress: () => setEnrolledCourses(prev => [...prev, { course, progress: 0, enrolledDate: new Date().toISOString().split('T')[0] }]) },
    ]);
  };

  const handleCheckout = () => {
    if (cart.length === 0) { Alert.alert('Cart Empty', 'Your cart is empty!'); return; }
    Alert.alert('Checkout', `Total: $${getCartTotal().toFixed(2)}\nProceed with payment?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Pay Now', onPress: () => { cart.forEach(item => setEnrolledCourses(prev => [...prev, { course: item.course, progress: 0, enrolledDate: new Date().toISOString().split('T')[0] }])); setCart([]); setShowCart(false); Alert.alert('Success', 'Payment successful!'); } },
    ]);
  };

  const handleLogout = () => Alert.alert('Logout', 'Are you sure?', [
    { text: 'Cancel', style: 'cancel' },
    { text: 'Logout', style: 'destructive', onPress: () => navigation.reset({ index: 0, routes: [{ name: 'LoginScreen' }] }) },
  ]);

  const markNotificationAsRead = (id: string) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  const clearAllNotifications = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  const joinDoubtSession = () => Alert.alert('Join Doubt Session', 'Live session now!\nLink: meet.google.com/abc-defg-hij\nPassword: 123456');

  const renderCourseCard = (course: Course) => {
    const discountedPrice = course.discount ? course.price * (1 - course.discount / 100) : course.price;
    const isEnrolled = enrolledCourses.some(ec => ec.course.id === course.id);

    return (
      <Animated.View key={course.id} style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }} className="bg-white rounded-3xl shadow-2xl mx-2 mb-4 overflow-hidden border border-gray-100">
        <LinearGradient colors={['#4F46E5', '#7C73E6']} className="p-4">
          <View className="flex-row justify-between items-start">
            <View className="flex-1">
              <View className="flex-row items-center flex-wrap">
                <Text className="text-xl font-bold text-white mr-2">{course.title}</Text>
                {course.featured && <Text className="text-xs bg-yellow-500 text-white px-2 py-1 rounded-full">Featured</Text>}
                {course.upcoming && <Text className="text-xs bg-purple-500 text-white px-2 py-1 rounded-full">Upcoming</Text>}
                {course.demo && <Text className="text-xs bg-green-500 text-white px-2 py-1 rounded-full">Demo</Text>}
              </View>
              <Text className="text-blue-100 text-sm mt-1">by {course.instructor}</Text>
            </View>
            <TouchableOpacity onPress={() => toggleFavorite(course.id)} className="p-2">
              <Ionicons name={favorites.includes(course.id) ? 'heart' : 'heart-outline'} size={24} color={favorites.includes(course.id) ? '#EF4444' : 'white'} />
            </TouchableOpacity>
          </View>
        </LinearGradient>

        <View className="p-4">
          <Text className="text-gray-600 text-sm mb-3 leading-5" numberOfLines={3}>{course.description}</Text>
          <Video source={{ uri: course.demoVideo }} rate={1.0} volume={1.0} isMuted={false} shouldPlay={false} useNativeControls resizeMode={ResizeMode.COVER} className="w-full h-40 rounded-2xl mb-3" />
          <View className="flex-row justify-between items-center mb-3">
            <View className="flex-row items-center"><Ionicons name="time-outline" size={16} color="#6B7280" /><Text className="text-gray-500 text-sm ml-1">{course.duration}</Text></View>
            <View className="flex-row items-center"><Ionicons name="people-outline" size={16} color="#6B7280" /><Text className="text-gray-500 text-sm ml-1">{course.students.toLocaleString()}</Text></View>
            <View className="flex-row items-center"><Ionicons name="star" size={16} color="#F59E0B" /><Text className="text-gray-500 text-sm ml-1">{course.rating}</Text></View>
          </View>

          <View className="flex-row items-center justify-between mb-3">
            <View><Text className="text-2xl font-bold text-gray-900">${discountedPrice.toFixed(0)}</Text>{course.discount && <Text className="text-lg text-gray-500 line-through">${course.price}</Text>}</View>
            <View className="bg-blue-100 px-3 py-1 rounded-full"><Text className="text-blue-800 text-sm font-medium">{course.level}</Text></View>
          </View>

          <View className="flex-row space-x-2">
            {!isEnrolled ? (
              <>
                <TouchableOpacity onPress={() => addToCart(course)} className="flex-1 bg-green-500 px-4 py-3 rounded-2xl items-center justify-center shadow-lg flex-row">
                  <Ionicons name="cart-outline" size={20} color="white" /><Text className="text-white font-bold ml-2">Add to Cart</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleEnroll(course)} className="flex-1 bg-blue-500 px-4 py-3 rounded-2xl items-center justify-center shadow-lg flex-row">
                  <Ionicons name="play-circle-outline" size={20} color="white" /><Text className="text-white font-bold ml-2">Enroll Now</Text>
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity onPress={() => navigation.navigate('CoursePlayer', { course })} className="flex-1 bg-green-500 px-4 py-3 rounded-2xl items-center justify-center shadow-lg flex-row">
                <Ionicons name="play-circle" size={20} color="white" /><Text className="text-white font-bold ml-2">Continue Learning</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Animated.View>
    );
  };

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white shadow-sm px-4 py-3 flex-row justify-between items-center">
        <Text className="text-2xl font-bold text-gray-900">Admin Dashboard</Text>
        <TouchableOpacity onPress={handleLogout} className="bg-red-500 px-4 py-2 rounded-full">
          <Text className="text-white font-semibold">Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View className="px-4 py-3 bg-white">
        <View className="flex-row items-center bg-gray-100 rounded-full px-4 py-2">
          <Ionicons name="search" size={20} color="#6B7280" />
          <TextInput
            placeholder="Search courses..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            className="flex-1 ml-2 text-gray-900"
          />
        </View>
      </View>

      {/* Add Course Button */}
      <View className="px-4 py-2">
        <TouchableOpacity onPress={() => setShowAddModal(true)} className="bg-blue-500 px-6 py-3 rounded-full items-center">
          <Text className="text-white font-bold text-lg">+ Add New Course</Text>
        </TouchableOpacity>
      </View>

      {/* Course List */}
      <ScrollView
        className="flex-1 px-4"
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        showsVerticalScrollIndicator={false}
      >
        {filteredCourses.map(course => (
          <View key={course.id} className="bg-white rounded-2xl shadow-lg mb-4 overflow-hidden">
            <StyledLinear colors={['#4F46E5', '#7C73E6']} className="p-4">
              <View className="flex-row justify-between items-start">
                <View className="flex-1">
                  <Text className="text-xl font-bold text-white">{course.title}</Text>
                  <Text className="text-blue-100 text-sm">by {course.instructor}</Text>
                </View>
                <View className="flex-row">
                  <TouchableOpacity onPress={() => { setSelectedCourse(course); setNewCourse(course); setShowEditModal(true); }} className="bg-yellow-500 p-2 rounded-full mr-2">
                    <Ionicons name="pencil" size={16} color="white" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleDeleteCourse(course.id)} className="bg-red-500 p-2 rounded-full">
                    <Ionicons name="trash" size={16} color="white" />
                  </TouchableOpacity>
                </View>
              </View>
            </StyledLinear>
            <View className="p-4">
              <Text className="text-gray-600 text-sm mb-2">{course.description}</Text>
              <View className="flex-row justify-between items-center mb-2">
                <Text className="text-lg font-bold text-gray-900">${course.price}</Text>
                <Text className="text-sm text-gray-500">{course.category}</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-sm text-gray-500">Students: {course.students}</Text>
                <Text className="text-sm text-gray-500">Rating: {course.rating}</Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Add Course Modal */}
      <Modal visible={showAddModal} animationType="slide" transparent>
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-3xl p-6 max-h-4/5">
            <Text className="text-2xl font-bold text-gray-900 mb-4">Add New Course</Text>
            <ScrollView showsVerticalScrollIndicator={false}>
              <TextInput placeholder="Title" value={newCourse.title || ''} onChangeText={(text) => setNewCourse({...newCourse, title: text})} className="border border-gray-300 rounded-lg p-3 mb-3" />
              <TextInput placeholder="Description" value={newCourse.description || ''} onChangeText={(text) => setNewCourse({...newCourse, description: text})} className="border border-gray-300 rounded-lg p-3 mb-3" multiline />
              <TextInput placeholder="Instructor" value={newCourse.instructor || ''} onChangeText={(text) => setNewCourse({...newCourse, instructor: text})} className="border border-gray-300 rounded-lg p-3 mb-3" />
              <TextInput placeholder="Price" value={newCourse.price?.toString() || ''} onChangeText={(text) => setNewCourse({...newCourse, price: parseFloat(text) || 0})} className="border border-gray-300 rounded-lg p-3 mb-3" keyboardType="numeric" />
              <TextInput placeholder="Category" value={newCourse.category || ''} onChangeText={(text) => setNewCourse({...newCourse, category: text})} className="border border-gray-300 rounded-lg p-3 mb-3" />
              <TextInput placeholder="Level" value={newCourse.level || ''} onChangeText={(text) => setNewCourse({...newCourse, level: text})} className="border border-gray-300 rounded-lg p-3 mb-3" />
              <TextInput placeholder="Duration" value={newCourse.duration || ''} onChangeText={(text) => setNewCourse({...newCourse, duration: text})} className="border border-gray-300 rounded-lg p-3 mb-3" />
              <TextInput placeholder="Demo Video URL" value={newCourse.demoVideo || ''} onChangeText={(text) => setNewCourse({...newCourse, demoVideo: text})} className="border border-gray-300 rounded-lg p-3 mb-3" />
            </ScrollView>
            <View className="flex-row mt-4">
              <TouchableOpacity onPress={() => setShowAddModal(false)} className="flex-1 bg-gray-300 p-3 rounded-lg mr-2 items-center">
                <Text className="text-gray-700 font-bold">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleAddCourse} className="flex-1 bg-blue-500 p-3 rounded-lg items-center">
                <Text className="text-white font-bold">Add Course</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Edit Course Modal */}
      <Modal visible={showEditModal} animationType="slide" transparent>
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-3xl p-6 max-h-4/5">
            <Text className="text-2xl font-bold text-gray-900 mb-4">Edit Course</Text>
            <ScrollView showsVerticalScrollIndicator={false}>
              <TextInput placeholder="Title" value={newCourse.title || ''} onChangeText={(text) => setNewCourse({...newCourse, title: text})} className="border border-gray-300 rounded-lg p-3 mb-3" />
              <TextInput placeholder="Description" value={newCourse.description || ''} onChangeText={(text) => setNewCourse({...newCourse, description: text})} className="border border-gray-300 rounded-lg p-3 mb-3" multiline />
              <TextInput placeholder="Instructor" value={newCourse.instructor || ''} onChangeText={(text) => setNewCourse({...newCourse, instructor: text})} className="border border-gray-300 rounded-lg p-3 mb-3" />
              <TextInput placeholder="Price" value={newCourse.price?.toString() || ''} onChangeText={(text) => setNewCourse({...newCourse, price: parseFloat(text) || 0})} className="border border-gray-300 rounded-lg p-3 mb-3" keyboardType="numeric" />
              <TextInput placeholder="Category" value={newCourse.category || ''} onChangeText={(text) => setNewCourse({...newCourse, category: text})} className="border border-gray-300 rounded-lg p-3 mb-3" />
              <TextInput placeholder="Level" value={newCourse.level || ''} onChangeText={(text) => setNewCourse({...newCourse, level: text})} className="border border-gray-300 rounded-lg p-3 mb-3" />
              <TextInput placeholder="Duration" value={newCourse.duration || ''} onChangeText={(text) => setNewCourse({...newCourse, duration: text})} className="border border-gray-300 rounded-lg p-3 mb-3" />
              <TextInput placeholder="Demo Video URL" value={newCourse.demoVideo || ''} onChangeText={(text) => setNewCourse({...newCourse, demoVideo: text})} className="border border-gray-300 rounded-lg p-3 mb-3" />
            </ScrollView>
            <View className="flex-row mt-4">
              <TouchableOpacity onPress={() => setShowEditModal(false)} className="flex-1 bg-gray-300 p-3 rounded-lg mr-2 items-center">
                <Text className="text-gray-700 font-bold">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleEditCourse} className="flex-1 bg-green-500 p-3 rounded-lg items-center">
                <Text className="text-white font-bold">Update Course</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  // Add any additional styles if needed
});
