import React, { useRef, useEffect, useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Dimensions, Modal, Switch, TextInput, PanResponder } from 'react-native';
import { Video } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Canvas from 'react-native-canvas';

const { width, height } = Dimensions.get('window'); // Get screen dimensions

export default function EditVideoPage({ route }) {
  const { videoUri } = route.params || {};
  const videoRef = useRef(null);
  const navigation = useNavigation();
  const [isPlaying, setIsPlaying] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showDate, setShowDate] = useState(false);
  const [showWeight, setShowWeight] = useState(false);
  const [weightUnit, setWeightUnit] = useState('LB');
  const [weight, setWeight] = useState('');
  const [showRPE, setShowRPE] = useState(false);
  const [rpe, setRPE] = useState('');
  const [circleVisible, setCircleVisible] = useState(false);
  const [circlePosition, setCirclePosition] = useState({ x: width / 2, y: height / 4 });
  const [motionPath, setMotionPath] = useState([]);

  useEffect(() => {
    console.log('Received Video URI:', videoUri);
  }, [videoUri]);

  const togglePlayPause = async () => {
    if (videoRef.current) {
      const status = await videoRef.current.getStatusAsync();
      if (status.isPlaying) {
        await videoRef.current.pauseAsync();
        setIsPlaying(false);
      } else {
        await videoRef.current.playAsync();
        setIsPlaying(true);
      }
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

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (evt, gestureState) => {
        const newX = Math.max(0, Math.min(width, gestureState.moveX));
        const newY = Math.max(0, Math.min(height, gestureState.moveY));
        setCirclePosition({ x: newX, y: newY });
        setMotionPath((prevPath) => [...prevPath, { x: newX, y: newY }]);
      },
    })
  ).current;

  const drawPath = (canvas) => {
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = 'red';
      ctx.lineWidth = 2;
      ctx.beginPath();
      motionPath.forEach((point, index) => {
        if (index === 0) {
          ctx.moveTo(point.x, point.y);
        } else {
          ctx.lineTo(point.x, point.y);
        }
      });
      ctx.stroke();
    }
  };

  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <View style={styles.container}>
      <View style={styles.topBarContainer}>
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.topButton}>
            <Ionicons name="chevron-back" size={32} color="white" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShowSettings(true)} style={styles.topButton}>
            <Ionicons name="settings-outline" size={32} color="white" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setCircleVisible(true)} style={styles.topButton}>
            <Ionicons name="search-outline" size={32} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('Export', {
                videoUri,
                showDate,
                showWeight,
                weight,
                weightUnit,
                showRPE,
                rpe,
                motionPath,
              })
            }
            style={styles.topButton}
          >
            <Text style={styles.exportButtonText}>Export</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.videoContainer}>
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
        <View style={styles.watermarkContainer}>
          {showDate && <Text style={styles.watermark}>{currentDate}</Text>}
          {showWeight && weight !== '' && (
            <Text style={styles.watermark}>{`${weight} ${weightUnit}`}</Text>
          )}
          {showRPE && rpe !== '' && <Text style={styles.watermark}>{`RPE: ${rpe}`}</Text>}
        </View>
        {circleVisible && (
          <View style={styles.magnifierContainer}>
            <View
              {...panResponder.panHandlers}
              style={[
                styles.circle,
                { left: circlePosition.x - 15, top: circlePosition.y - 15 },
              ]}
            />
            <View
              style={[
                styles.magnifier,
                {
                  left: circlePosition.x + 50,
                  top: circlePosition.y - 50,
                },
              ]}
            >
              <View style={styles.magnifiedAreaContainer}>
                <Video
                  source={{ uri: videoUri }}
                  style={[
                    styles.magnifiedArea,
                    {
                      transform: [
                        { translateX: -circlePosition.x * 2 + 50 },
                        { translateY: -circlePosition.y * 2 + 50 },
                      ],
                    },
                  ]}
                  resizeMode="contain"
                  isLooping
                  shouldPlay={isPlaying}
                  isMuted
                />
              </View>
            </View>
            {/* Line connecting small circle to magnifier */}
            <View
              style={[
                styles.line,
                {
                  left: circlePosition.x,
                  top: circlePosition.y,
                  width: 50,
                },
              ]}
            />
          </View>
        )}
        <Canvas ref={drawPath} style={styles.canvas} />
      </View>
      <View style={styles.controlBar}>
        <TouchableOpacity onPress={rewindVideo} style={styles.controlButton}>
          <Ionicons name="play-back" size={32} color="white" />
        </TouchableOpacity>
        <TouchableOpacity onPress={togglePlayPause} style={styles.controlButton}>
          <Ionicons name={isPlaying ? 'pause' : 'play'} size={32} color="white" />
        </TouchableOpacity>
        <TouchableOpacity onPress={forwardVideo} style={styles.controlButton}>
          <Ionicons name="play-forward" size={32} color="white" />
        </TouchableOpacity>
      </View>
      <Modal
        visible={showSettings}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowSettings(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Settings</Text>
              <TouchableOpacity onPress={() => setShowSettings(false)} style={styles.doneButton}>
                <Text style={styles.doneButtonText}>Done</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.settingRow}>
              <Text style={styles.settingText}>Show Date</Text>
              <Switch value={showDate} onValueChange={setShowDate} />
            </View>
            <View style={styles.settingRow}>
              <Text style={styles.settingText}>Show Weight</Text>
              <Switch value={showWeight} onValueChange={setShowWeight} />
            </View>
            {showWeight && (
              <>
                <View style={styles.settingRow}>
                  <TouchableOpacity
                    style={[styles.optionButton, weightUnit === 'LB' && styles.optionButtonSelected]}
                    onPress={() => setWeightUnit('LB')}
                  >
                    <Text style={styles.optionButtonText}>LB</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.optionButton, weightUnit === 'KG' && styles.optionButtonSelected]}
                    onPress={() => setWeightUnit('KG')}
                  >
                    <Text style={styles.optionButtonText}>KG</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.settingRow}>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter weight"
                    keyboardType="numeric"
                    value={weight}
                    onChangeText={setWeight}
                  />
                </View>
              </>
            )}
            <View style={styles.settingRow}>
              <Text style={styles.settingText}>Show RPE</Text>
              <Switch value={showRPE} onValueChange={setShowRPE} />
            </View>
            {showRPE && (
              <View style={styles.settingRow}>
                <TextInput
                  style={styles.input}
                  placeholder="Enter RPE"
                  keyboardType="numeric"
                  value={rpe}
                  onChangeText={setRPE}
                />
              </View>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  topBarContainer: {
    marginTop: 100, // Shift everything down by 100 pixels
  },
  topBar: {
    height: 60,
    width: '100%',
    backgroundColor: 'black',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 5,
  },
  topButton: {
    padding: 10,
  },
  exportButtonText: {
    color: 'lightblue',
    fontSize: 20,
    marginLeft: 10,
  },
  videoContainer: {
    width: '100%',
    height: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
    borderColor: 'lightgray', // Add light gray outline
    borderWidth: 1, // Width of the outline
  },
  video: {
    width: '100%',
    height: '100%',
  },
  watermarkContainer: {
    position: 'absolute',
    top: 10,
    left: 10,
  },
  watermark: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  controlBar: {
    height: 50,
    width: '100%',
    backgroundColor: 'black',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  controlButton: {
    padding: 10,
  },
  errorText: {
    color: 'red',
    fontSize: 18,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  doneButton: {
    padding: 10,
  },
  doneButtonText: {
    color: 'blue',
    fontSize: 16,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  settingText: {
    fontSize: 16,
  },
  optionButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 5,
    marginHorizontal: 5,
  },
  optionButtonSelected: {
    backgroundColor: 'black',
    color: 'white',
  },
  optionButtonText: {
    color: 'black',
  },
  input: {
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 5,
    padding: 5,
    width: '100%',
  },
  circle: {
    position: 'absolute',
    width: 30, // Smaller circle
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderColor: 'white',
    borderWidth: 2,
  },
  magnifierContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  magnifier: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: 'hidden',
    borderColor: 'white',
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  magnifiedAreaContainer: {
    width: '200%',
    height: '200%',
  },
  magnifiedArea: {
    position: 'absolute',
    width: width * 2, // Increase size for zoom effect
    height: height * 2,
  },
  canvas: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
  line: {
    position: 'absolute',
    height: 2,
    backgroundColor: 'white',
  },
});