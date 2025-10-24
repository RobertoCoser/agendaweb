import React, { useState, useEffect } from 'react';
import { Animated, Text, StyleSheet, SafeAreaView } from 'react-native';

const Notification = ({ message }) => {
    const fadeAnim = useState(new Animated.Value(0))[0];

    useEffect(() => {
        if (message) {
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }).start();

            const timer = setTimeout(() => {
                Animated.timing(fadeAnim, {
                    toValue: 0,
                    duration: 500,
                    useNativeDriver: true,
                }).start();
            }, 2500);

            return () => clearTimeout(timer);
        }
    }, [message]);

    if (!message) {
        return null;
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
                <Text style={styles.text}>{message}</Text>
            </Animated.View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
    },
    container: {
        backgroundColor: '#198754',
        padding: 15,
        margin: 10,
        borderRadius: 8,
        alignItems: 'center',
    },
    text: {
        color: 'white',
        fontWeight: 'bold',
    },
});

export default Notification;