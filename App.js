import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import IntroPage from './pages/IntroPage';
import DisplayPage from './pages/DisplayPage';
import ExportPage from './pages/ExportPage';
import EditVideoPage from './pages/EditVideoPage';
import AnimatedSplashScreen from './pages/AnimatedSplashScreen';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Linking } from 'react-native';

const Stack = createNativeStackNavigator();

export default function App() {
  const [isAppReady, setIsAppReady] = useState(false);

  useEffect(() => {
    // Simulate a delay to show the splash screen
    const timer = setTimeout(() => {
      setIsAppReady(true);
    }, 5000); // 3 seconds delay

    return () => clearTimeout(timer);
  }, []);

  if (!isAppReady) {
    return <AnimatedSplashScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Intro">
        <Stack.Screen 
          name="Intro" 
          component={IntroPage}
          options={{
            headerLeft: () => (
              <TouchableOpacity onPress={() => Linking.openURL('https://github.com/your-repo')}>
                <Ionicons name="logo-github" size={32} color="black" style={{ marginLeft: 10 }} />
              </TouchableOpacity>
            ),
            title: 'Intro'
          }} 
        />
        <Stack.Screen 
          name="Upload" 
          component={DisplayPage} 
        />
        <Stack.Screen 
          name="EditVideo" 
          component={EditVideoPage} 
          options={{ headerShown: false }} // Hide the header
        />
        <Stack.Screen name="Export" component={ExportPage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
