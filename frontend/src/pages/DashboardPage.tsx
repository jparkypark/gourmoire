import React from 'react';
import { Container, Title, Text, Button, Paper, Stack } from '@mantine/core';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { PageHeader } from '../components/PageHeader';

export const DashboardPage: React.FC = () => {
  const { state } = useAuth();

  return (
    <Container size="md" px="md" py="xl">
      <PageHeader currentPage="dashboard" />
      
      <Paper shadow="sm" p={{ base: 'md', sm: 'xl' }} radius="md">
        <Stack gap="xl">
          <div>
            <Title order={1} mb="md">
              Welcome to Gourmoire!
            </Title>
            <Text size="lg" c="dimmed">
              Hello, {state.user?.username}!
            </Text>
          </div>

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
            <Stack gap="sm" mb="lg">
              <Text>• Create and organize your favorite recipes</Text>
              <Text>• Share recipes with friends and family</Text>
              <Text>• Plan your meals for the week</Text>
              <Text>• Generate shopping lists from your recipes</Text>
            </Stack>
            
            <Button component={Link} to="/recipes" mt="md">
              View My Recipes
            </Button>
          </Paper>
        </Stack>
      </Paper>
    </Container>
  );
};