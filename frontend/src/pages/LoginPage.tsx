import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Center, Stack, Title, Text } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { LoginForm } from '../components/LoginForm';
import { useAuth } from '../contexts/AuthContext';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = useAuth();

  // Get the intended destination or default to dashboard
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/dashboard';

  // Redirect if already authenticated
  useEffect(() => {
    if (state.isAuthenticated && !state.isLoading) {
      navigate(from, { replace: true });
    }
  }, [state.isAuthenticated, state.isLoading, navigate, from]);

  const handleLoginSuccess = () => {
    notifications.show({
      title: 'Welcome!',
      message: 'You have successfully logged in.',
      color: 'green',
    });
    
    // Navigate to intended destination
    navigate(from, { replace: true });
  };

  const handleLoginError = (error: string) => {
    notifications.show({
      title: 'Login Failed',
      message: error,
      color: 'red',
    });
  };

  // Show loading state while checking authentication
  if (state.isLoading) {
    return (
      <Center h="100vh">
        <Stack align="center" gap="md">
          <Title order={3}>Loading...</Title>
          <Text c="dimmed">Checking your session...</Text>
        </Stack>
      </Center>
    );
  }

  // Don't render login form if already authenticated
  if (state.isAuthenticated) {
    return null;
  }

  return (
    <Center h="100vh" bg="gray.0">
      <LoginForm 
        onSuccess={handleLoginSuccess}
        onError={handleLoginError}
      />
    </Center>
  );
};