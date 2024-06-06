import React, { useState, useRef } from 'react';
import { Button, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Video } from 'expo-av';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';

export default function CameraPage() {
  const [videoUri, setVideoUri] = useState(null);
  const videoRef = useRef(null);

  const pickVideo = async () => {
    try {
      // Request media library permissions
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
        return;
      }

      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: true,
        quality: 1,
      });

      console.log(result); // Debugging line

      if (!result.cancelled) {
        setVideoUri(result.uri);
      } else {
        console.log("User cancelled the picker");
      }
    } catch (error) {
      console.error("Error picking video: ", error);
    }
  };

  const playVideo = async () => {
    if (videoRef.current) {
      await videoRef.current.playAsync();
    }
  };

  const pauseVideo = async () => {
    if (videoRef.current) {
      await videoRef.current.pauseAsync();
    }
  };

  const rewindVideo = async () => {
    if (videoRef.current) {
      const status = await videoRef.current.getStatusAsync();
      await videoRef.current.setPositionAsync(Math.max(status.positionMillis - 5000, 0));
    }
  };

  const forwardVideo = async () => {
    if (videoRef.current) {
      const status = await videoRef.current.getStatusAsync();
      await videoRef.current.setPositionAsync(status.positionMillis + 5000);
    }
  };

  return (
    <View style={styles.container}>
      {!videoUri && (
        <View style={styles.uploadContainer}>
          <Text style={styles.instructions}>Upload a video to get started</Text>
          <Button title="Upload Video" onPress={pickVideo} />
        </View>
      )}
      {videoUri && (
        <View style={styles.videoContainer}>
          <View style={styles.topBar} />
          <Video
            ref={videoRef}
            source={{ uri: videoUri }}
            style={styles.video}
            resizeMode="contain"
            isLooping={false}
          />
          <View style={styles.bottomBar}>
            <TouchableOpacity onPress={rewindVideo}>
              <Ionicons name="play-back" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity onPress={playVideo}>
              <Ionicons name="play" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity onPress={pauseVideo}>
              <Ionicons name="pause" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity onPress={forwardVideo}>
              <Ionicons name="play-forward" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  instructions: {
    fontSize: 18,
    marginBottom: 10,
  },
  videoContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    flex: 1,
    width: '100%',
  },
  topBar: {
    height: 50,
    width: '100%',
    backgroundColor: 'black',
  },
  bottomBar: {
    height: 50,
    width: '100%',
    backgroundColor: 'black',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
});
