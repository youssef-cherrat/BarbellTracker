import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import { Video } from 'expo-av';
import { RNFFmpeg } from 'react-native-ffmpeg';

export default function ExportPage({ route, navigation }) {
    const { videoUri, showDate, showWeight, weight, weightUnit, showRPE, rpe } = route.params;
    const [processing, setProcessing] = useState(false);
    const [processedVideoUri, setProcessedVideoUri] = useState(null);

    useEffect(() => {
        (async () => {
            const { status } = await MediaLibrary.requestPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission required', 'Please grant camera roll permissions in your settings.');
            }
        })();

        if (videoUri) {
            processVideo();
        }
    }, [videoUri]);

    const processVideo = async () => {
        setProcessing(true);

        const currentDate = new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });

        let filters = '';

        if (showDate) {
            filters += `drawtext=text='${currentDate}':x=10:y=10:fontsize=24:fontcolor=white,`;
        }
        if (showWeight && weight !== '') {
            filters += `drawtext=text='${weight} ${weightUnit}':x=10:y=40:fontsize=24:fontcolor=white,`;
        }
        if (showRPE && rpe !== '') {
            filters += `drawtext=text='RPE: ${rpe}':x=10:y=70:fontsize=24:fontcolor=white,`;
        }

        if (filters.endsWith(',')) {
            filters = filters.slice(0, -1); // Remove the trailing comma
        }

        const outputUri = `${RNFFmpeg.getFFmpegDir()}/output.mp4`;

        const command = `-i ${videoUri} -vf "${filters}" -codec:a copy ${outputUri}`;

        const result = await RNFFmpeg.execute(command);

        if (result.returnCode === 0) {
            setProcessedVideoUri(outputUri);
        } else {
            Alert.alert('Error', 'Failed to process the video.');
        }

        setProcessing(false);
    };

    const saveToCameraRoll = async () => {
        try {
            await MediaLibrary.saveToLibraryAsync(processedVideoUri || videoUri);
            Alert.alert('Success', 'Video saved to camera roll!');
        } catch (error) {
            Alert.alert('Error', 'Failed to save video to camera roll.');
        }
    };

    if (processing) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text>Processing video...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Video
                source={{ uri: processedVideoUri || videoUri }}
                style={styles.video}
                useNativeControls
                resizeMode="contain"
                isLooping
            />
            <Button title="Save to Camera Roll" onPress={saveToCameraRoll} />
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
        width: '100%',
        height: '50%',
    },
});
