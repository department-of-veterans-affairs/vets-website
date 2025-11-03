import { expect } from 'chai';

import {
  MEDICAID_PATTERNS,
  MEDICAID_MESSAGES,
} from '@bio-aquia/21-0779-nursing-home-information/schemas/constants/constants';

describe('Schema Constants', () => {
  describe('MEDICAID_PATTERNS', () => {
    it('should export MEDICAID_NUMBER pattern', () => {
      expect(MEDICAID_PATTERNS.MEDICAID_NUMBER).to.exist;
      expect(MEDICAID_PATTERNS.MEDICAID_NUMBER).to.be.instanceOf(RegExp);
    });

    it('should validate alphanumeric Medicaid number', () => {
      expect(MEDICAID_PATTERNS.MEDICAID_NUMBER.test('ABC123')).to.be.true;
    });

    it('should validate Medicaid number with hyphens', () => {
      expect(MEDICAID_PATTERNS.MEDICAID_NUMBER.test('ABC-123')).to.be.true;
    });

    it('should validate numeric Medicaid number', () => {
      expect(MEDICAID_PATTERNS.MEDICAID_NUMBER.test('123456')).to.be.true;
    });

    it('should validate alphabetic Medicaid number', () => {
      expect(MEDICAID_PATTERNS.MEDICAID_NUMBER.test('ABCDEF')).to.be.true;
    });

    it('should reject Medicaid number with spaces', () => {
      expect(MEDICAID_PATTERNS.MEDICAID_NUMBER.test('ABC 123')).to.be.false;
    });

    it('should reject Medicaid number with special characters', () => {
      expect(MEDICAID_PATTERNS.MEDICAID_NUMBER.test('ABC@123')).to.be.false;
    });

    it('should reject empty string', () => {
      expect(MEDICAID_PATTERNS.MEDICAID_NUMBER.test('')).to.be.false;
    });
  });

  describe('MEDICAID_MESSAGES', () => {
    it('should export MEDICAID_NUMBER message', () => {
      expect(MEDICAID_MESSAGES.MEDICAID_NUMBER).to.exist;
      expect(MEDICAID_MESSAGES.MEDICAID_NUMBER).to.be.a('string');
    });

    it('should have non-empty MEDICAID_NUMBER message', () => {
      expect(MEDICAID_MESSAGES.MEDICAID_NUMBER.length).to.be.greaterThan(0);
    });

    it('should have descriptive MEDICAID_NUMBER message', () => {
      expect(MEDICAID_MESSAGES.MEDICAID_NUMBER).to.include('Medicaid');
    });
  });
});
