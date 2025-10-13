import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

type Course = {
  id: string;
  title: string;
  category: string;
  enrolled: boolean;
  upcoming: boolean;
  description: string;
  modules: string[];
  rating: number;
  demo?: boolean;
  demoVideo?: string; // URL for demo video
  liveSession?: boolean; // Indicates a live session
};

const mockCourses: Course[] = [
  {
    id: '1',
    title: 'React Native Basics',
    category: 'mobile',
    enrolled: true,
    upcoming: false,
    description: 'Learn React Native from scratch and build mobile apps.',
    modules: ['JS Basics', 'Components', 'State & Props', 'Navigation', 'APIs'],
    rating: 4.5,
    demoVideo: 'https://sample-videos.com/video123/mp4/240/big_buck_bunny_240p_1mb.mp4',
    liveSession: true,
  },
  {
    id: '2',
    title: 'Advanced React',
    category: 'web',
    enrolled: false,
    upcoming: true,
    description: 'Deep dive into React hooks, context, and performance optimization.',
    modules: ['Hooks', 'Context API', 'Performance', 'Testing'],
    rating: 4.8,
    demo: true,
    demoVideo: 'https://sample-videos.com/video123/mp4/240/big_buck_bunny_240p_1mb.mp4',
  },
  {
    id: '3',
    title: 'Node.js API',
    category: 'backend',
    enrolled: true,
    upcoming: false,
    description: 'Build scalable REST APIs using Node.js and Express.',
    modules: ['Express', 'MongoDB', 'Authentication', 'Deployment'],
    rating: 4.6,
  },
  {
    id: '4',
    title: 'Next.js 14',
    category: 'web',
    enrolled: false,
    upcoming: false,
    description: 'Learn SSR, SSG, and routing with Next.js 14.',
    modules: ['Pages', 'SSR/SSG', 'API Routes', 'Styling'],
    rating: 4.7,
    demoVideo: 'https://sample-videos.com/video123/mp4/240/big_buck_bunny_240p_1mb.mp4',
  },
];

export default function CoursesScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'enrolled' | 'upcoming' | 'demo'>('all');
  const [cart, setCart] = useState<Course[]>([]);
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(3);
  const [expandedCourse, setExpandedCourse] = useState<string | null>(null);

  const user = { name: 'Pratik' };

  const filteredCourses = mockCourses
    .filter(course => {
      if (activeTab === 'enrolled') return course.enrolled;
      if (activeTab === 'upcoming') return course.upcoming;
      if (activeTab === 'demo') return course.demo;
      return true;
    })
    .filter(course => course.title.toLowerCase().includes(searchQuery.toLowerCase()));

  const handleLogout = () => console.log('Logging out...');
  const handleAddToCart = (course: Course) => {
    if (!cart.find(c => c.id === course.id)) setCart(prev => [...prev, course]);
  };
  const toggleExpand = (id: string) => setExpandedCourse(expandedCourse === id ? null : id);

  return (
    <View className="flex-1 bg-gray-100">
      {/* Header */}
      <LinearGradient colors={['#4F46E5', '#7C73E6']} className="pt-12 px-4 pb-4">
        <View className="flex-row justify-between items-center mb-3">
          <View>
            <Text className="text-white text-2xl font-bold">Hi, {user.name}! 👋</Text>
            <Text className="text-white text-sm opacity-80">Find your next course</Text>
          </View>
          <View className="flex-row items-center space-x-3">
            <TouchableOpacity className="relative p-1">
              <Ionicons name="notifications-outline" size={24} color="white" />
              {unreadNotificationsCount > 0 && (
                <View className="absolute -top-1 -right-1 bg-red-500 w-4 h-4 rounded-full justify-center items-center">
                  <Text className="text-white text-[10px] font-bold">{unreadNotificationsCount}</Text>
                </View>
              )}
            </TouchableOpacity>
            <TouchableOpacity className="relative p-1">
              <Ionicons name="cart-outline" size={24} color="white" />
              {cart.length > 0 && (
                <View className="absolute -top-1 -right-1 bg-green-500 w-4 h-4 rounded-full justify-center items-center">
                  <Text className="text-white text-[10px] font-bold">{cart.length}</Text>
                </View>
              )}
            </TouchableOpacity>
            <TouchableOpacity onPress={handleLogout} className="p-1">
              <Ionicons name="log-out-outline" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Search */}
        <View className="flex-row items-center bg-white rounded-full px-3 py-2 shadow-sm">
          <Ionicons name="search" size={18} color="#6B7280" />
          <TextInput
            placeholder="Search courses..."
            className="ml-2 flex-1 text-gray-700 text-sm"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={18} color="#6B7280" />
            </TouchableOpacity>
          )}
        </View>

        {/* Tabs */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-3">
          {['all', 'enrolled', 'upcoming', 'demo'].map(tab => (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab as any)}
              className={`px-4 py-1 rounded-full mr-2 ${activeTab === tab ? 'bg-white/30' : 'bg-white/10'}`}
            >
              <Text className="text-white font-medium text-sm">
                {tab === 'all'
                  ? 'All Courses'
                  : tab === 'enrolled'
                  ? `My Courses (${mockCourses.filter(c => c.enrolled).length})`
                  : tab === 'upcoming'
                  ? 'Upcoming'
                  : 'Demo Courses'}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </LinearGradient>

      {/* Course List */}
      <FlatList
        data={filteredCourses}
        keyExtractor={item => item.id}
        contentContainerStyle={{ padding: 16, paddingBottom: 50 }}
        renderItem={({ item }) => (
          <View className="bg-white rounded-xl p-4 mb-4 shadow">
            <View className="flex-row justify-between items-center">
              <Text className="text-gray-900 font-semibold text-base">{item.title}</Text>
              {item.demo && (
                <View className="bg-yellow-500 px-2 py-1 rounded">
                  <Text className="text-white text-[10px]">Demo</Text>
                </View>
              )}
              {item.liveSession && (
                <View className="bg-red-500 px-2 py-1 rounded ml-2">
                  <Text className="text-white text-[10px]">Live</Text>
                </View>
              )}
            </View>

            <Text className="text-gray-500 text-xs font-medium mt-1">{item.category.toUpperCase()}</Text>
            <Text className="text-gray-700 text-sm mt-1">{item.description}</Text>

            <TouchableOpacity onPress={() => toggleExpand(item.id)}>
              <Text className="text-indigo-600 font-medium mt-2 text-sm">
                {expandedCourse === item.id ? 'Hide Modules ▲' : 'Show Modules ▼'}
              </Text>
            </TouchableOpacity>

            {expandedCourse === item.id && (
              <View className="mt-2 space-y-1">
                {item.modules.map((mod, idx) => (
                  <Text key={idx} className="text-gray-500 text-sm ml-2">• {mod}</Text>
                ))}
              </View>
            )}

            {item.demoVideo && (
              <TouchableOpacity className="mt-2 bg-indigo-400 py-2 rounded">
                <Text className="text-white text-center font-medium">Watch Demo Video</Text>
              </TouchableOpacity>
            )}

            <Text className="mt-2 text-yellow-500 font-semibold text-sm">⭐ {item.rating} / 5</Text>

            {!cart.find(c => c.id === item.id) && !item.enrolled && (
              <TouchableOpacity
                onPress={() => handleAddToCart(item)}
                className="mt-2 bg-indigo-600 py-2 rounded"
              >
                <Text className="text-white text-center font-medium">Add to Cart</Text>
              </TouchableOpacity>
            )}

            {item.enrolled && (
              <TouchableOpacity className="mt-2 bg-green-500 py-2 rounded">
                <Text className="text-white text-center font-medium">Start Course</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
        ListEmptyComponent={
          <View className="items-center mt-12">
            <Text className="text-gray-400 text-base">No courses found.</Text>
          </View>
        }
      />
    </View>
  );
}
