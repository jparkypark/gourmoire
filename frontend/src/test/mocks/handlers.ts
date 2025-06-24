import { http, HttpResponse } from 'msw'

export const handlers = [
  // Auth endpoints
  http.post('/api/auth/login', () => {
    return HttpResponse.json({
      success: true,
      user: { 
        id: '1', 
        username: 'testuser', 
        email: 'test@example.com' 
      },
      accessToken: 'mock-access-token',
      refreshToken: 'mock-refresh-token'
    })
  }),

  http.post('/api/auth/refresh', () => {
    return HttpResponse.json({
      success: true,
      accessToken: 'new-mock-access-token',
      refreshToken: 'new-mock-refresh-token'
    })
  }),

  http.post('/api/auth/logout', () => {
    return HttpResponse.json({
      success: true,
      message: 'Logged out successfully'
    })
  }),

  // Recipe endpoints (for future implementation)
  http.get('/api/recipes', () => {
    return HttpResponse.json({
      success: true,
      recipes: [
        {
          id: '1',
          title: 'Test Recipe',
          description: 'A test recipe',
          ingredients: ['ingredient 1', 'ingredient 2'],
          instructions: ['step 1', 'step 2'],
          tags: ['test'],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ]
    })
  }),

  http.post('/api/recipes', () => {
    return HttpResponse.json({
      success: true,
      recipe: {
        id: '2',
        title: 'New Recipe',
        description: 'A new recipe',
        ingredients: ['new ingredient'],
        instructions: ['new step'],
        tags: ['new'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    })
  }),
]