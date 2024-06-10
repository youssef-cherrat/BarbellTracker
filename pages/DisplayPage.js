import React, { useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';

export default function DisplayPage() {
  const [videoUri, setVideoUri] = useState(null);
  const navigation = useNavigation();

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
        // Extract the uri from the assets array
        const uri = result.assets && result.assets.length > 0 ? result.assets[0].uri : null;
        setVideoUri(uri);
        console.log("Navigating to EditVideo with URI:", uri);
        navigation.navigate('EditVideo', { videoUri: uri });
      } else {
        console.log("User cancelled the picker");
      }
    } catch (error) {
      console.error("Error picking video: ", error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.uploadContainer}>
        <Text style={styles.instructions}>Upload a video to get started</Text>
        <Button title="Upload Video" onPress={pickVideo} />
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
  uploadContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  instructions: {
    fontSize: 18,
    marginBottom: 10,
  },
});
