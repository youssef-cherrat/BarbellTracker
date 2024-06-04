import Camera from 'react-native-vision-camera';
//import { CameraRoll }
import * as MediaLibrary from 'expo-media-library';
import { useState, useRef, useEffect } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Video, Audio } from 'expo-av';
import { useCameraDevice } from 'react-native-vision-camera';

export default function CameraPage() {
  const [facing, setFacing] = useState('back');
  const [permission, requestPermission] = useCameraPermissions();
  //request audio
  const device = useCameraDevice('back');
  const [permissionResponse, requestPermissionAudio] = Audio.usePermissions();
  const [isRecording, setIsRecording] = useState(false);
  const camera = useRef<Camera>(null);
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

  const recordVideo = async () => {
    camera.current.startRecording({
      onRecordingFinished: (video) => console.log(video),
      onRecordingError: (error) => console.error(error)
    })
  };

  const stopRecording = () => {
    camera.current.stopRecording();
  };

  return (
    <View style={styles.container}>
      <Camera 
        device = {device}
        isActive={true}
        style={styles.camera} 
        ref={camera}
        {...props}
        video = {true}       
      >
        <TouchableOpacity style={styles.flipButton} onPress={toggleCameraFacing}>
          <Image source={require('../assets/flip_cam.png')} style={styles.flipImage} />
        </TouchableOpacity>
        <View style={styles.recordButtonContainer}>
          <TouchableOpacity style={styles.recordButton} onPress={isRecording ? stopRecording : recordVideo}>
            {isRecording ? (
              <View style={styles.recordSquare} />
            ) : (
              <View style={styles.recordCircle} />
            )}
          </TouchableOpacity>
        </View>
      </Camera>
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