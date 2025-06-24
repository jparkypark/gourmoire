import { Group, Button, Text } from '@mantine/core';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface PageHeaderProps {
  showNavigation?: boolean;
  currentPage?: 'dashboard' | 'recipes' | 'recipe-form';
}

export function PageHeader({ showNavigation = true, currentPage }: PageHeaderProps) {
  const { state, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <Group justify="space-between" mb="md">
      <Group>
        {showNavigation && (
          <>
            {currentPage !== 'dashboard' && (
              <Button variant="subtle" component={Link} to="/dashboard" size="sm">
                Dashboard
              </Button>
            )}
            {currentPage !== 'recipes' && (
              <Button variant="subtle" component={Link} to="/recipes" size="sm">
                My Recipes
              </Button>
            )}
          </>
        )}
        <Text c="dimmed">Hello, {state.user?.username}!</Text>
      </Group>
      <Button variant="outline" color="red" onClick={handleLogout} size="sm">
        Logout
      </Button>
    </Group>
  );
}