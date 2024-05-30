import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { Video } from 'expo-av';

export default function ExportPage({ route, navigation }) {
  const { videoUri } = route.params;

  return (
    <View style={styles.container}>
      <Text>Export your photos or videos here.</Text>
      {videoUri && (
        <Video
          source={{ uri: videoUri }}
          style={styles.video}
          useNativeControls
          resizeMode="contain"
          isLooping
        />
      )}
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
    alignSelf: 'center',
    width: 350,
    height: 220,
  },
});