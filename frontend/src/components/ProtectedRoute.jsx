import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ProtectedRoute() {
    const { token, loading } = useAuth();

    // Enquanto estiver verificando o token, não mostra nada (ou mostra um spinner)
    if (loading) {
        return null;
    }

    // Se não tiver token, manda para o Login
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // Se tiver token, mostra o conteúdo (Calendário/Tarefas)
    return <Outlet />;
}

export default ProtectedRoute;