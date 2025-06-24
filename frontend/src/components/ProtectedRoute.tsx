import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Center, Stack, Title, Text, Loader } from '@mantine/core';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { state } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (state.isLoading) {
    return (
      <Center h="100vh">
        <Stack align="center" gap="md">
          <Loader size="xl" />
          <Title order={3}>Loading...</Title>
          <Text c="dimmed">Verifying your session...</Text>
        </Stack>
      </Center>
    );
  }

  // Redirect to login if not authenticated
  if (!state.isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Render protected content
  return <>{children}</>;
};