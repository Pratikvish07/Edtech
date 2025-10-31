import React from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Picker } from '@react-native-picker/picker';
import { Course } from './AdminTypes';

interface AddCourseModalProps {
  isVisible: boolean;
  onClose: () => void;
  newCourse: Partial<Course>;
  setNewCourse: (course: Partial<Course>) => void;
  onAdd: () => void;
  isDarkMode: boolean;
}

const courseCategories: Course['category'][] = ['Mobile', 'Web', 'Programming', 'Design', 'Data Science', 'AI'];
const courseLevels: Course['level'][] = ['Beginner', 'Intermediate', 'Advanced'];

export const AddCourseModal: React.FC<AddCourseModalProps> = ({ isVisible, onClose, newCourse, setNewCourse, onAdd, isDarkMode }) => {
  if (!isVisible) return null;

  return (
    <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
      <View className={`w-4/5 max-w-sm rounded-3xl shadow-2xl overflow-hidden ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <LinearGradient colors={isDarkMode ? ['#374151', '#1f2937'] : ['#FFFFFF', '#F9FAFB']} className="p-4">
          <View className="flex-row justify-between items-center mb-4">
            <Text className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Add Course</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={isDarkMode ? 'white' : 'gray'} />
            </TouchableOpacity>
          </View>
          <ScrollView showsVerticalScrollIndicator={false} className="max-h-96">
            <View className="relative mb-3">
              <Ionicons name="book-outline" size={18} color={isDarkMode ? '#60a5fa' : 'gray'} className="absolute left-3 top-3 z-10" />
              <TextInput
                placeholder="Title"
                placeholderTextColor={isDarkMode ? '#9CA3AF' : '#6B7280'}
                value={newCourse.title || ''}
                onChangeText={(text) => setNewCourse({ ...newCourse, title: text })}
                className={`pl-10 border rounded-lg text-sm p-2 ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-900'}`}
              />
            </View>
            <View className="relative mb-3">
              <Ionicons name="document-text-outline" size={18} color={isDarkMode ? '#60a5fa' : 'gray'} className="absolute left-3 top-3 z-10" />
              <TextInput
                placeholder="Description"
                placeholderTextColor={isDarkMode ? '#9CA3AF' : '#6B7280'}
                value={newCourse.description || ''}
                onChangeText={(text) => setNewCourse({ ...newCourse, description: text })}
                className={`pl-10 border rounded-lg text-sm p-2 ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-900'}`}
                multiline
              />
            </View>
            <View className="relative mb-3">
              <Ionicons name="person-outline" size={18} color={isDarkMode ? '#60a5fa' : 'gray'} className="absolute left-3 top-3 z-10" />
              <TextInput
                placeholder="Instructor"
                placeholderTextColor={isDarkMode ? '#9CA3AF' : '#6B7280'}
                value={newCourse.instructor || ''}
                onChangeText={(text) => setNewCourse({ ...newCourse, instructor: text })}
                className={`pl-10 border rounded-lg text-sm p-2 ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-900'}`}
              />
            </View>
            <View className="relative mb-3">
              <Ionicons name="cash-outline" size={18} color={isDarkMode ? '#60a5fa' : 'gray'} className="absolute left-3 top-3 z-10" />
              <TextInput
                placeholder="Price"
                placeholderTextColor={isDarkMode ? '#9CA3AF' : '#6B7280'}
                value={newCourse.price?.toString() || ''}
                onChangeText={(text) => setNewCourse({ ...newCourse, price: parseFloat(text) || 0 })}
                keyboardType="numeric"
                className={`pl-10 border rounded-lg text-sm p-2 ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-900'}`}
              />
            </View>
            <View className="mb-3">
              <Text className={`text-xs font-semibold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Category</Text>
              <Picker
                selectedValue={newCourse.category || ''}
                onValueChange={(itemValue) => setNewCourse({ ...newCourse, category: itemValue as Course['category'] })}
                style={{
                  color: isDarkMode ? 'white' : 'black',
                  backgroundColor: isDarkMode ? '#374151' : 'white',
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: isDarkMode ? '#4B5563' : '#D1D5DB',
                  padding: 8,
                  fontSize: 14
                }}
              >
                <Picker.Item label="Select Category" value="" />
                {courseCategories.map(cat => <Picker.Item key={cat} label={cat} value={cat} />)}
              </Picker>
            </View>
            <View className="mb-3">
              <Text className={`text-xs font-semibold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Level</Text>
              <Picker
                selectedValue={newCourse.level || ''}
                onValueChange={(itemValue) => setNewCourse({ ...newCourse, level: itemValue as Course['level'] })}
                style={{
                  color: isDarkMode ? 'white' : 'black',
                  backgroundColor: isDarkMode ? '#374151' : 'white',
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: isDarkMode ? '#4B5563' : '#D1D5DB',
                  padding: 8,
                  fontSize: 14
                }}
              >
                <Picker.Item label="Select Level" value="" />
                {courseLevels.map(lvl => <Picker.Item key={lvl} label={lvl} value={lvl} />)}
              </Picker>
            </View>
            <View className="flex-row justify-between mt-4">
              <LinearGradient colors={['#3B82F6', '#1D4ED8']} className="flex-1 mr-1 rounded-lg">
                <TouchableOpacity onPress={onAdd} className="p-2 items-center">
                  <Text className="text-white text-center font-bold text-sm">Add Course</Text>
                </TouchableOpacity>
              </LinearGradient>
              <TouchableOpacity onPress={onClose} className={`flex-1 ml-1 p-2 rounded-lg ${isDarkMode ? 'bg-gray-600' : 'bg-gray-300'}`}>
                <Text className={`text-center font-bold text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </LinearGradient>
      </View>
    </View>
  );
};
