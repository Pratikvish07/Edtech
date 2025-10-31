import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

interface AdminSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isDarkMode: boolean;
  navigation: any;
}

const sidebarSections = [
  { id: 'dashboard', label: 'Dashboard', icon: 'grid-outline' },
  { id: 'courses', label: 'Courses', icon: 'book-outline' },
  { id: 'users', label: 'Users', icon: 'people-outline' },
  { id: 'teachers', label: 'Teachers', icon: 'school-outline' },
  { id: 'leads', label: 'Leads', icon: 'megaphone-outline' },
  { id: 'analytics', label: 'Analytics', icon: 'bar-chart-outline' },
  { id: 'content', label: 'Content', icon: 'document-text-outline' },
  { id: 'settings', label: 'Settings', icon: 'settings-outline' },
];

const appPages = [
  { id: 'home', label: 'Home Dashboard', icon: 'home-outline' },
  { id: 'courses-page', label: 'Courses Page', icon: 'book-outline' },
  { id: 'tests', label: 'Tests', icon: 'clipboard-outline' },
  { id: 'profile', label: 'Profile', icon: 'person-outline' },
  { id: 'attendance', label: 'Attendance', icon: 'calendar-outline' },
  { id: 'doubt-portal', label: 'Doubt Portal', icon: 'help-circle-outline' },
  { id: 'notifications', label: 'Notifications', icon: 'notifications-outline' },
  { id: 'payments', label: 'Payments', icon: 'card-outline' },
  { id: 'support', label: 'Support', icon: 'headset-outline' },
];

export default function AdminSidebar({
  activeSection,
  onSectionChange,
  isCollapsed,
  onToggleCollapse,
  isDarkMode,
  navigation
}: AdminSidebarProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const sidebarWidth = isCollapsed ? 80 : 280;

  const toggleSection = (sectionId: string) => {
    setExpandedSection(expandedSection === sectionId ? null : sectionId);
  };

  return (
    <Animated.View
      style={{
        width: sidebarWidth,
        backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
        borderRightWidth: 1,
        borderRightColor: isDarkMode ? '#374151' : '#e5e7eb',
        shadowColor: '#000',
        shadowOffset: { width: 2, height: 0 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
      }}
    >
      {/* Header */}
      <LinearGradient
        colors={isDarkMode ? ['#3b82f6', '#1d4ed8'] : ['#6366f1', '#4f46e5']}
        style={{
          padding: 16,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {!isCollapsed && (
          <Text className="text-white font-bold text-lg">Admin Panel</Text>
        )}
        <TouchableOpacity
          onPress={onToggleCollapse}
          className="p-2 rounded-full bg-white/20"
        >
          <Ionicons
            name={isCollapsed ? 'chevron-forward' : 'chevron-back'}
            size={20}
            color="white"
          />
        </TouchableOpacity>
      </LinearGradient>

      {/* Navigation Sections */}
      <View className="flex-1 py-4">
        {/* Admin Modules */}
        <View className="mb-6">
          {!isCollapsed && (
            <Text className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Admin Modules
            </Text>
          )}
          {sidebarSections.map((section) => (
            <TouchableOpacity
              key={section.id}
              onPress={() => onSectionChange(section.id)}
              className={`mx-2 my-1 px-3 py-3 rounded-xl flex-row items-center ${
                activeSection === section.id
                  ? 'bg-blue-500'
                  : isDarkMode
                    ? 'hover:bg-gray-700'
                    : 'hover:bg-gray-100'
              }`}
            >
              <Ionicons
                name={section.icon as any}
                size={24}
                color={activeSection === section.id ? 'white' : (isDarkMode ? '#9ca3af' : '#6b7280')}
              />
              {!isCollapsed && (
                <Text
                  className={`ml-3 font-medium ${
                    activeSection === section.id ? 'text-white' : isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}
                >
                  {section.label}
                </Text>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* App Pages Access */}
        <View>
          {!isCollapsed && (
            <TouchableOpacity
              onPress={() => toggleSection('app-pages')}
              className="px-4 py-2 flex-row items-center justify-between"
            >
              <Text className={`text-xs font-semibold uppercase tracking-wider ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                App Pages
              </Text>
              <Ionicons
                name={expandedSection === 'app-pages' ? 'chevron-up' : 'chevron-down'}
                size={16}
                color={isDarkMode ? '#9ca3af' : '#6b7280'}
              />
            </TouchableOpacity>
          )}
          {(expandedSection === 'app-pages' || isCollapsed) && (
            <View>
              {appPages.map((page) => (
                <TouchableOpacity
                  key={page.id}
                  onPress={() => onSectionChange(page.id)}
                  className={`mx-2 my-1 px-3 py-2 rounded-lg flex-row items-center ${
                    activeSection === page.id
                      ? 'bg-purple-500'
                      : isDarkMode
                        ? 'hover:bg-gray-700'
                        : 'hover:bg-gray-100'
                  }`}
                >
                  <Ionicons
                    name={page.icon as any}
                    size={20}
                    color={activeSection === page.id ? 'white' : (isDarkMode ? '#9ca3af' : '#6b7280')}
                  />
                  {!isCollapsed && (
                    <Text
                      className={`ml-3 text-sm ${
                        activeSection === page.id ? 'text-white' : isDarkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}
                    >
                      {page.label}
                    </Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </View>

      {/* Footer */}
      <View className={`p-4 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Login');
          }}
          className={`flex-row items-center justify-center p-3 rounded-xl ${isDarkMode ? 'bg-red-600' : 'bg-red-500'} shadow-lg`}
          style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 8,
          }}
        >
          <Ionicons name="log-out-outline" size={20} color="white" />
          {!isCollapsed && (
            <Text className="text-white font-bold ml-2 text-base">Logout</Text>
          )}
        </TouchableOpacity>
        {!isCollapsed && (
          <Text className={`text-xs text-center mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Admin Access Active
          </Text>
        )}
      </View>
    </Animated.View>
  );
}
