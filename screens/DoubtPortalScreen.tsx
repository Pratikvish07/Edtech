import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  FlatList,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

type Doubt = {
  id: string;
  title: string;
  description: string;
  course: string;
  status: 'pending' | 'answered' | 'resolved';
  createdAt: string;
  answer?: string;
  answeredBy?: string;
};

const mockDoubts: Doubt[] = [
  {
    id: '1',
    title: 'React Hooks useEffect not working',
    description: 'I am having trouble with useEffect not triggering on component mount. Can someone help?',
    course: 'React Native Basics',
    status: 'answered',
    createdAt: '2024-01-15',
    answer: 'Make sure you have the correct dependency array. If you want it to run only once, use an empty array [].',
    answeredBy: 'John Doe',
  },
  {
    id: '2',
    title: 'Navigation between screens',
    description: 'How do I pass data between screens using React Navigation?',
    course: 'React Native Basics',
    status: 'pending',
    createdAt: '2024-01-14',
  },
  {
    id: '3',
    title: 'AsyncStorage not persisting data',
    description: 'My data is not being saved to AsyncStorage. What could be the issue?',
    course: 'React Native Basics',
    status: 'resolved',
    createdAt: '2024-01-13',
    answer: 'Check if you are awaiting the setItem method. AsyncStorage operations are asynchronous.',
    answeredBy: 'Jane Smith',
  },
];

export default function DoubtPortalScreen({ navigation }: any) {
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'answered' | 'resolved'>('all');
  const [showNewDoubtForm, setShowNewDoubtForm] = useState(false);
  const [newDoubt, setNewDoubt] = useState({
    title: '',
    description: '',
    course: '',
  });

  const filteredDoubts = mockDoubts.filter(doubt => {
    if (activeTab === 'all') return true;
    return doubt.status === activeTab;
  });

  const handleSubmitDoubt = () => {
    if (!newDoubt.title || !newDoubt.description || !newDoubt.course) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    // In a real app, this would make an API call
    Alert.alert('Success', 'Your doubt has been submitted successfully!');
    setNewDoubt({ title: '', description: '', course: '' });
    setShowNewDoubtForm(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'answered': return 'bg-blue-100 text-blue-700';
      case 'resolved': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
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
          <Text className="text-white text-2xl font-bold">Doubt Portal</Text>
          <TouchableOpacity
            onPress={() => setShowNewDoubtForm(!showNewDoubtForm)}
            className="p-2 bg-white/20 rounded-full"
          >
            <Ionicons name="add" size={20} color="white" />
          </TouchableOpacity>
        </View>

        {/* Tabs */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-3">
          {['all', 'pending', 'answered', 'resolved'].map(tab => (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab as any)}
              className={`px-4 py-1 rounded-full mr-2 ${activeTab === tab ? 'bg-white/30' : 'bg-white/10'}`}
            >
              <Text className="text-white font-medium text-sm capitalize">
                {tab === 'all' ? 'All Doubts' : tab}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </LinearGradient>

      <ScrollView className="flex-1 px-4 pt-4">
        {/* New Doubt Form */}
        {showNewDoubtForm && (
          <View className="bg-white p-6 rounded-lg shadow mb-6">
            <Text className="text-gray-900 text-lg font-bold mb-4">Ask a New Doubt</Text>

            <View className="mb-4">
              <Text className="text-gray-700 text-sm mb-1">Title</Text>
              <TextInput
                className="border border-gray-300 rounded px-3 py-2"
                placeholder="Brief title for your doubt"
                value={newDoubt.title}
                onChangeText={(text) => setNewDoubt({ ...newDoubt, title: text })}
              />
            </View>

            <View className="mb-4">
              <Text className="text-gray-700 text-sm mb-1">Course</Text>
              <TextInput
                className="border border-gray-300 rounded px-3 py-2"
                placeholder="Which course is this related to?"
                value={newDoubt.course}
                onChangeText={(text) => setNewDoubt({ ...newDoubt, course: text })}
              />
            </View>

            <View className="mb-4">
              <Text className="text-gray-700 text-sm mb-1">Description</Text>
              <TextInput
                className="border border-gray-300 rounded px-3 py-2"
                placeholder="Describe your doubt in detail"
                value={newDoubt.description}
                onChangeText={(text) => setNewDoubt({ ...newDoubt, description: text })}
                multiline
                numberOfLines={4}
              />
            </View>

            <View className="flex-row justify-end space-x-2">
              <TouchableOpacity
                onPress={() => {
                  setShowNewDoubtForm(false);
                  setNewDoubt({ title: '', description: '', course: '' });
                }}
                className="bg-gray-300 px-4 py-2 rounded"
              >
                <Text className="text-gray-700 font-medium">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSubmitDoubt} className="bg-indigo-600 px-4 py-2 rounded">
                <Text className="text-white font-medium">Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Doubts List */}
        <FlatList
          data={filteredDoubts}
          keyExtractor={item => item.id}
          contentContainerStyle={{ paddingBottom: 20 }}
          renderItem={({ item }) => (
            <View className="bg-white p-4 rounded-lg shadow mb-4">
              <View className="flex-row justify-between items-start mb-2">
                <Text className="text-gray-900 font-semibold text-base flex-1">{item.title}</Text>
                <View className={`px-2 py-1 rounded-full ${getStatusColor(item.status)}`}>
                  <Text className="text-xs font-medium capitalize">{item.status}</Text>
                </View>
              </View>

              <Text className="text-gray-500 text-sm mb-2">{item.course}</Text>
              <Text className="text-gray-600 text-sm mb-2">{item.description}</Text>
              <Text className="text-gray-400 text-xs">Asked on {item.createdAt}</Text>

              {item.answer && (
                <View className="bg-gray-50 p-3 rounded mt-3">
                  <Text className="text-gray-700 text-sm font-medium mb-1">Answer by {item.answeredBy}:</Text>
                  <Text className="text-gray-600 text-sm">{item.answer}</Text>
                </View>
              )}

              {item.status === 'pending' && (
                <TouchableOpacity className="mt-3 bg-indigo-600 py-2 rounded">
                  <Text className="text-white text-center font-medium">Follow Up</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
          ListEmptyComponent={
            <View className="items-center mt-12">
              <Text className="text-gray-400 text-base">No doubts found.</Text>
            </View>
          }
        />
      </ScrollView>
    </View>
  );
}
