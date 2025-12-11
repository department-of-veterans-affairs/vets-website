/**
 * @module tests/constants.unit.spec
 * @description Unit tests for application constants
 */

import { expect } from 'chai';
import { SUBTITLE, TITLE, TRACKING_PREFIX } from './constants';

describe('Constants', () => {
  describe('Form Title and Subtitle', () => {
    it('should have correct title', () => {
      expect(TITLE).to.exist;
      expect(TITLE).to.be.a('string');
      expect(TITLE).to.include('interment allowance');
    });

    it('should have correct subtitle', () => {
      expect(SUBTITLE).to.exist;
      expect(SUBTITLE).to.equal(
        'State or Tribal Organization Application for Interment Allowance (Under 38 U.S.C. Chapter 23) (VA Form 21-530a)',
      );
    });
  });

  describe('Tracking Prefix', () => {
    it('should have tracking prefix', () => {
      expect(TRACKING_PREFIX).to.exist;
      expect(TRACKING_PREFIX).to.be.a('string');
    });

    it('should include form identifier', () => {
      expect(TRACKING_PREFIX).to.include('21p-530a');
    });

    it('should end with hyphen', () => {
      expect(TRACKING_PREFIX).to.match(/-$/);
    });
  });

  describe('Constant Values Format', () => {
    it('should use kebab-case for tracking prefix', () => {
      expect(TRACKING_PREFIX).to.match(/^[a-z0-9]+(-[a-z0-9]+)*-$/);
    });
  });

  describe('Constant Immutability', () => {
    it('should export all constants', () => {
      expect(TITLE).to.exist;
      expect(SUBTITLE).to.exist;
      expect(TRACKING_PREFIX).to.exist;
    });
  });
});
