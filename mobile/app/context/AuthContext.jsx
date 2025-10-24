import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../../config';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadTokenFromStorage = async () => {
            try {
                const storedToken = await AsyncStorage.getItem('token');
                if (storedToken) {
                    setToken(storedToken);
                    axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
                }
            } catch (e) {
                console.error("Falha ao carregar o token", e);
            } finally {
                setIsLoading(false);
            }
        };

        loadTokenFromStorage();
    }, []);

    const login = async (email, password) => {
        const response = await axios.post(`${API_BASE_URL}/login`, { email, password });
        const newToken = response.data.token;
        setToken(newToken);
        axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
        await AsyncStorage.setItem('token', newToken);
    };

    const register = async (email, password) => {
        await axios.post(`${API_BASE_URL}/register`, { email, password });
    };

    const logout = async () => {
        setToken(null);
        delete axios.defaults.headers.common['Authorization'];
        await AsyncStorage.removeItem('token');
    };

    return (
        <AuthContext.Provider value={{ token, login, register, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};