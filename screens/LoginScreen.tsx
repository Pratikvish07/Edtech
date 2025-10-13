import { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Dimensions,
  ImageBackground,
  ScrollView,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Svg, { Circle, Defs, RadialGradient, Stop } from "react-native-svg";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { cssInterop } from "nativewind";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const StyledLinear = cssInterop(LinearGradient, { className: 'className' });

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const screenWidth = Dimensions.get("window").width;
  const animValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animValue, {
          toValue: screenWidth - 50,
          duration: 5000,
          useNativeDriver: false,
        }),
        Animated.timing(animValue, {
          toValue: 0,
          duration: 5000,
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, []);

  const handleLogin = () => {
    if (!email.trim() || !password.trim()) {
      alert("Please fill in all fields");
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      if (email === "admin@gmail.com" && password === "admin") {
        navigation.navigate("Admin");
      } else {
        navigation.navigate("Courses");
      }
    }, 1000);
  };

  return (
    <ImageBackground
      source={{
        uri: "https://images.unsplash.com/photo-1522204508822-7f3b1b57ef1c?auto=format&fit=crop&w=1400&q=80",
      }}
      className="flex-1"
    >
      {/* Overlay */}
      <StyledLinear
        colors={["rgba(0,0,0,0.85)", "rgba(0,0,0,0.3)", "rgba(0,0,0,0.85)"]}
        className="absolute inset-0"
      />

      {/* Animated particles */}
      <Svg height="220" width={screenWidth} className="absolute top-12 opacity-50">
        <Defs>
          <RadialGradient id="grad1" cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor="#FFD700" stopOpacity="0.8" />
            <Stop offset="100%" stopColor="#FFA500" stopOpacity="0" />
          </RadialGradient>
        </Defs>
        <AnimatedCircle cx={animValue} cy={40} r="22" fill="url(#grad1)" />
        <AnimatedCircle cx={Animated.add(animValue, 140)} cy={75} r="16" fill="url(#grad1)" />
        <AnimatedCircle cx={Animated.add(animValue, 260)} cy={30} r="12" fill="url(#grad1)" />
      </Svg>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1 justify-center items-center px-4"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: "center", alignItems: "center" }}
          showsVerticalScrollIndicator={false}
        >
          {/* Glassmorphic Card */}
          <View style={styles.cardContainer}>
            <StyledLinear
              colors={["#FF9A8B", "#FF6A88", "#FF99AC"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.gradientBorder}
            >
              <BlurView intensity={130} tint="dark" style={styles.blurCard}>
                <View style={{ gap: 20 }}>
                  <Text className="text-4xl font-extrabold text-white text-center mb-2">
                    Welcome Back
                  </Text>

                  {/* Email */}
                  <View className="relative">
                    <Ionicons
                      name="mail-outline"
                      size={24}
                      color="#fff"
                      className="absolute top-5 left-4"
                    />
                    <TextInput
                      placeholder="Email"
                      placeholderTextColor="rgba(255,255,255,0.7)"
                      value={email}
                      onChangeText={setEmail}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      style={[styles.input, { paddingVertical: 14, paddingLeft: 48 }]}
                    />
                  </View>

                  {/* Password */}
                  <View className="relative">
                    <Ionicons
                      name="lock-closed-outline"
                      size={24}
                      color="#fff"
                      className="absolute top-5 left-4"
                    />
                    <TextInput
                      placeholder="Password"
                      placeholderTextColor="rgba(255,255,255,0.7)"
                      secureTextEntry={!showPassword}
                      value={password}
                      onChangeText={setPassword}
                      style={[styles.input, { paddingVertical: 14, paddingLeft: 48, paddingRight: 48 }]}
                    />
                    <TouchableOpacity
                      className="absolute right-4 top-5"
                      onPress={() => setShowPassword(!showPassword)}
                    >
                      <Ionicons
                        name={showPassword ? "eye-off-outline" : "eye-outline"}
                        size={24}
                        color="#fff"
                      />
                    </TouchableOpacity>
                  </View>

                  {/* Login Button */}
                  <TouchableOpacity
                    onPress={handleLogin}
                    disabled={isLoading}
                    style={styles.buttonWrapper}
                  >
                    <StyledLinear
                      colors={["#6a11cb", "#2575fc"]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.buttonGradient}
                    >
                      <Text className="text-center text-white font-bold text-lg">
                        {isLoading ? "Signing In..." : "Login"}
                      </Text>
                    </StyledLinear>
                  </TouchableOpacity>

                  {/* Forgot Password */}
                  <TouchableOpacity>
                    <Text className="text-center text-yellow-300 font-medium underline">
                      Forgot Password?
                    </Text>
                  </TouchableOpacity>

                  {/* Register */}
                  <Text className="text-center text-white/90 mt-2">
                    Don’t have an account?{" "}
                    <Text className="text-yellow-300 underline font-semibold">Register</Text>
                  </Text>
                </View>
              </BlurView>
            </StyledLinear>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    width: "100%",
    maxWidth: 600,
    borderRadius: 35,
    padding: 3,
    marginVertical: 25,
    shadowColor: "#FF9A8B",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.5,
    shadowRadius: 25,
    elevation: 18,
  },
  gradientBorder: {
    borderRadius: 35,
  },
  blurCard: {
    borderRadius: 35,
    overflow: "hidden",
    paddingVertical: 35,
    paddingHorizontal: 25,
    backgroundColor: "rgba(255,255,255,0.05)",
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.4)",
    color: "#fff",
    fontSize: 16,
    borderRadius: 12,
  },
  buttonWrapper: {
    borderRadius: 999,
    overflow: "hidden",
    shadowColor: "#2575fc",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45,
    shadowRadius: 12,
    elevation: 10,
    marginTop: 10,
  },
  buttonGradient: {
    paddingVertical: 18,
    borderRadius: 999,
  },
});
