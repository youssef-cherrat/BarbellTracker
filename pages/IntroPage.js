import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function IntroPage({ navigation }) {
  return (
    <View style={styles.container}>
      <Text>Welcome to the Barbell Tracker App</Text>
      <Button
        title="Go to Upload Page"
        onPress={() => navigation.navigate('Upload')}
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
});
