import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import IntroPage from './pages/IntroPage';
import UploadPage from './pages/UploadPage'; // Updated import to UploadPage
import ExportPage from './pages/ExportPage';
import EditVideoPage from './pages/EditVideoPage';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Intro">
        <Stack.Screen name="Intro" component={IntroPage} />
        <Stack.Screen 
          name="Upload" 
          component={UploadPage} 
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
