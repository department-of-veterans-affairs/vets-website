import piiReplace from '../components/webchat/piiReplace';
import { expect } from 'chai';

describe('replacing a message that includes pii with ****', () => {
  it("should replace ssn's with ****", () => {
    const ssns = ['123-45-6789', '856-45-6789'];
    const replacedMessage = '****';

    for (let j = 0; j < ssns.length; j++) {
      expect(piiReplace(ssns[j])).to.equal(replacedMessage);
    }
  });

  it('should replace multiple phone numbers with ****', () => {
    const phoneNumbers = [
      '123-456-7890',
      '(123) 456-7890',
      '123 456 7890',
      '123.456.7890',
    ];
    const replacedMessage = '****';

    for (let j = 0; j < phoneNumbers.length; j++) {
      expect(piiReplace(phoneNumbers[j])).to.equal(replacedMessage);
    }
  });

  it('should replace multiple emails with ****', () => {
    const emails = [
      'firstName@google.com',
      'first.name@va.gov',
      'fun-email@blahblah.tv',
      'fadsfasdfasd@df.sasd',
    ];
    const replacedMessage = '****';

    for (let j = 0; j < emails.length; j++) {
      expect(piiReplace(emails[j])).to.equal(replacedMessage);
    }
  });

  it("should replace multiple pii's in a single message", () => {
    const message =
      'My email is firstName@google.com, my ssn is 123-45-6789, and my phone number is (123) 456-7890';
    const replacedMessage =
      'My email is ****, my ssn is ****, and my phone number is ****';
    expect(piiReplace(message)).to.equal(replacedMessage);
  });
});

describe('does not replace invalid pii', () => {
  it('should not replace an invalid ssn', () => {
    const invalidSsns = ['000-45-6789', '8561-45-6789', '856-45-0000'];
    for (let i = 0; i < invalidSsns.length; i++) {
      expect(piiReplace(invalidSsns[i])).to.equal(invalidSsns[i]);
    }
  });

  it('should not replace an invalid phone', () => {
    const invalidPhones = [
      '1123-456-78901',
      '1123 456 78901',
      '1123.456.78901',
    ];
    for (let i = 0; i < invalidPhones.length; i++) {
      expect(piiReplace(invalidPhones[i])).to.equal(invalidPhones[i]);
    }
  });
});
