import { CameraView, useCameraPermissions, useCamera } from 'expo-camera';
import { useState, useRef } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Video } from 'expo-av';

export default function CameraPage() {
  const [facing, setFacing] = useState('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [isRecording, setIsRecording] = useState(false);
  const cameraRef = useRef(null);
  const navigation = useNavigation();
  const [videoUri, setVideoUri] = useState(null);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center' }}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  async function handleRecord() {
    if (isRecording) {
      setIsRecording(false);
      const video = await cameraRef.current.stopRecording();
      if (video && video.uri) {
        setVideoUri(video.uri);
        navigation.navigate('Export', { videoUri: video.uri });
      }
    } else {
      setIsRecording(true);
      await cameraRef.current.recordAsync();
    }
  }

  return (
    <View style={styles.container}>
      <CameraView 
        ref={cameraRef}
        style={styles.camera} 
        facing={facing}
      >
        <TouchableOpacity style={styles.flipButton} onPress={toggleCameraFacing}>
          <Image source={require('../assets/flip_cam.png')} style={styles.flipImage} />
        </TouchableOpacity>
        <View style={styles.recordButtonContainer}>
          <TouchableOpacity style={styles.recordButton} onPress={handleRecord}>
            {isRecording ? (
              <View style={styles.recordSquare} />
            ) : (
              <View style={styles.recordCircle} />
            )}
          </TouchableOpacity>
        </View>
      </CameraView>
      {videoUri && (
        <Video
          source={{ uri: videoUri }}
          style={styles.video}
          useNativeControls
          resizeMode="contain"
          isLooping={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  camera: {
    flex: 1,
  },
  flipButton: {
    position: 'absolute',
    top: 50,
    right: 20,
  },
  flipImage: {
    width: 40,
    height: 40,
  },
  recordButtonContainer: {
    position: 'absolute',
    bottom: '10%',
    left: '50%',
    transform: [{ translateX: -35 }], // Center horizontally
  },
  recordButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 2,
    borderColor: 'white',
  },
  recordCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'red',
  },
  recordSquare: {
    width: 30,
    height: 30,
    backgroundColor: 'red',
  },
  video: {
    alignSelf: 'center',
    width: 350,
    height: 220,
  },
});