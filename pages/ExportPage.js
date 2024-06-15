import React, { useEffect, useRef } from 'react';
import { View, Text, Button, StyleSheet, Alert, Dimensions } from 'react-native';
import { Video } from 'expo-av';
import Canvas from 'react-native-canvas';

const { width, height } = Dimensions.get('window');

export default function ExportPage({ route, navigation }) {
    const { videoUri, showDate, showWeight, weight, weightUnit, showRPE, rpe, motionPath } = route.params;
    const canvasRef = useRef(null);
    const videoRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            canvas.width = width;
            canvas.height = height / 2; // Set canvas height to match the video container
            drawPath(canvas);
        }
    }, [motionPath]);

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
            canvas.width = width;
            canvas.height = height / 2; // Set canvas height to match the video container
            drawPath(canvas);
        }
    }, [motionPath]);

    return (
        <View style={styles.container}>
            <View style={styles.videoContainer}>
                <Video
                    ref={videoRef}
                    source={{ uri: videoUri }}
                    style={styles.video}
                    useNativeControls
                    resizeMode="contain"
                    isLooping
                    shouldPlay // This will ensure the video starts playing immediately
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
            <Text style={styles.note}>
                Use your device's screen recording feature to save the video with the overlay.
            </Text>
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
    note: {
        margin: 20,
        fontSize: 16,
        textAlign: 'center',
        color: 'gray',
    },
});
