import React from 'react';
import { Container, Title, Text, Button, Group, Paper, Stack } from '@mantine/core';
import { useAuth } from '../contexts/AuthContext';

export const DashboardPage: React.FC = () => {
  const { state, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <Container size="md" px="md" py="xl">
      <Paper shadow="sm" p={{ base: 'md', sm: 'xl' }} radius="md">
        <Stack gap="xl">
          <Group justify="space-between" align="flex-start" wrap="wrap">
            <div>
              <Title order={1} mb="md">
                Welcome to Gourmoire!
              </Title>
              <Text size="lg" c="dimmed">
                Hello, {state.user?.username}! 👋
              </Text>
            </div>
            <Button variant="outline" color="red" onClick={handleLogout} size="sm">
              Logout
            </Button>
          </Group>

          <Paper withBorder p="md" radius="sm">
            <Title order={3} mb="sm">
              Your Account Information
            </Title>
            <Stack gap="xs">
              <Text><strong>Username:</strong> {state.user?.username}</Text>
              <Text><strong>Email:</strong> {state.user?.email}</Text>
              <Text><strong>User ID:</strong> {state.user?.id}</Text>
              <Text><strong>Member since:</strong> {
                state.user?.createdAt 
                  ? new Date(state.user.createdAt).toLocaleDateString()
                  : 'Unknown'
              }</Text>
            </Stack>
          </Paper>

          <Paper withBorder p="md" radius="sm">
            <Title order={3} mb="sm">
              Getting Started
            </Title>
            <Text mb="md">
              Welcome to your recipe management dashboard! Here are some things you can do:
            </Text>
            <Stack gap="xs">
              <Text>• Create and organize your favorite recipes</Text>
              <Text>• Share recipes with friends and family</Text>
              <Text>• Plan your meals for the week</Text>
              <Text>• Generate shopping lists from your recipes</Text>
            </Stack>
          </Paper>
        </Stack>
      </Paper>
    </Container>
  );
};