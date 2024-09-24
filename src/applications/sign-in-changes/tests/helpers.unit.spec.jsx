import { maskEmail } from './helpers'; // Adjust the path based on your project structure

describe('maskEmail', () => {
  it('should mask the email name after the second character with *', () => {
    const email = 'johndoe@example.com';
    const result = maskEmail(email);
    expect(result).toBe('joh***@example.com');
  });

  it('should not mask the name if it has only two characters', () => {
    const email = 'jo@example.com';
    const result = maskEmail(email);
    expect(result).toBe('jo@example.com');
  });

  it('should not mask the name if it has only one character', () => {
    const email = 'a@example.com';
    const result = maskEmail(email);
    expect(result).toBe('a@example.com');
  });

  it('should return the same if email is an empty string', () => {
    const email = '';
    const result = maskEmail(email);
    expect(result).toBe('');
  });
});