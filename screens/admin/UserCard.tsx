import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { User } from './AdminTypes';

interface UserCardProps {
  user: User;
  isSelected: boolean;
  isDarkMode: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export const UserCard: React.FC<UserCardProps> = ({ user, isSelected, isDarkMode, onSelect, onEdit, onDelete }) => {
  return (
    <View className={`bg-white rounded-3xl shadow-lg mb-4 overflow-hidden ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
      <TouchableOpacity onPress={onSelect} className={`absolute top-3 left-3 z-10 ${isDarkMode ? 'bg-gray-700' : 'bg-white'} rounded-full p-1`}>
        <Ionicons name={isSelected ? 'checkbox-outline' : 'square-outline'} size={24} color={isSelected ? 'blue' : (isDarkMode ? 'white' : 'gray')} />
      </TouchableOpacity>
      <LinearGradient colors={['#10B981', '#34D399']} className="p-4 pt-10">
        <View className="flex-row justify-between items-start">
          <View className="flex-1">
            <Text className="text-xl font-bold text-white">{user.name}</Text>
            <Text className="text-green-100 text-sm">{user.email}</Text>
            <View className="flex-row items-center mt-1">
              <Text className="text-green-200 text-xs bg-green-600 px-2 py-1 rounded-full">{user.role}</Text>
              <Text className={`text-xs ml-2 px-2 py-1 rounded-full ${user.status === 'active' ? 'bg-blue-500 text-white' : 'bg-red-500 text-white'}`}>{user.status}</Text>
            </View>
          </View>
          <View className="flex-row space-x-2">
            <TouchableOpacity onPress={onEdit} className="bg-yellow-500 p-2 rounded-full"><Ionicons name="pencil" size={16} color="white" /></TouchableOpacity>
            <TouchableOpacity onPress={onDelete} className="bg-red-500 p-2 rounded-full"><Ionicons name="trash" size={16} color="white" /></TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
      <View className="p-4">
        <Text className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>ID: {user.id}</Text>
      </View>
    </View>
  );
};
