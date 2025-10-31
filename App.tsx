import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Platform } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import LoginScreen from "./screens/LoginScreen";
import AdminScreen from "./screens/AdminScreen";
import DashboardScreen from "./screens/DashboardScreen";
import CoursesScreen from "./screens/CoursesScreen";
import TestsScreen from "./screens/TestsScreen";
import ProfileScreen from "./screens/ProfileScreen";
import AttendanceScreen from "./screens/AttendanceScreen";
import DoubtPortalScreen from "./screens/DoubtPortalScreen";
import NotificationsScreen from "./screens/NotificationsScreen";
import PaymentsScreen from "./screens/PaymentsScreen";
import SupportScreen from "./screens/SupportScreen";
import "./global.css";
import "./styles.css";

import "./global.css";
import "./styles.css";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: any;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Courses') {
            iconName = focused ? 'book' : 'book-outline';
          } else if (route.name === 'Tests') {
            iconName = focused ? 'clipboard' : 'clipboard-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#4F46E5',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={DashboardScreen} />
      <Tab.Screen name="Courses" component={CoursesScreen} />
      <Tab.Screen name="Tests" component={TestsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Admin" component={AdminScreen} />
        <Stack.Screen name="Main" component={MainTabs} />
        <Stack.Screen name="Attendance" component={AttendanceScreen} />
        <Stack.Screen name="DoubtPortal" component={DoubtPortalScreen} />
        <Stack.Screen name="Notifications" component={NotificationsScreen} />
        <Stack.Screen name="Payments" component={PaymentsScreen} />
        <Stack.Screen name="Support" component={SupportScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
