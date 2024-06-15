import React, { useEffect, useRef } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import { Video } from 'expo-av';
import Canvas from 'react-native-canvas';

export default function ExportPage({ route, navigation }) {
    const { videoUri, showDate, showWeight, weight, weightUnit, showRPE, rpe, motionPath } = route.params;
    const canvasRef = useRef(null);

    useEffect(() => {
        (async () => {
            const { status } = await MediaLibrary.requestPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission required', 'Please grant camera roll permissions in your settings.');
            }
        })();
    }, []);

    const saveToCameraRoll = async () => {
        try {
            await MediaLibrary.saveToLibraryAsync(videoUri);
            Alert.alert('Success', 'Video saved to camera roll!');
        } catch (error) {
            Alert.alert('Error', 'Failed to save video to camera roll.');
        }
    };

    const currentDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    const drawPath = (canvas) => {
        if (canvas) {
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.beginPath();
            ctx.strokeStyle = 'red';
            ctx.lineWidth = 2;

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

    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            const resizeCanvas = () => {
                canvas.width = canvas.offsetWidth;
                canvas.height = canvas.offsetHeight;
                drawPath(canvas);
            };
            resizeCanvas();
            window.addEventListener('resize', resizeCanvas);
            return () => {
                window.removeEventListener('resize', resizeCanvas);
            };
        }
    }, [motionPath]);

    return (
        <View style={styles.container}>
            <View style={styles.videoContainer}>
                <Video
                    source={{ uri: videoUri }}
                    style={styles.video}
                    useNativeControls
                    resizeMode="contain"
                    isLooping
                />
                <View style={styles.watermarkContainer}>
                    {showDate && <Text style={styles.watermark}>{currentDate}</Text>}
                    {showWeight && weight !== '' && (
                        <Text style={styles.watermark}>{`${weight} ${weightUnit}`}</Text>
                    )}
                    {showRPE && rpe !== '' && <Text style={styles.watermark}>{`RPE: ${rpe}`}</Text>}
                </View>
                <Canvas ref={canvasRef} style={styles.canvas} />
            </View>
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
    videoContainer: {
        width: '100%',
        height: '50%',
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
    canvas: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 10,
    },
});
