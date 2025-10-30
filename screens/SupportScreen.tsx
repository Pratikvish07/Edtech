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

type FAQ = {
  id: string;
  question: string;
  answer: string;
};

const mockFAQs: FAQ[] = [
  {
    id: '1',
    question: 'How do I reset my password?',
    answer: 'Go to the login screen and click on "Forgot Password". Enter your email address and follow the instructions sent to your email.',
  },
  {
    id: '2',
    question: 'How do I enroll in a course?',
    answer: 'Browse courses from the dashboard or courses tab. Click on a course and select "Add to Cart" or "Enroll Now" if it\'s free.',
  },
  {
    id: '3',
    question: 'Can I download course content?',
    answer: 'Currently, course content is available for online viewing only. Offline access may be available for premium subscribers.',
  },
  {
    id: '4',
    question: 'How do I contact my instructor?',
    answer: 'Use the Doubt Portal to ask questions. Instructors typically respond within 24 hours.',
  },
  {
    id: '5',
    question: 'What payment methods are accepted?',
    answer: 'We accept credit cards, debit cards, PayPal, and bank transfers. All payments are processed securely.',
  },
];

export default function SupportScreen({ navigation }: any) {
  const [activeTab, setActiveTab] = useState<'faq' | 'contact'>('faq');
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);
  const [contactForm, setContactForm] = useState({
    subject: '',
    message: '',
  });

  const handleSubmitContact = () => {
    if (!contactForm.subject || !contactForm.message) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    Alert.alert('Success', 'Your message has been sent successfully! We will get back to you within 24 hours.');
    setContactForm({ subject: '', message: '' });
  };

  const quickActions = [
    {
      icon: 'chatbubble-outline',
      title: 'Live Chat',
      action: () => Alert.alert('Live Chat', 'Live chat feature coming soon!'),
    },
    {
      icon: 'call-outline',
      title: 'Call Support',
      action: () => Alert.alert('Call Support', 'Phone: +1 (555) 123-4567'),
    },
    {
      icon: 'mail-outline',
      title: 'Email Us',
      action: () => Alert.alert('Email Support', 'support@edtechapp.com'),
    },
    {
      icon: 'document-text-outline',
      title: 'User Guide',
      action: () => Alert.alert('User Guide', 'User guide feature coming soon!'),
    },
  ];

  return (
    <View className="flex-1 bg-gray-100">
      {/* Header */}
      <LinearGradient colors={['#4F46E5', '#7C73E6']} className="pt-12 px-4 pb-4">
        <View className="flex-row justify-between items-center mb-3">
          <TouchableOpacity onPress={() => navigation.goBack()} className="p-2">
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-white text-2xl font-bold">Support</Text>
          <View className="w-10" />
        </View>

        {/* Tabs */}
        <View className="flex-row mt-3">
          {['faq', 'contact'].map(tab => (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab as any)}
              className={`px-4 py-1 rounded-full mr-2 ${activeTab === tab ? 'bg-white/30' : 'bg-white/10'}`}
            >
              <Text className="text-white font-medium text-sm capitalize">
                {tab === 'faq' ? 'FAQ' : 'Contact Us'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </LinearGradient>

      <ScrollView className="flex-1 px-4 pt-4">
        {activeTab === 'faq' ? (
          <>
            {/* Quick Actions */}
            <View className="bg-white p-4 rounded-lg shadow mb-6">
              <Text className="text-gray-900 font-bold mb-4">Quick Actions</Text>
              <View className="flex-row flex-wrap">
                {quickActions.map((action, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={action.action}
                    className="w-1/2 p-2 items-center"
                  >
                    <View className="w-12 h-12 bg-indigo-100 rounded-full items-center justify-center mb-2">
                      <Ionicons name={action.icon as any} size={24} color="#4F46E5" />
                    </View>
                    <Text className="text-gray-700 text-sm text-center">{action.title}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* FAQ Section */}
            <View className="bg-white rounded-lg shadow mb-6">
              <Text className="text-gray-900 font-bold p-4 border-b border-gray-200">Frequently Asked Questions</Text>

              {mockFAQs.map((faq) => (
                <View key={faq.id}>
                  <TouchableOpacity
                    onPress={() => setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)}
                    className="flex-row items-center justify-between p-4 border-b border-gray-100"
                  >
                    <Text className="text-gray-900 font-medium flex-1 pr-2">{faq.question}</Text>
                    <Ionicons
                      name={expandedFAQ === faq.id ? 'chevron-up' : 'chevron-down'}
                      size={20}
                      color="#6B7280"
                    />
                  </TouchableOpacity>

                  {expandedFAQ === faq.id && (
                    <View className="px-4 pb-4">
                      <Text className="text-gray-600 text-sm">{faq.answer}</Text>
                    </View>
                  )}
                </View>
              ))}
            </View>
          </>
        ) : (
          <>
            {/* Contact Form */}
            <View className="bg-white p-6 rounded-lg shadow mb-6">
              <Text className="text-gray-900 text-lg font-bold mb-4">Contact Support</Text>

              <View className="mb-4">
                <Text className="text-gray-700 text-sm mb-1">Subject</Text>
                <TextInput
                  className="border border-gray-300 rounded px-3 py-2"
                  placeholder="What is this about?"
                  value={contactForm.subject}
                  onChangeText={(text) => setContactForm({ ...contactForm, subject: text })}
                />
              </View>

              <View className="mb-4">
                <Text className="text-gray-700 text-sm mb-1">Message</Text>
                <TextInput
                  className="border border-gray-300 rounded px-3 py-2"
                  placeholder="Describe your issue or question"
                  value={contactForm.message}
                  onChangeText={(text) => setContactForm({ ...contactForm, message: text })}
                  multiline
                  numberOfLines={6}
                />
              </View>

              <TouchableOpacity onPress={handleSubmitContact} className="bg-indigo-600 py-3 rounded">
                <Text className="text-white text-center font-medium">Send Message</Text>
              </TouchableOpacity>
            </View>

            {/* Contact Information */}
            <View className="bg-white p-6 rounded-lg shadow mb-6">
              <Text className="text-gray-900 text-lg font-bold mb-4">Other Ways to Reach Us</Text>

              <View className="space-y-4">
                <View className="flex-row items-center">
                  <Ionicons name="mail-outline" size={24} color="#4F46E5" />
                  <View className="ml-3">
                    <Text className="text-gray-900 font-medium">Email</Text>
                    <Text className="text-gray-600 text-sm">support@edtechapp.com</Text>
                  </View>
                </View>

                <View className="flex-row items-center">
                  <Ionicons name="call-outline" size={24} color="#4F46E5" />
                  <View className="ml-3">
                    <Text className="text-gray-900 font-medium">Phone</Text>
                    <Text className="text-gray-600 text-sm">+1 (555) 123-4567</Text>
                  </View>
                </View>

                <View className="flex-row items-center">
                  <Ionicons name="time-outline" size={24} color="#4F46E5" />
                  <View className="ml-3">
                    <Text className="text-gray-900 font-medium">Support Hours</Text>
                    <Text className="text-gray-600 text-sm">Mon-Fri: 9 AM - 6 PM EST</Text>
                  </View>
                </View>
              </View>
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}
