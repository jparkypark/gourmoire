import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '../../test/utils/test-utils'
import { LoginForm } from '../LoginForm'
import { useAuth } from '../../contexts/AuthContext'

// Mock the useAuth hook
vi.mock('../../contexts/AuthContext', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    useAuth: vi.fn(),
    AuthProvider: ({ children }: { children: React.ReactNode }) => children,
  }
})

const mockUseAuth = vi.mocked(useAuth)

describe('LoginForm', () => {
  const mockLogin = vi.fn()
  const mockState = {
    isLoading: false,
    isAuthenticated: false,
    user: null,
    error: null,
  }

  beforeEach(() => {
    vi.clearAllMocks()
    mockUseAuth.mockReturnValue({
      login: mockLogin,
      logout: vi.fn(),
      refreshToken: vi.fn(),
      state: mockState,
    })
  })

  it('renders login form with all fields', () => {
    render(<LoginForm />)
    
    expect(screen.getByText('Welcome to Gourmoire')).toBeInTheDocument()
    expect(screen.getByText('Sign in to your account to continue')).toBeInTheDocument()
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/remember me/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
  })

  it('calls login function with correct data on valid submission', async () => {
    mockLogin.mockResolvedValue({ success: true })
    
    render(<LoginForm />)
    
    const usernameInput = screen.getByLabelText(/username/i)
    const passwordInput = screen.getByLabelText(/password/i)
    const rememberMeCheckbox = screen.getByLabelText(/remember me/i)
    const submitButton = screen.getByRole('button', { name: /sign in/i })
    
    fireEvent.change(usernameInput, { target: { value: 'testuser' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.click(rememberMeCheckbox)
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        username: 'testuser',
        password: 'password123',
        rememberMe: true,
      })
    })
  })

  it('shows error message on login failure', async () => {
    const errorMessage = 'Invalid credentials'
    mockLogin.mockResolvedValue({ 
      success: false, 
      message: errorMessage 
    })
    
    render(<LoginForm />)
    
    const usernameInput = screen.getByLabelText(/username/i)
    const passwordInput = screen.getByLabelText(/password/i)
    const submitButton = screen.getByRole('button', { name: /sign in/i })
    
    fireEvent.change(usernameInput, { target: { value: 'testuser' } })
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument()
      expect(screen.getByText('Login Failed')).toBeInTheDocument()
    })
  })

  it('calls onSuccess callback on successful login', async () => {
    const onSuccess = vi.fn()
    mockLogin.mockResolvedValue({ success: true })
    
    render(<LoginForm onSuccess={onSuccess} />)
    
    const usernameInput = screen.getByLabelText(/username/i)
    const passwordInput = screen.getByLabelText(/password/i)
    const submitButton = screen.getByRole('button', { name: /sign in/i })
    
    fireEvent.change(usernameInput, { target: { value: 'testuser' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalled()
    })
  })

  it('calls onError callback on login failure', async () => {
    const onError = vi.fn()
    const errorMessage = 'Invalid credentials'
    mockLogin.mockResolvedValue({ 
      success: false, 
      message: errorMessage 
    })
    
    render(<LoginForm onError={onError} />)
    
    const usernameInput = screen.getByLabelText(/username/i)
    const passwordInput = screen.getByLabelText(/password/i)
    const submitButton = screen.getByRole('button', { name: /sign in/i })
    
    fireEvent.change(usernameInput, { target: { value: 'testuser' } })
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(onError).toHaveBeenCalledWith(errorMessage)
    })
  })

  it('disables form when auth state is loading', () => {
    mockUseAuth.mockReturnValue({
      login: mockLogin,
      logout: vi.fn(),
      refreshToken: vi.fn(),
      state: { ...mockState, isLoading: true },
    })
    
    render(<LoginForm />)
    
    const submitButton = screen.getByRole('button', { name: /sign in/i })
    
    // Check that the submit button is disabled when auth state is loading
    expect(submitButton).toBeDisabled()
  })
})