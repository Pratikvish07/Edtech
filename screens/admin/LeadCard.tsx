import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Lead } from './AdminTypes';

interface LeadCardProps {
  lead: Lead;
  isSelected: boolean;
  isDarkMode: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export const LeadCard: React.FC<LeadCardProps> = ({ lead, isSelected, isDarkMode, onSelect, onEdit, onDelete }) => {
  const getStatusColor = (status: Lead['status']) => {
    switch (status) {
      case 'new': return '#3B82F6';
      case 'contacted': return '#F59E0B';
      case 'qualified': return '#10B981';
      case 'converted': return '#8B5CF6';
      case 'lost': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const getSourceIcon = (source: Lead['source']) => {
    switch (source) {
      case 'website': return 'globe-outline';
      case 'social': return 'logo-instagram';
      case 'referral': return 'people-outline';
      case 'advertisement': return 'megaphone-outline';
      case 'other': return 'help-circle-outline';
      default: return 'help-circle-outline';
    }
  };

  return (
    <TouchableOpacity
      onPress={onSelect}
      className={`mx-2 my-2 rounded-2xl shadow-lg ${isSelected ? 'border-2 border-blue-500' : ''}`}
      style={{
        backgroundColor: isDarkMode ? '#374151' : '#FFFFFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      }}
    >
      <LinearGradient
        colors={isSelected ? ['#3B82F6', '#1D4ED8'] : isDarkMode ? ['#4B5563', '#374151'] : ['#F9FAFB', '#F3F4F6']}
        className="p-4 rounded-2xl"
      >
        <View className="flex-row justify-between items-start mb-3">
          <View className="flex-1">
            <Text className={`text-lg font-bold ${isSelected ? 'text-white' : isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {lead.name}
            </Text>
            <Text className={`text-sm ${isSelected ? 'text-blue-100' : isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {lead.email}
            </Text>
            {lead.phone && (
              <Text className={`text-sm ${isSelected ? 'text-blue-100' : isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {lead.phone}
              </Text>
            )}
          </View>
          <View className="flex-row items-center">
            <Ionicons name={getSourceIcon(lead.source) as any} size={20} color={isSelected ? 'white' : isDarkMode ? '#9CA3AF' : '#6B7280'} />
          </View>
        </View>

        <View className="flex-row justify-between items-center mb-3">
          <View className="flex-row items-center">
            <View
              className="px-2 py-1 rounded-full"
              style={{ backgroundColor: getStatusColor(lead.status) }}
            >
              <Text className="text-white text-xs font-semibold capitalize">
                {lead.status}
              </Text>
            </View>
          </View>
          <Text className={`text-xs ${isSelected ? 'text-blue-100' : isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {new Date(lead.createdAt).toLocaleDateString()}
          </Text>
        </View>

        {lead.notes && (
          <Text className={`text-sm mb-3 ${isSelected ? 'text-blue-100' : isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            {lead.notes}
          </Text>
        )}

        <View className="flex-row justify-end space-x-2">
          <TouchableOpacity
            onPress={onEdit}
            className="p-2 rounded-full bg-blue-500"
          >
            <Ionicons name="pencil-outline" size={16} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onDelete}
            className="p-2 rounded-full bg-red-500"
          >
            <Ionicons name="trash-outline" size={16} color="white" />
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};
