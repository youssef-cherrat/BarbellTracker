import React, { useRef, useEffect, useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Dimensions, Modal, Switch, TextInput, Image } from 'react-native';
import { Video } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Canvas from 'react-native-canvas';

const { width, height } = Dimensions.get('window');

export default function EditVideoPage({ route }) {
  const { videoUri } = route.params || {};
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
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
  const [motionPath, setMotionPath] = useState([]);
  const [frameInterval, setFrameInterval] = useState(5);
  const [pathColor, setPathColor] = useState('red');
  const [currentFrame, setCurrentFrame] = useState(0);
  const [showBestFit, setShowBestFit] = useState(false);
  const [bestFitInfo, setBestFitInfo] = useState({ slope: 0, intercept: 0 });

  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (canvas) {
        canvas.width = width;
        canvas.height = height;
        drawPath(canvas);
      }
    };

    handleResize();
    Dimensions.addEventListener('change', handleResize);

    return () => {
      //Dimensions.removeEventListener('change', handleResize);
    };
  }, [width, height]);

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

  const rewind = async () => {
    if (videoRef.current) {
      const status = await videoRef.current.getStatusAsync();
      await videoRef.current.setPositionAsync(Math.max(status.positionMillis - 1000, 0));
    }
  };

  const forward = async () => {
    if (videoRef.current) {
      const status = await videoRef.current.getStatusAsync();
      await videoRef.current.setPositionAsync(status.positionMillis + 500);
    }
  };

  const undoLastDot = () => {
    if (motionPath.length > 0) {
      const newMotionPath = [...motionPath];
      newMotionPath.pop();
      setMotionPath(newMotionPath);
    }
  };
  const setPlaybackSpeed = async (speed) => {
    if (videoRef.current) {
      try {
        await videoRef.current.setRateAsync(speed, true);
      } catch (error) {
        console.error('Error setting playback speed:', error);
      }
    }
  };

  const handleVideoPress = async (evt) => {
    const newX = evt.nativeEvent.locationX;
    const newY = evt.nativeEvent.locationY;
    setMotionPath((prevPath) => [...prevPath, { x: newX, y: newY, id: prevPath.length + 1 }]);

    try {
      //
    } catch (error) {
      console.error('Error updating video position:', error);
    }
  };

  const drawPath = (canvas) => {
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.beginPath();
      ctx.strokeStyle = pathColor;
      // ctx.fillStyle = pathColor;
      // ctx.font = '14px Arial';
      ctx.lineWidth = 2;

      motionPath.forEach((point, index) => {
        if (index === 0) {
          ctx.moveTo(point.x, point.y);
        } else {
          // ctx.lineTo(motionPath[index - 1 ].x, motionPath[index - 1].y);
          ctx.lineTo(point.x, point.y);
        }
      });
      ctx.stroke();
      if (showBestFit) {
        drawLineOfBestFit(ctx, motionPath);
      }
    }
  };

  const drawLineOfBestFit = (ctx, points) => {
    if (points.length < 2) return;
    const { slope, intercept } = calculateLineOfBestFit(points);
    const startX = 0;
    const endX = width;
    const startY = slope * startX + intercept;
    const endY = slope * endX + intercept;

    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.strokeStyle = 'blue';
    ctx.lineWidth = 1;
    ctx.stroke();

    setBestFitInfo({ slope, intercept });
  };

  const calculateLineOfBestFit = (points) => {
    const n = points.length;
    let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;

    points.forEach(point => {
      sumX += point.x;
      sumY += point.y;
      sumXY += point.x * point.y;
      sumXX += point.x * point.x;
    });

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    return { slope, intercept };
  };

  useEffect(() => {
    drawPath(canvasRef.current);
  }, [motionPath, showBestFit]);

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
                    navigation.navigate('Video', {
                      videoUri,
                      showDate,
                      showWeight,
                      weight,
                      weightUnit,
                      showRPE,
                      rpe,
                      motionPath,
                      bestFitInfo,
                    })
                }
                style={styles.topButton}
            >
              <Text style={styles.exportButtonText}>Video</Text>
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
                  onLoad={() => setPlaybackSpeed(0.25)}
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
          <Canvas ref={canvasRef} style={styles.canvas} />
          {motionPath.map((point, index) => (
              <View
                  key={index}
                  style={[
                    styles.circle,
                    {
                      left: point.x - 15,
                      top: point.y - 15,
                    },
                  ]}
              >
                <Text style={styles.circleText}>{point.id}</Text>
              </View>
          ))}
        </View>

        <View style={styles.controlBar}>
          <TouchableOpacity onPress={undoLastDot} style={styles.controlButton}>
            <Ionicons name="arrow-undo" size={32} color="white" />
          </TouchableOpacity>
          <TouchableOpacity onPress={togglePlayPause} style={styles.controlButton}>
            <Ionicons name={isPlaying ? 'pause' : 'play'} size={32} color="white" />
          </TouchableOpacity>
          <TouchableOpacity onPress={forward} style={styles.controlButton}>
            <Ionicons name="arrow-redo" size={32} color="white" />
          </TouchableOpacity>
        </View>
        <View style={styles.controlBar}>
          <TouchableOpacity onPress={rewind} style={styles.controlButton}>
            <Ionicons name="play-back" size={32} color="white" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShowBestFit(!showBestFit)} style={styles.controlButton}>
            <Image source={require('../assets/chart.png')} style={styles.chartIcon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={forward} style={styles.controlButton}>
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
        <Modal
            visible={showSearchSettings}
            animationType="slide"
            transparent={true}
            onRequestClose={() => setShowSearchSettings(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Bar Tracker Settings</Text>
                <TouchableOpacity onPress={() => setShowSearchSettings(false)} style={styles.doneButton}>
                  <Text style={styles.doneButtonText}>Done</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.settingRow}>
                <Text style={styles.settingText}>Frame Interval</Text>
                <TextInput
                    style={styles.smallInput}
                    keyboardType="numeric"
                    value={frameInterval.toString()}
                    onChangeText={(text) => setFrameInterval(Number(text))}
                />
              </View>
              <View style={styles.settingRow}>
                <Text style={styles.settingText}>Path Color</Text>
                <TouchableOpacity
                    style={[
                      styles.colorOptionButton,
                      { backgroundColor: 'red' },
                      pathColor === 'red' && styles.colorOptionButtonSelected
                    ]}
                    onPress={() => setPathColor('red')}
                >
                  <Text style={styles.colorOptionButtonText}>Red</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[
                      styles.colorOptionButton,
                      { backgroundColor: 'white' },
                      pathColor === 'white' && styles.colorOptionButtonSelected
                    ]}
                    onPress={() => setPathColor('white')}
                >
                  <Text style={styles.colorOptionButtonText}>White</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
        {showBestFit && (
            <View style={styles.bestFitInfo}>
              <Text style={styles.bestFitText}>Slope: {bestFitInfo.slope.toFixed(2)}</Text>
              <Text style={styles.bestFitText}>Intercept: {bestFitInfo.intercept.toFixed(2)}</Text>
            </View>
        )}
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  topBarContainer: {
    marginTop: 100,
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
    borderColor: 'lightgray',
    borderWidth: 1,
    position: 'relative',
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
  chartIcon: {
    width: 32,
    height: 32,
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
  smallInput: {
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 5,
    padding: 5,
    width: 50,
  },
  colorOptionButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 5,
    marginHorizontal: 5,
  },
  colorOptionButtonSelected: {
    borderWidth: 2,
    borderColor: 'blue',
  },
  colorOptionButtonText: {
    color: 'black',
    fontWeight: 'bold',
  },
  circle: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderColor: 'white',
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleText: {
    color: 'white',
    fontWeight: 'bold',
  },
  canvas: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 10,
  },
  bestFitInfo: {
    position: 'absolute',
    bottom: 10,
    left: '45%',
    transform: [{ translateX: -50 }],
    alignItems: 'center',
    height: 100,
  },
  bestFitText: {
    color: 'white',
    font: 'Times New Roman',
    fontSize: 17,
    fontWeight: 'bold',
  },
});