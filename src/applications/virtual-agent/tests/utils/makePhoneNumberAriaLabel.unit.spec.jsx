import { expect } from 'chai';
import makePhoneNumberAriaLabel from '../../utils/makePhoneNumberAriaLabel';

describe('makePhoneNumberAriaLabel', () => {
  it('should break the phone number into chunks and join them with spaces and period at the end', () => {
    const phoneNumber = '+1 (234) 567-8901';
    const expected = '1. 2 3 4. 5 6 7. 8 9 0 1.';
    const result = makePhoneNumberAriaLabel(phoneNumber);
    expect(result).to.be.equal(expected);
  });

  it('should handle phone numbers with different lengths', () => {
    const phoneNumber = '+11 (234) 567-8901';
    const expected = '1 1. 2 3 4. 5 6 7. 8 9 0 1.';
    const result = makePhoneNumberAriaLabel(phoneNumber);
    expect(result).to.be.equal(expected);
  });

  it('should handle phone numbers with different format', () => {
    const phoneNumber = '1234567890';
    const expected = '1 2 3. 4 5 6. 7 8 9 0.';
    const result = makePhoneNumberAriaLabel(phoneNumber);
    expect(result).to.be.equal(expected);
  });

  it('should handle empty phone numbers', () => {
    const phoneNumber = '';
    const expected = '.';
    const result = makePhoneNumberAriaLabel(phoneNumber);
    expect(result).to.be.equal(expected);
  });
});
