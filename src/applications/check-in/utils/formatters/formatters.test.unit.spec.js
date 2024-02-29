import { expect } from 'chai';
import {
  formatPhone,
  formatDemographicString,
  toCamelCase,
  removeTimezoneOffset,
} from './index';

describe('check in', () => {
  describe('format helpers', () => {
    describe('format a phone number', () => {
      it('returns format like xxx-xxx-xxxx', () => {
        const testNumber = '1112223333';
        const formatted = formatPhone(testNumber);
        expect(formatted).to.equal('111-222-3333');
      });
      it('returns format with international like +1 xxx-xxx-xxxx', () => {
        const testNumber = '11112223333';
        const formattedNumber = formatPhone(testNumber);
        expect(formattedNumber).to.equal('+1 111-222-3333');
      });
      it('ignores a malformatted number', () => {
        const testNumber = '0';
        const formattedNumber = formatPhone(testNumber);
        expect(formattedNumber).to.equal('0');
      });
    });
    describe('format demographic text', () => {
      it('formats a phone number', () => {
        const testNumber = '1112223333';
        const formatted = formatDemographicString(testNumber);
        expect(formatted).to.equal('111-222-3333');
      });
      it('passes email address through', () => {
        const testEmail = 'email@email.com';
        const formatedEmail = formatDemographicString(testEmail);
        expect(formatedEmail).to.equal('email@email.com');
      });
    });
    describe('toCamelCase', () => {
      it('formats string to camel case', () => {
        const str = 'Mailing Address';
        const transformedString = toCamelCase(str);
        expect(transformedString).to.equal('mailingAddress');
      });
    });
    describe('removeTimezoneOffset', () => {
      it('removes timezone offset', () => {
        const str1 = removeTimezoneOffset('2023-09-06T16:51:29-07:00');
        const str2 = removeTimezoneOffset('2023-09-06T16:51:29+07:00');
        const str3 = removeTimezoneOffset('2023-09-06T16:51:29+0700');
        const str4 = removeTimezoneOffset('2023-09-06T16:51:29Z');

        expect(str1).to.equal('2023-09-06T16:51:29Z');
        expect(str2).to.equal('2023-09-06T16:51:29Z');
        expect(str3).to.equal('2023-09-06T16:51:29Z');
        expect(str4).to.equal('2023-09-06T16:51:29Z');
      });
    });
  });
});
