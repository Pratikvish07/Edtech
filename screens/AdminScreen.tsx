import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Modal, Alert, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Types
type User = {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'instructor' | 'admin';
  joinDate: string;
  status: 'active' | 'inactive';
  lastLogin: string;
};

type Course = {
  id: string;
  title: string;
  description: string;
  instructor: string;
  price: number;
  duration: string;
  category: string;
  rating: number;
  students: number;
  image: string;
  status: 'published' | 'draft' | 'archived';
  createdAt: string;
};

type Enrollment = {
  id: string;
  userId: string;
  courseId: string;
  enrolledAt: string;
  progress: number;
};

export default function AdminScreen({ navigation }: any) {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'courses' | 'users' | 'analytics' | 'settings'>('dashboard');
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Form states
  const [courseForm, setCourseForm] = useState({
    title: '',
    description: '',
    instructor: '',
    price: '',
    duration: '',
    category: '',
    status: 'published' as 'published' | 'draft' | 'archived',
  });

  const [userForm, setUserForm] = useState({
    name: '',
    email: '',
    role: 'student' as 'student' | 'instructor' | 'admin',
    status: 'active' as 'active' | 'inactive',
  });

  const [settings, setSettings] = useState({
    platformName: 'ED TECH',
    supportEmail: 'support@edtech.com',
    maxCoursePrice: 1000,
    autoApproveInstructors: false,
  });

  // Sample data
  const [courses, setCourses] = useState<Course[]>([
    {
      id: '1',
      title: 'React Native Masterclass',
      description: 'Build amazing mobile apps with React Native and Expo',
      instructor: 'John Doe',
      price: 99,
      duration: '8 weeks',
      category: 'Mobile Development',
      rating: 4.8,
      students: 1247,
      image: '📱',
      status: 'published',
      createdAt: '2024-01-15',
    },
    {
      id: '2',
      title: 'Advanced JavaScript',
      description: 'Master modern JavaScript concepts and patterns',
      instructor: 'Jane Smith',
      price: 79,
      duration: '6 weeks',
      category: 'Programming',
      rating: 4.6,
      students: 892,
      image: '⚡',
      status: 'published',
      createdAt: '2024-01-10',
    },
    {
      id: '3',
      title: 'UI/UX Design Fundamentals',
      description: 'Learn to design beautiful and user-friendly interfaces',
      instructor: 'Mike Johnson',
      price: 89,
      duration: '7 weeks',
      category: 'Design',
      rating: 4.7,
      students: 567,
      image: '🎨',
      status: 'draft',
      createdAt: '2024-01-12',
    },
  ]);

  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      name: 'Alice Brown',
      email: 'alice@email.com',
      role: 'student',
      joinDate: '2024-01-15',
      status: 'active',
      lastLogin: '2024-01-20',
    },
    {
      id: '2',
      name: 'Bob Wilson',
      email: 'bob@email.com',
      role: 'instructor',
      joinDate: '2024-01-10',
      status: 'active',
      lastLogin: '2024-01-19',
    },
    {
      id: '3',
      name: 'Carol Davis',
      email: 'carol@email.com',
      role: 'admin',
      joinDate: '2024-01-05',
      status: 'active',
      lastLogin: '2024-01-20',
    },
  ]);

  const [enrollments, setEnrollments] = useState<Enrollment[]>([
    { id: '1', userId: '1', courseId: '1', enrolledAt: '2024-01-16', progress: 75 },
    { id: '2', userId: '1', courseId: '2', enrolledAt: '2024-01-17', progress: 30 },
    { id: '3', userId: '2', courseId: '1', enrolledAt: '2024-01-18', progress: 100 },
  ]);

  // Filtered data based on search and category
  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.instructor.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Categories for filtering
  const categories = ['all', 'Programming', 'Design', 'Mobile Development', 'Business', 'Data Science'];

  // Refresh function
  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      Alert.alert('Refreshed', 'Data has been updated');
    }, 1000);
  };

  // Course CRUD Operations
  const handleAddCourse = () => {
    if (!courseForm.title || !courseForm.description || !courseForm.instructor) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }

    const newCourse: Course = {
      id: Date.now().toString(),
      title: courseForm.title,
      description: courseForm.description,
      instructor: courseForm.instructor,
      price: parseFloat(courseForm.price) || 0,
      duration: courseForm.duration,
      category: courseForm.category,
      rating: 4.5,
      students: 0,
      image: '📚',
      status: courseForm.status,
      createdAt: new Date().toISOString().split('T')[0],
    };

    setCourses([...courses, newCourse]);
    setShowCourseModal(false);
    resetCourseForm();
    Alert.alert('Success', 'Course added successfully!');
  };

  const handleEditCourse = (course: Course) => {
    setEditingCourse(course);
    setCourseForm({
      title: course.title,
      description: course.description,
      instructor: course.instructor,
      price: course.price.toString(),
      duration: course.duration,
      category: course.category,
      status: course.status,
    });
    setShowCourseModal(true);
  };

  const handleUpdateCourse = () => {
    if (!editingCourse || !courseForm.title || !courseForm.description || !courseForm.instructor) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }

    const updatedCourses = courses.map(course =>
      course.id === editingCourse.id
        ? {
            ...course,
            title: courseForm.title,
            description: courseForm.description,
            instructor: courseForm.instructor,
            price: parseFloat(courseForm.price) || 0,
            duration: courseForm.duration,
            category: courseForm.category,
            status: courseForm.status,
          }
        : course
    );

    setCourses(updatedCourses);
    setShowCourseModal(false);
    setEditingCourse(null);
    resetCourseForm();
    Alert.alert('Success', 'Course updated successfully!');
  };

  const handleDeleteCourse = (courseId: string) => {
    Alert.alert(
      'Delete Course',
      'Are you sure you want to delete this course?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setCourses(courses.filter(course => course.id !== courseId));
            Alert.alert('Success', 'Course deleted successfully!');
          },
        },
      ]
    );
  };

  // User CRUD Operations
  const handleAddUser = () => {
    if (!userForm.name || !userForm.email) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }

    const newUser: User = {
      id: Date.now().toString(),
      name: userForm.name,
      email: userForm.email,
      role: userForm.role,
      joinDate: new Date().toISOString().split('T')[0],
      status: userForm.status,
      lastLogin: new Date().toISOString().split('T')[0],
    };

    setUsers([...users, newUser]);
    setShowUserModal(false);
    resetUserForm();
    Alert.alert('Success', 'User added successfully!');
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setUserForm({
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
    });
    setShowUserModal(true);
  };

  const handleUpdateUser = () => {
    if (!editingUser || !userForm.name || !userForm.email) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }

    const updatedUsers = users.map(user =>
      user.id === editingUser.id
        ? {
            ...user,
            name: userForm.name,
            email: userForm.email,
            role: userForm.role,
            status: userForm.status,
          }
        : user
    );

    setUsers(updatedUsers);
    setShowUserModal(false);
    setEditingUser(null);
    resetUserForm();
    Alert.alert('Success', 'User updated successfully!');
  };

  const handleDeleteUser = (userId: string) => {
    Alert.alert(
      'Delete User',
      'Are you sure you want to delete this user?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setUsers(users.filter(user => user.id !== userId));
            Alert.alert('Success', 'User deleted successfully!');
          },
        },
      ]
    );
  };

  const resetCourseForm = () => {
    setCourseForm({
      title: '',
      description: '',
      instructor: '',
      price: '',
      duration: '',
      category: '',
      status: 'published',
    });
    setEditingCourse(null);
  };

  const resetUserForm = () => {
    setUserForm({
      name: '',
      email: '',
      role: 'student',
      status: 'active',
    });
    setEditingUser(null);
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => navigation.navigate('Login'),
        },
      ]
    );
  };

  const handleSaveSettings = () => {
    setShowSettingsModal(false);
    Alert.alert('Success', 'Settings saved successfully!');
  };

  // Analytics Data
  const analyticsData = {
    totalCourses: courses.length,
    totalUsers: users.length,
    totalEnrollments: enrollments.length,
    totalRevenue: courses.reduce((sum, course) => sum + (course.price * course.students), 0),
    averageRating: (courses.reduce((sum, course) => sum + course.rating, 0) / courses.length).toFixed(1),
    activeUsers: users.filter(user => user.status === 'active').length,
    publishedCourses: courses.filter(course => course.status === 'published').length,
  };

  const recentActivities = [
    { id: '1', type: 'enrollment', message: '5 new students enrolled today', time: '2 hours ago', icon: 'person-add' },
    { id: '2', type: 'course', message: 'New course "React Native Masterclass" published', time: '5 hours ago', icon: 'book' },
    { id: '3', type: 'revenue', message: '$2,450 revenue generated this week', time: '1 day ago', icon: 'cash' },
    { id: '4', type: 'user', message: '10 new users registered today', time: '1 day ago', icon: 'people' },
  ];

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-blue-600 pt-12 pb-4 px-6">
        <View className="flex-row justify-between items-center">
          <Text className="text-2xl font-bold text-white">Admin Dashboard</Text>
          <TouchableOpacity onPress={handleLogout} className="flex-row items-center bg-red-500 px-3 py-2 rounded-lg">
            <Ionicons name="log-out-outline" size={20} color="white" />
            <Text className="text-white ml-2 font-semibold">Logout</Text>
          </TouchableOpacity>
        </View>
        
        {/* Navigation Tabs */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-4">
          <View className="flex-row space-x-2">
            {[
              { key: 'dashboard', label: 'Dashboard', icon: 'grid' },
              { key: 'courses', label: 'Courses', icon: 'book' },
              { key: 'users', label: 'Users', icon: 'people' },
              { key: 'analytics', label: 'Analytics', icon: 'stats-chart' },
              { key: 'settings', label: 'Settings', icon: 'settings' },
            ].map((tab) => (
              <TouchableOpacity
                key={tab.key}
                onPress={() => setActiveTab(tab.key as any)}
                className={`px-4 py-2 rounded-full flex-row items-center ${
                  activeTab === tab.key ? 'bg-white' : 'bg-blue-500'
                }`}
              >
                <Ionicons 
                  name={tab.icon as any} 
                  size={16} 
                  color={activeTab === tab.key ? '#2563eb' : 'white'} 
                />
                <Text 
                  className={`ml-2 font-semibold ${
                    activeTab === tab.key ? 'text-blue-600' : 'text-white'
                  }`}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Search Bar */}
      {(activeTab === 'courses' || activeTab === 'users') && (
        <View className="px-6 py-4 bg-white border-b border-gray-200">
          <View className="flex-row items-center bg-gray-100 rounded-lg px-4 py-2">
            <Ionicons name="search" size={20} color="#6b7280" />
            <TextInput
              className="flex-1 ml-2 text-gray-700"
              placeholder={`Search ${activeTab}...`}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={20} color="#6b7280" />
              </TouchableOpacity>
            )}
          </View>
          
          {activeTab === 'courses' && (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-3">
              <View className="flex-row space-x-2">
                {categories.map((category) => (
                  <TouchableOpacity
                    key={category}
                    onPress={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-full ${
                      selectedCategory === category ? 'bg-blue-500' : 'bg-gray-200'
                    }`}
                  >
                    <Text className={selectedCategory === category ? 'text-white font-semibold' : 'text-gray-700'}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          )}
        </View>
      )}

      {/* Content */}
      <ScrollView 
        className="flex-1 p-6"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {activeTab === 'dashboard' && (
          <View>
            {/* Stats Cards */}
            <View className="flex-row flex-wrap -mx-2 mb-6">
              {[
                { label: 'Total Courses', value: analyticsData.totalCourses, icon: 'book', color: 'blue', change: '+12%' },
                { label: 'Total Users', value: analyticsData.totalUsers, icon: 'people', color: 'green', change: '+8%' },
                { label: 'Total Revenue', value: `$${analyticsData.totalRevenue}`, icon: 'cash', color: 'yellow', change: '+15%' },
                { label: 'Avg Rating', value: analyticsData.averageRating, icon: 'star', color: 'red', change: '+2%' },
              ].map((stat, index) => (
                <View key={index} className="w-1/2 px-2 mb-4">
                  <View className="bg-white rounded-xl p-4 shadow-lg">
                    <View className="flex-row items-center justify-between">
                      <Text className="text-lg font-semibold text-gray-700">{stat.label}</Text>
                      <Ionicons name={stat.icon as any} size={24} color={
                        stat.color === 'blue' ? '#3b82f6' :
                        stat.color === 'green' ? '#10b981' :
                        stat.color === 'yellow' ? '#f59e0b' : '#ef4444'
                      } />
                    </View>
                    <Text className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</Text>
                    <Text className="text-green-500 text-sm font-semibold mt-1">{stat.change}</Text>
                  </View>
                </View>
              ))}
            </View>

            {/* Quick Actions */}
            <Text className="text-xl font-bold mb-4 text-gray-800">Quick Actions</Text>
            <View className="flex-row flex-wrap -mx-2 mb-6">
              {[
                { label: 'Add Course', icon: 'add-circle', color: 'green', action: () => { setActiveTab('courses'); setShowCourseModal(true); } },
                { label: 'Add User', icon: 'person-add', color: 'blue', action: () => { setActiveTab('users'); setShowUserModal(true); } },
                { label: 'View Analytics', icon: 'stats-chart', color: 'purple', action: () => setActiveTab('analytics') },
                { label: 'Settings', icon: 'settings', color: 'orange', action: () => setActiveTab('settings') },
              ].map((action, index) => (
                <View key={index} className="w-1/2 px-2 mb-4">
                  <TouchableOpacity 
                    onPress={action.action}
                    className={`bg-${action.color}-500 rounded-xl p-6 items-center justify-center shadow-lg`}
                  >
                    <Ionicons name={action.icon as any} size={32} color="white" />
                    <Text className="text-white font-semibold mt-2 text-center">{action.label}</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>

            {/* Recent Activity */}
            <Text className="text-xl font-bold mb-4 text-gray-800">Recent Activity</Text>
            <View className="bg-white rounded-xl p-6 shadow-lg">
              {recentActivities.map((activity) => (
                <View key={activity.id} className="flex-row items-center py-3 border-b border-gray-100 last:border-b-0">
                  <Ionicons name={activity.icon as any} size={20} color="#3b82f6" />
                  <View className="ml-3 flex-1">
                    <Text className="text-gray-800 font-medium">{activity.message}</Text>
                    <Text className="text-gray-500 text-sm">{activity.time}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {activeTab === 'courses' && (
          <View>
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-2xl font-bold text-gray-800">Course Management</Text>
              <TouchableOpacity 
                onPress={() => setShowCourseModal(true)}
                className="bg-green-500 rounded-lg px-4 py-2 flex-row items-center"
              >
                <Ionicons name="add" size={20} color="white" />
                <Text className="text-white font-semibold ml-2">Add Course</Text>
              </TouchableOpacity>
            </View>

            <View className="space-y-4">
              {filteredCourses.map((course) => (
                <View key={course.id} className="bg-white rounded-xl p-4 shadow-lg">
                  <View className="flex-row justify-between items-start">
                    <View className="flex-1">
                      <View className="flex-row items-center">
                        <Text className="text-2xl mr-3">{course.image}</Text>
                        <View className="flex-1">
                          <View className="flex-row items-center">
                            <Text className="text-lg font-bold text-gray-800">{course.title}</Text>
                            <View className={`ml-2 px-2 py-1 rounded-full ${
                              course.status === 'published' ? 'bg-green-100' : 
                              course.status === 'draft' ? 'bg-yellow-100' : 'bg-red-100'
                            }`}>
                              <Text className={`text-xs font-semibold ${
                                course.status === 'published' ? 'text-green-600' : 
                                course.status === 'draft' ? 'text-yellow-600' : 'text-red-600'
                              }`}>
                                {course.status.toUpperCase()}
                              </Text>
                            </View>
                          </View>
                          <Text className="text-gray-600">{course.instructor}</Text>
                        </View>
                      </View>
                      <Text className="text-gray-700 mt-2">{course.description}</Text>
                      <View className="flex-row flex-wrap mt-2">
                        <View className="bg-blue-100 px-2 py-1 rounded-full mr-2 mb-2">
                          <Text className="text-blue-600 text-xs">{course.category}</Text>
                        </View>
                        <View className="bg-green-100 px-2 py-1 rounded-full mr-2 mb-2">
                          <Text className="text-green-600 text-xs">{course.duration}</Text>
                        </View>
                        <View className="bg-yellow-100 px-2 py-1 rounded-full mb-2">
                          <Text className="text-yellow-600 text-xs">⭐ {course.rating} ({course.students} students)</Text>
                        </View>
                      </View>
                      <Text className="text-lg font-bold text-gray-900 mt-2">${course.price}</Text>
                    </View>
                  </View>
                  
                  <View className="flex-row justify-end space-x-2 mt-4">
                    <TouchableOpacity 
                      onPress={() => handleEditCourse(course)}
                      className="bg-blue-500 rounded-lg px-4 py-2 flex-row items-center"
                    >
                      <Ionicons name="pencil" size={16} color="white" />
                      <Text className="text-white ml-2">Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      onPress={() => handleDeleteCourse(course.id)}
                      className="bg-red-500 rounded-lg px-4 py-2 flex-row items-center"
                    >
                      <Ionicons name="trash" size={16} color="white" />
                      <Text className="text-white ml-2">Delete</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {activeTab === 'users' && (
          <View>
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-2xl font-bold text-gray-800">User Management</Text>
              <TouchableOpacity 
                onPress={() => setShowUserModal(true)}
                className="bg-green-500 rounded-lg px-4 py-2 flex-row items-center"
              >
                <Ionicons name="person-add" size={20} color="white" />
                <Text className="text-white font-semibold ml-2">Add User</Text>
              </TouchableOpacity>
            </View>

            <View className="space-y-4">
              {filteredUsers.map((user) => (
                <View key={user.id} className="bg-white rounded-xl p-4 shadow-lg">
                  <View className="flex-row justify-between items-start">
                    <View className="flex-1">
                      <Text className="text-lg font-bold text-gray-800">{user.name}</Text>
                      <Text className="text-gray-600">{user.email}</Text>
                      <View className="flex-row items-center mt-2 space-x-2">
                        <View className={`px-3 py-1 rounded-full ${
                          user.role === 'admin' ? 'bg-red-100' : 
                          user.role === 'instructor' ? 'bg-blue-100' : 'bg-green-100'
                        }`}>
                          <Text className={`text-xs font-semibold ${
                            user.role === 'admin' ? 'text-red-600' : 
                            user.role === 'instructor' ? 'text-blue-600' : 'text-green-600'
                          }`}>
                            {user.role.toUpperCase()}
                          </Text>
                        </View>
                        <View className={`px-3 py-1 rounded-full ${
                          user.status === 'active' ? 'bg-green-100' : 'bg-red-100'
                        }`}>
                          <Text className={`text-xs font-semibold ${
                            user.status === 'active' ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {user.status.toUpperCase()}
                          </Text>
                        </View>
                      </View>
                      <Text className="text-gray-500 text-sm mt-1">Joined: {user.joinDate} • Last login: {user.lastLogin}</Text>
                    </View>
                  </View>
                  
                  <View className="flex-row justify-end space-x-2 mt-4">
                    <TouchableOpacity 
                      onPress={() => handleEditUser(user)}
                      className="bg-blue-500 rounded-lg px-4 py-2 flex-row items-center"
                    >
                      <Ionicons name="pencil" size={16} color="white" />
                      <Text className="text-white ml-2">Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      onPress={() => handleDeleteUser(user.id)}
                      className="bg-red-500 rounded-lg px-4 py-2 flex-row items-center"
                    >
                      <Ionicons name="trash" size={16} color="white" />
                      <Text className="text-white ml-2">Delete</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {activeTab === 'analytics' && (
          <View>
            <Text className="text-2xl font-bold mb-6 text-gray-800">Analytics Overview</Text>
            
            {/* Detailed Stats */}
            <View className="flex-row flex-wrap -mx-2 mb-6">
              {[
                { label: 'Active Users', value: analyticsData.activeUsers, icon: 'people', color: 'green' },
                { label: 'Published Courses', value: analyticsData.publishedCourses, icon: 'book', color: 'blue' },
                { label: 'Total Enrollments', value: analyticsData.totalEnrollments, icon: 'school', color: 'purple' },
                { label: 'Completion Rate', value: '78%', icon: 'trophy', color: 'orange' },
              ].map((stat, index) => (
                <View key={index} className="w-1/2 px-2 mb-4">
                  <View className="bg-white rounded-xl p-4 shadow-lg">
                    <View className="flex-row items-center justify-between">
                      <Text className="text-lg font-semibold text-gray-700">{stat.label}</Text>
                      <Ionicons name={stat.icon as any} size={24} color={
                        stat.color === 'green' ? '#10b981' :
                        stat.color === 'blue' ? '#3b82f6' :
                        stat.color === 'purple' ? '#8b5cf6' : '#f59e0b'
                      } />
                    </View>
                    <Text className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</Text>
                  </View>
                </View>
              ))}
            </View>

            <View className="bg-white rounded-xl p-6 shadow-lg mb-6">
              <Text className="text-lg font-semibold mb-4">Platform Statistics</Text>
              <View className="space-y-3">
                <View className="flex-row justify-between">
                  <Text className="text-gray-600">Total Courses</Text>
                  <Text className="font-semibold">{analyticsData.totalCourses}</Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-gray-600">Total Users</Text>
                  <Text className="font-semibold">{analyticsData.totalUsers}</Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-gray-600">Total Revenue</Text>
                  <Text className="font-semibold">${analyticsData.totalRevenue}</Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-gray-600">Average Rating</Text>
                  <Text className="font-semibold">{analyticsData.averageRating}/5</Text>
                </View>
              </View>
            </View>

            <View className="bg-white rounded-xl p-6 shadow-lg">
              <Text className="text-lg font-semibold mb-4">Recent Activity</Text>
              <View className="space-y-3">
                {recentActivities.map((activity) => (
                  <View key={activity.id} className="flex-row items-center">
                    <Ionicons name={activity.icon as any} size={20} color="#3b82f6" />
                    <Text className="ml-3 text-gray-700 flex-1">{activity.message}</Text>
                    <Text className="text-gray-500 text-sm">{activity.time}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        )}

        {activeTab === 'settings' && (
          <View>
            <Text className="text-2xl font-bold mb-6 text-gray-800">Platform Settings</Text>
            
            <View className="bg-white rounded-xl p-6 shadow-lg mb-6">
              <Text className="text-lg font-semibold mb-4">General Settings</Text>
              <View className="space-y-4">
                <View>
                  <Text className="text-gray-700 font-medium mb-2">Platform Name</Text>
                  <TextInput
                    className="border border-gray-300 rounded-lg p-3 bg-white"
                    value={settings.platformName}
                    onChangeText={(text) => setSettings({...settings, platformName: text})}
                  />
                </View>

                <View>
                  <Text className="text-gray-700 font-medium mb-2">Support Email</Text>
                  <TextInput
                    className="border border-gray-300 rounded-lg p-3 bg-white"
                    value={settings.supportEmail}
                    onChangeText={(text) => setSettings({...settings, supportEmail: text})}
                    keyboardType="email-address"
                  />
                </View>

                <View>
                  <Text className="text-gray-700 font-medium mb-2">Maximum Course Price ($)</Text>
                  <TextInput
                    className="border border-gray-300 rounded-lg p-3 bg-white"
                    value={settings.maxCoursePrice.toString()}
                    onChangeText={(text) => setSettings({...settings, maxCoursePrice: parseInt(text) || 0})}
                    keyboardType="numeric"
                  />
                </View>

                <View className="flex-row items-center justify-between">
                  <Text className="text-gray-700 font-medium">Auto-approve Instructors</Text>
                  <TouchableOpacity 
                    onPress={() => setSettings({...settings, autoApproveInstructors: !settings.autoApproveInstructors})}
                    className={`w-12 h-6 rounded-full ${
                      settings.autoApproveInstructors ? 'bg-green-500' : 'bg-gray-300'
                    }`}
                  >
                    <View className={`w-5 h-5 bg-white rounded-full m-0.5 transform ${
                      settings.autoApproveInstructors ? 'translate-x-6' : 'translate-x-0'
                    }`} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <TouchableOpacity 
              onPress={handleSaveSettings}
              className="bg-green-500 rounded-xl py-4 items-center shadow-lg"
            >
              <Text className="text-white font-semibold text-lg">Save Settings</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={() => setShowSettingsModal(true)}
              className="bg-blue-500 rounded-xl py-4 items-center shadow-lg mt-4"
            >
              <Text className="text-white font-semibold text-lg">Advanced Settings</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Add/Edit Course Modal - User Friendly */}
      <Modal visible={showCourseModal} animationType="slide" transparent>
        <View className="flex-1 justify-center bg-black/50 p-4">
          <View className="bg-white rounded-2xl p-5 max-h-3/4">
            {/* Header with close button */}
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-xl font-bold">
                {editingCourse ? 'Edit Course' : 'Add New Course'}
              </Text>
              <TouchableOpacity 
                onPress={() => { setShowCourseModal(false); resetCourseForm(); }}
                className="p-2"
              >
                <Ionicons name="close" size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>
            
            <ScrollView showsVerticalScrollIndicator={false}>
              <View className="space-y-3">
                <View>
                  <Text className="text-sm font-semibold mb-1 text-gray-700">Course Title *</Text>
                  <TextInput
                    className="border border-gray-300 rounded-lg p-3 bg-white text-sm"
                    placeholder="Enter course title"
                    value={courseForm.title}
                    onChangeText={(text) => setCourseForm({...courseForm, title: text})}
                  />
                </View>

                <View>
                  <Text className="text-sm font-semibold mb-1 text-gray-700">Description *</Text>
                  <TextInput
                    className="border border-gray-300 rounded-lg p-3 bg-white text-sm h-20"
                    placeholder="Enter course description"
                    multiline
                    value={courseForm.description}
                    onChangeText={(text) => setCourseForm({...courseForm, description: text})}
                  />
                </View>

                <View>
                  <Text className="text-sm font-semibold mb-1 text-gray-700">Instructor *</Text>
                  <TextInput
                    className="border border-gray-300 rounded-lg p-3 bg-white text-sm"
                    placeholder="Enter instructor name"
                    value={courseForm.instructor}
                    onChangeText={(text) => setCourseForm({...courseForm, instructor: text})}
                  />
                </View>

                <View className="flex-row -mx-1">
                  <View className="flex-1 px-1">
                    <Text className="text-sm font-semibold mb-1 text-gray-700">Price ($)</Text>
                    <TextInput
                      className="border border-gray-300 rounded-lg p-3 bg-white text-sm"
                      placeholder="0.00"
                      keyboardType="numeric"
                      value={courseForm.price}
                      onChangeText={(text) => setCourseForm({...courseForm, price: text})}
                    />
                  </View>

                  <View className="flex-1 px-1">
                    <Text className="text-sm font-semibold mb-1 text-gray-700">Duration</Text>
                    <TextInput
                      className="border border-gray-300 rounded-lg p-3 bg-white text-sm"
                      placeholder="e.g., 8 weeks"
                      value={courseForm.duration}
                      onChangeText={(text) => setCourseForm({...courseForm, duration: text})}
                    />
                  </View>
                </View>

                <View>
                  <Text className="text-sm font-semibold mb-1 text-gray-700">Category</Text>
                  <TextInput
                    className="border border-gray-300 rounded-lg p-3 bg-white text-sm"
                    placeholder="e.g., Programming, Design"
                    value={courseForm.category}
                    onChangeText={(text) => setCourseForm({...courseForm, category: text})}
                  />
                </View>

                <View>
                  <Text className="text-sm font-semibold mb-1 text-gray-700">Status</Text>
                  <View className="flex-row space-x-1">
                    {['published', 'draft', 'archived'].map((status) => (
                      <TouchableOpacity
                        key={status}
                        onPress={() => setCourseForm({...courseForm, status: status as any})}
                        className={`flex-1 rounded-lg p-2 border ${
                          courseForm.status === status 
                            ? 'border-blue-500 bg-blue-50' 
                            : 'border-gray-300 bg-white'
                        }`}
                      >
                        <Text className={`text-center text-xs font-semibold ${
                          courseForm.status === status ? 'text-blue-600' : 'text-gray-600'
                        }`}>
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </View>
            </ScrollView>

            <View className="flex-row justify-end space-x-2 mt-4 pt-4 border-t border-gray-200">
              <TouchableOpacity 
                onPress={() => { setShowCourseModal(false); resetCourseForm(); }}
                className="bg-gray-300 rounded-lg px-4 py-2"
              >
                <Text className="font-semibold text-sm">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={editingCourse ? handleUpdateCourse : handleAddCourse}
                className="bg-green-500 rounded-lg px-4 py-2"
              >
                <Text className="text-white font-semibold text-sm">
                  {editingCourse ? 'Update' : 'Add Course'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Add/Edit User Modal - User Friendly */}
      <Modal visible={showUserModal} animationType="slide" transparent>
        <View className="flex-1 justify-center bg-black/50 p-4">
          <View className="bg-white rounded-2xl p-5 max-h-3/4">
            {/* Header with close button */}
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-xl font-bold">
                {editingUser ? 'Edit User' : 'Add New User'}
              </Text>
              <TouchableOpacity 
                onPress={() => { setShowUserModal(false); resetUserForm(); }}
                className="p-2"
              >
                <Ionicons name="close" size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>
            
            <ScrollView showsVerticalScrollIndicator={false}>
              <View className="space-y-3">
                <View>
                  <Text className="text-sm font-semibold mb-1 text-gray-700">Full Name *</Text>
                  <TextInput
                    className="border border-gray-300 rounded-lg p-3 bg-white text-sm"
                    placeholder="Enter full name"
                    value={userForm.name}
                    onChangeText={(text) => setUserForm({...userForm, name: text})}
                  />
                </View>

                <View>
                  <Text className="text-sm font-semibold mb-1 text-gray-700">Email *</Text>
                  <TextInput
                    className="border border-gray-300 rounded-lg p-3 bg-white text-sm"
                    placeholder="Enter email address"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={userForm.email}
                    onChangeText={(text) => setUserForm({...userForm, email: text})}
                  />
                </View>

                <View>
                  <Text className="text-sm font-semibold mb-1 text-gray-700">Role</Text>
                  <View className="flex-row space-x-1">
                    {['student', 'instructor', 'admin'].map((role) => (
                      <TouchableOpacity
                        key={role}
                        onPress={() => setUserForm({...userForm, role: role as any})}
                        className={`flex-1 rounded-lg p-2 border ${
                          userForm.role === role 
                            ? 'border-blue-500 bg-blue-50' 
                            : 'border-gray-300 bg-white'
                        }`}
                      >
                        <Text className={`text-center text-xs font-semibold ${
                          userForm.role === role ? 'text-blue-600' : 'text-gray-600'
                        }`}>
                          {role.charAt(0).toUpperCase() + role.slice(1)}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                <View>
                  <Text className="text-sm font-semibold mb-1 text-gray-700">Status</Text>
                  <View className="flex-row space-x-1">
                    {['active', 'inactive'].map((status) => (
                      <TouchableOpacity
                        key={status}
                        onPress={() => setUserForm({...userForm, status: status as any})}
                        className={`flex-1 rounded-lg p-2 border ${
                          userForm.status === status 
                            ? 'border-blue-500 bg-blue-50' 
                            : 'border-gray-300 bg-white'
                        }`}
                      >
                        <Text className={`text-center text-xs font-semibold ${
                          userForm.status === status ? 'text-blue-600' : 'text-gray-600'
                        }`}>
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </View>
            </ScrollView>

            <View className="flex-row justify-end space-x-2 mt-4 pt-4 border-t border-gray-200">
              <TouchableOpacity 
                onPress={() => { setShowUserModal(false); resetUserForm(); }}
                className="bg-gray-300 rounded-lg px-4 py-2"
              >
                <Text className="font-semibold text-sm">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={editingUser ? handleUpdateUser : handleAddUser}
                className="bg-green-500 rounded-lg px-4 py-2"
              >
                <Text className="text-white font-semibold text-sm">
                  {editingUser ? 'Update' : 'Add User'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Settings Modal - User Friendly */}
      <Modal visible={showSettingsModal} animationType="slide" transparent>
        <View className="flex-1 justify-center bg-black/50 p-4">
          <View className="bg-white rounded-2xl p-5 max-h-3/4">
            {/* Header with close button */}
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-xl font-bold">Advanced Settings</Text>
              <TouchableOpacity 
                onPress={() => setShowSettingsModal(false)}
                className="p-2"
              >
                <Ionicons name="close" size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>
            
            <ScrollView showsVerticalScrollIndicator={false}>
              <View className="space-y-4">
                <View className="flex-row items-center justify-between">
                  <Text className="text-gray-700 font-medium text-sm">Enable Notifications</Text>
                  <TouchableOpacity className="w-10 h-5 bg-gray-300 rounded-full">
                    <View className="w-4 h-4 bg-white rounded-full m-0.5" />
                  </TouchableOpacity>
                </View>

                <View className="flex-row items-center justify-between">
                  <Text className="text-gray-700 font-medium text-sm">Dark Mode</Text>
                  <TouchableOpacity className="w-10 h-5 bg-gray-300 rounded-full">
                    <View className="w-4 h-4 bg-white rounded-full m-0.5" />
                  </TouchableOpacity>
                </View>

                <View className="flex-row items-center justify-between">
                  <Text className="text-gray-700 font-medium text-sm">Auto Backup</Text>
                  <TouchableOpacity className="w-10 h-5 bg-gray-300 rounded-full">
                    <View className="w-4 h-4 bg-white rounded-full m-0.5" />
                  </TouchableOpacity>
                </View>

                <View className="flex-row items-center justify-between">
                  <Text className="text-gray-700 font-medium text-sm">Email Notifications</Text>
                  <TouchableOpacity className="w-10 h-5 bg-gray-300 rounded-full">
                    <View className="w-4 h-4 bg-white rounded-full m-0.5" />
                  </TouchableOpacity>
                </View>

                <View className="flex-row items-center justify-between">
                  <Text className="text-gray-700 font-medium text-sm">Auto Update</Text>
                  <TouchableOpacity className="w-10 h-5 bg-gray-300 rounded-full">
                    <View className="w-4 h-4 bg-white rounded-full m-0.5" />
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>

            <View className="flex-row justify-end space-x-2 mt-4 pt-4 border-t border-gray-200">
              <TouchableOpacity 
                onPress={() => setShowSettingsModal(false)}
                className="bg-gray-300 rounded-lg px-4 py-2"
              >
                <Text className="font-semibold text-sm">Close</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => { setShowSettingsModal(false); Alert.alert('Success', 'Advanced settings saved!'); }}
                className="bg-green-500 rounded-lg px-4 py-2"
              >
                <Text className="text-white font-semibold text-sm">Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}