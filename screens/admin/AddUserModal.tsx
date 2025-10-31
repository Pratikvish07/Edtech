import React from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Picker } from '@react-native-picker/picker';
import { User } from './AdminTypes';

interface AddUserModalProps {
  isVisible: boolean;
  onClose: () => void;
  newUser: Partial<User>;
  setNewUser: (user: Partial<User>) => void;
  onAdd: () => void;
  isDarkMode: boolean;
}

export const AddUserModal: React.FC<AddUserModalProps> = ({ isVisible, onClose, newUser, setNewUser, onAdd, isDarkMode }) => {
  if (!isVisible) return null;

  return (
    <View className="flex-1 justify-end bg-black bg-opacity-60">
      <View className="bg-transparent">
        <LinearGradient colors={isDarkMode ? ['#1F2937', '#111827'] : ['#F8FAFC', '#E2E8F0']} className="rounded-t-3xl shadow-2xl p-6 pb-8">
          <View className="flex-row justify-between items-center mb-6">
            <View className="flex-row items-center">
              <LinearGradient colors={['#10B981', '#059669']} className="p-2 rounded-full mr-3">
                <Ionicons name="person-add-outline" size={24} color="white" />
              </LinearGradient>
              <Text className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Add New User</Text>
            </View>
            <TouchableOpacity onPress={onClose} className={`p-2 rounded-full ${isDarkMode ? 'bg-gray-600' : 'bg-gray-200'}`}>
              <Ionicons name="close" size={24} color={isDarkMode ? 'white' : 'gray'} />
            </TouchableOpacity>
          </View>
          <ScrollView showsVerticalScrollIndicator={false} className="max-h-80">
            <View className="relative mb-5">
              <LinearGradient colors={isDarkMode ? ['#374151', '#4B5563'] : ['#FFFFFF', '#F9FAFB']} className="p-4 rounded-2xl shadow-lg">
                <View className="flex-row items-center">
                  <Ionicons name="person-outline" size={22} color={isDarkMode ? '#10B981' : '#059669'} className="mr-3" />
                  <TextInput
                    placeholder="Full Name"
                    placeholderTextColor={isDarkMode ? '#9CA3AF' : '#6B7280'}
                    value={newUser.name || ''}
                    onChangeText={(text) => setNewUser({ ...newUser, name: text })}
                    className={`flex-1 text-base ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
                  />
                </View>
              </LinearGradient>
            </View>
            <View className="relative mb-5">
              <LinearGradient colors={isDarkMode ? ['#374151', '#4B5563'] : ['#FFFFFF', '#F9FAFB']} className="p-4 rounded-2xl shadow-lg">
                <View className="flex-row items-center">
                  <Ionicons name="mail-outline" size={22} color={isDarkMode ? '#10B981' : '#059669'} className="mr-3" />
                  <TextInput
                    placeholder="Email Address"
                    placeholderTextColor={isDarkMode ? '#9CA3AF' : '#6B7280'}
                    value={newUser.email || ''}
                    onChangeText={(text) => setNewUser({ ...newUser, email: text })}
                    keyboardType="email-address"
                    className={`flex-1 text-base ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
                  />
                </View>
              </LinearGradient>
            </View>
            <View className="mb-5">
              <Text className={`text-sm font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>User Role</Text>
              <LinearGradient colors={isDarkMode ? ['#374151', '#4B5563'] : ['#FFFFFF', '#F9FAFB']} className="rounded-2xl shadow-lg p-1">
                <Picker
                  selectedValue={newUser.role || ''}
                  onValueChange={(itemValue) => setNewUser({ ...newUser, role: itemValue as User['role'] })}
                  style={{
                    color: isDarkMode ? 'white' : 'black',
                    backgroundColor: 'transparent',
                    borderRadius: 16,
                    padding: 12,
                    fontSize: 16
                  }}
                >
                  <Picker.Item label="Select Role" value="" />
                  <Picker.Item label="👑 Admin" value="admin" />
                  <Picker.Item label="🎓 Instructor" value="instructor" />
                  <Picker.Item label="📚 Student" value="student" />
                </Picker>
              </LinearGradient>
            </View>
            <View className="mb-6">
              <Text className={`text-sm font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Account Status</Text>
              <LinearGradient colors={isDarkMode ? ['#374151', '#4B5563'] : ['#FFFFFF', '#F9FAFB']} className="rounded-2xl shadow-lg p-1">
                <Picker
                  selectedValue={newUser.status || 'active'}
                  onValueChange={(itemValue) => setNewUser({ ...newUser, status: itemValue as User['status'] })}
                  style={{
                    color: isDarkMode ? 'white' : 'black',
                    backgroundColor: 'transparent',
                    borderRadius: 16,
                    padding: 12,
                    fontSize: 16
                  }}
                >
                  <Picker.Item label="✅ Active" value="active" />
                  <Picker.Item label="🚫 Blocked" value="blocked" />
                </Picker>
              </LinearGradient>
            </View>
            <View className="flex-row justify-between mt-2 space-x-4">
              <LinearGradient colors={['#10B981', '#059669']} className="flex-1 rounded-2xl shadow-lg">
                <TouchableOpacity onPress={onAdd} className="p-4 items-center">
                  <View className="flex-row items-center">
                    <Ionicons name="checkmark-circle-outline" size={20} color="white" className="mr-2" />
                    <Text className="text-white text-center font-bold text-lg">Add User</Text>
                  </View>
                </TouchableOpacity>
              </LinearGradient>
              <TouchableOpacity onPress={onClose} className={`flex-1 p-4 rounded-2xl shadow-lg ${isDarkMode ? 'bg-gray-600' : 'bg-gray-300'}`}>
                <View className="flex-row items-center justify-center">
                  <Ionicons name="close-circle-outline" size={20} color={isDarkMode ? 'white' : 'gray'} className="mr-2" />
                  <Text className={`text-center font-bold text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Cancel</Text>
                </View>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </LinearGradient>
      </View>
    </View>
  );
};
