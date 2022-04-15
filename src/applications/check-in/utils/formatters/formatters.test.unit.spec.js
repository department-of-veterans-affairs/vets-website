import { expect } from 'chai';
import {
  formatPhone,
  formatDemographicString,
  extractDateFromVaDateComponent,
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
    describe('format date picker object to 8601', () => {
      it('formats to 8601', () => {
        const testDateObject = {
          year: {
            value: '1999',
            dirty: false,
          },
          month: {
            value: '5',
            dirty: false,
          },
          day: {
            value: '20',
            dirty: false,
          },
        };
        const formatted = extractDateFromVaDateComponent(testDateObject);
        expect(formatted).to.equal('1999-05-20');
      });
    });
  });
});
