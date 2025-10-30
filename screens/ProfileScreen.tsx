import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

type UserProfile = {
  name: string;
  email: string;
  phone: string;
  bio: string;
  avatar?: string;
};

export default function ProfileScreen({ navigation }: any) {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
    name: 'Pratik Vishwakarma',
    email: 'pratik@example.com',
    phone: '+91 9876543210',
    bio: 'Passionate learner and developer. Always eager to explore new technologies and build amazing applications.',
  });

  const [editedProfile, setEditedProfile] = useState<UserProfile>(profile);

  const handleSave = () => {
    setProfile(editedProfile);
    setIsEditing(false);
    Alert.alert('Success', 'Profile updated successfully!');
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };

  const menuItems = [
    { icon: 'person-outline', title: 'Edit Profile', action: () => setIsEditing(true) },
    { icon: 'notifications-outline', title: 'Notifications', action: () => navigation.navigate('Notifications') },
    { icon: 'card-outline', title: 'Payments & Subscriptions', action: () => navigation.navigate('Payments') },
    { icon: 'help-circle-outline', title: 'Support & Help', action: () => navigation.navigate('Support') },
    { icon: 'log-out-outline', title: 'Logout', action: () => navigation.navigate('Login') },
  ];

  return (
    <View className="flex-1 bg-gray-100">
      {/* Header */}
      <LinearGradient colors={['#4F46E5', '#7C73E6']} className="pt-12 px-4 pb-4">
        <View className="flex-row justify-between items-center">
          <Text className="text-white text-2xl font-bold">Profile</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')} className="p-1 bg-red-500 px-3 py-1 rounded flex-row items-center">
            <Ionicons name="log-out-outline" size={16} color="white" />
            <Text className="text-white font-semibold ml-1">Logout</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView className="flex-1 px-4 pt-4">
        {/* Profile Card */}
        <View className="bg-white p-6 rounded-lg shadow mb-6">
          <View className="items-center mb-4">
            <View className="w-20 h-20 bg-indigo-100 rounded-full items-center justify-center mb-3">
              <Ionicons name="person" size={40} color="#4F46E5" />
            </View>
            <Text className="text-gray-900 text-xl font-bold">{profile.name}</Text>
            <Text className="text-gray-500 text-sm">{profile.email}</Text>
          </View>

          <View className="border-t border-gray-200 pt-4">
            <Text className="text-gray-700 text-sm mb-2">Bio</Text>
            <Text className="text-gray-600 text-sm">{profile.bio}</Text>
          </View>
        </View>

        {/* Edit Profile Modal/Form */}
        {isEditing && (
          <View className="bg-white p-6 rounded-lg shadow mb-6">
            <Text className="text-gray-900 text-lg font-bold mb-4">Edit Profile</Text>

            <View className="mb-4">
              <Text className="text-gray-700 text-sm mb-1">Name</Text>
              <TextInput
                className="border border-gray-300 rounded px-3 py-2"
                value={editedProfile.name}
                onChangeText={(text) => setEditedProfile({ ...editedProfile, name: text })}
              />
            </View>

            <View className="mb-4">
              <Text className="text-gray-700 text-sm mb-1">Email</Text>
              <TextInput
                className="border border-gray-300 rounded px-3 py-2"
                value={editedProfile.email}
                onChangeText={(text) => setEditedProfile({ ...editedProfile, email: text })}
                keyboardType="email-address"
              />
            </View>

            <View className="mb-4">
              <Text className="text-gray-700 text-sm mb-1">Phone</Text>
              <TextInput
                className="border border-gray-300 rounded px-3 py-2"
                value={editedProfile.phone}
                onChangeText={(text) => setEditedProfile({ ...editedProfile, phone: text })}
                keyboardType="phone-pad"
              />
            </View>

            <View className="mb-4">
              <Text className="text-gray-700 text-sm mb-1">Bio</Text>
              <TextInput
                className="border border-gray-300 rounded px-3 py-2"
                value={editedProfile.bio}
                onChangeText={(text) => setEditedProfile({ ...editedProfile, bio: text })}
                multiline
                numberOfLines={3}
              />
            </View>

            <View className="flex-row justify-end space-x-2">
              <TouchableOpacity onPress={handleCancel} className="bg-gray-300 px-4 py-2 rounded">
                <Text className="text-gray-700 font-medium">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSave} className="bg-indigo-600 px-4 py-2 rounded">
                <Text className="text-white font-medium">Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Menu Items */}
        <View className="bg-white rounded-lg shadow mb-6">
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={item.title}
              onPress={item.action}
              className={`flex-row items-center p-4 ${index !== menuItems.length - 1 ? 'border-b border-gray-200' : ''}`}
            >
              <Ionicons name={item.icon as any} size={24} color="#4F46E5" />
              <Text className="text-gray-900 font-medium ml-3 flex-1">{item.title}</Text>
              <Ionicons name="chevron-forward" size={20} color="#6B7280" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Stats */}
        <View className="bg-white p-6 rounded-lg shadow mb-6">
          <Text className="text-gray-900 text-lg font-bold mb-4">Your Stats</Text>

          <View className="flex-row justify-between mb-4">
            <View className="items-center">
              <Text className="text-2xl font-bold text-indigo-600">12</Text>
              <Text className="text-gray-500 text-sm">Courses</Text>
            </View>
            <View className="items-center">
              <Text className="text-2xl font-bold text-green-600">8</Text>
              <Text className="text-gray-500 text-sm">Completed</Text>
            </View>
            <View className="items-center">
              <Text className="text-2xl font-bold text-orange-600">5</Text>
              <Text className="text-gray-500 text-sm">Tests</Text>
            </View>
          </View>

          <View className="flex-row justify-between">
            <View className="items-center">
              <Text className="text-2xl font-bold text-purple-600">4.8</Text>
              <Text className="text-gray-500 text-sm">Avg Rating</Text>
            </View>
            <View className="items-center">
              <Text className="text-2xl font-bold text-blue-600">156</Text>
              <Text className="text-gray-500 text-sm">Hours</Text>
            </View>
            <View className="items-center">
              <Text className="text-2xl font-bold text-red-600">3</Text>
              <Text className="text-gray-500 text-sm">Certificates</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
