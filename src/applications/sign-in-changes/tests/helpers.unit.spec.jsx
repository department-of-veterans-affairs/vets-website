import { expect } from 'chai';
import { maskEmail } from '../helpers';

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
});
