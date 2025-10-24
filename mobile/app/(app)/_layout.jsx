import React from 'react';
import { Tabs, useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import { useAuth } from '../context/AuthContext';

const AppLayout = () => {
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#3b82f6',
        tabBarInactiveTintColor: '#6b7280',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Calendário',
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="calendar" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="tasks"
        options={{
          title: 'Lista de Tarefas',
          headerTitleAlign: 'center',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="list" size={size} color={color} />
          ),
          headerRight: () => (
            <TouchableOpacity onPress={() => router.push({ pathname: '/tasks', params: { openModal: 'true' } })} style={{ marginRight: 15 }}>
              <FontAwesome name="plus" size={22} color="#3b82f6" />
            </TouchableOpacity>
          ),
          headerLeft: () => (
            <TouchableOpacity onPress={handleLogout} style={{ marginLeft: 15 }}>
              <FontAwesome name="sign-out" size={24} color="#dc3545" />
            </TouchableOpacity>
          ),
        }}
      />
    </Tabs>
  );
};

export default AppLayout;