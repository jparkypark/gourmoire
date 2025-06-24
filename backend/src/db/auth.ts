import type { User, DatabaseUser, LoginCredentials } from '../types';

/**
 * Hash a password using Web Crypto API (PBKDF2)
 */
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  
  // Generate a random salt
  const salt = crypto.getRandomValues(new Uint8Array(16));
  
  // Import the password as a key
  const key = await crypto.subtle.importKey(
    'raw',
    data,
    { name: 'PBKDF2' },
    false,
    ['deriveBits']
  );
  
  // Derive bits using PBKDF2
  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: 100000,
      hash: 'SHA-256'
    },
    key,
    256
  );
  
  // Combine salt and hash
  const hashArray = new Uint8Array(derivedBits);
  const combined = new Uint8Array(salt.length + hashArray.length);
  combined.set(salt);
  combined.set(hashArray, salt.length);
  
  // Convert to base64
  return btoa(String.fromCharCode(...combined));
}

/**
 * Verify a password against its hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    
    // Decode the hash
    const combined = new Uint8Array(atob(hash).split('').map(char => char.charCodeAt(0)));
    
    // Extract salt and hash
    const salt = combined.slice(0, 16);
    const storedHash = combined.slice(16);
    
    // Import the password as a key
    const key = await crypto.subtle.importKey(
      'raw',
      data,
      { name: 'PBKDF2' },
      false,
      ['deriveBits']
    );
    
    // Derive bits using PBKDF2 with the same salt
    const derivedBits = await crypto.subtle.deriveBits(
      {
        name: 'PBKDF2',
        salt: salt,
        iterations: 100000,
        hash: 'SHA-256'
      },
      key,
      256
    );
    
    const derivedHash = new Uint8Array(derivedBits);
    
    // Compare hashes
    if (derivedHash.length !== storedHash.length) {
      return false;
    }
    
    for (let i = 0; i < derivedHash.length; i++) {
      if (derivedHash[i] !== storedHash[i]) {
        return false;
      }
    }
    
    return true;
  } catch {
    return false;
  }
}

/**
 * Find a user by username
 */
export async function findUserByUsername(db: D1Database, username: string): Promise<DatabaseUser | null> {
  try {
    const result = await db.prepare(
      'SELECT id, username, password_hash, created_at FROM users WHERE username = ?'
    ).bind(username).first<DatabaseUser>();

    return result || null;
  } catch (error) {
    console.error('Error finding user:', error);
    return null;
  }
}

/**
 * Authenticate user with username and password
 */
export async function authenticateUser(
  db: D1Database, 
  credentials: LoginCredentials
): Promise<User | null> {
  try {
    const user = await findUserByUsername(db, credentials.username);
    
    if (!user) {
      return null;
    }

    const isValidPassword = await verifyPassword(credentials.password, user.password_hash);
    
    if (!isValidPassword) {
      return null;
    }

    // Return user without password hash
    return {
      id: user.id,
      username: user.username,
      password_hash: '', // Don't expose the hash
      created_at: user.created_at
    };
  } catch (error) {
    console.error('Error authenticating user:', error);
    return null;
  }
}

/**
 * Create the initial user if it doesn't exist
 */
export async function seedInitialUser(db: D1Database): Promise<void> {
  try {
    // Check if user already exists
    const existingUser = await findUserByUsername(db, 'user');
    
    if (existingUser) {
      console.log('Initial user already exists');
      return;
    }

    // Hash the default password
    const hashedPassword = await hashPassword('password123');
    
    // Insert the initial user
    await db.prepare(
      'INSERT INTO users (username, password_hash) VALUES (?, ?)'
    ).bind('user', hashedPassword).run();

    console.log('Initial user created successfully');
  } catch (error) {
    console.error('Error seeding initial user:', error);
    throw error;
  }
}