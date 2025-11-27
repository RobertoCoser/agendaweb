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

  // Componente do botão "Adicionar"
  const AddButton = ({ routeName }) => (
    <TouchableOpacity
      onPress={() => router.push({ pathname: routeName, params: { openModal: 'true' } })}
      style={{ marginRight: 15 }}
    >
      <FontAwesome name="plus" size={22} color="#3b82f6" />
    </TouchableOpacity>
  );

  // Componente do botão "Sair"
  const LogoutButton = () => (
    <TouchableOpacity onPress={handleLogout} style={{ marginLeft: 15 }}>
      <FontAwesome name="sign-out" size={24} color="#dc3545" />
    </TouchableOpacity>
  );

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#3b82f6',
        tabBarInactiveTintColor: '#6b7280',
        headerTitleAlign: 'center',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Calendário',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="calendar" size={size} color={color} />
          ),
          headerRight: () => <AddButton routeName="/" />,
          headerLeft: () => <LogoutButton />,
        }}
      />
      <Tabs.Screen
        name="tasks"
        options={{
          title: 'Lista de Tarefas',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="list" size={size} color={color} />
          ),
          headerRight: () => <AddButton routeName="/tasks" />,
          headerLeft: () => <LogoutButton />,
        }}
      />
    </Tabs>
  );
};

export default AppLayout;