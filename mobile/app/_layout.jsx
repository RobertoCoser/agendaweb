import React, { useEffect } from 'react';
import { Slot, useRouter, useSegments } from 'expo-router';
import { AuthProvider, useAuth } from './context/AuthContext';

const InitialLayout = () => {
    const { token, isLoading } = useAuth();
    const segments = useSegments();
    const router = useRouter();

    useEffect(() => {
        if (isLoading) return;

        const inAuthGroup = segments[0] === '(auth)';

        if (token && inAuthGroup) {
            router.replace('/');
        } else if (!token && !inAuthGroup) {
            router.replace('/login');
        }
    }, [token, isLoading, segments]);

    if (isLoading) {
        return null;
    }

    return <Slot />;
};

const RootLayout = () => {
    return (
        <AuthProvider>
            <InitialLayout />
        </AuthProvider>
    );
};

export default RootLayout;