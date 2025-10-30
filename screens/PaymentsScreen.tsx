import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

type Payment = {
  id: string;
  course: string;
  amount: number;
  date: string;
  status: 'completed' | 'pending' | 'failed';
  method: string;
};

const mockPayments: Payment[] = [
  {
    id: '1',
    course: 'React Native Basics',
    amount: 49.99,
    date: '2024-01-10',
    status: 'completed',
    method: 'Credit Card',
  },
  {
    id: '2',
    course: 'Advanced React',
    amount: 79.99,
    date: '2024-01-08',
    status: 'completed',
    method: 'PayPal',
  },
  {
    id: '3',
    course: 'Node.js API',
    amount: 59.99,
    date: '2024-01-05',
    status: 'pending',
    method: 'Bank Transfer',
  },
];

export default function PaymentsScreen({ navigation }: any) {
  const [activeTab, setActiveTab] = useState<'history' | 'methods'>('history');

  const totalSpent = mockPayments
    .filter(payment => payment.status === 'completed')
    .reduce((sum, payment) => sum + payment.amount, 0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'failed': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const handleRetryPayment = (paymentId: string) => {
    Alert.alert('Retry Payment', 'Are you sure you want to retry this payment?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Retry',
        onPress: () => Alert.alert('Success', 'Payment retry initiated successfully!'),
      },
    ]);
  };

  return (
    <View className="flex-1 bg-gray-100">
      {/* Header */}
      <LinearGradient colors={['#4F46E5', '#7C73E6']} className="pt-12 px-4 pb-4">
        <View className="flex-row justify-between items-center mb-3">
          <TouchableOpacity onPress={() => navigation.goBack()} className="p-2">
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-white text-2xl font-bold">Payments</Text>
          <View className="w-10" />
        </View>

        {/* Tabs */}
        <View className="flex-row mt-3">
          {['history', 'methods'].map(tab => (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab as any)}
              className={`px-4 py-1 rounded-full mr-2 ${activeTab === tab ? 'bg-white/30' : 'bg-white/10'}`}
            >
              <Text className="text-white font-medium text-sm capitalize">
                {tab === 'history' ? 'Payment History' : 'Payment Methods'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </LinearGradient>

      <ScrollView className="flex-1 px-4 pt-4">
        {activeTab === 'history' ? (
          <>
            {/* Summary Card */}
            <View className="bg-white p-6 rounded-lg shadow mb-6">
              <Text className="text-gray-900 text-lg font-bold mb-4">Payment Summary</Text>
              <View className="flex-row justify-between items-center">
                <View>
                  <Text className="text-gray-600 text-sm">Total Spent</Text>
                  <Text className="text-2xl font-bold text-indigo-600">${totalSpent.toFixed(2)}</Text>
                </View>
                <View>
                  <Text className="text-gray-600 text-sm">This Month</Text>
                  <Text className="text-xl font-bold text-green-600">$129.98</Text>
                </View>
              </View>
            </View>

            {/* Payment History */}
            <View className="bg-white rounded-lg shadow mb-6">
              <Text className="text-gray-900 font-bold p-4 border-b border-gray-200">Payment History</Text>

              {mockPayments.map((payment, index) => (
                <View
                  key={payment.id}
                  className={`flex-row items-center justify-between p-4 ${index !== mockPayments.length - 1 ? 'border-b border-gray-100' : ''}`}
                >
                  <View className="flex-1">
                    <Text className="text-gray-900 font-medium">{payment.course}</Text>
                    <Text className="text-gray-500 text-sm">{payment.date} • {payment.method}</Text>
                  </View>
                  <View className="items-end">
                    <Text className="text-gray-900 font-semibold">${payment.amount.toFixed(2)}</Text>
                    <View className={`px-2 py-1 rounded-full mt-1 ${getStatusColor(payment.status)}`}>
                      <Text className="text-xs font-medium capitalize">{payment.status}</Text>
                    </View>
                  </View>
                  {payment.status === 'failed' && (
                    <TouchableOpacity
                      onPress={() => handleRetryPayment(payment.id)}
                      className="ml-2 p-2"
                    >
                      <Ionicons name="refresh" size={20} color="#4F46E5" />
                    </TouchableOpacity>
                  )}
                </View>
              ))}
            </View>
          </>
        ) : (
          <>
            {/* Payment Methods */}
            <View className="bg-white rounded-lg shadow mb-6">
              <Text className="text-gray-900 font-bold p-4 border-b border-gray-200">Saved Payment Methods</Text>

              <TouchableOpacity className="flex-row items-center p-4 border-b border-gray-100">
                <Ionicons name="card" size={24} color="#4F46E5" />
                <View className="flex-1 ml-3">
                  <Text className="text-gray-900 font-medium">Credit Card</Text>
                  <Text className="text-gray-500 text-sm">**** **** **** 1234</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#6B7280" />
              </TouchableOpacity>

              <TouchableOpacity className="flex-row items-center p-4">
                <Ionicons name="logo-paypal" size={24} color="#4F46E5" />
                <View className="flex-1 ml-3">
                  <Text className="text-gray-900 font-medium">PayPal</Text>
                  <Text className="text-gray-500 text-sm">pratik@example.com</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#6B7280" />
              </TouchableOpacity>
            </View>

            {/* Add New Method */}
            <TouchableOpacity className="bg-indigo-600 p-4 rounded-lg shadow items-center mb-6">
              <Ionicons name="add" size={24} color="white" />
              <Text className="text-white font-medium mt-2">Add New Payment Method</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </View>
  );
}
