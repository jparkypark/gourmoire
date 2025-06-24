import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import AuthProvider from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { LoginPage, DashboardPage, RecipeListPage, RecipeFormPage } from './pages';

// Import Mantine styles
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';

function App() {
  return (
    <MantineProvider defaultColorScheme="light">
      <Notifications position="top-right" />
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<LoginPage />} />
            
            {/* Protected routes */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              } 
            />
            
            {/* Recipe routes */}
            <Route 
              path="/recipes" 
              element={
                <ProtectedRoute>
                  <RecipeListPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/recipes/new" 
              element={
                <ProtectedRoute>
                  <RecipeFormPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/recipes/:id/edit" 
              element={
                <ProtectedRoute>
                  <RecipeFormPage />
                </ProtectedRoute>
              } 
            />
            
            {/* Default redirect */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            
            {/* Catch all - redirect to dashboard */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </MantineProvider>
  );
}

export default App;
