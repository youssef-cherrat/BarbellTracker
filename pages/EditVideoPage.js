import React, { useRef, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { Video } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';

export default function EditVideoPage({ route }) {
  const { videoUri } = route.params || {}; // Ensure route.params is not undefined
  const videoRef = useRef(null);

  useEffect(() => {
    console.log('Received Video URI:', videoUri);
  }, [videoUri]);

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
      <View style={styles.topBar} />
      {videoUri ? (
        <Video
          ref={videoRef}
          source={{ uri: videoUri }}
          style={styles.video}
          resizeMode="contain"
          isLooping={false}
          onError={(error) => console.log('Video Error:', error)}
        />
      ) : (
        <Text style={styles.errorText}>Video URI is missing</Text>
      )}
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
    height: '70%', // Adjusted height to ensure visibility
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
  errorText: {
    color: 'red',
    fontSize: 18,
  },
});
