import React, { useEffect } from 'react';
import { View, Text, Animated } from 'react-native';
import { ToastState } from './AdminTypes';

// ----- Toast -----
export const Toast = ({ message, type, onHide }: ToastState & { onHide: () => void }) => {
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
      Animated.delay(2000),
      Animated.timing(fadeAnim, { toValue: 0, duration: 300, useNativeDriver: true }),
    ]).start(() => onHide());
  }, [message]);

  return (
    <Animated.View
      style={{ opacity: fadeAnim, transform: [{ translateY: fadeAnim.interpolate({ inputRange: [0, 1], outputRange: [50, 0] }) }] }}
      className={`absolute bottom-8 left-1/2 -ml-24 w-48 p-3 rounded-lg shadow-lg items-center z-50 ${type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}
    >
      <Text className="text-white font-semibold text-center">{message}</Text>
    </Animated.View>
  );
};
