import React, { useEffect } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import { Video } from 'expo-av';

export default function ExportPage({ route, navigation }) {
  const { videoUri, stats } = route.params;

  useEffect(() => {
    (async () => {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'Please grant camera roll permissions in your settings.');
      }
    })();
  }, []);

  const saveToCameraRoll = async () => {
    try {
      await MediaLibrary.saveToLibraryAsync(videoUri);
      Alert.alert('Success', 'Video saved to camera roll!');
    } catch (error) {
      Alert.alert('Error', 'Failed to save video to camera roll.');
    }
  };

  return (
      <View style={styles.container}>
        <Video
            source={{ uri: videoUri }}
            style={styles.video}
            useNativeControls
            resizeMode="contain"
            isLooping
        />
        <Text>{stats}</Text>
        <Button title="Save to Camera Roll" onPress={saveToCameraRoll} />
        <Button
            title="Back to Intro"
            onPress={() => navigation.navigate('Intro')}
        />
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    width: '100%',
    height: '50%',
  },
});
