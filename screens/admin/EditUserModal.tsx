import React from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Picker } from '@react-native-picker/picker';
import { User } from './AdminTypes';

interface EditUserModalProps {
  isVisible: boolean;
  onClose: () => void;
  newUser: Partial<User>;
  setNewUser: (user: Partial<User>) => void;
  onUpdate: () => void;
  isDarkMode: boolean;
}

export const EditUserModal: React.FC<EditUserModalProps> = ({ isVisible, onClose, newUser, setNewUser, onUpdate, isDarkMode }) => {
  if (!isVisible) return null;

  return (
    <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
      <LinearGradient colors={isDarkMode ? ['#374151', '#1F2937'] : ['#FFFFFF', '#F9FAFB']} className="w-11/12 p-6 rounded-2xl shadow-2xl">
        <View className="flex-row justify-between items-center mb-4">
          <Text className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Edit User</Text>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} color={isDarkMode ? 'white' : 'gray'} />
          </TouchableOpacity>
        </View>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View className="relative mb-4">
            <Ionicons name="person-outline" size={20} color={isDarkMode ? 'white' : 'gray'} className="absolute left-3 top-3 z-10" />
            <TextInput placeholder="Name" value={newUser.name || ''} onChangeText={(text) => setNewUser({ ...newUser, name: text })} className={`pl-10 border p-3 rounded-xl ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-900'}`} />
          </View>
          <View className="relative mb-4">
            <Ionicons name="mail-outline" size={20} color={isDarkMode ? 'white' : 'gray'} className="absolute left-3 top-3 z-10" />
            <TextInput placeholder="Email" value={newUser.email || ''} onChangeText={(text) => setNewUser({ ...newUser, email: text })} keyboardType="email-address" className={`pl-10 border p-3 rounded-xl ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-900'}`} />
          </View>
          <View className="mb-4">
            <Text className={`text-sm font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Role</Text>
            <Picker
              selectedValue={newUser.role || ''}
              onValueChange={(itemValue) => setNewUser({ ...newUser, role: itemValue as User['role'] })}
              style={{ color: isDarkMode ? 'white' : 'black', backgroundColor: isDarkMode ? '#374151' : 'white', borderRadius: 12, borderWidth: 1, borderColor: isDarkMode ? '#4B5563' : '#D1D5DB', padding: 12 }}
            >
              <Picker.Item label="Select Role" value="" />
              <Picker.Item label="Admin" value="admin" />
              <Picker.Item label="Instructor" value="instructor" />
              <Picker.Item label="Student" value="student" />
            </Picker>
          </View>
          <View className="mb-4">
            <Text className={`text-sm font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Status</Text>
            <Picker
              selectedValue={newUser.status || 'active'}
              onValueChange={(itemValue) => setNewUser({ ...newUser, status: itemValue as User['status'] })}
              style={{ color: isDarkMode ? 'white' : 'black', backgroundColor: isDarkMode ? '#374151' : 'white', borderRadius: 12, borderWidth: 1, borderColor: isDarkMode ? '#4B5563' : '#D1D5DB', padding: 12 }}
            >
              <Picker.Item label="Active" value="active" />
              <Picker.Item label="Blocked" value="blocked" />
            </Picker>
          </View>
          <View className="flex-row justify-between mt-6">
            <LinearGradient colors={['#3B82F6', '#1D4ED8']} className="flex-1 mr-2 rounded-xl">
              <TouchableOpacity onPress={onUpdate} className="p-3 items-center">
                <Text className="text-white text-center font-bold">Update User</Text>
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
