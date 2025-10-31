import React from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Picker } from '@react-native-picker/picker';
import { Course } from './AdminTypes';

interface EditCourseModalProps {
  isVisible: boolean;
  onClose: () => void;
  newCourse: Partial<Course>;
  setNewCourse: (course: Partial<Course>) => void;
  onUpdate: () => void;
  isDarkMode: boolean;
}

const courseCategories: Course['category'][] = ['Mobile', 'Web', 'Programming', 'Design', 'Data Science', 'AI'];
const courseLevels: Course['level'][] = ['Beginner', 'Intermediate', 'Advanced'];

export const EditCourseModal: React.FC<EditCourseModalProps> = ({ isVisible, onClose, newCourse, setNewCourse, onUpdate, isDarkMode }) => {
  if (!isVisible) return null;

  return (
    <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
      <LinearGradient colors={isDarkMode ? ['#374151', '#1F2937'] : ['#FFFFFF', '#F9FAFB']} className="w-11/12 p-6 rounded-2xl shadow-2xl">
        <View className="flex-row justify-between items-center mb-4">
          <Text className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Edit Course</Text>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} color={isDarkMode ? 'white' : 'gray'} />
          </TouchableOpacity>
        </View>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View className="relative mb-4">
            <Ionicons name="book-outline" size={20} color={isDarkMode ? 'white' : 'gray'} className="absolute left-3 top-3 z-10" />
            <TextInput placeholder="Title" value={newCourse.title || ''} onChangeText={(text) => setNewCourse({ ...newCourse, title: text })} className={`pl-10 border p-3 rounded-xl ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-900'}`} />
          </View>
          <View className="relative mb-4">
            <Ionicons name="document-text-outline" size={20} color={isDarkMode ? 'white' : 'gray'} className="absolute left-3 top-3 z-10" />
            <TextInput placeholder="Description" value={newCourse.description || ''} onChangeText={(text) => setNewCourse({ ...newCourse, description: text })} className={`pl-10 border p-3 rounded-xl ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-900'}`} multiline />
          </View>
          <View className="relative mb-4">
            <Ionicons name="person-outline" size={20} color={isDarkMode ? 'white' : 'gray'} className="absolute left-3 top-3 z-10" />
            <TextInput placeholder="Instructor" value={newCourse.instructor || ''} onChangeText={(text) => setNewCourse({ ...newCourse, instructor: text })} className={`pl-10 border p-3 rounded-xl ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-900'}`} />
          </View>
          <View className="relative mb-4">
            <Ionicons name="cash-outline" size={20} color={isDarkMode ? 'white' : 'gray'} className="absolute left-3 top-3 z-10" />
            <TextInput placeholder="Price" value={newCourse.price?.toString() || ''} onChangeText={(text) => setNewCourse({ ...newCourse, price: parseFloat(text) || 0 })} keyboardType="numeric" className={`pl-10 border p-3 rounded-xl ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-900'}`} />
          </View>
          <View className="mb-4">
            <Text className={`text-sm font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Category</Text>
            <Picker
              selectedValue={newCourse.category || ''}
              onValueChange={(itemValue) => setNewCourse({ ...newCourse, category: itemValue as Course['category'] })}
              style={{ color: isDarkMode ? 'white' : 'black', backgroundColor: isDarkMode ? '#374151' : 'white', borderRadius: 12, borderWidth: 1, borderColor: isDarkMode ? '#4B5563' : '#D1D5DB', padding: 12 }}
            >
              <Picker.Item label="Select Category" value="" />
              {courseCategories.map(cat => <Picker.Item key={cat} label={cat} value={cat} />)}
            </Picker>
          </View>
          <View className="mb-4">
            <Text className={`text-sm font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Level</Text>
            <Picker
              selectedValue={newCourse.level || ''}
              onValueChange={(itemValue) => setNewCourse({ ...newCourse, level: itemValue as Course['level'] })}
              style={{ color: isDarkMode ? 'white' : 'black', backgroundColor: isDarkMode ? '#374151' : 'white', borderRadius: 12, borderWidth: 1, borderColor: isDarkMode ? '#4B5563' : '#D1D5DB', padding: 12 }}
            >
              <Picker.Item label="Select Level" value="" />
              {courseLevels.map(lvl => <Picker.Item key={lvl} label={lvl} value={lvl} />)}
            </Picker>
          </View>
          <View className="flex-row justify-between mt-6">
            <LinearGradient colors={['#3B82F6', '#1D4ED8']} className="flex-1 mr-2 rounded-xl">
              <TouchableOpacity onPress={onUpdate} className="p-3 items-center">
                <Text className="text-white text-center font-bold">Update Course</Text>
              </TouchableOpacity>
            </LinearGradient>
            <TouchableOpacity onPress={onClose} className={`flex-1 ml-2 p-3 rounded-xl ${isDarkMode ? 'bg-gray-600' : 'bg-gray-300'}`}>
              <Text className={`text-center font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </LinearGradient>
    </View>
  );
};
