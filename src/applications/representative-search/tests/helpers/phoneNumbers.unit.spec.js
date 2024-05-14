import { expect } from 'chai';
import { parsePhoneNumber } from '../../utils/phoneNumbers';

describe('parsePhoneNumber', () => {
  it('should handle valid numbers with no ext or dashes', () => {
    const phone = '2345678901';
    const { extension, contact } = parsePhoneNumber(phone);
    expect(extension).to.equal(null);
    expect(contact).to.equal('2345678901');
  });

  it('should handle valid numbers with extension but no dashes', () => {
    const phone = '2345678901 x123';
    const { extension, contact } = parsePhoneNumber(phone);

    expect(extension).to.equal('123');
    expect(contact).to.equal('2345678901');
  });

  it('should handle valid numbers with unnecessary dashes', () => {
    const phone = '234-567--8901x23';
    const { extension, contact } = parsePhoneNumber(phone);

    expect(extension).to.equal('23');
    expect(contact).to.equal('2345678901');
  });

  it('should handle valid numbers with unnecessary spaces', () => {
    const phone = '213  456 7890 Extension 123';
    const { extension, contact } = parsePhoneNumber(phone);

    expect(extension).to.equal('123');
    expect(contact).to.equal('2134567890');
  });

  it('should handle valid 800 numbers', () => {
    const phone = '1-800-827-1000';
    const { extension, contact } = parsePhoneNumber(phone);

    expect(extension).to.equal(null);
    expect(contact).to.equal('8008271000');
  });

  it('should handle cases when no dash is provided after country code', () => {
    const phone = '1844-458-9767';
    const { extension, contact } = parsePhoneNumber(phone);

    expect(extension).to.equal(null);
    expect(contact).to.equal('8444589767');
  });

  it('should handle US country code but no dashes', () => {
    const phone = '18444589767';
    const { extension, contact } = parsePhoneNumber(phone);

    expect(extension).to.equal(null);
    expect(contact).to.equal('8444589767');
  });

  it('should handle parentheses', () => {
    const phone = '(941)745-3795';
    const { extension, contact } = parsePhoneNumber(phone);

    expect(extension).to.equal(null);
    expect(contact).to.equal('9417453795');
  });

  it('should return invalid for +[non US country code]', () => {
    const phone = '(+44) 186-531-1388';
    const { extension, contact } = parsePhoneNumber(phone);

    expect(extension).to.equal(null);
    expect(contact).to.equal(null);
  });

  it('should handle cases when all separators are dashes', () => {
    const phone = '1-286-514-1358-23';
    const { extension, contact } = parsePhoneNumber(phone);

    expect(contact).to.equal('2865141358');
    expect(extension).to.equal('23');
  });
});
