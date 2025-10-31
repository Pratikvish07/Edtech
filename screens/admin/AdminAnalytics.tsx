import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withRepeat, withSequence } from 'react-native-reanimated';
import { Course, User } from './AdminTypes';
import { getData } from './AdminUtils';

const { width } = Dimensions.get('window');

interface StatCardProps {
  title: string;
  value: string | number;
  icon: string;
  color: string;
  trend?: string;
  isDarkMode: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color, trend, isDarkMode }) => {
  const scale = useSharedValue(1);
  const pulseAnim = useSharedValue(1);

  useEffect(() => {
    pulseAnim.value = withRepeat(
      withSequence(
        withTiming(1.05, { duration: 1000 }),
        withTiming(1, { duration: 1000 })
      ),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseAnim.value }],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <LinearGradient
        colors={isDarkMode ? ['#374151', '#1f2937'] : ['#ffffff', '#f9fafb']}
        style={{
          padding: 20,
          borderRadius: 16,
          margin: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 4,
          borderWidth: 1,
          borderColor: isDarkMode ? '#4b5563' : '#e5e7eb',
        }}
      >
        <View className="flex-row items-center justify-between mb-4">
          <View
            className="w-12 h-12 rounded-full items-center justify-center"
            style={{ backgroundColor: color + '20' }}
          >
            <Ionicons name={icon as any} size={24} color={color} />
          </View>
          {trend && (
            <View className="flex-row items-center">
              <Ionicons
                name={trend.startsWith('+') ? 'trending-up' : 'trending-down'}
                size={16}
                color={trend.startsWith('+') ? '#10b981' : '#ef4444'}
              />
              <Text
                className={`ml-1 text-sm font-medium ${
                  trend.startsWith('+') ? 'text-green-500' : 'text-red-500'
                }`}
              >
                {trend}
              </Text>
            </View>
          )}
        </View>
        <Text className={`text-2xl font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          {value}
        </Text>
        <Text className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          {title}
        </Text>
      </LinearGradient>
    </Animated.View>
  );
};

interface ChartData {
  label: string;
  value: number;
  color: string;
}

const SimpleBarChart: React.FC<{ data: ChartData[]; isDarkMode: boolean }> = ({ data, isDarkMode }) => {
  const maxValue = Math.max(...data.map(d => d.value));

  return (
    <View className="mt-6">
      <Text className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
        Course Categories
      </Text>
      {data.map((item, index) => (
        <View key={index} className="mb-3">
          <View className="flex-row justify-between mb-1">
            <Text className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              {item.label}
            </Text>
            <Text className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              {item.value}
            </Text>
          </View>
          <View className={`h-2 rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
            <View
              className="h-2 rounded-full"
              style={{
                width: `${(item.value / maxValue) * 100}%`,
                backgroundColor: item.color,
              }}
            />
          </View>
        </View>
      ))}
    </View>
  );
};

export default function AdminAnalytics({ isDarkMode }: { isDarkMode: boolean }) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const storedCourses = await getData('courses');
      const storedUsers = await getData('users');
      if (storedCourses) setCourses(storedCourses);
      if (storedUsers) setUsers(storedUsers);
    };
    loadData();
  }, []);

  const totalCourses = courses.length;
  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.status === 'active').length;
  const totalRevenue = courses.reduce((sum, course) => sum + (course.price * course.students), 0);
  const avgRating = courses.length > 0
    ? (courses.reduce((sum, course) => sum + (course.ratings || 0), 0) / courses.length).toFixed(1)
    : 0;

  const categoryData: ChartData[] = [
    { label: 'Mobile', value: courses.filter(c => c.category === 'Mobile').length, color: '#3b82f6' },
    { label: 'Web', value: courses.filter(c => c.category === 'Web').length, color: '#10b981' },
    { label: 'Programming', value: courses.filter(c => c.category === 'Programming').length, color: '#f59e0b' },
    { label: 'Design', value: courses.filter(c => c.category === 'Design').length, color: '#ef4444' },
  ];

  return (
    <ScrollView
      className={`flex-1 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}
      showsVerticalScrollIndicator={false}
    >
      <View className="p-6">
        <Text className={`text-3xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Analytics Dashboard
        </Text>

        {/* Stats Grid */}
        <View className="flex-row flex-wrap justify-between">
          <View style={{ width: (width - 48) / 2 }}>
            <StatCard
              title="Total Courses"
              value={totalCourses}
              icon="book-outline"
              color="#3b82f6"
              trend="+12%"
              isDarkMode={isDarkMode}
            />
          </View>
          <View style={{ width: (width - 48) / 2 }}>
            <StatCard
              title="Total Users"
              value={totalUsers}
              icon="people-outline"
              color="#10b981"
              trend="+8%"
              isDarkMode={isDarkMode}
            />
          </View>
          <View style={{ width: (width - 48) / 2 }}>
            <StatCard
              title="Active Users"
              value={activeUsers}
              icon="person-outline"
              color="#f59e0b"
              trend="+15%"
              isDarkMode={isDarkMode}
            />
          </View>
          <View style={{ width: (width - 48) / 2 }}>
            <StatCard
              title="Revenue"
              value={`$${totalRevenue.toLocaleString()}`}
              icon="cash-outline"
              color="#ef4444"
              trend="+23%"
              isDarkMode={isDarkMode}
            />
          </View>
        </View>

        {/* Average Rating Card */}
        <LinearGradient
          colors={isDarkMode ? ['#374151', '#1f2937'] : ['#ffffff', '#f9fafb']}
          style={{
            margin: 8,
            padding: 20,
            borderRadius: 16,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 4,
          }}
        >
          <View className="flex-row items-center justify-between">
            <View>
              <Text className={`text-lg font-semibold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Average Rating
              </Text>
              <Text className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {avgRating} ⭐
              </Text>
            </View>
            <View className="flex-row">
              {[...Array(5)].map((_, i) => (
                <Ionicons
                  key={i}
                  name="star"
                  size={24}
                  color={i < Math.floor(Number(avgRating)) ? '#fbbf24' : '#d1d5db'}
                />
              ))}
            </View>
          </View>
        </LinearGradient>

        {/* Charts */}
        <LinearGradient
          colors={isDarkMode ? ['#374151', '#1f2937'] : ['#ffffff', '#f9fafb']}
          style={{
            margin: 8,
            padding: 20,
            borderRadius: 16,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 4,
          }}
        >
          <SimpleBarChart data={categoryData} isDarkMode={isDarkMode} />
        </LinearGradient>

        {/* Recent Activity */}
        <LinearGradient
          colors={isDarkMode ? ['#374151', '#1f2937'] : ['#ffffff', '#f9fafb']}
          style={{
            margin: 8,
            padding: 20,
            borderRadius: 16,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 4,
          }}
        >
          <Text className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Recent Activity
          </Text>
          <View className="space-y-3">
            {[
              { action: 'New course added', time: '2 hours ago', icon: 'add-circle', color: '#10b981' },
              { action: 'User registered', time: '4 hours ago', icon: 'person-add', color: '#3b82f6' },
              { action: 'Course updated', time: '1 day ago', icon: 'create', color: '#f59e0b' },
              { action: 'Payment received', time: '2 days ago', icon: 'cash', color: '#ef4444' },
            ].map((activity, index) => (
              <View key={index} className="flex-row items-center py-2">
                <View
                  className="w-8 h-8 rounded-full items-center justify-center mr-3"
                  style={{ backgroundColor: activity.color + '20' }}
                >
                  <Ionicons name={activity.icon as any} size={16} color={activity.color} />
                </View>
                <View className="flex-1">
                  <Text className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {activity.action}
                  </Text>
                  <Text className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {activity.time}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </LinearGradient>
      </View>
    </ScrollView>
  );
}
