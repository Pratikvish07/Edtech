import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Course, User } from './AdminTypes';
import { getData, saveData } from './AdminUtils';
import { Toast } from './Toast';

interface ContentItem {
  id: string;
  type: 'course' | 'user' | 'announcement' | 'page';
  title: string;
  status: 'published' | 'draft' | 'archived';
  lastModified: string;
  author: string;
}

export default function AdminContentManager({ isDarkMode }: { isDarkMode: boolean }) {
  const [content, setContent] = useState<ContentItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    const courses = await getData('courses') || [];
    const users = await getData('users') || [];

    const courseItems: ContentItem[] = courses.map((course: Course) => ({
      id: course.id,
      type: 'course',
      title: course.title,
      status: course.featured ? 'published' : 'draft',
      lastModified: new Date().toISOString().split('T')[0],
      author: course.instructor,
    }));

    const userItems: ContentItem[] = users.map((user: User) => ({
      id: user.id,
      type: 'user',
      title: `${user.name} (${user.email})`,
      status: user.status === 'active' ? 'published' : 'archived',
      lastModified: new Date().toISOString().split('T')[0],
      author: user.role,
    }));

    const mockAnnouncements: ContentItem[] = [
      {
        id: 'ann1',
        type: 'announcement',
        title: 'Welcome to ED Tech Platform',
        status: 'published',
        lastModified: '2024-01-15',
        author: 'Admin',
      },
      {
        id: 'ann2',
        type: 'announcement',
        title: 'New Course: Advanced React Native',
        status: 'draft',
        lastModified: '2024-01-20',
        author: 'Admin',
      },
    ];

    setContent([...courseItems, ...userItems, ...mockAnnouncements]);
  };

  const filteredContent = content.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'all' || item.type === selectedType;
    return matchesSearch && matchesType;
  });

  const updateContentStatus = async (id: string, newStatus: ContentItem['status']) => {
    const updatedContent = content.map(item =>
      item.id === id ? { ...item, status: newStatus } : item
    );
    setContent(updatedContent);

    // Update corresponding data
    if (content.find(c => c.id === id)?.type === 'course') {
      const courses = await getData('courses') || [];
      const updatedCourses = courses.map((course: Course) =>
        course.id === id ? { ...course, featured: newStatus === 'published' } : course
      );
      await saveData('courses', updatedCourses);
    }

    setToast({ message: `Content status updated to ${newStatus}`, type: 'success' });
  };

  const deleteContent = async (id: string) => {
    const item = content.find(c => c.id === id);
    if (!item) return;

    Alert.alert(
      'Delete Content',
      `Are you sure you want to delete "${item.title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const updatedContent = content.filter(c => c.id !== id);
            setContent(updatedContent);

            if (item.type === 'course') {
              const courses = await getData('courses') || [];
              const updatedCourses = courses.filter((c: Course) => c.id !== id);
              await saveData('courses', updatedCourses);
            } else if (item.type === 'user') {
              const users = await getData('users') || [];
              const updatedUsers = users.filter((u: User) => u.id !== id);
              await saveData('users', updatedUsers);
            }

            setToast({ message: 'Content deleted successfully', type: 'success' });
          }
        }
      ]
    );
  };

  const getStatusColor = (status: ContentItem['status']) => {
    switch (status) {
      case 'published': return '#10b981';
      case 'draft': return '#f59e0b';
      case 'archived': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const getTypeIcon = (type: ContentItem['type']) => {
    switch (type) {
      case 'course': return 'book-outline';
      case 'user': return 'person-outline';
      case 'announcement': return 'megaphone-outline';
      case 'page': return 'document-outline';
      default: return 'document-outline';
    }
  };

  return (
    <View className={`flex-1 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <View className="p-6">
        <Text className={`text-3xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Content Manager
        </Text>

        {/* Search and Filter */}
        <View className="mb-6">
          <TextInput
            placeholder="Search content..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            className={`border p-3 rounded-xl mb-4 ${isDarkMode ? 'border-gray-700 bg-gray-800 text-white' : 'border-gray-300 bg-white text-gray-900'}`}
          />

          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
            {[
              { id: 'all', label: 'All' },
              { id: 'course', label: 'Courses' },
              { id: 'user', label: 'Users' },
              { id: 'announcement', label: 'Announcements' },
              { id: 'page', label: 'Pages' },
            ].map((filter) => (
              <TouchableOpacity
                key={filter.id}
                onPress={() => setSelectedType(filter.id)}
                className={`mr-3 px-4 py-2 rounded-full ${
                  selectedType === filter.id
                    ? 'bg-blue-500'
                    : isDarkMode
                      ? 'bg-gray-700'
                      : 'bg-gray-200'
                }`}
              >
                <Text
                  className={`font-medium ${
                    selectedType === filter.id
                      ? 'text-white'
                      : isDarkMode
                        ? 'text-gray-300'
                        : 'text-gray-700'
                  }`}
                >
                  {filter.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Content List */}
        <ScrollView showsVerticalScrollIndicator={false}>
          {filteredContent.map((item) => (
            <LinearGradient
              key={item.id}
              colors={isDarkMode ? ['#374151', '#1f2937'] : ['#ffffff', '#f9fafb']}
              style={{
                marginBottom: 12,
                padding: 16,
                borderRadius: 12,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 2,
              }}
            >
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center flex-1">
                  <View
                    className="w-10 h-10 rounded-full items-center justify-center mr-3"
                    style={{ backgroundColor: '#3b82f620' }}
                  >
                    <Ionicons name={getTypeIcon(item.type) as any} size={20} color="#3b82f6" />
                  </View>
                  <View className="flex-1">
                    <Text className={`font-semibold text-base mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {item.title}
                    </Text>
                    <View className="flex-row items-center">
                      <Text className={`text-sm mr-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                      </Text>
                      <View
                        className="px-2 py-1 rounded-full"
                        style={{ backgroundColor: getStatusColor(item.status) + '20' }}
                      >
                        <Text
                          className="text-xs font-medium"
                          style={{ color: getStatusColor(item.status) }}
                        >
                          {item.status}
                        </Text>
                      </View>
                    </View>
                    <Text className={`text-xs mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                      By {item.author} • Modified {item.lastModified}
                    </Text>
                  </View>
                </View>

                <View className="flex-row items-center">
                  <TouchableOpacity
                    onPress={() => {
                      const newStatus = item.status === 'published' ? 'draft' : 'published';
                      updateContentStatus(item.id, newStatus);
                    }}
                    className="p-2 mr-2"
                  >
                    <Ionicons
                      name={item.status === 'published' ? 'eye-off-outline' : 'eye-outline'}
                      size={20}
                      color={isDarkMode ? '#9ca3af' : '#6b7280'}
                    />
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => deleteContent(item.id)}
                    className="p-2"
                  >
                    <Ionicons name="trash-outline" size={20} color="#ef4444" />
                  </TouchableOpacity>
                </View>
              </View>
            </LinearGradient>
          ))}

          {filteredContent.length === 0 && (
            <View className="items-center py-12">
              <Ionicons
                name="document-text-outline"
                size={64}
                color={isDarkMode ? '#6b7280' : '#9ca3af'}
              />
              <Text className={`text-lg font-medium mt-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                No content found
              </Text>
              <Text className={`text-sm mt-2 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                Try adjusting your search or filter criteria
              </Text>
            </View>
          )}
        </ScrollView>
      </View>

      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onHide={() => setToast(null)}
        />
      )}
    </View>
  );
}
