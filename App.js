import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import IntroPage from './pages/IntroPage';
import DisplayPage from './pages/DisplayPage';
import ExportPage from './pages/ExportPage';
import EditVideoPage from './pages/EditVideoPage';
import { TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Linking } from 'react-native';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Intro">
        <Stack.Screen 
          name="Intro" 
          component={IntroPage} 
          options={{
            headerLeft: () => (
              <TouchableOpacity onPress={() => Linking.openURL('https://github.com/youssef-cherrat/BarbellTracker')}>
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
