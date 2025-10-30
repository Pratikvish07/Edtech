import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

type AttendanceRecord = {
  date: string;
  status: 'present' | 'absent' | 'late';
  course: string;
};

const mockAttendance: AttendanceRecord[] = [
  { date: '2024-01-15', status: 'present', course: 'React Native Basics' },
  { date: '2024-01-14', status: 'present', course: 'Advanced React' },
  { date: '2024-01-13', status: 'late', course: 'Node.js API' },
  { date: '2024-01-12', status: 'present', course: 'Next.js 14' },
  { date: '2024-01-11', status: 'absent', course: 'Python for Data Science' },
  { date: '2024-01-10', status: 'present', course: 'UI/UX Design Fundamentals' },
  { date: '2024-01-09', status: 'present', course: 'Machine Learning with TensorFlow' },
];

export default function AttendanceScreen({ navigation }: any) {
  const [selectedMonth, setSelectedMonth] = useState('January 2024');

  const attendanceStats = {
    total: mockAttendance.length,
    present: mockAttendance.filter(a => a.status === 'present').length,
    absent: mockAttendance.filter(a => a.status === 'absent').length,
    late: mockAttendance.filter(a => a.status === 'late').length,
  };

  const attendancePercentage = Math.round((attendanceStats.present / attendanceStats.total) * 100);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present': return 'text-green-600 bg-green-100';
      case 'absent': return 'text-red-600 bg-red-100';
      case 'late': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'present': return 'checkmark-circle';
      case 'absent': return 'close-circle';
      case 'late': return 'time';
      default: return 'help-circle';
    }
  };

  return (
    <View className="flex-1 bg-gray-100">
      {/* Header */}
      <LinearGradient colors={['#4F46E5', '#7C73E6']} className="pt-12 px-4 pb-4">
        <View className="flex-row justify-between items-center">
          <TouchableOpacity onPress={() => navigation.goBack()} className="p-2">
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-white text-2xl font-bold">Attendance</Text>
          <View className="w-10" />
        </View>
      </LinearGradient>

      <ScrollView className="flex-1 px-4 pt-4">
        {/* Stats Card */}
        <View className="bg-white p-6 rounded-lg shadow mb-6">
          <Text className="text-gray-900 text-lg font-bold mb-4">Attendance Overview</Text>

          <View className="items-center mb-4">
            <View className="w-24 h-24 rounded-full bg-indigo-100 items-center justify-center mb-2">
              <Text className="text-2xl font-bold text-indigo-600">{attendancePercentage}%</Text>
            </View>
            <Text className="text-gray-600 text-sm">Overall Attendance</Text>
          </View>

          <View className="flex-row justify-between">
            <View className="items-center">
              <Text className="text-xl font-bold text-green-600">{attendanceStats.present}</Text>
              <Text className="text-gray-500 text-sm">Present</Text>
            </View>
            <View className="items-center">
              <Text className="text-xl font-bold text-red-600">{attendanceStats.absent}</Text>
              <Text className="text-gray-500 text-sm">Absent</Text>
            </View>
            <View className="items-center">
              <Text className="text-xl font-bold text-yellow-600">{attendanceStats.late}</Text>
              <Text className="text-gray-500 text-sm">Late</Text>
            </View>
          </View>
        </View>

        {/* Month Selector */}
        <View className="bg-white p-4 rounded-lg shadow mb-6">
          <Text className="text-gray-900 font-bold mb-2">Select Month</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {['December 2023', 'January 2024', 'February 2024'].map((month) => (
              <TouchableOpacity
                key={month}
                onPress={() => setSelectedMonth(month)}
                className={`px-4 py-2 rounded-full mr-2 ${selectedMonth === month ? 'bg-indigo-600' : 'bg-gray-200'}`}
              >
                <Text className={`font-medium ${selectedMonth === month ? 'text-white' : 'text-gray-700'}`}>
                  {month}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Attendance Records */}
        <View className="bg-white rounded-lg shadow mb-6">
          <Text className="text-gray-900 font-bold p-4 border-b border-gray-200">Attendance Records</Text>

          {mockAttendance.map((record, index) => (
            <View
              key={record.date}
              className={`flex-row items-center justify-between p-4 ${index !== mockAttendance.length - 1 ? 'border-b border-gray-100' : ''}`}
            >
              <View className="flex-1">
                <Text className="text-gray-900 font-medium">{record.course}</Text>
                <Text className="text-gray-500 text-sm">{record.date}</Text>
              </View>
              <View className={`flex-row items-center px-3 py-1 rounded-full ${getStatusColor(record.status)}`}>
                <Ionicons name={getStatusIcon(record.status) as any} size={16} color="currentColor" />
                <Text className="text-sm font-medium ml-1 capitalize">{record.status}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Calendar View Placeholder */}
        <View className="bg-white p-6 rounded-lg shadow mb-6">
          <Text className="text-gray-900 text-lg font-bold mb-4">Calendar View</Text>
          <View className="items-center">
            <Ionicons name="calendar-outline" size={48} color="#6B7280" />
            <Text className="text-gray-500 text-sm mt-2">Calendar integration coming soon</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
