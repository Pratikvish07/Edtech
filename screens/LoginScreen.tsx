// GlassBlurLoginScreenBlackText.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSignIn, setIsSignIn] = useState(true);
  const [rememberMe, setRememberMe] = useState(false);

  return (
    <LinearGradient
      colors={["#a78bfa", "#6366f1", "#ec4899"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1 }}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
          }}
          showsVerticalScrollIndicator={false}
        >
          {/* Glass Card */}
          <BlurView
            intensity={100}
            tint="light"
            className="rounded-3xl w-full max-w-md p-6 shadow-2xl"
            style={{ backgroundColor: "rgba(255,255,255,0.2)" }}
          >
            {/* Sign In / Sign Up Toggle */}
            <View className="flex-row justify-center mb-6">
              <TouchableOpacity
                onPress={() => setIsSignIn(true)}
                className="px-6 py-2"
              >
                <Text
                  className={`text-lg font-bold ${
                    isSignIn ? "text-black" : "text-gray-700"
                  }`}
                >
                  Sign In
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setIsSignIn(false)}
                className="px-6 py-2"
              >
                <Text
                  className={`text-lg font-bold ${
                    !isSignIn ? "text-black" : "text-gray-700"
                  }`}
                >
                  Sign Up
                </Text>
              </TouchableOpacity>
            </View>

            {/* Welcome / Create Account */}
            <Text
  className="text-4xl font-bold text-center mb-12"
  style={{
    textShadowColor: "rgba(0,0,0,0.2)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  }}
>
  {isSignIn ? "Welcome Back" : "Create Account"}
</Text>

            {/* Email Input */}
            <View className="flex-row items-center border-2 border-gray-400 rounded-xl mb-4 px-4 py-3 bg-white/50">
              <Ionicons name="mail-outline" size={24} color="black" />
              <TextInput
                placeholder="Email"
                placeholderTextColor="rgba(0,0,0,0.6)"
                value={email}
                onChangeText={setEmail}
                className="flex-1 ml-3 h-10 text-black"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            {/* Password Input */}
            <View className="flex-row items-center justify-between border-2 border-gray-400 rounded-xl mb-4 px-4 py-3 bg-white/50">
              <View className="flex-row items-center">
                <Ionicons name="lock-closed-outline" size={24} color="black" />
                <TextInput
                  placeholder="Password"
                  placeholderTextColor="rgba(0,0,0,0.6)"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  className="flex-1 ml-3 h-10 text-black"
                />
              </View>
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={24}
                  color="black"
                />
              </TouchableOpacity>
            </View>

            {/* Remember Me */}
            <TouchableOpacity
  className="flex-row items-center mb-6"
  onPress={() => setRememberMe(!rememberMe)}
>
  <View
    className="w-5 h-5 border-2 border-black rounded-sm mr-2 flex items-center justify-center"
    style={{ backgroundColor: rememberMe ? "black" : "transparent" }}
  >
    {rememberMe && (
      <Ionicons name="checkmark" size={16} color="white" />
    )}
  </View>
  <Text className="text-black">Remember Me</Text>
</TouchableOpacity>


            {/* Login / Signup Button */}
            <TouchableOpacity
              activeOpacity={0.8}
              className="mb-4"
              onPress={() => {
                if (!email.trim() || !password.trim()) {
                  alert("Please fill in all fields");
                  return;
                }
                if (email === "admin@gmail.com" && password === "admin") {
                  navigation.navigate("Admin");
                } else {
                  navigation.navigate("Courses");
                }
              }}
            >
              <LinearGradient
                colors={["#ec4899", "#8b5cf6"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                className="py-3 rounded-xl"
              >
                <Text className="text-white text-center font-bold text-lg">
                  {isSignIn ? "Sign In" : "Sign Up"}
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* Social Login Buttons */}
            <View className="flex-row justify-between mt-4">
              <TouchableOpacity className="bg-red-500 px-6 py-2 rounded-lg">
                <Text className="text-white font-bold">Google</Text>
              </TouchableOpacity>
              <TouchableOpacity className="bg-blue-700 px-6 py-2 rounded-lg">
                <Text className="text-black font-bold">Facebook</Text>
              </TouchableOpacity>
            </View>

            {/* Forgot Password (only Sign In) */}
            {isSignIn && (
              <TouchableOpacity className="mt-6">
                <Text className="text-black text-center underline">
                  Forgot Password?
                </Text>
              </TouchableOpacity>
            )}
          </BlurView>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}
