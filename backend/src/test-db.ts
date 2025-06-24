/**
 * Test script to verify database functionality
 * This can be used to test database operations locally
 */

import { hashPassword, verifyPassword } from './db/auth';

export async function testPasswordHashing() {
  console.log('Testing password hashing...');
  
  const password = 'password123';
  const hash = await hashPassword(password);
  
  console.log(`Original password: ${password}`);
  console.log(`Hashed password: ${hash}`);
  
  const isValid = await verifyPassword(password, hash);
  console.log(`Password verification: ${isValid ? 'PASS' : 'FAIL'}`);
  
  const isInvalid = await verifyPassword('wrongpassword', hash);
  console.log(`Wrong password verification: ${isInvalid ? 'FAIL' : 'PASS'}`);
}

// For testing in Node.js environment
// Uncomment the line below to run the test:
// testPasswordHashing().catch(console.error);