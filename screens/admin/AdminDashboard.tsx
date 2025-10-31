import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert, Animated, RefreshControl, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Course, User, Lead, ToastState } from './AdminTypes';
import { saveData, getData } from './AdminUtils';
import { Toast } from './Toast';
import { CourseCard } from './CourseCard';
import { UserCard } from './UserCard';
import { LeadCard } from './LeadCard';
import { AddCourseModal } from './AddCourseModal';     
import { EditCourseModal } from './EditCourseModal';
import { AddUserModal } from './AddUserModal';
import { EditUserModal } from './EditUserModal';
import { AddLeadModal } from './AddLeadModal';
import { EditLeadModal } from './EditLeadModal';
import AdminSidebar from './AdminSidebar';
import AdminAnalytics from './AdminAnalytics';
import AdminSettings from './AdminSettings';
import AdminContentManager from './AdminContentManager';

const { width } = Dimensions.get('window');

export default function AdminDashboard({ navigation }: any) {
  // Main state
  const [activeSection, setActiveSection] = useState<string>('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);

  // Data state
  const [courses, setCourses] = useState<Course[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);

  // Form state
  const [newCourse, setNewCourse] = useState<Partial<Course>>({});
  const [newUser, setNewUser] = useState<Partial<User>>({});
  const [newLead, setNewLead] = useState<Partial<Lead>>({});

  // Selection state
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [selectedCourseIds, setSelectedCourseIds] = useState<string[]>([]);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [selectedLeadIds, setSelectedLeadIds] = useState<string[]>([]);

  // Modal state
  const [showAddCourseModal, setShowAddCourseModal] = useState(false);
  const [showEditCourseModal, setShowEditCourseModal] = useState(false);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [showAddLeadModal, setShowAddLeadModal] = useState(false);
  const [showEditLeadModal, setShowEditLeadModal] = useState(false);

  // Animation
  const fadeAnim = useState(new Animated.Value(0))[0];
  const slideAnim = useState(new Animated.Value(50))[0];

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 800, useNativeDriver: true }),
    ]).start();
  }, []);

  // Load data on mount
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      // Load courses
      const storedCourses = await getData('courses');
      if (storedCourses) {
        setCourses(storedCourses);
      } else {
        const defaultCourses: Course[] = [
          { id: '1', title: 'React Native Masterclass', description: 'Build cross-platform apps', instructor: 'John Doe', price: 99, discount: 20, demoVideo: 'https://www.w3schools.com/html/mov_bbb.mp4', lessons: 42, duration: '8 weeks', level: 'Intermediate', category: 'Mobile', students: 1247, featured: true, ratings: 4.8 },
          { id: '2', title: 'Advanced JavaScript', description: 'Deep dive into JS', instructor: 'Jane Smith', price: 79, demoVideo: 'https://www.w3schools.com/html/mov_bbb.mp4', lessons: 36, duration: '6 weeks', level: 'Advanced', category: 'Programming', students: 892, ratings: 4.5 },
          { id: '3', title: 'Web Development Basics', description: 'Learn HTML, CSS, JS', instructor: 'Mike Ross', price: 49, demoVideo: 'https://www.w3schools.com/html/mov_bbb.mp4', lessons: 20, duration: '4 weeks', level: 'Beginner', category: 'Web', students: 2500, ratings: 4.2 },
        ];
        setCourses(defaultCourses);
        await saveData('courses', defaultCourses);
      }

      // Load users
      const storedUsers = await getData('users');
      if (storedUsers) {
        setUsers(storedUsers);
      } else {
        const defaultUsers: User[] = [
          { id: 'u1', name: 'Alice Johnson', email: 'alice@example.com', role: 'student', status: 'active' },
          { id: 'u2', name: 'Bob Williams', email: 'bob@example.com', role: 'instructor', status: 'active' },
          { id: 'u3', name: 'Charlie Brown', email: 'charlie@example.com', role: 'student', status: 'blocked' },
        ];
        setUsers(defaultUsers);
        await saveData('users', defaultUsers);
      }

      // Load leads
      const storedLeads = await getData('leads');
      if (storedLeads) {
        setLeads(storedLeads);
      } else {
        const defaultLeads: Lead[] = [
          { id: 'l1', name: 'David Smith', email: 'david@example.com', phone: '123-456-7890', status: 'new', source: 'website', notes: 'Interested in React courses', createdAt: new Date().toISOString() },
          { id: 'l2', name: 'Emma Wilson', email: 'emma@example.com', status: 'contacted', source: 'social', createdAt: new Date().toISOString() },
        ];
        setLeads(defaultLeads);
        await saveData('leads', defaultLeads);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      showToast('Error loading data', 'error');
    }
  };

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
  };

  // Filtered data
  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.instructor.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredTeachers = users.filter(user =>
    user.role === 'instructor' &&
    (user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
     user.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredLeads = leads.filter(lead =>
    lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lead.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Course CRUD handlers
  const handleAddCourse = async () => {
    if (!newCourse.title || !newCourse.price || !newCourse.category || !newCourse.level || !newCourse.instructor) {
      Alert.alert('Error', 'Title, Price, Category, Level, and Instructor are required');
      return;
    }
    try {
      const courseToAdd: Course = {
        ...newCourse as Course,
        id: Date.now().toString(),
        students: 0,
        lessons: newCourse.lessons || 0,
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
    } catch (error) {
      console.error('Error adding course:', error);
      showToast('Error adding course', 'error');
    }
  };

  const handleEditCourse = async () => {
    if (!selectedCourse || !newCourse.title || !newCourse.price || !newCourse.category || !newCourse.level || !newCourse.instructor) {
      Alert.alert('Error', 'All fields are required');
      return;
    }
    try {
      const updatedCourse: Course = { ...selectedCourse, ...newCourse };
      const updatedCourses = courses.map(c => c.id === selectedCourse.id ? updatedCourse : c);
      setCourses(updatedCourses);
      await saveData('courses', updatedCourses);
      setShowEditCourseModal(false);
      setSelectedCourse(null);
      setNewCourse({});
      showToast('Course updated successfully!', 'success');
    } catch (error) {
      console.error('Error updating course:', error);
      showToast('Error updating course', 'error');
    }
  };

  const handleDeleteCourse = (id: string) => {
    Alert.alert('Delete Course', 'Are you sure you want to delete this course?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            const updatedCourses = courses.filter(c => c.id !== id);
            setCourses(updatedCourses);
            await saveData('courses', updatedCourses);
            showToast('Course deleted!', 'success');
          } catch (error) {
            console.error('Error deleting course:', error);
            showToast('Error deleting course', 'error');
          }
        }
      }
    ]);
  };

  const toggleSelectCourse = (id: string) => {
    setSelectedCourseIds(prev => prev.includes(id) ? prev.filter(courseId => courseId !== id) : [...prev, id]);
  };

  const handleBulkDeleteCourses = () => {
    if (selectedCourseIds.length === 0) {
      showToast('No courses selected.', 'error');
      return;
    }
    Alert.alert('Bulk Delete', `Delete ${selectedCourseIds.length} courses?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            const updatedCourses = courses.filter(c => !selectedCourseIds.includes(c.id));
            setCourses(updatedCourses);
            await saveData('courses', updatedCourses);
            setSelectedCourseIds([]);
            showToast('Courses deleted!', 'success');
          } catch (error) {
            console.error('Error deleting courses:', error);
            showToast('Error deleting courses', 'error');
          }
        }
      }
    ]);
  };

  // User CRUD handlers
  const handleAddUser = async () => {
    if (!newUser.name || !newUser.email || !newUser.role) {
      Alert.alert('Error', 'Name, Email, and Role are required');
      return;
    }
    try {
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
    } catch (error) {
      console.error('Error adding user:', error);
      showToast('Error adding user', 'error');
    }
  };

  const handleEditUser = async () => {
    if (!selectedUser || !newUser.name || !newUser.email || !newUser.role) {
      Alert.alert('Error', 'All fields are required');
      return;
    }
    try {
      const updatedUser: User = { ...selectedUser, ...newUser };
      const updatedUsers = users.map(u => u.id === selectedUser.id ? updatedUser : u);
      setUsers(updatedUsers);
      await saveData('users', updatedUsers);
      setShowEditUserModal(false);
      setSelectedUser(null);
      setNewUser({});
      showToast('User updated successfully!', 'success');
    } catch (error) {
      console.error('Error updating user:', error);
      showToast('Error updating user', 'error');
    }
  };

  const handleDeleteUser = (id: string) => {
    Alert.alert('Delete User', 'Are you sure you want to delete this user?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            const updatedUsers = users.filter(u => u.id !== id);
            setUsers(updatedUsers);
            await saveData('users', updatedUsers);
            showToast('User deleted!', 'success');
          } catch (error) {
            console.error('Error deleting user:', error);
            showToast('Error deleting user', 'error');
          }
        }
      }
    ]);
  };

  const toggleSelectUser = (id: string) => {
    setSelectedUserIds(prev => prev.includes(id) ? prev.filter(userId => userId !== id) : [...prev, id]);
  };

  const handleBulkDeleteUsers = () => {
    if (selectedUserIds.length === 0) {
      showToast('No users selected.', 'error');
      return;
    }
    Alert.alert('Bulk Delete', `Delete ${selectedUserIds.length} users?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            const updatedUsers = users.filter(u => !selectedUserIds.includes(u.id));
            setUsers(updatedUsers);
            await saveData('users', updatedUsers);
            setSelectedUserIds([]);
            showToast('Users deleted!', 'success');
          } catch (error) {
            console.error('Error deleting users:', error);
            showToast('Error deleting users', 'error');
          }
        }
      }
    ]);
  };

  // Lead CRUD handlers
  const handleAddLead = async () => {
    if (!newLead.name || !newLead.email || !newLead.status) {
      Alert.alert('Error', 'Name, Email, and Status are required');
      return;
    }
    try {
      const leadToAdd: Lead = {
        ...newLead as Lead,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };
      const updatedLeads = [...leads, leadToAdd];
      setLeads(updatedLeads);
      await saveData('leads', updatedLeads);
      setShowAddLeadModal(false);
      setNewLead({});
      showToast('Lead added successfully!', 'success');
    } catch (error) {
      console.error('Error adding lead:', error);
      showToast('Error adding lead', 'error');
    }
  };

  const handleEditLead = async () => {
    if (!selectedLead || !newLead.name || !newLead.email || !newLead.status) {
      Alert.alert('Error', 'All fields are required');
      return;
    }
    try {
      const updatedLead: Lead = { ...selectedLead, ...newLead };
      const updatedLeads = leads.map(l => l.id === selectedLead.id ? updatedLead : l);
      setLeads(updatedLeads);
      await saveData('leads', updatedLeads);
      setShowEditLeadModal(false);
      setSelectedLead(null);
      setNewLead({});
      showToast('Lead updated successfully!', 'success');
    } catch (error) {
      console.error('Error updating lead:', error);
      showToast('Error updating lead', 'error');
    }
  };

  const handleDeleteLead = (id: string) => {
    Alert.alert('Delete Lead', 'Are you sure you want to delete this lead?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            const updatedLeads = leads.filter(l => l.id !== id);
            setLeads(updatedLeads);
            await saveData('leads', updatedLeads);
            showToast('Lead deleted!', 'success');
          } catch (error) {
            console.error('Error deleting lead:', error);
            showToast('Error deleting lead', 'error');
          }
        }
      }
    ]);
  };

  const toggleSelectLead = (id: string) => {
    setSelectedLeadIds(prev => prev.includes(id) ? prev.filter(leadId => leadId !== id) : [...prev, id]);
  };

  const handleBulkDeleteLeads = () => {
    if (selectedLeadIds.length === 0) {
      showToast('No leads selected.', 'error');
      return;
    }
    Alert.alert('Bulk Delete', `Delete ${selectedLeadIds.length} leads?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            const updatedLeads = leads.filter(l => !selectedLeadIds.includes(l.id));
            setLeads(updatedLeads);
            await saveData('leads', updatedLeads);
            setSelectedLeadIds([]);
            showToast('Leads deleted!', 'success');
          } catch (error) {
            console.error('Error deleting leads:', error);
            showToast('Error deleting leads', 'error');
          }
        }
      }
    ]);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadAllData();
    setRefreshing(false);
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <View className="flex-1">
            {/* Statistics Cards */}
            <View className="px-6 py-4">
              <View className="flex-row justify-between mb-6">
                <View className="flex-1 mr-2">
                  <LinearGradient
                    colors={isDarkMode ? ['#374151', '#1f2937'] : ['#ffffff', '#f9fafb']}
                    style={{
                      padding: 16,
                      borderRadius: 12,
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.1,
                      shadowRadius: 4,
                      elevation: 2,
                    }}
                  >
                    <Text className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Courses</Text>
                    <Text className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{courses.length}</Text>
                    <Text className="text-green-500 text-sm">+12% from last month</Text>
                  </LinearGradient>
                </View>
                <View className="flex-1 mr-2">
                  <LinearGradient
                    colors={isDarkMode ? ['#374151', '#1f2937'] : ['#ffffff', '#f9fafb']}
                    style={{
                      padding: 16,
                      borderRadius: 12,
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.1,
                      shadowRadius: 4,
                      elevation: 2,
                    }}
                  >
                    <Text className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Users</Text>
                    <Text className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{users.length}</Text>
                    <Text className="text-green-500 text-sm">+8% from last month</Text>
                  </LinearGradient>
                </View>
                <View className="flex-1">
                  <LinearGradient
                    colors={isDarkMode ? ['#374151', '#1f2937'] : ['#ffffff', '#f9fafb']}
                    style={{
                      padding: 16,
                      borderRadius: 12,
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.1,
                      shadowRadius: 4,
                      elevation: 2,
                    }}
                  >
                    <Text className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Leads</Text>
                    <Text className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{leads.length}</Text>
                    <Text className="text-green-500 text-sm">+15% from last month</Text>
                  </LinearGradient>
                </View>
              </View>
            </View>

            {/* Quick Actions */}
            <View className="px-6 mb-4">
              <Text className={`text-lg font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Quick Actions</Text>
              <View className="flex-row justify-between">
                <TouchableOpacity
                  onPress={() => setShowAddCourseModal(true)}
                  className={`flex-1 mr-2 p-4 rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} items-center shadow-lg`}
                  style={{
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                    elevation: 2,
                  }}
                >
                  <Ionicons name="add-circle" size={24} color={isDarkMode ? '#60a5fa' : '#3b82f6'} />
                  <Text className={`text-sm font-medium mt-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Add Course</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setShowAddUserModal(true)}
                  className={`flex-1 mr-2 p-4 rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} items-center shadow-lg`}
                  style={{
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                    elevation: 2,
                  }}
                >
                  <Ionicons name="person-add" size={24} color={isDarkMode ? '#60a5fa' : '#3b82f6'} />
                  <Text className={`text-sm font-medium mt-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Add User</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setShowAddLeadModal(true)}
                  className={`flex-1 p-4 rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} items-center shadow-lg`}
                  style={{
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                    elevation: 2,
                  }}
                >
                  <Ionicons name="megaphone" size={24} color={isDarkMode ? '#60a5fa' : '#3b82f6'} />
                  <Text className={`text-sm font-medium mt-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Add Lead</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        );

      case 'courses':
        return (
          <View className="flex-1">
            <View className="px-6 py-4">
              <TextInput
                placeholder="Search courses..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                className={`border p-3 rounded-xl mb-4 ${isDarkMode ? 'border-gray-700 bg-gray-800 text-white' : 'border-gray-300 bg-white text-gray-900'}`}
              />
            </View>
            <ScrollView
              className="px-6"
              refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            >
              {filteredCourses.map(course => (
                <CourseCard
                  key={course.id}
                  course={course}
                  isSelected={selectedCourseIds.includes(course.id)}
                  isDarkMode={isDarkMode}
                  onSelect={() => toggleSelectCourse(course.id)}
                  onEdit={() => { setSelectedCourse(course); setNewCourse(course); setShowEditCourseModal(true); }}
                  onDelete={() => handleDeleteCourse(course.id)}
                />
              ))}
              {selectedCourseIds.length > 0 && (
                <TouchableOpacity
                  onPress={handleBulkDeleteCourses}
                  className="bg-red-600 p-4 rounded-xl mb-5"
                >
                  <Text className="text-white text-center font-bold">Delete Selected ({selectedCourseIds.length})</Text>
                </TouchableOpacity>
              )}
            </ScrollView>
          </View>
        );

      case 'users':
        return (
          <View className="flex-1">
            <View className="px-6 py-4">
              <TextInput
                placeholder="Search users..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                className={`border p-3 rounded-xl mb-4 ${isDarkMode ? 'border-gray-700 bg-gray-800 text-white' : 'border-gray-300 bg-white text-gray-900'}`}
              />
            </View>
            <ScrollView
              className="px-6"
              refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            >
              {filteredUsers.map(user => (
                <UserCard
                  key={user.id}
                  user={user}
                  isSelected={selectedUserIds.includes(user.id)}
                  isDarkMode={isDarkMode}
                  onSelect={() => toggleSelectUser(user.id)}
                  onEdit={() => { setSelectedUser(user); setNewUser(user); setShowEditUserModal(true); }}
                  onDelete={() => handleDeleteUser(user.id)}
                />
              ))}
              {selectedUserIds.length > 0 && (
                <TouchableOpacity
                  onPress={handleBulkDeleteUsers}
                  className="bg-red-600 p-4 rounded-xl mb-5"
                >
                  <Text className="text-white text-center font-bold">Delete Selected ({selectedUserIds.length})</Text>
                </TouchableOpacity>
              )}
            </ScrollView>
          </View>
        );

      case 'teachers':
        return (
          <View className="flex-1">
            <View className="px-6 py-4">
              <TextInput
                placeholder="Search teachers..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                className={`border p-3 rounded-xl mb-4 ${isDarkMode ? 'border-gray-700 bg-gray-800 text-white' : 'border-gray-300 bg-white text-gray-900'}`}
              />
            </View>
            <ScrollView
              className="px-6"
              refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            >
              {filteredTeachers.map(user => (
                <UserCard
                  key={user.id}
                  user={user}
                  isSelected={selectedUserIds.includes(user.id)}
                  isDarkMode={isDarkMode}
                  onSelect={() => toggleSelectUser(user.id)}
                  onEdit={() => { setSelectedUser(user); setNewUser(user); setShowEditUserModal(true); }}
                  onDelete={() => handleDeleteUser(user.id)}
                />
              ))}
              {selectedUserIds.length > 0 && (
                <TouchableOpacity
                  onPress={handleBulkDeleteUsers}
                  className="bg-red-600 p-4 rounded-xl mb-5"
                >
                  <Text className="text-white text-center font-bold">Delete Selected ({selectedUserIds.length})</Text>
                </TouchableOpacity>
              )}
            </ScrollView>
          </View>
        );

      case 'leads':
        return (
          <View className="flex-1">
            <View className="px-6 py-4">
              <TextInput
                placeholder="Search leads..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                className={`border p-3 rounded-xl mb-4 ${isDarkMode ? 'border-gray-700 bg-gray-800 text-white' : 'border-gray-300 bg-white text-gray-900'}`}
              />
            </View>
            <ScrollView
              className="px-6"
              refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            >
              {filteredLeads.map(lead => (
                <LeadCard
                  key={lead.id}
                  lead={lead}
                  isSelected={selectedLeadIds.includes(lead.id)}
                  isDarkMode={isDarkMode}
                  onSelect={() => toggleSelectLead(lead.id)}
                  onEdit={() => { setSelectedLead(lead); setNewLead(lead); setShowEditLeadModal(true); }}
                  onDelete={() => handleDeleteLead(lead.id)}
                />
              ))}
              {selectedLeadIds.length > 0 && (
                <TouchableOpacity
                  onPress={handleBulkDeleteLeads}
                  className="bg-red-600 p-4 rounded-xl mb-5"
                >
                  <Text className="text-white text-center font-bold">Delete Selected ({selectedLeadIds.length})</Text>
                </TouchableOpacity>
              )}
            </ScrollView>
          </View>
        );

      case 'analytics':
        return <AdminAnalytics isDarkMode={isDarkMode} />;

      case 'settings':
        return <AdminSettings isDarkMode={isDarkMode} onThemeToggle={() => setIsDarkMode(!isDarkMode)} />;

      case 'content':
        return <AdminContentManager isDarkMode={isDarkMode} />;

      default:
        return (
          <View className="flex-1 items-center justify-center">
            <Text className={`text-xl ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {activeSection === 'home' && 'Home Dashboard'}
              {activeSection === 'courses-page' && 'Courses Page'}
              {activeSection === 'tests' && 'Tests Page'}
              {activeSection === 'profile' && 'Profile Page'}
              {activeSection === 'attendance' && 'Attendance Page'}
              {activeSection === 'doubt-portal' && 'Doubt Portal Page'}
              {activeSection === 'notifications' && 'Notifications Page'}
              {activeSection === 'payments' && 'Payments Page'}
              {activeSection === 'support' && 'Support Page'}
            </Text>
            <Text className={`text-center mt-4 px-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Admin can view and manage content on this page. Full CRUD functionality available.
            </Text>
          </View>
        );
    }
  };

  const getHeaderTitle = () => {
    switch (activeSection) {
      case 'dashboard': return 'Dashboard';
      case 'courses': return 'Courses Management';
      case 'users': return 'Users Management';
      case 'teachers': return 'Teachers Management';
      case 'leads': return 'Leads Management';
      case 'analytics': return 'Analytics';
      case 'settings': return 'Settings';
      case 'content': return 'Content Manager';
      case 'home': return 'Home Dashboard';
      case 'courses-page': return 'Courses Page';
      case 'tests': return 'Tests Page';
      case 'profile': return 'Profile Page';
      case 'attendance': return 'Attendance Page';
      case 'doubt-portal': return 'Doubt Portal Page';
      case 'notifications': return 'Notifications Page';
      case 'payments': return 'Payments Page';
      case 'support': return 'Support Page';
      default: return 'Admin Dashboard';
    }
  };

  const showAddButton = ['courses', 'users', 'teachers', 'leads'].includes(activeSection);

  return (
    <View className={`flex-1 flex-row ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Sidebar */}
      <AdminSidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        isDarkMode={isDarkMode}
        navigation={navigation}
      />

      {/* Main Content */}
      <View className="flex-1">
        {/* Header */}
        <View className={`flex-row justify-between items-center px-6 py-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <Text className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {getHeaderTitle()}
          </Text>
          <View className="flex-row items-center space-x-4">
            {showAddButton && (
              <TouchableOpacity
                onPress={() => {
                  if (activeSection === 'courses') setShowAddCourseModal(true);
                  else if (activeSection === 'users' || activeSection === 'teachers') setShowAddUserModal(true);
                  else if (activeSection === 'leads') setShowAddLeadModal(true);
                }}
                className="p-2 rounded-full bg-blue-500"
              >
                <Ionicons name="add" size={24} color="white" />
              </TouchableOpacity>
            )}

            <TouchableOpacity
              onPress={() => {
                Alert.alert(
                  'Logout',
                  'Are you sure you want to logout?',
                  [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Logout', style: 'destructive', onPress: () => navigation.navigate('Login') }
                  ]
                );
              }}
              className="px-4 py-3 rounded-xl flex-row items-center shadow-lg"
              style={{
                backgroundColor: isDarkMode ? '#dc2626' : '#ef4444',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 8,
              }}
            >
              <Ionicons name="log-out-outline" size={20} color="white" />
              <Text className="text-white font-bold ml-2 text-base">Logout</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Content */}
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
            flex: 1,
          }}
        >
          {renderContent()}
        </Animated.View>

        {/* Floating Action Button */}
        {showAddButton && (
          <TouchableOpacity
            onPress={() => {
              if (activeSection === 'courses') setShowAddCourseModal(true);
              else if (activeSection === 'users' || activeSection === 'teachers') setShowAddUserModal(true);
              else if (activeSection === 'leads') setShowAddLeadModal(true);
            }}
            className="absolute bottom-6 right-6 w-14 h-14 rounded-full bg-blue-500 items-center justify-center shadow-lg"
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 8,
            }}
          >
            <Ionicons name="add" size={28} color="white" />
          </TouchableOpacity>
        )}

        {/* Modals */}
        <AddCourseModal
          isVisible={showAddCourseModal}
          onClose={() => setShowAddCourseModal(false)}
          newCourse={newCourse}
          setNewCourse={setNewCourse}
          onAdd={handleAddCourse}
          isDarkMode={isDarkMode}
        />

        <EditCourseModal
          isVisible={showEditCourseModal}
          onClose={() => setShowEditCourseModal(false)}
          newCourse={newCourse}
          setNewCourse={setNewCourse}
          onUpdate={handleEditCourse}
          isDarkMode={isDarkMode}
        />

        <AddUserModal
          isVisible={showAddUserModal}
          onClose={() => setShowAddUserModal(false)}
          newUser={newUser}
          setNewUser={setNewUser}
          onAdd={handleAddUser}
          isDarkMode={isDarkMode}
        />

        <EditUserModal
          isVisible={showEditUserModal}
          onClose={() => setShowEditUserModal(false)}
          newUser={newUser}
          setNewUser={setNewUser}
          onUpdate={handleEditUser}
          isDarkMode={isDarkMode}
        />

        <AddLeadModal
          isVisible={showAddLeadModal}
          onClose={() => setShowAddLeadModal(false)}
          newLead={newLead}
          setNewLead={setNewLead}
          onAdd={handleAddLead}
          isDarkMode={isDarkMode}
        />

        <EditLeadModal
          isVisible={showEditLeadModal}
          onClose={() => setShowEditLeadModal(false)}
          newLead={newLead}
          setNewLead={setNewLead}
          onUpdate={handleEditLead}
          isDarkMode={isDarkMode}
        />

        {/* Toast Notification */}
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onHide={() => setToast(null)}
          />
        )}
      </View>
    </View>
  );
}
