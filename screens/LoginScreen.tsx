import { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, Animated, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Circle } from 'react-native-svg';

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigation.navigate('Courses');
    }, 1000);
  };

  const screenWidth = Dimensions.get('window').width;
  const animValue = new Animated.Value(0);

  // Wrap Circle in Animated
  const AnimatedCircle = Animated.createAnimatedComponent(Circle);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animValue, { toValue: screenWidth - 50, duration: 3000, useNativeDriver: false }),
        Animated.timing(animValue, { toValue: 0, duration: 3000, useNativeDriver: false }),
      ])
    ).start();
  }, []);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-white justify-center items-center"
    >
      {/* Animated SVG */}
      <View className="absolute top-20">
        <Svg height="60" width={screenWidth}>
          <AnimatedCircle
            cx={animValue}
            cy={30}
            r="15"
            fill="#3b82f6"
          />
        </Svg>
      </View>

      {/* Login Box */}
      <View className="w-11/12 bg-white rounded-3xl shadow-lg p-6">
        <Text className="text-2xl font-bold text-center text-gray-900 mb-4">Welcome Back</Text>

        {/* Email */}
        <View className="mb-4">
          <View className="flex-row items-center bg-gray-50 rounded-xl border border-gray-200 px-3">
            <Ionicons name="mail-outline" size={18} color="#6b7280" />
            <TextInput
              className="flex-1 py-3 px-2 text-gray-900 text-sm"
              placeholder="Email"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>
        </View>

        {/* Password */}
        <View className="mb-4">
          <View className="flex-row items-center bg-gray-50 rounded-xl border border-gray-200 px-3">
            <Ionicons name="lock-closed-outline" size={18} color="#6b7280" />
            <TextInput
              className="flex-1 py-3 px-2 text-gray-900 text-sm"
              placeholder="Password"
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={18} color="#6b7280" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Login Button */}
        <TouchableOpacity
          onPress={handleLogin}
          disabled={isLoading}
          className={`bg-blue-500 rounded-xl py-3 mb-2 ${isLoading ? 'opacity-70' : ''}`}
        >
          <Text className="text-white text-center font-semibold text-sm">{isLoading ? 'Signing In...' : 'Sign In'}</Text>
        </TouchableOpacity>

        {/* Guest Login */}
        <TouchableOpacity
          onPress={() => navigation.navigate('Courses')}
          className="border border-blue-500 rounded-xl py-3"
        >
          <Text className="text-blue-500 text-center font-semibold text-sm">Continue as Guest</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
