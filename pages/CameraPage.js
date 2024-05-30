import { CameraView, useCameraPermissions, useCamera } from 'expo-camera';
import { useState, useRef } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Video } from 'expo-av';

export default function App() {
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
      setVideoUri(video.uri);
      navigation.navigate('Export', { videoUri: video.uri });
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
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
            <Text style={styles.text}>Flip Camera</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleRecord}>
            <Text style={styles.text}>{isRecording ? 'Stop Recording' : 'Start Recording'}</Text>
          </TouchableOpacity>
        </View>
      </CameraView>
      {videoUri && (
        <Video
          source={{ uri: videoUri }}
          style={styles.video}
          useNativeControls
          resizeMode="contain"
          isLooping
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
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
    justifyContent: 'space-around',
  },
  button: {
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  video: {
    alignSelf: 'center',
    width: 350,
    height: 220,
  },
});