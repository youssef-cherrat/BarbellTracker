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
  const [showSearchSettings, setShowSearchSettings] = useState(false);
  const [showDate, setShowDate] = useState(false);
  const [showWeight, setShowWeight] = useState(false);
  const [weightUnit, setWeightUnit] = useState('LB');
  const [weight, setWeight] = useState('');
  const [showRPE, setShowRPE] = useState(false);
  const [rpe, setRPE] = useState('');
  const [circleVisible, setCircleVisible] = useState(false);
  const [circlePosition, setCirclePosition] = useState({ x: width / 2, y: height / 4 });
  const [motionPath, setMotionPath] = useState([]);
  const [frameInterval, setFrameInterval] = useState(5);
  const [pathColor, setPathColor] = useState('red');
  const [currentFrame, setCurrentFrame] = useState(0);

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

  const undoLastDot = () => {
    if (motionPath.length > 0) {
      const newMotionPath = [...motionPath];
      const lastDot = newMotionPath.pop();
      setUndoStack((prevStack) => [...prevStack, lastDot]);
      setMotionPath(newMotionPath);
    }
  };
  
  const redoLastUndo = () => {
    if (undoStack.length > 0) {
      const newUndoStack = [...undoStack];
      const lastUndo = newUndoStack.pop();
      setRedoStack((prevStack) => [...prevStack, lastUndo]);
      setMotionPath((prevPath) => [...prevPath, lastUndo]);
    }
  };

  const handleVideoPress = async (evt) => {
    const newX = evt.nativeEvent.locationX;
    const newY = evt.nativeEvent.locationY;
    setCirclePosition({ x: newX, y: newY });
    setMotionPath((prevPath) => [...prevPath, { x: newX, y: newY }]);
  
    const status = await videoRef.current.getStatusAsync();
    const newPosition = status.positionMillis + frameInterval * 1000 / 24;
    await videoRef.current.setPositionAsync(newPosition);
    setCurrentFrame(currentFrame + frameInterval);
  };
  

  const drawPath = (canvas) => {
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = pathColor;
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
          <TouchableOpacity onPress={() => setShowSearchSettings(true)} style={styles.topButton}>
            <Ionicons name="barbell" size={32} color="white" />
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
      <View style={styles.videoContainer} onTouchEnd={handleVideoPress}>
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
        <Canvas ref={drawPath} style={styles.canvas} />
      </View>

      <View style={styles.controlBar}>
        <TouchableOpacity onPress={undoLastDot} style={styles.controlButton}>
          <Ionicons name="arrow-undo" size={32} color="white" />
        </TouchableOpacity>
        <TouchableOpacity onPress={togglePlayPause} style={styles.controlButton}>
          <Ionicons name={isPlaying ? 'pause' : 'play'} size={32} color="white" />
        </TouchableOpacity>
        <TouchableOpacity onPress={redoLastUndo} style={styles.controlButton}>
          <Ionicons name="arrow-redo" size={32} color="white" />
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
      <Modal
        visible={showSearchSettings}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowSearchSettings(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Search Settings</Text>
              <TouchableOpacity onPress={() => setShowSearchSettings(false)} style={styles.doneButton}>
                <Text style={styles.doneButtonText}>Done</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.settingRow}>
              <Text style={styles.settingText}>Frame Interval</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={frameInterval.toString()}
                onChangeText={(text) => setFrameInterval(Number(text))}
              />
            </View>
            <View style={styles.settingRow}>
              <Text style={styles.settingText}>Path Color</Text>
              <TextInput
                style={styles.input}
                value={pathColor}
                onChangeText={setPathColor}
              />
            </View>
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
