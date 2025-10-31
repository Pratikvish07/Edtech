import React, { useState } from 'react';
import { View, Text, ScrollView, Switch, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface SettingItemProps {
  title: string;
  description: string;
  icon: string;
  isDarkMode: boolean;
  children?: React.ReactNode;
}

const SettingItem: React.FC<SettingItemProps> = ({ title, description, icon, isDarkMode, children }) => (
  <LinearGradient
    colors={isDarkMode ? ['#374151', '#1f2937'] : ['#ffffff', '#f9fafb']}
    style={{
      margin: 8,
      padding: 16,
      borderRadius: 12,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    }}
  >
    <View className="flex-row items-center">
      <View
        className="w-10 h-10 rounded-full items-center justify-center mr-4"
        style={{ backgroundColor: '#3b82f620' }}
      >
        <Ionicons name={icon as any} size={20} color="#3b82f6" />
      </View>
      <View className="flex-1">
        <Text className={`font-semibold text-base mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          {title}
        </Text>
        <Text className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          {description}
        </Text>
      </View>
      {children}
    </View>
  </LinearGradient>
);

export default function AdminSettings({ isDarkMode, onThemeToggle }: { isDarkMode: boolean; onThemeToggle: () => void }) {
  const [notifications, setNotifications] = useState(true);
  const [autoBackup, setAutoBackup] = useState(false);
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  const handleClearCache = () => {
    Alert.alert(
      'Clear Cache',
      'This will clear all cached data. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear', style: 'destructive', onPress: () => Alert.alert('Success', 'Cache cleared successfully!') }
      ]
    );
  };

  const handleResetSettings = () => {
    Alert.alert(
      'Reset Settings',
      'This will reset all settings to default. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Reset', style: 'destructive', onPress: () => Alert.alert('Success', 'Settings reset to default!') }
      ]
    );
  };

  return (
    <ScrollView
      className={`flex-1 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}
      showsVerticalScrollIndicator={false}
    >
      <View className="p-6">
        <Text className={`text-3xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Settings
        </Text>

        {/* General Settings */}
        <View className="mb-8">
          <Text className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            General
          </Text>

          <SettingItem
            title="Dark Mode"
            description="Toggle between light and dark themes"
            icon="moon-outline"
            isDarkMode={isDarkMode}
          >
            <Switch value={isDarkMode} onValueChange={onThemeToggle} />
          </SettingItem>

          <SettingItem
            title="Notifications"
            description="Receive notifications for important updates"
            icon="notifications-outline"
            isDarkMode={isDarkMode}
          >
            <Switch value={notifications} onValueChange={setNotifications} />
          </SettingItem>

          <SettingItem
            title="Auto Backup"
            description="Automatically backup data daily"
            icon="cloud-upload-outline"
            isDarkMode={isDarkMode}
          >
            <Switch value={autoBackup} onValueChange={setAutoBackup} />
          </SettingItem>
        </View>

        {/* System Settings */}
        <View className="mb-8">
          <Text className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            System
          </Text>

          <SettingItem
            title="Maintenance Mode"
            description="Put the system in maintenance mode"
            icon="construct-outline"
            isDarkMode={isDarkMode}
          >
            <Switch
              value={maintenanceMode}
              onValueChange={setMaintenanceMode}
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={maintenanceMode ? '#f5dd4b' : '#f4f3f4'}
            />
          </SettingItem>

          <TouchableOpacity onPress={handleClearCache}>
            <SettingItem
              title="Clear Cache"
              description="Clear all cached data and temporary files"
              icon="trash-outline"
              isDarkMode={isDarkMode}
            >
              <Ionicons name="chevron-forward" size={20} color={isDarkMode ? '#9ca3af' : '#6b7280'} />
            </SettingItem>
          </TouchableOpacity>
        </View>

        {/* Data Management */}
        <View className="mb-8">
          <Text className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Data Management
          </Text>

          <TouchableOpacity onPress={() => Alert.alert('Export Data', 'Data export feature coming soon!')}>
            <SettingItem
              title="Export Data"
              description="Export all data to CSV or JSON format"
              icon="download-outline"
              isDarkMode={isDarkMode}
            >
              <Ionicons name="chevron-forward" size={20} color={isDarkMode ? '#9ca3af' : '#6b7280'} />
            </SettingItem>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => Alert.alert('Import Data', 'Data import feature coming soon!')}>
            <SettingItem
              title="Import Data"
              description="Import data from CSV or JSON files"
              icon="cloud-upload-outline"
              isDarkMode={isDarkMode}
            >
              <Ionicons name="chevron-forward" size={20} color={isDarkMode ? '#9ca3af' : '#6b7280'} />
            </SettingItem>
          </TouchableOpacity>
        </View>

        {/* Advanced Settings */}
        <View className="mb-8">
          <Text className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Advanced
          </Text>

          <TouchableOpacity onPress={() => Alert.alert('API Settings', 'API configuration coming soon!')}>
            <SettingItem
              title="API Configuration"
              description="Configure API endpoints and authentication"
              icon="code-outline"
              isDarkMode={isDarkMode}
            >
              <Ionicons name="chevron-forward" size={20} color={isDarkMode ? '#9ca3af' : '#6b7280'} />
            </SettingItem>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => Alert.alert('Security Settings', 'Security configuration coming soon!')}>
            <SettingItem
              title="Security Settings"
              description="Configure security policies and permissions"
              icon="shield-checkmark-outline"
              isDarkMode={isDarkMode}
            >
              <Ionicons name="chevron-forward" size={20} color={isDarkMode ? '#9ca3af' : '#6b7280'} />
            </SettingItem>
          </TouchableOpacity>
        </View>

        {/* Danger Zone */}
        <View className="mb-8">
          <Text className={`text-lg font-semibold mb-4 text-red-500`}>
            Danger Zone
          </Text>

          <TouchableOpacity onPress={handleResetSettings}>
            <LinearGradient
              colors={['#fef2f2', '#fef2f2']}
              style={{
                margin: 8,
                padding: 16,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: '#fecaca',
              }}
            >
              <View className="flex-row items-center">
                <View className="w-10 h-10 rounded-full items-center justify-center mr-4 bg-red-100">
                  <Ionicons name="refresh-outline" size={20} color="#dc2626" />
                </View>
                <View className="flex-1">
                  <Text className="font-semibold text-base mb-1 text-red-700">
                    Reset Settings
                  </Text>
                  <Text className="text-sm text-red-600">
                    Reset all settings to their default values
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#dc2626" />
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* App Info */}
        <LinearGradient
          colors={isDarkMode ? ['#374151', '#1f2937'] : ['#ffffff', '#f9fafb']}
          style={{
            margin: 8,
            padding: 20,
            borderRadius: 12,
            alignItems: 'center',
          }}
        >
          <Ionicons name="information-circle-outline" size={48} color={isDarkMode ? '#9ca3af' : '#6b7280'} />
          <Text className={`text-lg font-semibold mt-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            ED Tech Admin v1.0.0
          </Text>
          <Text className={`text-sm mt-2 text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Built with React Native & Expo
          </Text>
          <Text className={`text-xs mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
            © 2024 ED Tech Platform
          </Text>
        </LinearGradient>
      </View>
    </ScrollView>
  );
}
