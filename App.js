import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import IntroPage from './pages/IntroPage';
import CameraPage from './pages/CameraPage';
import ExportPage from './pages/ExportPage';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Intro">
        <Stack.Screen name="Intro" component={IntroPage} />
        <Stack.Screen name="Camera" component={CameraPage} />
        <Stack.Screen name="Export" component={ExportPage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
