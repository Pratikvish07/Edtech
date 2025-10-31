// screens/LoginScreen.tsx
import React, { useRef, useState, useEffect, memo, forwardRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Dimensions,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import * as Haptics from "expo-haptics";
import { Ionicons } from "@expo/vector-icons";
import Svg, { G, Path, Circle } from "react-native-svg";
import { useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get("window");

// Captcha generator
const CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const generateCaptcha = () =>
  Array.from({ length: 5 }, () => CHARS[Math.floor(Math.random() * CHARS.length)]).join("");

// Animated SVG elements
const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedG = Animated.createAnimatedComponent(G);

// TypeScript Interfaces
interface AnimatedInputProps {
  icon?: string;
  placeholder: string;
  value: string;
  secure?: boolean;
  onChange: (text: string) => void;
  keyboardType?: any;
  onFocus?: () => void;
  onBlur?: () => void;
  showToggle?: boolean;
  toggle?: () => void;
}

interface AnimatedButtonProps {
  title: string;
  onPress: () => void;
  colors?: readonly [string, string, ...string[]];
  disabled?: boolean;
}

interface SocialButtonProps {
  icon: string;
  color: string;
  onPress: () => void;
  brand?: string;
}

interface TextButtonProps {
  title: string;
  onPress: () => void;
  color?: string;
}

interface AnimatedFaceProps {
  email: string;
  focusedPassword: boolean;
  errorShake: Animated.Value;
  mouthAnimValue: Animated.Value;
}

/* ------------------ Animated Input ------------------ */
const AnimatedInput = memo(forwardRef<TextInput, AnimatedInputProps>((props, ref) => {
  const { icon, placeholder, value, secure, onChange, keyboardType, onFocus, onBlur, showToggle, toggle } = props;
  const scale = useRef(new Animated.Value(1)).current;

  const handleFocus = () => {
    Animated.spring(scale, { toValue: 1.03, useNativeDriver: true }).start();
    onFocus?.();
  };

  const handleBlur = () => {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start();
    onBlur?.();
  };

  return (
    <Animated.View style={{ transform: [{ scale }], width: "100%", marginBottom: 6 }}>
      <View style={styles.inputContainer}>
        {icon && <Ionicons name={icon as any} size={18} color="#fff" style={{ marginRight: 6 }} />}
        <TextInput
          ref={ref}
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="rgba(255,255,255,0.6)"
          value={value}
          secureTextEntry={secure}
          onChangeText={onChange}
          keyboardType={keyboardType}
          onFocus={handleFocus}
          onBlur={handleBlur}
          autoCapitalize="none"
        />
        {showToggle && (
          <TouchableOpacity onPress={toggle}>
            <Ionicons
              name={secure ? "eye-outline" : "eye-off-outline"}
              size={18}
              color="rgba(255,255,255,0.7)"
            />
          </TouchableOpacity>
        )}
      </View>
    </Animated.View>
  );
}));

/* ------------------ Enhanced Animated Button ------------------ */
const AnimatedButton: React.FC<AnimatedButtonProps> = memo(({
  title,
  onPress,
  colors = ["#3dd2ff", "#0072ff"] as const,
  disabled = false
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const rippleAnim = useRef(new Animated.Value(0)).current;
  const rippleOpacity = useRef(new Animated.Value(1)).current;
  const shimmerAnim = useRef(new Animated.Value(-1)).current;

  useEffect(() => {
    if (!disabled) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(shimmerAnim, { toValue: 1, duration: 2000, useNativeDriver: true }),
          Animated.timing(shimmerAnim, { toValue: -1, duration: 2000, useNativeDriver: true }),
        ])
      ).start();
    }
  }, [disabled]);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const handlePress = () => {
    // Ripple effect
    rippleAnim.setValue(0);
    rippleOpacity.setValue(1);

    Animated.parallel([
      Animated.timing(rippleAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(rippleOpacity, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  const rippleScale = rippleAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.8, 3],
  });

  const shimmerTranslateX = shimmerAnim.interpolate({
    inputRange: [-1, 1],
    outputRange: [-100, 100],
  });

  return (
    <TouchableOpacity
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      activeOpacity={0.9}
      disabled={disabled}
      style={styles.buttonTouchable}
    >
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <LinearGradient
          colors={disabled ? ["#666", "#888"] as const : colors}
          style={[
            styles.enhancedButton,
            disabled && styles.buttonDisabled
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          {/* Ripple Effect */}
          <Animated.View
            style={[
              styles.ripple,
              {
                transform: [{ scale: rippleScale }],
                opacity: rippleOpacity,
              },
            ]}
          />

          <Text style={[
            styles.enhancedButtonText,
            disabled && styles.buttonDisabledText
          ]}>
            {title}
          </Text>

          {/* Shimmer effect */}
          {!disabled && (
            <Animated.View
              style={[
                styles.shimmer,
                { transform: [{ translateX: shimmerTranslateX }] },
              ]}
            >
              <LinearGradient
                colors={['transparent', 'rgba(255,255,255,0.4)', 'transparent'] as const}
                style={styles.shimmerGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              />
            </Animated.View>
          )}
        </LinearGradient>
      </Animated.View>
    </TouchableOpacity>
  );
});

/* ------------------ Social Login Buttons ------------------ */
const SocialButton: React.FC<SocialButtonProps> = memo(({ 
  icon, 
  color, 
  onPress,
  brand 
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  const handlePressIn = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 0.85,
        useNativeDriver: true,
      }),
      Animated.timing(glowAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePressOut = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
      }),
      Animated.timing(glowAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.3],
  });

  return (
    <TouchableOpacity
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress();
      }}
      activeOpacity={0.8}
    >
      <Animated.View style={[styles.socialButton, { transform: [{ scale: scaleAnim }] }]}>
        <LinearGradient
          colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']}
          style={styles.socialButtonGradient}
        >
          <Animated.View style={[styles.socialGlow, { backgroundColor: color, opacity: glowOpacity }]} />
          <Ionicons name={icon as any} size={24} color={color} />
        </LinearGradient>
      </Animated.View>
    </TouchableOpacity>
  );
});

/* ------------------ Text Button ------------------ */
const TextButton: React.FC<TextButtonProps> = memo(({ 
  title, 
  onPress,
  color = "#78d0ff" 
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const underlineWidth = useRef(new Animated.Value(0)).current;

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    Animated.timing(underlineWidth, {
      toValue: 1,
      duration: 300,
      useNativeDriver: false,
    }).start();

    setTimeout(() => {
      underlineWidth.setValue(0);
    }, 600);

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  const actualWidth = underlineWidth.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <TouchableOpacity onPress={handlePress} style={styles.textButtonTouchable}>
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <View style={styles.textButtonContainer}>
          <Text style={[styles.textButtonText, { color }]}>{title}</Text>
          <Animated.View 
            style={[
              styles.textButtonUnderline, 
              { width: actualWidth, backgroundColor: color }
            ]} 
          />
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
});

/* ------------------ Animated Face ------------------ */
const AnimatedFace: React.FC<AnimatedFaceProps> = memo(({ email, focusedPassword, errorShake, mouthAnimValue }) => {
  const float = useRef(new Animated.Value(0)).current;
  const leftEyeX = useRef(new Animated.Value(70)).current;
  const rightEyeX = useRef(new Animated.Value(130)).current;
  const handOpacity = useRef(new Animated.Value(0)).current;
  const blinkAnim = useRef(new Animated.Value(1)).current;
  const expressionAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(float, { toValue: -4, duration: 2500, useNativeDriver: true }),
        Animated.timing(float, { toValue: 4, duration: 2500, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  useEffect(() => {
    const move = email.length > 0 ? (email.includes("@") ? 8 : 4) : 0;
    Animated.spring(leftEyeX, { toValue: 70 - move, useNativeDriver: true }).start();
    Animated.spring(rightEyeX, { toValue: 130 + move, useNativeDriver: true }).start();
  }, [email]);

  useEffect(() => {
    Animated.timing(handOpacity, {
      toValue: focusedPassword ? 1 : 0,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, [focusedPassword]);

  // Blinking animation
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      Animated.sequence([
        Animated.timing(blinkAnim, { toValue: 0.1, duration: 150, useNativeDriver: true }),
        Animated.timing(blinkAnim, { toValue: 1, duration: 150, useNativeDriver: true }),
      ]).start();
    }, Math.random() * 3000 + 2000); // Random blink every 2-5 seconds

    return () => clearInterval(blinkInterval);
  }, []);

  // Expression changes based on input
  useEffect(() => {
    const hasValidEmail = email.includes("@") && email.length > 5;
    const hasPassword = focusedPassword;
    const targetValue = hasValidEmail ? 1 : hasPassword ? 0.5 : 0;
    Animated.spring(expressionAnim, { toValue: targetValue, useNativeDriver: true }).start();
  }, [email, focusedPassword]);

  const mouthPath = mouthAnimValue.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [
      "M70 90 Q100 90 130 90",
      "M70 95 Q100 105 130 95",
      "M70 100 Q100 120 130 100",
    ],
  });

  const expressionMouthPath = expressionAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [
      "M70 90 Q100 90 130 90", // Neutral
      "M70 95 Q100 105 130 95", // Curious
      "M70 100 Q100 110 130 100", // Happy
    ],
  });

  const eyeScaleY = blinkAnim.interpolate({
    inputRange: [0.1, 1],
    outputRange: [0.1, 1],
  });

  return (
    <Animated.View
      style={{
        transform: [{ translateY: float }, { translateX: errorShake }],
        alignItems: "center",
        marginBottom: 10,
      }}
    >
      <Svg height={130} width={160} viewBox="0 0 200 200">
        <Circle cx={100} cy={90} r={60} fill="#ffffff10" />
        <G>
          <AnimatedCircle
            cx={leftEyeX}
            cy={75}
            r={7.5}
            fill="#fff"
            transform={`scale(1, ${eyeScaleY})`}
          />
          <AnimatedCircle
            cx={rightEyeX}
            cy={75}
            r={7.5}
            fill="#fff"
            transform={`scale(1, ${eyeScaleY})`}
          />
        </G>
        <AnimatedPath d={expressionMouthPath as any} stroke="#fff" strokeWidth={3.2} fill="none" />
        <AnimatedG opacity={handOpacity}>
          <Path d="M44 70 Q60 30 80 64" stroke="#fff" strokeWidth={4} fill="none" />
          <Path d="M156 70 Q140 30 120 64" stroke="#fff" strokeWidth={4} fill="none" />
        </AnimatedG>
      </Svg>
    </Animated.View>
  );
});

/* ------------------ Main Login Screen ------------------ */
const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [captcha, setCaptcha] = useState(generateCaptcha());
  const [captchaInput, setCaptchaInput] = useState("");
  const fade = useRef(new Animated.Value(0)).current;
  const mouthAnimValue = useRef(new Animated.Value(0)).current;
  const errorShake = useRef(new Animated.Value(0)).current;

  // Ref for password input focus state
  const [focusedPassword, setFocusedPassword] = useState(false);

  useEffect(() => {
    Animated.timing(fade, { toValue: 1, duration: 800, useNativeDriver: true }).start();
  }, []);

  const triggerShake = () => {
    Animated.sequence([
      Animated.timing(errorShake, { toValue: -8, duration: 50, useNativeDriver: true }),
      Animated.timing(errorShake, { toValue: 8, duration: 50, useNativeDriver: true }),
      Animated.timing(errorShake, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]).start();
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
  };

  const navigation = useNavigation();

  const handleSubmit = () => {
    if (!email || !password || captchaInput.toUpperCase() !== captcha) {
      triggerShake();
      return;
    }
    if (email.includes("admin")) {
      navigation.navigate("Admin" as never);
    } else if (email.includes("pratik")) {
      navigation.navigate("Main" as never);
    } else {
      navigation.navigate("Main" as never);
    }
  };

  const handleSocialLogin = (platform: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    alert(`${platform} login clicked!`);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <LinearGradient colors={["#0a0a0a", "#1a1a2e", "#16213e", "#0f3460"]} style={styles.container}>
        {/* Particle Effects Background */}
        <View style={styles.particlesContainer}>
          {Array.from({ length: 20 }).map((_, i) => (
            <Animated.View
              key={i}
              style={[
                styles.particle,
                {
                  left: Math.random() * width,
                  top: Math.random() * Dimensions.get('window').height,
                  transform: [
                    {
                      translateY: new Animated.Value(0).interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, -100],
                      }),
                    },
                  ],
                },
              ]}
            />
          ))}
        </View>
        <Animated.View style={{ flex: 1, opacity: fade }}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.keyboardView}
          >
            <ScrollView
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              <Animated.View style={[styles.cardGlow, { opacity: fade }]}>
                <BlurView intensity={60} tint="dark" style={styles.card}>
                <AnimatedFace
                  email={email}
                  focusedPassword={focusedPassword}
                  errorShake={errorShake}
                  mouthAnimValue={mouthAnimValue}
                />

                <Text style={styles.title}>Welcome Back</Text>

                <AnimatedInput
                  icon="mail-outline"
                  placeholder="Email"
                  value={email}
                  onChange={setEmail}
                />
                <AnimatedInput
                  icon="lock-closed-outline"
                  placeholder="Password"
                  value={password}
                  secure={!showPassword}
                  onChange={setPassword}
                  showToggle
                  toggle={() => setShowPassword(!showPassword)}
                  onFocus={() => {
                    setFocusedPassword(true);
                    Animated.timing(mouthAnimValue, { toValue: 0, duration: 200, useNativeDriver: true }).start();
                  }}
                  onBlur={() => setFocusedPassword(false)}
                />

                {/* Captcha */}
                <View style={styles.captchaRow}>
                  <View style={styles.captchaBox}>
                    <Text style={styles.captchaText}>{captcha}</Text>
                  </View>
                  <TouchableOpacity 
                    onPress={() => {
                      setCaptcha(generateCaptcha());
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    }}
                    style={styles.refreshButton}
                  >
                    <Ionicons name="refresh" size={22} color="#78d0ff" />
                  </TouchableOpacity>
                </View>
                <TextInput
                  style={styles.captchaInput}
                  placeholder="Enter captcha"
                  placeholderTextColor="rgba(255,255,255,0.6)"
                  value={captchaInput}
                  onChangeText={setCaptchaInput}
                  autoCapitalize="characters"
                />

                {/* Sign In Button */}
                <AnimatedButton 
                  title="Sign In" 
                  onPress={handleSubmit}
                  colors={["#3dd2ff", "#0072ff", "#0050c8"]}
                  disabled={!email || !password || captchaInput.toUpperCase() !== captcha}
                />

                {/* OR divider */}
                <View style={styles.divider}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.dividerText}>OR</Text>
                  <View style={styles.dividerLine} />
                </View>

                {/* Social Buttons Row */}
                <View style={styles.socialIconsRow}>
                  <SocialButton 
                    icon="logo-google" 
                    color="#DB4437" 
                    onPress={() => handleSocialLogin('Google')}
                  />
                  <SocialButton 
                    icon="logo-facebook" 
                    color="#4267B2" 
                    onPress={() => handleSocialLogin('Facebook')}
                  />
                  <SocialButton 
                    icon="logo-apple" 
                    color="#FFFFFF" 
                    onPress={() => handleSocialLogin('Apple')}
                  />
                </View>

                {/* Additional Options */}
                <View style={styles.additionalOptions}>
                  <TextButton 
                    title="Forgot Password?" 
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      alert('Forgot password flow');
                    }}
                    color="#78d0ff"
                  />
                  <TextButton
                    title="Create Account"
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      alert('Sign up flow');
                    }}
                    color="#ff6b6b"
                  />
                </View>
                </BlurView>
              </Animated.View>
            </ScrollView>
          </KeyboardAvoidingView>
        </Animated.View>
      </LinearGradient>
    </TouchableWithoutFeedback>
  );
};

export default LoginScreen;

/* ------------------ Enhanced Styles ------------------ */
const styles = StyleSheet.create({
  container: { 
    flex: 1 
  },
  keyboardView: { 
    flex: 1 
  },
  scrollContent: { 
    flexGrow: 1, 
    justifyContent: "center", 
    alignItems: "center" 
  },
  card: {
    width: width * 0.9,
    maxWidth: 380,
    padding: 20,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    alignItems: "center",
    overflow: 'hidden',
  },
  title: { 
    color: "#fff", 
    fontSize: 24, 
    fontWeight: "700", 
    marginBottom: 16,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    paddingHorizontal: 14,
    minHeight: 48,
    marginBottom: 8,
  },
  input: {
    flex: 1,
    color: "#fff",
    fontSize: 15,
    paddingVertical: 8,
  },
  captchaRow: { 
    flexDirection: "row", 
    alignItems: "center", 
    marginVertical: 12,
    width: '100%',
  },
  captchaBox: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 10,
    padding: 12,
    alignItems: "center",
    marginRight: 12,
  },
  captchaText: { 
    color: "#78d0ff", 
    fontSize: 18, 
    fontWeight: "700", 
    letterSpacing: 3 
  },
  refreshButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  captchaInput: {
    width: "100%",
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 12,
    color: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 16,
    textAlign: "center",
    fontSize: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },

  // Enhanced Primary Button Styles
  buttonTouchable: {
    width: '100%',
    marginTop: 16,
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: '#0072ff',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  enhancedButton: {
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    minHeight: 54,
  },
  enhancedButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonDisabledText: {
    color: '#ccc',
  },
  ripple: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    top: '50%',
    left: '50%',
    marginLeft: -10,
    marginTop: -10,
  },
  shine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
  },
  shimmer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
  },
  shimmerGradient: {
    width: '100%',
    height: '100%',
  },

  // Social Button Styles
  socialIconsRow: {
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
    gap: 20,
    marginVertical: 16,
  },
  socialButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  socialButtonGradient: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 28,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  socialGlow: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 28,
  },

  // Text Button Styles
  additionalOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 8,
    marginBottom: 4,
  },
  textButtonTouchable: {
    marginVertical: 4,
  },
  textButtonContainer: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  textButtonText: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  textButtonUnderline: {
    height: 2,
    marginTop: 2,
    borderRadius: 1,
  },

  // Divider Styles
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
    width: "100%",
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "rgba(255,255,255,0.2)"
  },
  dividerText: {
    color: "rgba(255,255,255,0.5)",
    paddingHorizontal: 12,
    fontSize: 12,
    fontWeight: '600',
  },

  // Particle Effects
  particlesContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
  },
  particle: {
    position: 'absolute',
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },

  // Card Glow Effect
  cardGlow: {
    shadowColor: '#3dd2ff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 20,
  },
});
