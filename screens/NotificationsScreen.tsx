import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

type Notification = {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  timestamp: string;
};

const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'New Course Available',
    message: 'React Native Advanced Concepts course is now available. Enroll now!',
    type: 'info',
    read: false,
    timestamp: '2024-01-15 10:30 AM',
  },
  {
    id: '2',
    title: 'Assignment Due',
    message: 'Your assignment for "JavaScript Fundamentals" is due tomorrow.',
    type: 'warning',
    read: false,
    timestamp: '2024-01-14 3:45 PM',
  },
  {
    id: '3',
    title: 'Certificate Earned',
    message: 'Congratulations! You have earned a certificate for completing "Python Basics".',
    type: 'success',
    read: true,
    timestamp: '2024-01-13 9:15 AM',
  },
  {
    id: '4',
    title: 'Live Session Reminder',
    message: 'Live session for "UI/UX Design" starts in 30 minutes.',
    type: 'info',
    read: true,
    timestamp: '2024-01-12 2:00 PM',
  },
];

export default function NotificationsScreen({ navigation }: any) {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [activeTab, setActiveTab] = useState<'all' | 'unread'>('all');

  const filteredNotifications = notifications.filter(notification => {
    if (activeTab === 'unread') return !notification.read;
    return true;
  });

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'info': return 'bg-blue-100 border-blue-300';
      case 'success': return 'bg-green-100 border-green-300';
      case 'warning': return 'bg-yellow-100 border-yellow-300';
      case 'error': return 'bg-red-100 border-red-300';
      default: return 'bg-gray-100 border-gray-300';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'info': return 'information-circle';
      case 'success': return 'checkmark-circle';
      case 'warning': return 'warning';
      case 'error': return 'close-circle';
      default: return 'notifications';
    }
  };

  return (
    <View className="flex-1 bg-gray-100">
      {/* Header */}
      <LinearGradient colors={['#4F46E5', '#7C73E6']} className="pt-12 px-4 pb-4">
        <View className="flex-row justify-between items-center mb-3">
          <TouchableOpacity onPress={() => navigation.goBack()} className="p-2">
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-white text-2xl font-bold">Notifications</Text>
          <TouchableOpacity onPress={markAllAsRead} className="p-2">
            <Text className="text-white text-sm font-medium">Mark All Read</Text>
          </TouchableOpacity>
        </View>

        {/* Tabs */}
        <View className="flex-row mt-3">
          {['all', 'unread'].map(tab => (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab as any)}
              className={`px-4 py-1 rounded-full mr-2 ${activeTab === tab ? 'bg-white/30' : 'bg-white/10'}`}
            >
              <Text className="text-white font-medium text-sm capitalize">
                {tab === 'all' ? 'All' : 'Unread'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </LinearGradient>

      {/* Notifications List */}
      <FlatList
        data={filteredNotifications}
        keyExtractor={item => item.id}
        contentContainerStyle={{ padding: 16, paddingBottom: 50 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => markAsRead(item.id)}
            className={`p-4 rounded-lg border-l-4 mb-3 ${getTypeColor(item.type)} ${!item.read ? 'bg-white shadow' : 'bg-gray-50'}`}
          >
            <View className="flex-row items-start">
              <Ionicons
                name={getTypeIcon(item.type) as any}
                size={24}
                color={item.type === 'info' ? '#3B82F6' : item.type === 'success' ? '#10B981' : item.type === 'warning' ? '#F59E0B' : '#EF4444'}
              />
              <View className="flex-1 ml-3">
                <Text className={`font-semibold text-base ${!item.read ? 'text-gray-900' : 'text-gray-700'}`}>
                  {item.title}
                </Text>
                <Text className={`text-sm mt-1 ${!item.read ? 'text-gray-700' : 'text-gray-500'}`}>
                  {item.message}
                </Text>
                <Text className="text-gray-400 text-xs mt-2">{item.timestamp}</Text>
              </View>
              {!item.read && (
                <View className="w-2 h-2 bg-indigo-600 rounded-full mt-2" />
              )}
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View className="items-center mt-12">
            <Ionicons name="notifications-off-outline" size={48} color="#6B7280" />
            <Text className="text-gray-400 text-base mt-4">No notifications found.</Text>
          </View>
        }
      />
    </View>
  );
}
