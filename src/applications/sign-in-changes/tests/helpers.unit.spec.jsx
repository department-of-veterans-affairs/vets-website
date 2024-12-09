import { expect } from 'chai';
import { maskEmail } from '../helpers';

describe('maskEmail', () => {
  it('should mask the email name after the second character with *', () => {
    const result = maskEmail('johndo@example.com');
    expect(result).to.equal('joh***@example.com');
  });

  it('should not mask the name if it has less than three characters', () => {
    const threeChar = 'abc@example.com';
    const twoChar = 'ab@example.com';
    const oneChar = 'a@example.com';
    expect(maskEmail(threeChar)).to.equal('abc@example.com');
    expect(maskEmail(twoChar)).to.equal('ab@example.com');
    expect(maskEmail(oneChar)).to.equal('a@example.com');
  });

  it('should return the same if email is an empty string', () => {
    const result = maskEmail('');
    expect(result).to.equal('');
  });
});
