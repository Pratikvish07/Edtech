import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

type Test = {
  id: string;
  title: string;
  subject: string;
  duration: number; // in minutes
  questions: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  attempted: boolean;
  score?: number;
  maxScore?: number;
  timeLeft?: number; // in seconds
};

const mockTests: Test[] = [
  {
    id: '1',
    title: 'React Native Fundamentals',
    subject: 'Mobile Development',
    duration: 60,
    questions: 50,
    difficulty: 'Medium',
    attempted: false,
  },
  {
    id: '2',
    title: 'JavaScript Advanced Concepts',
    subject: 'Programming',
    duration: 45,
    questions: 40,
    difficulty: 'Hard',
    attempted: true,
    score: 35,
    maxScore: 40,
  },
  {
    id: '3',
    title: 'UI/UX Design Principles',
    subject: 'Design',
    duration: 30,
    questions: 25,
    difficulty: 'Easy',
    attempted: false,
  },
  {
    id: '4',
    title: 'Data Structures & Algorithms',
    subject: 'Computer Science',
    duration: 90,
    questions: 60,
    difficulty: 'Hard',
    attempted: true,
    score: 48,
    maxScore: 60,
  },
  {
    id: '5',
    title: 'Python Basics',
    subject: 'Programming',
    duration: 45,
    questions: 35,
    difficulty: 'Easy',
    attempted: false,
  },
];

export default function TestsScreen({ navigation }: any) {
  const [activeTab, setActiveTab] = useState<'all' | 'attempted' | 'pending'>('all');
  const [ongoingTest, setOngoingTest] = useState<Test | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0);

  useEffect(() => {
    if (ongoingTest && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            Alert.alert('Time Up!', 'Your test time has expired.');
            setOngoingTest(null);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [ongoingTest, timeLeft]);

  const filteredTests = mockTests.filter(test => {
    if (activeTab === 'attempted') return test.attempted;
    if (activeTab === 'pending') return !test.attempted;
    return true;
  });

  const startTest = (test: Test) => {
    Alert.alert(
      'Start Test',
      `Are you sure you want to start "${test.title}"? You have ${test.duration} minutes.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Start',
          onPress: () => {
            setOngoingTest(test);
            setTimeLeft(test.duration * 60);
            Alert.alert('Test Started', 'Good luck!');
          },
        },
      ]
    );
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-700';
      case 'Medium': return 'bg-yellow-100 text-yellow-700';
      case 'Hard': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <View className="flex-1 bg-gray-100">
      {/* Header */}
      <LinearGradient colors={['#4F46E5', '#7C73E6']} className="pt-12 px-4 pb-4">
        <View className="flex-row justify-between items-center mb-3">
          <View>
            <Text className="text-white text-2xl font-bold">Test Center</Text>
            <Text className="text-white text-sm opacity-80">Attempt and track your tests</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('Login')} className="p-1 bg-red-500 px-3 py-1 rounded flex-row items-center">
            <Ionicons name="log-out-outline" size={16} color="white" />
            <Text className="text-white font-semibold ml-1">Logout</Text>
          </TouchableOpacity>
        </View>

        {/* Tabs */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-3">
          {['all', 'attempted', 'pending'].map(tab => (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab as any)}
              className={`px-4 py-1 rounded-full mr-2 ${activeTab === tab ? 'bg-white/30' : 'bg-white/10'}`}
            >
              <Text className="text-white font-medium text-sm">
                {tab === 'all'
                  ? 'All Tests'
                  : tab === 'attempted'
                  ? 'Attempted'
                  : 'Pending'}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </LinearGradient>

      {/* Ongoing Test Banner */}
      {ongoingTest && (
        <View className="bg-orange-100 mx-4 mt-4 p-4 rounded-lg border-l-4 border-orange-500">
          <View className="flex-row justify-between items-center">
            <View>
              <Text className="text-orange-800 font-bold">Ongoing: {ongoingTest.title}</Text>
              <Text className="text-orange-600 text-sm">Time Left: {formatTime(timeLeft)}</Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                Alert.alert('Submit Test', 'Are you sure you want to submit?', [
                  { text: 'Cancel' },
                  {
                    text: 'Submit',
                    onPress: () => {
                      setOngoingTest(null);
                      Alert.alert('Test Submitted', 'Your test has been submitted successfully.');
                    },
                  },
                ]);
              }}
              className="bg-orange-500 px-3 py-1 rounded"
            >
              <Text className="text-white font-medium">Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Test List */}
      <ScrollView className="flex-1 px-4 pt-4">
        {filteredTests.map((test) => (
          <View key={test.id} className="bg-white p-4 rounded-lg shadow mb-4">
            <View className="flex-row justify-between items-start mb-2">
              <Text className="text-gray-900 font-semibold text-lg flex-1">{test.title}</Text>
              <View className={`px-2 py-1 rounded-full ${getDifficultyColor(test.difficulty)}`}>
                <Text className="text-xs font-medium">{test.difficulty}</Text>
              </View>
            </View>

            <Text className="text-gray-500 text-sm mb-2">{test.subject}</Text>

            <View className="flex-row justify-between items-center mb-3">
              <Text className="text-gray-600 text-sm">Duration: {test.duration} min</Text>
              <Text className="text-gray-600 text-sm">Questions: {test.questions}</Text>
            </View>

            {test.attempted && test.score !== undefined && test.maxScore !== undefined && (
              <View className="bg-gray-50 p-2 rounded mb-3">
                <Text className="text-gray-700 text-sm">
                  Score: {test.score}/{test.maxScore} ({Math.round((test.score / test.maxScore) * 100)}%)
                </Text>
              </View>
            )}

            {!test.attempted && (
              <TouchableOpacity
                onPress={() => startTest(test)}
                className="bg-indigo-600 py-2 rounded"
              >
                <Text className="text-white text-center font-medium">Start Test</Text>
              </TouchableOpacity>
            )}

            {test.attempted && (
              <TouchableOpacity
                onPress={() => Alert.alert('Review Test', 'Review functionality coming soon!')}
                className="bg-green-600 py-2 rounded"
              >
                <Text className="text-white text-center font-medium">Review Test</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}

        {filteredTests.length === 0 && (
          <View className="items-center mt-12">
            <Text className="text-gray-400 text-base">No tests found.</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
