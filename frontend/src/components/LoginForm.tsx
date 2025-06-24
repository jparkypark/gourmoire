import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  TextInput,
  PasswordInput,
  Button,
  Paper,
  Title,
  Text,
  Container,
  Alert,
  Stack,
  Checkbox,
  Group,
  LoadingOverlay,
} from '@mantine/core';
import { useAuth } from '../contexts/AuthContext';
import type { LoginRequest } from '../../../shared/types';

// Validation schema
const loginSchema = z.object({
  username: z.string()
    .min(1, 'Username is required')
    .min(3, 'Username must be at least 3 characters')
    .max(50, 'Username must be less than 50 characters'),
  password: z.string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters')
    .max(100, 'Password must be less than 100 characters'),
  rememberMe: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface LoginFormProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSuccess, onError }) => {
  const { login, state } = useAuth();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setSubmitError(null);

    try {
      const loginRequest: LoginRequest = {
        username: data.username,
        password: data.password,
        rememberMe: data.rememberMe,
      };

      const response = await login(loginRequest);

      if (response.success) {
        reset();
        onSuccess?.();
      } else {
        const errorMessage = response.error || response.message || 'Login failed';
        setSubmitError(errorMessage);
        onError?.(errorMessage);
      }
    } catch {
      const errorMessage = 'An unexpected error occurred. Please try again.';
      setSubmitError(errorMessage);
      onError?.(errorMessage);
    }
  };

  const rememberMeValue = watch('rememberMe');

  return (
    <Container size={420} px="md" my={40}>
      <Paper withBorder shadow="md" p={{ base: 20, sm: 30 }} mt={30} radius="md" pos="relative">
        <LoadingOverlay 
          visible={state.isLoading || isSubmitting} 
          overlayProps={{ radius: 'md' }}
        />
        
        <Title ta="center" order={2} mb="md">
          Welcome to Gourmoire
        </Title>
        
        <Text c="dimmed" size="sm" ta="center" mb={20}>
          Sign in to your account to continue
        </Text>

        {submitError && (
          <Alert 
            color="red" 
            mb="md"
            title="Login Failed"
            onClose={() => setSubmitError(null)}
            withCloseButton
          >
            {submitError}
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack gap="md">
            <TextInput
              label="Username"
              placeholder="Enter your username"
              required
              {...register('username')}
              error={errors.username?.message}
              disabled={isSubmitting}
            />

            <PasswordInput
              label="Password"
              placeholder="Enter your password"
              required
              {...register('password')}
              error={errors.password?.message}
              disabled={isSubmitting}
            />

            <Group justify="space-between" mt="md">
              <Checkbox
                label="Remember me"
                {...register('rememberMe')}
                checked={rememberMeValue}
                disabled={isSubmitting}
              />
              
              <Text 
                component="a" 
                href="#" 
                size="sm" 
                c="dimmed"
                td="underline"
                onClick={(e) => {
                  e.preventDefault();
                  // TODO: Implement forgot password functionality
                  console.log('Forgot password clicked');
                }}
              >
                Forgot password?
              </Text>
            </Group>

            <Button
              type="submit"
              fullWidth
              mt="md"
              loading={isSubmitting}
              disabled={state.isLoading}
            >
              Sign In
            </Button>
          </Stack>
        </form>

        <Text ta="center" mt="md" size="sm" c="dimmed">
          Don't have an account?{' '}
          <Text 
            component="a" 
            href="#" 
            c="blue" 
            td="underline"
            onClick={(e) => {
              e.preventDefault();
              // TODO: Navigate to registration page
              console.log('Create account clicked');
            }}
          >
            Create one here
          </Text>
        </Text>
      </Paper>
    </Container>
  );
};