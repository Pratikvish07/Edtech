import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Dimensions,
  findNodeHandle,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";
import Svg, { 
  Path, Defs, ClipPath, Circle, G, Rect, Ellipse, Use 
} from "react-native-svg";
import { StyleSheet } from "react-native";

const { width, height } = Dimensions.get("window");

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState({ email: false, password: false });
  const [caretPosition, setCaretPosition] = useState({ x: 0, y: 0 });
  
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const svgContainerRef = useRef(null);

  // Animation states based on email input
  const getMouthState = () => {
    if (email.length === 0) return "small";
    if (email.includes("@")) return "large";
    return "medium";
  };

  const getEyeScale = () => {
    if (email.length === 0) return 1;
    if (email.includes("@")) return 0.65;
    return 0.85;
  };

  const mouthState = getMouthState();
  const eyeScale = getEyeScale();

  // Calculate approximate caret position for eye tracking
  const calculateCaretPosition = () => {
    // Simplified calculation - in a real app you'd need more complex measurement
    const emailLength = email.length;
    const approximateCaretX = (emailLength / 30) * 100; // Normalize based on typical email length
    
    // Map to SVG coordinate system
    const eyeCenterX = 100; // Center of SVG
    const maxEyeMovement = 20;
    
    let eyeX = (approximateCaretX - 50) * (maxEyeMovement / 50);
    eyeX = Math.max(-maxEyeMovement, Math.min(maxEyeMovement, eyeX));
    
    return { eyeX, eyeY: 0 };
  };

  const { eyeX, eyeY } = calculateCaretPosition();

  return (
    <View style={styles.loginContainer}>
      {/* Animated Gradient Background */}
      <LinearGradient
        colors={["#0a0f24", "#1a1f34", "#2a2f44"]}
        style={styles.loginGradientBackground}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.loginKeyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.loginScrollView}
          showsVerticalScrollIndicator={false}
        >
          {/* Interactive SVG Character */}
          <View style={styles.characterContainer}>
            <Svg width={200} height={200} viewBox="0 0 200 200">
              {/* Body */}
              <G>
                <Path fill="#a9ddf3" d="M100,100 C100,100 100,100 100,100"/>
                <G>
                  <Path fill="#FFFFFF" d="M193.3,135.9c-5.8-8.4-15.5-13.9-26.5-13.9H151V72c0-27.6-22.4-50-50-50S51,44.4,51,72v50H32.1 c-10.6,0-20,5.1-25.8,13l0,78h187L193.3,135.9z"/>
                  <Path fill="none" stroke="#3A5E77" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" d="M193.3,135.9 c-5.8-8.4-15.5-13.9-26.5-13.9H151V72c0-27.6-22.4-50-50-50S51,44.4,51,72v50H32.1c-10.6,0-20,5.1-25.8,13"/>
                  <Path fill="#DDF1FA" d="M100,156.4c-22.9,0-43,11.1-54.1,27.7c15.6,10,34.2,15.9,54.1,15.9s38.5-5.8,54.1-15.9 C143,167.5,122.9,156.4,100,156.4z"/>
                </G>
                
                {/* Face */}
                <Path fill="#DDF1FA" d="M134.5,46v35.5c0,21.815-15.446,39.5-34.5,39.5s-34.5-17.685-34.5-39.5V46"/>
                
                {/* Eyes with animation */}
                <G>
                  <G style={{ transform: [{ translateX: eyeX }, { translateY: eyeY }, { scale: eyeScale }] }}>
                    <Circle cx="85.5" cy="78.5" r="3.5" fill="#3a5e77"/>
                    <Circle cx="84" cy="76" r="1" fill="#fff"/>
                  </G>
                  <G style={{ transform: [{ translateX: eyeX }, { translateY: eyeY }, { scale: eyeScale }] }}>
                    <Circle cx="114.5" cy="78.5" r="3.5" fill="#3a5e77"/>
                    <Circle cx="113" cy="76" r="1" fill="#fff"/>
                  </G>
                </G>

                {/* Animated Mouth */}
                <G>
                  {mouthState === "small" && (
                    <Path fill="#617E92" d="M100.2,101c-0.4,0-1.4,0-1.8,0c-2.7-0.3-5.3-1.1-8-2.5c-0.7-0.3-0.9-1.2-0.6-1.8 c0.2-0.5,0.7-0.7,1.2-0.7c0.2,0,0.5,0.1,0.6,0.2c3,1.5,5.8,2.3,8.6,2.3s5.7-0.7,8.6-2.3c0.2-0.1,0.4-0.2,0.6-0.2 c0.5,0,1,0.3,1.2,0.7c0.4,0.7,0.1,1.5-0.6,1.9c-2.6,1.4-5.3,2.2-7.9,2.5C101.7,101,100.5,101,100.2,101z"/>
                  )}
                  {mouthState === "medium" && (
                    <Path fill="#617E92" d="M95,104.2c-4.5,0-8.2-3.7-8.2-8.2v-2c0-1.2,1-2.2,2.2-2.2h22c1.2,0,2.2,1,2.2,2.2v2 c0,4.5-3.7,8.2-8.2,8.2H95z"/>
                  )}
                  {mouthState === "large" && (
                    <G>
                      <Path fill="#617E92" d="M100 110.2c-9 0-16.2-7.3-16.2-16.2 0-2.3 1.9-4.2 4.2-4.2h24c2.3 0 4.2 1.9 4.2 4.2 0 9-7.2 16.2-16.2 16.2z"/>
                      <Circle cx="100" cy="107" r="8" fill="#cc4a6c"/>
                      <Ellipse cx="100" cy="100.5" rx="3" ry="1.5" opacity="0.1" fill="#fff"/>
                    </G>
                  )}
                </G>

                {/* Nose */}
                <Path fill="#3a5e77" d="M97.7 79.9h4.7c1.9 0 3 2.2 1.9 3.7l-2.3 3.3c-.9 1.3-2.9 1.3-3.8 0l-2.3-3.3c-1.3-1.6-.2-3.7 1.8-3.7z"/>
                
                {/* Arms - Cover eyes when password is focused */}
                <G opacity={isFocused.password ? 1 : 0}>
                  <Path fill="#ddf1fa" stroke="#3a5e77" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" d="M121.3 97.4L111 58.7l38.8-10.4 20 36.1z"/>
                  <Path fill="#ddf1fa" stroke="#3a5e77" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" d="M265.4 97.3l10.4-38.6-38.9-10.5-20 36.1z"/>
                </G>
              </G>
            </Svg>
          </View>

          {/* Glassmorphic Card */}
          <View style={styles.loginGlassCard}>
            <Text style={styles.loginTitle}>
              Welcome Back 👋
            </Text>

            {/* Email Input */}
            <View style={styles.loginInputContainer}>
              <View style={[
                styles.loginInputWrapper,
                isFocused.email && styles.loginInputFocused
              ]}>
                <Ionicons
                  name="mail-outline"
                  size={22}
                  color="white"
                  style={styles.loginInputIcon}
                />
                <TextInput
                  ref={emailRef}
                  style={styles.loginInput}
                  placeholder="Email"
                  placeholderTextColor="rgba(255,255,255,0.7)"
                  value={email}
                  onChangeText={setEmail}
                  onFocus={() => setIsFocused({ ...isFocused, email: true })}
                  onBlur={() => setIsFocused({ ...isFocused, email: false })}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </View>
            </View>

            {/* Password Input */}
            <View style={styles.loginPasswordContainer}>
              <View style={[
                styles.loginInputWrapper,
                isFocused.password && styles.loginInputFocused
              ]}>
                <Ionicons
                  name="lock-closed-outline"
                  size={22}
                  color="white"
                  style={styles.loginInputIcon}
                />
                <TextInput
                  ref={passwordRef}
                  style={styles.loginInput}
                  placeholder="Password"
                  placeholderTextColor="rgba(255,255,255,0.7)"
                  value={password}
                  secureTextEntry={!showPassword}
                  onChangeText={setPassword}
                  onFocus={() => setIsFocused({ ...isFocused, password: true })}
                  onBlur={() => setIsFocused({ ...isFocused, password: false })}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Ionicons
                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                    size={22}
                    color="white"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Sign In Button */}
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => {
                if (!email.trim() || !password.trim()) {
                  alert("Please fill in all fields");
                  return;
                }
                if (email === "admin@gmail.com" && password === "Admin") {
                  navigation.navigate("Admin");
                } else {
                  navigation.navigate("Main");
                }
              }}
            >
              <LinearGradient
                colors={["#00c6ff", "#0072ff"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.loginButton}
              >
                <Text style={styles.loginButtonText}>
                  Sign In
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  loginContainer: {
    flex: 1,
    backgroundColor: "#0a0f24",
  },
  loginGradientBackground: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  loginKeyboardView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loginScrollView: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    paddingVertical: 20,
  },
  characterContainer: {
    marginBottom: 30,
    alignItems: "center",
  },
  loginGlassCard: {
    width: "85%",
    borderRadius: 30,
    padding: 25,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    shadowColor: "#fff",
    shadowOpacity: 0.4,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 0 },
  },
  loginTitle: {
    fontSize: 34,
    fontWeight: "800",
    color: "#fff",
    textAlign: "center",
    marginBottom: 30,
  },
  loginInputContainer: {
    marginBottom: 20,
  },
  loginPasswordContainer: {
    marginBottom: 25,
  },
  loginInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 15,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  loginInputFocused: {
    borderColor: "rgba(255,255,255,0.3)",
    backgroundColor: "rgba(255,255,255,0.15)",
  },
  loginInputIcon: {
    marginRight: 12,
  },
  loginInput: {
    flex: 1,
    color: "white",
    fontSize: 16,
    paddingVertical: 0,
  },
  loginButton: {
    paddingVertical: 16,
    borderRadius: 20,
    shadowColor: "#00c6ff",
    shadowOpacity: 0.6,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
  },
  loginButtonText: {
    textAlign: "center",
    color: "white",
    fontWeight: "700",
    fontSize: 18,
  },
});