import * as bcrypt from 'bcryptjs';

export class PasswordUtil {
  private static readonly SALT_ROUNDS = 12;

  /**
   * Hash a password using bcrypt
   */
  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.SALT_ROUNDS);
  }

  /**
   * Verify a password against its hash
   */
  static async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  /**
   * Validate password strength
   */
  static validatePassword(password: string): { valid: boolean; message?: string } {
    if (!password || password.length < 8) {
      return {
        valid: false,
        message: 'Password must be at least 8 characters long'
      };
    }

    // Check for at least one uppercase, one lowercase, one digit, and one special character
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasDigit = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (!hasUpper || !hasLower || !hasDigit || !hasSpecial) {
      return {
        valid: false,
        message: 'Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character'
      };
    }

    return { valid: true };
  }
}