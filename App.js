import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Modal, Text, StyleSheet, Linking } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import IntroPage from './pages/IntroPage';
import DisplayPage from './pages/DisplayPage';
import ExportPage from './pages/ExportPage';
import EditVideoPage from './pages/EditVideoPage';
import AnimatedSplashScreen from './pages/AnimatedSplashScreen';
import Ionicons from '@expo/vector-icons/Ionicons';

const Stack = createNativeStackNavigator();

export default function App() {
  const [isAppReady, setIsAppReady] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAppReady(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleEmailPressJ = () => {
    Linking.openURL('mailto:jja3em@virginia.edu');
  };

  const handleEmailPressM = () => {
    Linking.openURL('mailto:vnc9uv@virginia.edu');
  };

  const handleEmailPressI = () => {
    Linking.openURL('mailto:vnc9uv@virginia.edu');
  };

  if (!isAppReady) {
    return <AnimatedSplashScreen />;
  }

  return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Intro">
          <Stack.Screen
              name="Intro"
              component={IntroPage}
              options={{
                headerLeft: () => (
                    <TouchableOpacity onPress={() => Linking.openURL('https://github.com/youssef-cherrat/BarbellTracker')}>
                      <Ionicons name="logo-github" size={32} color="black" style={{ marginLeft: 10 }} />
                    </TouchableOpacity>
                ),
                headerRight: () => (
                    <TouchableOpacity onPress={() => setModalVisible(true)}>
                      <Ionicons name="information-circle" size={32} color="black" style={{ marginRight: 10 }} />
                    </TouchableOpacity>
                ),
                title: 'Home'
              }}
          />
          <Stack.Screen
              name="Upload"
              component={DisplayPage}
          />
          <Stack.Screen
              name="EditVideo"
              component={EditVideoPage}
              options={{ headerShown: false }}
          />
          <Stack.Screen name="Video" component={ExportPage} />
        </Stack.Navigator>

        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              setModalVisible(!modalVisible);
            }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>Contact Us</Text>
              <Text style={styles.contactText}>Youssef Cherrat</Text>
              <TouchableOpacity onPress={handleEmailPressJ} style={styles.emailContainer}>
                <Text style={styles.contactText}>Email: </Text>
                <Text style={[styles.contactText, { color: 'blue', textDecorationLine: 'underline' }]}>jja3em@virginia.edu</Text>
              </TouchableOpacity>
              <Text style={styles.contactText}>Minahal Aisha</Text>
              <TouchableOpacity onPress={handleEmailPressM} style={styles.emailContainer}>
                <Text style={styles.contactText}>Email: </Text>
                <Text style={[styles.contactText, { color: 'blue', textDecorationLine: 'underline' }]}>vnc9uv@virginia.edu</Text>
              </TouchableOpacity>
              <Text style={styles.contactText}>Yoon Lee</Text>
              <TouchableOpacity onPress={handleEmailPressI} style={styles.emailContainer}>
                <Text style={styles.contactText}>Email: </Text>
                <Text style={[styles.contactText, { color: 'blue', textDecorationLine: 'underline' }]}>fnb5ww@virginia.edu</Text>
              </TouchableOpacity>
              <TouchableOpacity
                  style={[styles.button, styles.buttonClose]}
                  onPress={() => setModalVisible(!modalVisible)}
              >
                <Text style={styles.textStyle}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 20,
    fontWeight: 'bold'
  },
  contactText: {
    marginBottom: 10,
    textAlign: "center",
    fontSize: 16
  },
  emailContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  }
});
