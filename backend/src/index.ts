import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { prettyJSON } from 'hono/pretty-json';
import type { Env, AuthContext } from './types';
import { initializeDatabase, checkDatabaseHealth } from './db/init';
import { authenticateUser, findUserByUsername } from './db/auth';

// Import JWT auth components
import { JWTUtil } from './utils/jwt';
import { authMiddleware, refreshTokenMiddleware } from './middleware/auth';
import { logoutHandler } from './auth/logout';
import { refreshHandler } from './auth/refresh';

const app = new Hono<{ Bindings: Env; Variables: { auth?: AuthContext } }>();

// Global middleware
app.use('*', logger());
app.use('*', prettyJSON());
app.use('*', cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

// Initialize database on first request
let dbInitialized = false;

app.use('*', async (c, next) => {
  if (!dbInitialized) {
    try {
      await initializeDatabase(c.env);
      dbInitialized = true;
    } catch (error) {
      console.error('Failed to initialize database:', error);
      return c.json({ error: 'Database initialization failed' }, 500);
    }
  }
  await next();
});

// Health check endpoint
app.get('/api/health', async (c) => {
  const dbHealthy = await checkDatabaseHealth(c.env.DB);
  return c.json({ 
    status: dbHealthy ? 'ok' : 'unhealthy', 
    database: dbHealthy ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString() 
  });
});

// Authentication endpoints with JWT
app.post('/api/auth/login', async (c) => {
  try {
    const { username, password, rememberMe } = await c.req.json();
    
    if (!username || !password) {
      return c.json({ 
        success: false,
        message: 'Username and password are required',
        code: 'INVALID_CREDENTIALS'
      }, 400);
    }

    const user = await authenticateUser(c.env.DB, { username, password });
    
    if (!user) {
      return c.json({ 
        success: false,
        message: 'Invalid username or password',
        code: 'INVALID_CREDENTIALS'
      }, 401);
    }

    // Generate JWT tokens
    const jwtUtil = new JWTUtil(c.env);
    const tokenPayload = {
      userId: user.id.toString(),
      username: user.username,
      email: '' // D1 schema doesn't have email field
    };

    const accessToken = await jwtUtil.generateAccessToken(tokenPayload, rememberMe);
    const refreshToken = await jwtUtil.generateRefreshToken(tokenPayload, rememberMe);

    // Store refresh token in KV with expiration
    const refreshTokenKey = `refresh_token:${user.id}:${Date.now()}`;
    const refreshTokenExpiry = rememberMe ? 90 * 24 * 60 * 60 : 7 * 24 * 60 * 60;
    
    await c.env.AUTH_KV.put(refreshTokenKey, refreshToken, {
      expirationTtl: refreshTokenExpiry
    });

    return c.json({
      success: true,
      user: {
        id: user.id.toString(),
        username: user.username,
        email: ''
      },
      accessToken,
      refreshToken,
      expiresIn: jwtUtil.getTokenExpirationTime(rememberMe),
      message: 'Login successful'
    });
  } catch (error) {
    console.error('Login error:', error);
    return c.json({ 
      success: false,
      message: 'Internal server error during login',
      code: 'UNAUTHORIZED'
    }, 500);
  }
});

// JWT-based auth endpoints
app.post('/api/auth/refresh', refreshTokenMiddleware, refreshHandler);
app.post('/api/auth/logout', authMiddleware, logoutHandler);

// Protected user endpoints
app.get('/api/user/profile', authMiddleware, async (c) => {
  try {
    const auth = c.get('auth');
    
    if (!auth) {
      return c.json({ 
        success: false,
        message: 'Authentication required',
        code: 'UNAUTHORIZED'
      }, 401);
    }

    const user = await findUserByUsername(c.env.DB, auth.user.username);
    
    if (!user) {
      return c.json({ 
        success: false,
        message: 'User not found',
        code: 'USER_NOT_FOUND'
      }, 404);
    }

    return c.json({
      success: true,
      user: {
        id: user.id.toString(),
        username: user.username,
        created_at: user.created_at
      }
    });
  } catch (error) {
    console.error('Get user profile error:', error);
    return c.json({ 
      success: false,
      message: 'Internal server error',
      code: 'UNAUTHORIZED'
    }, 500);
  }
});

// Get user info endpoint (protected)
app.get('/api/user/:username', authMiddleware, async (c) => {
  try {
    const auth = c.get('auth');
    const requestedUsername = c.req.param('username');
    
    // Users can only access their own profile unless they're admin
    if (auth?.user.username !== requestedUsername) {
      return c.json({ 
        success: false,
        message: 'Access denied - can only view own profile',
        code: 'UNAUTHORIZED'
      }, 403);
    }

    const user = await findUserByUsername(c.env.DB, requestedUsername);
    
    if (!user) {
      return c.json({ 
        success: false,
        message: 'User not found',
        code: 'USER_NOT_FOUND'
      }, 404);
    }

    return c.json({
      success: true,
      user: {
        id: user.id.toString(),
        username: user.username,
        created_at: user.created_at
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    return c.json({ 
      success: false,
      message: 'Internal server error',
      code: 'UNAUTHORIZED'
    }, 500);
  }
});

// Protected recipe endpoints (placeholder implementations)
app.get('/api/recipes', authMiddleware, async (c) => {
  const auth = c.get('auth');
  return c.json({
    success: true,
    message: `Recipes for ${auth?.user.username}`,
    recipes: [] // Placeholder - actual implementation would fetch from database
  });
});

app.post('/api/recipes', authMiddleware, async (c) => {
  const auth = c.get('auth');
  const body = await c.req.json().catch(() => ({}));
  
  return c.json({
    success: true,
    message: `Recipe creation requested by ${auth?.user.username}`,
    recipe: {
      id: `recipe_${Date.now()}`,
      ...body,
      createdBy: auth?.user.id,
      createdAt: new Date().toISOString()
    }
  });
});

app.get('/api/recipes/:id', authMiddleware, async (c) => {
  const auth = c.get('auth');
  const recipeId = c.req.param('id');
  
  return c.json({
    success: true,
    message: `Recipe ${recipeId} requested by ${auth?.user.username}`,
    recipe: {
      id: recipeId,
      title: 'Sample Recipe',
      description: 'This is a placeholder recipe',
      createdBy: auth?.user.id
    }
  });
});

app.put('/api/recipes/:id', authMiddleware, async (c) => {
  const auth = c.get('auth');
  const recipeId = c.req.param('id');
  const body = await c.req.json().catch(() => ({}));
  
  return c.json({
    success: true,
    message: `Recipe ${recipeId} update requested by ${auth?.user.username}`,
    recipe: {
      id: recipeId,
      ...body,
      updatedBy: auth?.user.id,
      updatedAt: new Date().toISOString()
    }
  });
});

app.delete('/api/recipes/:id', authMiddleware, async (c) => {
  const auth = c.get('auth');
  const recipeId = c.req.param('id');
  
  return c.json({
    success: true,
    message: `Recipe ${recipeId} deletion requested by ${auth?.user.username}`,
    deletedBy: auth?.user.id,
    deletedAt: new Date().toISOString()
  });
});

// API info endpoint
app.get('/api', (c) => {
  return c.json({
    name: 'Gourmoire API',
    version: '1.0.0',
    description: 'JWT-authenticated API for recipe management',
    endpoints: {
      auth: [
        'POST /api/auth/login',
        'POST /api/auth/logout (protected)',
        'POST /api/auth/refresh'
      ],
      user: [
        'GET /api/user/profile (protected)',
        'GET /api/user/:username (protected)'
      ],
      recipes: [
        'GET /api/recipes (protected)',
        'POST /api/recipes (protected)',
        'GET /api/recipes/:id (protected)',
        'PUT /api/recipes/:id (protected)',
        'DELETE /api/recipes/:id (protected)'
      ],
      utility: [
        'GET /api/health',
        'GET /api'
      ]
    }
  });
});

// Basic route for testing
app.get('/', (c) => {
  return c.json({ 
    message: 'Gourmoire API Server', 
    version: '1.0.0',
    authentication: 'JWT-based',
    endpoints: '/api'
  });
});

// 404 handler
app.notFound((c) => {
  return c.json({
    success: false,
    message: 'Endpoint not found',
    code: 'NOT_FOUND'
  }, 404);
});

// Error handler
app.onError((err, c) => {
  console.error('Unhandled error:', err);
  
  return c.json({
    success: false,
    message: 'Internal server error',
    code: 'INTERNAL_ERROR'
  }, 500);
});

export default app;