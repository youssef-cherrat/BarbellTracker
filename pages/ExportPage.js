import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function ExportPage({ navigation }) {
  return (
    <View style={styles.container}>
      <Text>Export your photos or videos here.</Text>
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
});
