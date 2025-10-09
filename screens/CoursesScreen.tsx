import React, { useState, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Modal, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Video } from 'expo-av';

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
};

export default function CoursesScreen({ navigation }: any) {
  // === STATES ===
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [cart, setCart] = useState<string[]>([]);
  const [notifications, setNotifications] = useState([
    { id: '1', title: '🔥 New Course Added', message: 'Learn AI in 4 weeks!' },
    { id: '2', title: '💰 Discount Offer', message: 'Get 30% off React Native course.' },
  ]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [showCourseModal, setShowCourseModal] = useState(false);

  // === MOCK DATA ===
  const courses: Course[] = [
    {
      id: '1',
      title: 'React Native Masterclass',
      description: 'Learn cross-platform app development.',
      instructor: 'John Doe',
      price: 99,
      image: '📱',
      demoVideo: 'https://www.w3schools.com/html/mov_bbb.mp4',
      lessons: 42,
      duration: '8 weeks',
      level: 'Intermediate',
      language: 'English',
    },
    {
      id: '2',
      title: 'Advanced JavaScript',
      description: 'Deep dive into JS concepts.',
      instructor: 'Jane Smith',
      price: 79,
      image: '⚡',
      demoVideo: 'https://www.w3schools.com/html/mov_bbb.mp4',
      lessons: 36,
      duration: '6 weeks',
      level: 'Advanced',
      language: 'English',
    },
    {
      id: '3',
      title: 'UI/UX Design',
      description: 'Master modern product design.',
      instructor: 'Mike Johnson',
      price: 89,
      image: '🎨',
      demoVideo: 'https://www.w3schools.com/html/mov_bbb.mp4',
      lessons: 28,
      duration: '7 weeks',
      level: 'Beginner',
      language: 'English',
    },
  ];

  // === FUNCTIONS ===
  const toggleFavorite = (courseId: string) => {
    setFavorites(prev =>
      prev.includes(courseId)
        ? prev.filter(id => id !== courseId)
        : [...prev, courseId]
    );
  };

  const addToCart = (courseId: string) => {
    if (!cart.includes(courseId)) {
      setCart(prev => [...prev, courseId]);
      Alert.alert('Added to Cart', 'Course added to your cart successfully.');
    } else {
      Alert.alert('Already in Cart', 'This course is already in your cart.');
    }
  };

  const handleEnroll = (course: Course) => {
    Alert.alert('Enroll', `You are enrolling in ${course.title}`);
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: () => Alert.alert('Logged Out', 'You have been logged out successfully.'),
      },
    ]);
  };

  // === COMPONENTS ===
  const renderCourseCard = (course: Course) => (
    <View key={course.id} className="bg-white rounded-2xl shadow-lg p-4 mb-5">
      <View className="flex-row justify-between items-start mb-2">
        <Text className="text-3xl mr-3">{course.image}</Text>
        <View className="flex-1">
          <Text className="text-lg font-bold text-gray-900">{course.title}</Text>
          <Text className="text-gray-600 text-sm">by {course.instructor}</Text>
        </View>
        <TouchableOpacity onPress={() => toggleFavorite(course.id)}>
          <Ionicons
            name={favorites.includes(course.id) ? 'heart' : 'heart-outline'}
            size={22}
            color={favorites.includes(course.id) ? '#ef4444' : '#9ca3af'}
          />
        </TouchableOpacity>
      </View>

      <Text className="text-gray-600 mb-3" numberOfLines={2}>
        {course.description}
      </Text>

      <Video
        source={{ uri: course.demoVideo }}
        rate={1.0}
        volume={1.0}
        isMuted={false}
        
        shouldPlay={false}
        useNativeControls
        className="w-full h-40 rounded-xl mb-3"
      />

      <View className="flex-row justify-between items-center mb-3">
        <Text className="text-lg font-bold text-gray-900">${course.price}</Text>
        <View className="flex-row space-x-2">
          <TouchableOpacity
            onPress={() => addToCart(course.id)}
            className="bg-green-500 px-3 py-2 rounded-xl flex-row items-center"
          >
            <Ionicons name="cart" size={16} color="white" />
            <Text className="text-white ml-1 font-semibold">Add</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleEnroll(course)}
            className="bg-blue-500 px-3 py-2 rounded-xl flex-row items-center"
          >
            <Ionicons name="play" size={16} color="white" />
            <Text className="text-white ml-1 font-semibold">Enroll</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View className="flex-row flex-wrap space-x-2">
        <View className="bg-gray-100 px-2 py-1 rounded-full mb-1">
          <Text className="text-gray-700 text-xs">{course.duration}</Text>
        </View>
        <View className="bg-gray-100 px-2 py-1 rounded-full mb-1">
          <Text className="text-gray-700 text-xs">{course.lessons} lessons</Text>
        </View>
        <View className="bg-gray-100 px-2 py-1 rounded-full mb-1">
          <Text className="text-gray-700 text-xs">{course.level}</Text>
        </View>
        <View className="bg-gray-100 px-2 py-1 rounded-full mb-1">
          <Text className="text-gray-700 text-xs">{course.language}</Text>
        </View>
      </View>

      {/* Extra Sections */}
      <View className="mt-3 space-y-2">
        <Text className="font-semibold text-gray-900">Live Class:</Text>
        <Text className="text-gray-600 text-sm">Next live session on Wed 6 PM</Text>

        <Text className="font-semibold text-gray-900">Attendance:</Text>
        <Text className="text-gray-600 text-sm">85% completed</Text>

        <Text className="font-semibold text-gray-900">Faculty Doubts:</Text>
        <Text className="text-gray-600 text-sm">Ask questions directly to your instructor</Text>

        <Text className="font-semibold text-gray-900">Books Download:</Text>
        <TouchableOpacity className="bg-yellow-500 px-3 py-2 rounded-xl w-36">
          <Text className="text-white font-semibold text-center">Download PDFs</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="flex-row justify-between items-center px-6 pt-12 pb-4 bg-blue-600">
        <Text className="text-2xl font-bold text-white">Courses</Text>
        <View className="flex-row items-center space-x-4">
          <TouchableOpacity onPress={() => setShowCart(true)}>
            <Ionicons name="cart" size={22} color="white" />
            {cart.length > 0 && (
              <View className="absolute top-[-4] right-[-6] bg-red-500 rounded-full px-1">
                <Text className="text-xs text-white">{cart.length}</Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setShowNotifications(true)}>
            <Ionicons name="notifications" size={22} color="white" />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setShowUserMenu(true)}>
            <Ionicons name="person-circle" size={26} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar */}
      <View className="mx-6 mt-4 rounded-xl px-4 py-3 flex-row items-center bg-white shadow">
        <Ionicons name="search" size={20} color="#6b7280" />
        <TextInput
          className="flex-1 ml-3 text-gray-800"
          placeholder="Search courses..."
          placeholderTextColor="#9ca3af"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={20} color="#6b7280" />
          </TouchableOpacity>
        )}
      </View>

      {/* Courses List */}
      <ScrollView className="mt-6 px-6 pb-20">
        {courses.filter(c => c.title.toLowerCase().includes(searchQuery.toLowerCase())).map(renderCourseCard)}
      </ScrollView>

      {/* Cart Modal */}
      <Modal visible={showCart} animationType="slide" transparent>
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-3xl p-6">
            <Text className="text-xl font-bold mb-3 text-gray-900">Your Cart</Text>
            {cart.length === 0 ? (
              <Text className="text-gray-600">Your cart is empty.</Text>
            ) : (
              cart.map(id => {
                const c = courses.find(c => c.id === id);
                return (
                  <View key={id} className="flex-row justify-between items-center mb-3">
                    <Text className="text-gray-900">{c?.title}</Text>
                    <Text className="text-gray-600">${c?.price}</Text>
                  </View>
                );
              })
            )}
            <TouchableOpacity onPress={() => setShowCart(false)} className="mt-4 bg-blue-500 py-3 rounded-xl">
              <Text className="text-center text-white font-semibold">Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Notifications Modal */}
      <Modal visible={showNotifications} animationType="slide" transparent>
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-3xl p-6">
            <Text className="text-xl font-bold mb-3 text-gray-900">Notifications</Text>
            {notifications.map(n => (
              <View key={n.id} className="p-3 mb-2 rounded-lg bg-gray-100">
                <Text className="font-semibold text-gray-900">{n.title}</Text>
                <Text className="text-gray-600">{n.message}</Text>
              </View>
            ))}
            <TouchableOpacity onPress={() => setShowNotifications(false)} className="mt-4 bg-blue-500 py-3 rounded-xl">
              <Text className="text-center text-white font-semibold">Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* User Menu Modal */}
      <Modal visible={showUserMenu} animationType="fade" transparent>
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white w-4/5 rounded-2xl p-6">
            <Text className="text-xl font-bold mb-3 text-gray-900">User Account</Text>
            <Text className="text-gray-600 mb-4">John Doe • johndoe@email.com</Text>

            <TouchableOpacity onPress={handleLogout} className="bg-red-500 py-3 rounded-xl mb-3">
              <Text className="text-white text-center font-semibold">Logout</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setShowUserMenu(false)} className="bg-gray-300 py-3 rounded-xl">
              <Text className="text-center text-gray-800 font-semibold">Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
