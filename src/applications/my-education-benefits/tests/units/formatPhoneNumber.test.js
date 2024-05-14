// formatPhoneNumber.test.js
import { formatPhoneNumber } from '../../components/ContactInformationReviewPanel';

describe('formatPhoneNumber', () => {
  test('correctly formats a 10-digit number', () => {
    const phoneObject = { phone: '1234567890' };
    expect(formatPhoneNumber(phoneObject)).toBe('(123) 456-7890');
  });
  test('returns the original number if not 10 digits', () => {
    const phoneObject = { phone: '12345' };
    expect(formatPhoneNumber(phoneObject)).toBe('12345');
  });
  test('ignores non-numeric characters and formats correctly', () => {
    const phoneObject = { phone: '123-456-7890' };
    expect(formatPhoneNumber(phoneObject)).toBe('(123) 456-7890');
  });
  test('handles case where phone number is international but has 10 digits', () => {
    const phoneObject = { phone: '1234567890', isInternational: true };
    expect(formatPhoneNumber(phoneObject)).toBe('(123) 456-7890');
  });
  test('returns the original string if it is international and not 10 digits', () => {
    const phoneObject = { phone: '1234567890123', isInternational: true };
    expect(formatPhoneNumber(phoneObject)).toBe('1234567890123');
  });
});
