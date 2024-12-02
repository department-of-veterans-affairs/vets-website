import { expect } from 'chai';
import {
  createHref,
  formatAriaLabel,
  formatPhoneNumber,
} from './sign-in-phone-utils';

describe('utilities for SubmitSignInForm', () => {
  describe('createHref', () => {
    it('should correctly create the href for a regular phone number', () => {
      expect(createHref('8006982411')).to.equal('tel:+18006982411');
    });

    it('should correctly create the href for a tty number', () => {
      expect(createHref('711')).to.equal('tel:711');
    });
  });

  describe('formatAriaLabel', () => {
    it('should correctly create the aria label for a regular phone number', () => {
      expect(formatAriaLabel('8006982411')).to.equal('8 0 0. 6 9 8. 2 4 1 1');
    });

    it('should correctly create the aria label for a tty number', () => {
      expect(formatAriaLabel('711', true)).to.equal('TTY. 7 1 1');
    });
  });

  describe('formatPhoneNumber', () => {
    it('should correctly create the phone number label for a regular phone number', () => {
      expect(formatPhoneNumber('8006982411')).to.equal('800-698-2411');
    });

    it('should correctly create the phone number label for a tty number', () => {
      expect(formatPhoneNumber('711', true)).to.equal('TTY: 711');
    });
  });
});
