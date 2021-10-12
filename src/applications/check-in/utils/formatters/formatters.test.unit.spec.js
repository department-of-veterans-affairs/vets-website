import { expect } from 'chai';
import { formatPhone, formatAddress, formatDemographic } from './index';
import { render } from '@testing-library/react';

describe('check in', () => {
  describe('format helpers', () => {
    describe('format a phone number', () => {
      it('returns format like xxx-xxx-xxxx', () => {
        const testNumber = '1112223333';
        const formatted = formatPhone(testNumber);
        expect(formatted).to.equal('111-222-3333');
      });
      it('returns format with international like +1xxx-xxx-xxxx', () => {
        const testNumber = '11112223333';
        const formattedNumber = formatPhone(testNumber);
        expect(formattedNumber).to.equal('+1 111-222-3333');
      });
    });
    describe('format an address', () => {
      it('breaks address into two lines', () => {
        const testAddress = '1221 Douglas Way, Douglas, MA, 00000';
        const formattedAddress = formatAddress(testAddress);
        const component = render(formattedAddress);
        expect(component.getByText('1221 Douglas Way Douglas, MA, 00000')).to
          .exist;
        expect(
          component.getByText('1221 Douglas Way Douglas, MA, 00000'),
        ).to.contain.html('<br>');
      });
    });
    describe('format demographic text', () => {
      it('formats a phone number', () => {
        const testNumber = '1112223333';
        const formatted = formatDemographic(testNumber);
        expect(formatted).to.equal('111-222-3333');
      });
      it('formats an address', () => {
        const testAddress = '1221 Douglas Way, Douglas, MA, 00000';
        const formattedAddress = formatDemographic(testAddress);
        const component = render(formattedAddress);
        expect(component.getByText('1221 Douglas Way Douglas, MA, 00000')).to
          .exist;
        expect(
          component.getByText('1221 Douglas Way Douglas, MA, 00000'),
        ).to.contain.html('<br>');
      });
      it('passes email address through', () => {
        const testEmail = 'email@email.com';
        const formatedEmail = formatDemographic(testEmail);
        expect(formatedEmail).to.equal('email@email.com');
      });
    });
  });
});
