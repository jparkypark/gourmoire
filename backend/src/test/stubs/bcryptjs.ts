// Stub for bcryptjs to avoid import errors in test environment
// This is a minimal implementation for type compatibility

export function hash(data: string, rounds: number): Promise<string> {
  return Promise.resolve(`$2a$${rounds}$mockedhash`)
}

export function compare(data: string, hash: string): Promise<boolean> {
  return Promise.resolve(hash.includes('mockedhash'))
}

export default {
  hash,
  compare,
}