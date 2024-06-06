import React from 'react';
import { View, StyleSheet, Text, Dimensions } from 'react-native';
import { Video } from 'expo-av';

const { width } = Dimensions.get('window');

export default function ExportPage({ route }) {
  const { videoUri, showDate, showWeight, weight, weightUnit, showRPE, rpe } = route.params;

  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <View style={styles.container}>
      <Video
        source={{ uri: videoUri }}
        style={styles.video}
        useNativeControls
        resizeMode="contain"
        isLooping={false}
      />
      <View style={styles.watermarkContainer}>
        {showDate && <Text style={styles.watermark}>{currentDate}</Text>}
        {showWeight && weight !== '' && (
          <Text style={styles.watermark}>{`${weight} ${weightUnit}`}</Text>
        )}
        {showRPE && rpe !== '' && <Text style={styles.watermark}>{`RPE: ${rpe}`}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
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
});
