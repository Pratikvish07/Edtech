import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  FlatList,
  Animated,
  Alert,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

type Course = {
  id: string;
  title: string;
  category: string;
  enrolled: boolean;
  upcoming: boolean;
  description: string;
  modules: string[];
  rating: number;
  instructor: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  demo?: boolean;
  demoVideo?: string; // URL for demo video
  liveSession?: boolean; // Indicates a live session
};

const mockCourses: Course[] = [
  {
    id: '1',
    title: 'React Native Basics',
    category: 'mobile',
    enrolled: true,
    upcoming: false,
    description: 'Learn React Native from scratch and build mobile apps. This comprehensive course covers everything from setting up your development environment to deploying your first app on both iOS and Android platforms.',
    modules: ['JS Basics', 'Components', 'State & Props', 'Navigation', 'APIs', 'Styling with NativeWind', 'AsyncStorage', 'Push Notifications'],
    rating: 4.5,
    instructor: 'John Doe',
    level: 'Beginner',
    demoVideo: 'https://sample-videos.com/video123/mp4/240/big_buck_bunny_240p_1mb.mp4',
    liveSession: true,
  },
  {
    id: '2',
    title: 'Advanced React',
    category: 'web',
    enrolled: false,
    upcoming: true,
    description: 'Deep dive into React hooks, context, and performance optimization. Master advanced patterns and build high-performance web applications.',
    modules: ['Hooks', 'Context API', 'Performance', 'Testing', 'Redux Toolkit', 'React Query', 'TypeScript Integration'],
    rating: 4.8,
    instructor: 'Jane Smith',
    level: 'Advanced',
    demo: true,
    demoVideo: 'https://sample-videos.com/video123/mp4/240/big_buck_bunny_240p_1mb.mp4',
  },
  {
    id: '3',
    title: 'Node.js API',
    category: 'backend',
    enrolled: true,
    upcoming: false,
    description: 'Build scalable REST APIs using Node.js and Express. Learn authentication, database integration, and deployment strategies.',
    modules: ['Express', 'MongoDB', 'Authentication', 'Deployment', 'JWT Tokens', 'File Uploads', 'Error Handling'],
    rating: 4.6,
    instructor: 'Mike Johnson',
    level: 'Intermediate',
  },
  {
    id: '4',
    title: 'Next.js 14',
    category: 'web',
    enrolled: false,
    upcoming: false,
    description: 'Learn SSR, SSG, and routing with Next.js 14. Build modern web applications with server-side rendering and static generation.',
    modules: ['Pages', 'SSR/SSG', 'API Routes', 'Styling', 'Image Optimization', 'Middleware', 'App Router'],
    rating: 4.7,
    instructor: 'Sarah Wilson',
    level: 'Intermediate',
    demoVideo: 'https://sample-videos.com/video123/mp4/240/big_buck_bunny_240p_1mb.mp4',
  },
  {
    id: '5',
    title: 'Python for Data Science',
    category: 'data science',
    enrolled: false,
    upcoming: false,
    description: 'Master Python for data analysis, visualization, and machine learning. From pandas to scikit-learn, become a data science expert.',
    modules: ['Python Basics', 'NumPy', 'Pandas', 'Matplotlib', 'Seaborn', 'Scikit-learn', 'Jupyter Notebooks'],
    rating: 4.9,
    instructor: 'Alex Brown',
    level: 'Beginner',
    demo: true,
  },
  {
    id: '6',
    title: 'UI/UX Design Fundamentals',
    category: 'design',
    enrolled: false,
    upcoming: true,
    description: 'Learn the principles of user interface and user experience design. Create beautiful and functional designs for web and mobile.',
    modules: ['Design Principles', 'Color Theory', 'Typography', 'Wireframing', 'Prototyping', 'User Research', 'Figma Tools'],
    rating: 4.4,
    instructor: 'Emily Davis',
    level: 'Beginner',
    liveSession: true,
  },
  {
    id: '7',
    title: 'Machine Learning with TensorFlow',
    category: 'ai',
    enrolled: false,
    upcoming: false,
    description: 'Build and deploy machine learning models using TensorFlow. From neural networks to deep learning applications.',
    modules: ['Linear Regression', 'Neural Networks', 'CNNs', 'RNNs', 'Transfer Learning', 'Model Deployment', 'TensorFlow.js'],
    rating: 4.7,
    instructor: 'David Lee',
    level: 'Advanced',
  },
  {
    id: '8',
    title: 'DevOps with Docker & Kubernetes',
    category: 'devops',
    enrolled: true,
    upcoming: false,
    description: 'Master containerization and orchestration with Docker and Kubernetes. Learn to deploy and scale applications efficiently.',
    modules: ['Docker Basics', 'Docker Compose', 'Kubernetes', 'Helm Charts', 'CI/CD Pipelines', 'Monitoring', 'Security'],
    rating: 4.6,
    instructor: 'Chris Taylor',
    level: 'Intermediate',
    demoVideo: 'https://sample-videos.com/video123/mp4/240/big_buck_bunny_240p_1mb.mp4',
  },
  {
    id: '9',
    title: 'Flutter for Cross-Platform Development',
    category: 'mobile',
    enrolled: false,
    upcoming: false,
    description: 'Build beautiful native apps for iOS and Android with Flutter. Learn Dart, widgets, and state management.',
    modules: ['Dart Basics', 'Widgets', 'State Management', 'Navigation', 'APIs', 'Firebase Integration', 'Deployment'],
    rating: 4.6,
    instructor: 'Tom Wilson',
    level: 'Intermediate',
    demo: true,
  },
  {
    id: '10',
    title: 'Cybersecurity Essentials',
    category: 'security',
    enrolled: false,
    upcoming: true,
    description: 'Understand the fundamentals of cybersecurity, including threats, defenses, and best practices for protecting digital assets.',
    modules: ['Network Security', 'Cryptography', 'Ethical Hacking', 'Incident Response', 'Compliance', 'Tools and Techniques'],
    rating: 4.5,
    instructor: 'Lisa Green',
    level: 'Beginner',
    liveSession: true,
  },
  {
    id: '11',
    title: 'Blockchain Development',
    category: 'blockchain',
    enrolled: false,
    upcoming: false,
    description: 'Dive into blockchain technology and learn to build decentralized applications using Ethereum and Solidity.',
    modules: ['Blockchain Basics', 'Ethereum', 'Solidity', 'Smart Contracts', 'DApps', 'Web3.js', 'Deployment'],
    rating: 4.8,
    instructor: 'Mark Thompson',
    level: 'Advanced',
    demoVideo: 'https://sample-videos.com/video123/mp4/240/big_buck_bunny_240p_1mb.mp4',
  },
  {
    id: '12',
    title: 'Cloud Computing with AWS',
    category: 'cloud',
    enrolled: true,
    upcoming: false,
    description: 'Master Amazon Web Services for cloud computing. Learn to deploy, manage, and scale applications in the cloud.',
    modules: ['EC2', 'S3', 'Lambda', 'RDS', 'CloudFormation', 'Monitoring', 'Security'],
    rating: 4.7,
    instructor: 'Anna Lee',
    level: 'Intermediate',
  },
  {
    id: '13',
    title: 'Game Development with Unity',
    category: 'game dev',
    enrolled: false,
    upcoming: false,
    description: 'Create engaging games using Unity. Learn C#, physics, animations, and deploy to multiple platforms.',
    modules: ['C# Basics', 'Unity Interface', 'Physics', 'Animations', 'UI/UX', 'Multiplayer', 'Publishing'],
    rating: 4.9,
    instructor: 'Jake Miller',
    level: 'Beginner',
    demo: true,
  },
  {
    id: '14',
    title: 'Digital Marketing Mastery',
    category: 'marketing',
    enrolled: false,
    upcoming: true,
    description: 'Learn SEO, social media marketing, content creation, and analytics to grow your online presence.',
    modules: ['SEO', 'Social Media', 'Content Marketing', 'PPC Advertising', 'Analytics', 'Email Marketing', 'Strategy'],
    rating: 4.4,
    instructor: 'Sophie Turner',
    level: 'Beginner',
    liveSession: true,
  },
];

// ----- Toast -----
const Toast = ({ message, type, onHide }: { message: string; type: 'success' | 'error'; onHide: () => void }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

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

export default function DashboardScreen({ navigation }: any) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'enrolled' | 'upcoming' | 'demo' | 'favorites'>('all');
  const [cart, setCart] = useState<Course[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(3);
  const [expandedCourse, setExpandedCourse] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [animationValues, setAnimationValues] = useState<{ [key: string]: Animated.Value }>({});

  const scrollViewRef = useRef<ScrollView>(null);

  const { width } = Dimensions.get('window');
  const slideWidth = width * 0.8;
  const slideMargin = width * 0.1;

  const featuredCourses = mockCourses.filter(course => course.demo || course.liveSession).slice(0, 3);
  const recentlyViewed = mockCourses.slice(0, 4); // Simulate recently viewed courses

  const user = { name: 'Pratik' };

  // Auto-slide functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => {
        const nextSlide = (prevSlide + 1) % featuredCourses.length;
        scrollViewRef.current?.scrollTo({ x: nextSlide * slideWidth, animated: true });
        return nextSlide;
      });
    }, 3000); // Change slide every 3 seconds

    return () => clearInterval(interval);
  }, [featuredCourses.length, slideWidth]);

  const filteredCourses = mockCourses
    .filter(course => {
      if (activeTab === 'enrolled') return course.enrolled;
      if (activeTab === 'upcoming') return course.upcoming;
      if (activeTab === 'demo') return course.demo;
      if (activeTab === 'favorites') return favorites.includes(course.id);
      return true;
    })
    .filter(course => course.title.toLowerCase().includes(searchQuery.toLowerCase()));

  const showToast = (message: string, type: 'success' | 'error') => setToast({ message, type });

  const handleLogout = () => console.log('Logging out...');
  const handleAddToCart = (course: Course) => {
    if (!cart.find(c => c.id === course.id)) {
      setCart(prev => [...prev, course]);
      showToast('Course added to cart!', 'success');
    } else {
      showToast('Course already in cart!', 'error');
    }
  };

  const handleToggleFavorite = (courseId: string) => {
    setFavorites(prev => {
      if (prev.includes(courseId)) {
        showToast('Removed from favorites!', 'success');
        return prev.filter(id => id !== courseId);
      } else {
        showToast('Added to favorites!', 'success');
        return [...prev, courseId];
      }
    });
  };

  const toggleExpand = (id: string) => {
    const isExpanding = expandedCourse !== id;
    setExpandedCourse(isExpanding ? id : null);

    if (!animationValues[id]) {
      setAnimationValues(prev => ({ ...prev, [id]: new Animated.Value(0) }));
    }

    Animated.timing(animationValues[id] || new Animated.Value(0), {
      toValue: isExpanding ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  return (
    <View className="flex-1 bg-gray-100">
      {/* Header */}
      <LinearGradient colors={['#4F46E5', '#7C73E6']} className="pt-12 px-4 pb-4">
        <View className="flex-row justify-between items-center mb-3">
          <View>
            <Text className="text-white text-2xl font-bold">Hi, {user.name}! 👋</Text>
            <Text className="text-white text-sm opacity-80">Welcome to your dashboard</Text>
          </View>
          <View className="flex-row items-center space-x-3">
            <TouchableOpacity onPress={() => Alert.alert('Notifications', 'You have no new notifications.')} className="relative p-2 bg-white/20 rounded-full">
              <Ionicons name="notifications-outline" size={20} color="white" />
              {unreadNotificationsCount > 0 && (
                <View className="absolute -top-1 -right-1 bg-red-500 w-5 h-5 rounded-full justify-center items-center">
                  <Text className="text-white text-[10px] font-bold">{unreadNotificationsCount}</Text>
                </View>
              )}
            </TouchableOpacity>
            <TouchableOpacity onPress={() => Alert.alert('Cart', `You have ${cart.length} items in your cart.`)} className="relative p-2 bg-white/20 rounded-full">
              <Ionicons name="cart-outline" size={20} color="white" />
              {cart.length > 0 && (
                <View className="absolute -top-1 -right-1 bg-green-500 w-5 h-5 rounded-full justify-center items-center">
                  <Text className="text-white text-[10px] font-bold">{cart.length}</Text>
                </View>
              )}
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Login')} className="p-1 bg-red-500 px-3 py-1 rounded flex-row items-center">
              <Ionicons name="log-out-outline" size={16} color="white" />
              <Text className="text-white font-semibold ml-1">Logout</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Search */}
        <View className="flex-row items-center bg-white rounded-full px-3 py-2 shadow-sm">
          <Ionicons name="search" size={18} color="#6B7280" />
          <TextInput
            placeholder="Search courses..."
            className="ml-2 flex-1 text-gray-700 text-sm"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={18} color="#6B7280" />
            </TouchableOpacity>
          )}
        </View>

        {/* Tabs */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-3">
          {['all', 'enrolled', 'upcoming', 'demo', 'favorites'].map(tab => (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab as any)}
              className={`px-4 py-1 rounded-full mr-2 ${activeTab === tab ? 'bg-white/30' : 'bg-white/10'}`}
            >
              <Text className="text-white font-medium text-sm">
                {tab === 'all'
                  ? 'All Courses'
                  : tab === 'enrolled'
                  ? `My Courses (${mockCourses.filter(c => c.enrolled).length})`
                  : tab === 'upcoming'
                  ? 'Upcoming'
                  : tab === 'demo'
                  ? 'Demo Courses'
                  : `Favorites (${favorites.length})`}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </LinearGradient>

      {/* Recently Viewed */}
      <View className="bg-white py-4">
        <Text className="text-gray-900 font-bold text-lg px-4 mb-3">Recently Viewed</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16 }}>
          {recentlyViewed.map((course) => (
            <TouchableOpacity
              key={course.id}
              onPress={() => Alert.alert('Course Details', `Title: ${course.title}\nInstructor: ${course.instructor}\nLevel: ${course.level}\nRating: ${course.rating}/5`)}
              className="bg-gray-50 p-3 rounded-2xl mr-3 shadow-lg"
              style={{ width: 120 }}
            >
              <Text className="text-gray-900 font-semibold text-sm mb-1" numberOfLines={2}>{course.title}</Text>
              <Text className="text-gray-500 text-xs mb-1">{course.instructor}</Text>
              <Text className="text-indigo-600 text-xs font-medium">{course.level}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Featured Courses Slider */}
      <View className="bg-white py-4">
        <Text className="text-gray-900 font-bold text-lg px-4 mb-3">Featured Courses</Text>
        <ScrollView
          ref={scrollViewRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16 }}
          pagingEnabled
          onScroll={(event) => {
            const slideSize = event.nativeEvent.layoutMeasurement.width;
            const index = event.nativeEvent.contentOffset.x / slideSize;
            const roundIndex = Math.round(index);
            setCurrentSlide(roundIndex);
          }}
          scrollEventThrottle={16}
        >
          {featuredCourses.map((course, index) => (
            <View
              key={course.id}
              className="card-rich mr-4 animate-fade-in"
              style={{ width: slideWidth }}
            >
              <LinearGradient
                colors={['#667eea', '#764ba2']}
                className="p-4 rounded-xl"
              >
                <View className="flex-row justify-between items-start mb-2">
                  <Text className="text-white font-bold text-base flex-1">{course.title}</Text>
                  {course.demo && (
                    <View className="bg-yellow-400 px-2 py-1 rounded ml-2">
                      <Text className="text-black text-[10px] font-bold">Demo</Text>
                    </View>
                  )}
                  {course.liveSession && (
                    <View className="bg-red-400 px-2 py-1 rounded ml-2">
                      <Text className="text-white text-[10px] font-bold">Live</Text>
                    </View>
                  )}
                </View>
                <Text className="text-white/80 text-xs font-medium mb-2">{course.category.toUpperCase()}</Text>
                <Text className="text-white text-sm mb-3" numberOfLines={2}>{course.description}</Text>
                <View className="flex-row justify-between items-center">
                  <Text className="text-yellow-300 font-semibold text-sm">⭐ {course.rating} / 5</Text>
                  <TouchableOpacity
                    onPress={() => handleAddToCart(course)}
                    className="bg-white/20 px-3 py-1 rounded-full"
                  >
                    <Text className="text-white font-medium text-sm">Add to Cart</Text>
                  </TouchableOpacity>
                </View>
              </LinearGradient>
            </View>
          ))}
        </ScrollView>
        {/* Slider Dots */}
        <View className="flex-row justify-center mt-3">
          {featuredCourses.map((_, index) => (
            <View
              key={index}
              className={`w-2 h-2 rounded-full mx-1 ${index === currentSlide ? 'bg-indigo-600' : 'bg-gray-300'}`}
            />
          ))}
        </View>
      </View>

      {/* Course List */}
      <FlatList
        data={filteredCourses}
        keyExtractor={item => item.id}
        contentContainerStyle={{ padding: 16, paddingBottom: 50 }}
        renderItem={({ item }) => (
          <View className="card-rich animate-fade-in mb-4">
            <View className="flex-row justify-between items-center">
              <Text className="text-gray-900 font-semibold text-base">{item.title}</Text>
              {item.demo && (
                <View className="bg-yellow-500 px-2 py-1 rounded">
                  <Text className="text-white text-[10px]">Demo</Text>
                </View>
              )}
              {item.liveSession && (
                <View className="bg-red-500 px-2 py-1 rounded ml-2">
                  <Text className="text-white text-[10px]">Live</Text>
                </View>
              )}
            </View>

            <Text className="text-gray-500 text-xs font-medium mt-1">{item.category.toUpperCase()}</Text>
            <Text className="text-gray-700 text-sm mt-1">{item.description}</Text>

            <View className="flex-row justify-between items-center mt-2">
              <Text className="text-gray-600 text-xs">By {item.instructor}</Text>
              <View className={`px-2 py-1 rounded-full ${item.level === 'Beginner' ? 'bg-green-100' : item.level === 'Intermediate' ? 'bg-yellow-100' : 'bg-red-100'}`}>
                <Text className={`text-xs font-medium ${item.level === 'Beginner' ? 'text-green-700' : item.level === 'Intermediate' ? 'text-yellow-700' : 'text-red-700'}`}>
                  {item.level}
                </Text>
              </View>
            </View>

            <TouchableOpacity onPress={() => toggleExpand(item.id)}>
              <Text className="text-indigo-600 font-medium mt-2 text-sm">
                {expandedCourse === item.id ? 'Hide Modules ▲' : 'Show Modules ▼'}
              </Text>
            </TouchableOpacity>

            <Animated.View
              style={{
                maxHeight: (animationValues[item.id] || new Animated.Value(0)).interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 200],
                }),
                opacity: animationValues[item.id] || new Animated.Value(0),
                overflow: 'hidden',
              }}
            >
              <View className="mt-2 space-y-1">
                {item.modules.map((mod, idx) => (
                  <Text key={idx} className="text-gray-500 text-sm ml-2">• {mod}</Text>
                ))}
              </View>
            </Animated.View>

            {item.demoVideo && (
              <TouchableOpacity className="mt-2 bg-indigo-400 py-2 rounded">
                <Text className="text-white text-center font-medium">Watch Demo Video</Text>
              </TouchableOpacity>
            )}

            <View className="flex-row justify-between items-center mt-2">
              <Text className="text-yellow-500 font-semibold text-sm">⭐ {item.rating} / 5</Text>
              <TouchableOpacity
                onPress={() => handleToggleFavorite(item.id)}
                className="p-2"
              >
                <Ionicons
                  name={favorites.includes(item.id) ? 'heart' : 'heart-outline'}
                  size={20}
                  color={favorites.includes(item.id) ? '#ef4444' : '#6b7280'}
                />
              </TouchableOpacity>
            </View>

            {!cart.find(c => c.id === item.id) && !item.enrolled && (
              <TouchableOpacity
                onPress={() => handleAddToCart(item)}
                className="mt-2 bg-indigo-600 py-2 rounded"
              >
                <Text className="text-white text-center font-medium">Add to Cart</Text>
              </TouchableOpacity>
            )}

            {item.enrolled && (
              <TouchableOpacity className="mt-2 bg-green-500 py-2 rounded">
                <Text className="text-white text-center font-medium">Start Course</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
        ListEmptyComponent={
          <View className="items-center mt-12">
            <Text className="text-gray-400 text-base">No courses found.</Text>
          </View>
        }
      />

      {/* Toast */}
      {toast && <Toast message={toast.message} type={toast.type} onHide={() => setToast(null)} />}
    </View>
  );
}
