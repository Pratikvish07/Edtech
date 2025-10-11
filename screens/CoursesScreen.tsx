import React, { useState } from 'react';
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
  rating: number;
  reviews: number;
};

export default function CoursesScreen({ navigation }: any) {
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
  const [showAllCourses, setShowAllCourses] = useState(false);

  // Expanded course data
  const courses: Course[] = [
    { id: '1', title: 'React Native Masterclass', description: 'Learn cross-platform app development.', instructor: 'John Doe', price: 99, image: '📱', demoVideo: 'https://www.w3schools.com/html/mov_bbb.mp4', lessons: 42, duration: '8 weeks', level: 'Intermediate', language: 'English', rating: 4.8, reviews: 120 },
    { id: '2', title: 'Advanced JavaScript', description: 'Deep dive into JS concepts.', instructor: 'Jane Smith', price: 79, image: '⚡', demoVideo: 'https://www.w3schools.com/html/mov_bbb.mp4', lessons: 36, duration: '6 weeks', level: 'Advanced', language: 'English', rating: 4.6, reviews: 95 },
    { id: '3', title: 'UI/UX Design', description: 'Master modern product design.', instructor: 'Mike Johnson', price: 89, image: '🎨', demoVideo: 'https://www.w3schools.com/html/mov_bbb.mp4', lessons: 28, duration: '7 weeks', level: 'Beginner', language: 'English', rating: 4.5, reviews: 110 },
    { id: '4', title: 'Python for Beginners', description: 'Learn Python from scratch.', instructor: 'Alice Brown', price: 69, image: '🐍', demoVideo: 'https://www.w3schools.com/html/mov_bbb.mp4', lessons: 32, duration: '6 weeks', level: 'Beginner', language: 'English', rating: 4.7, reviews: 80 },
    { id: '5', title: 'Machine Learning', description: 'Intro to ML concepts and applications.', instructor: 'Bob Martin', price: 129, image: '🤖', demoVideo: 'https://www.w3schools.com/html/mov_bbb.mp4', lessons: 50, duration: '10 weeks', level: 'Advanced', language: 'English', rating: 4.9, reviews: 150 },
    { id: '6', title: 'Fullstack Web Dev', description: 'Become a fullstack developer.', instructor: 'Sara Lee', price: 109, image: '💻', demoVideo: 'https://www.w3schools.com/html/mov_bbb.mp4', lessons: 45, duration: '9 weeks', level: 'Intermediate', language: 'English', rating: 4.6, reviews: 130 },
  ];

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

  const renderCourseCard = (course: Course) => (
    <View key={course.id} className="bg-white rounded-2xl shadow-lg p-4 mr-4 w-72">
      <View className="flex-row justify-between items-start mb-2">
        <Text className="text-3xl mr-2">{course.image}</Text>
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

      <Text className="text-gray-600 mb-2" numberOfLines={2}>{course.description}</Text>

      <Video
        source={{ uri: course.demoVideo }}
        rate={1.0}
        volume={1.0}
        isMuted={false}
        shouldPlay={false}
        useNativeControls
        className="w-full h-36 rounded-xl mb-2"
      />

      <View className="flex-row items-center justify-between mb-2">
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

      <View className="flex-row flex-wrap space-x-2 mb-2">
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

      {/* Extra features */}
      <View className="space-y-1 mb-2">
        <Text className="text-yellow-500 font-semibold">{'⭐'.repeat(Math.round(course.rating))} ({course.reviews} reviews)</Text>
        <Text className="font-semibold text-gray-900">Live Class: <Text className="text-gray-600">Wed 6 PM</Text></Text>
        <Text className="font-semibold text-gray-900">Attendance: <Text className="text-gray-600">85% completed</Text></Text>
        <Text className="font-semibold text-gray-900">Faculty Doubts:</Text>
        <Text className="text-gray-600 text-sm">Ask questions directly to your instructor</Text>
        <TouchableOpacity className="bg-yellow-500 px-3 py-2 rounded-xl w-36">
          <Text className="text-white font-semibold text-center">Download PDFs</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="flex-row justify-between items-center px-6 pt-16 pb-6 bg-blue-600 shadow-lg">
        <Text className="text-2xl font-bold text-white">Courses</Text>
        <View className="flex-row items-center space-x-4">
          <TouchableOpacity onPress={() => setShowCart(true)}>
            <Ionicons name="cart" size={24} color="white" />
            {cart.length > 0 && (
              <View className="absolute top-[-4] right-[-6] bg-red-500 rounded-full px-1">
                <Text className="text-xs text-white">{cart.length}</Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setShowNotifications(true)}>
            <Ionicons name="notifications" size={24} color="white" />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setShowUserMenu(true)}>
            <Ionicons name="person-circle" size={28} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar */}
      <View className="mx-6 mt-4 rounded-xl px-4 py-3 flex-row items-center bg-white shadow mb-4">
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

      {/* Horizontal Slider */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-6">
        {(showAllCourses ? courses : courses.slice(0, 3))
          .filter(c => c.title.toLowerCase().includes(searchQuery.toLowerCase()))
          .map(renderCourseCard)}
        {!showAllCourses && (
          <TouchableOpacity onPress={() => setShowAllCourses(true)} className="bg-gray-200 w-72 h-80 justify-center items-center rounded-2xl ml-2">
            <Text className="text-gray-700 font-bold">Show More Courses</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
}
