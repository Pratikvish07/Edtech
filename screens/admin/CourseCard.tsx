import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Video, ResizeMode } from 'expo-av';
import { Course } from './AdminTypes';

interface CourseCardProps {
  course: Course;
  isSelected: boolean;
  isDarkMode: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export const CourseCard: React.FC<CourseCardProps> = ({ course, isSelected, isDarkMode, onSelect, onEdit, onDelete }) => {
  const discountedPrice = course.discount ? course.price * (1 - course.discount / 100) : course.price;

  return (
    <View className={`bg-white rounded-3xl shadow-lg mb-4 overflow-hidden ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
      <TouchableOpacity onPress={onSelect} className={`absolute top-3 left-3 z-10 ${isDarkMode ? 'bg-gray-700' : 'bg-white'} rounded-full p-1`}>
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
            <TouchableOpacity onPress={onEdit} className="bg-yellow-500 p-2 rounded-full"><Ionicons name="pencil" size={16} color="white" /></TouchableOpacity>
            <TouchableOpacity onPress={onDelete} className="bg-red-500 p-2 rounded-full"><Ionicons name="trash" size={16} color="white" /></TouchableOpacity>
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
    </View>
  );
};
