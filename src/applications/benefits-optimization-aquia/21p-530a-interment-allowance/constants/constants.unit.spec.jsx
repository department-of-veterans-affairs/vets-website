/**
 * @module tests/constants.unit.spec
 * @description Unit tests for application constants
 */

import { expect } from 'chai';
import {
  SUBMISSION_ADDRESS,
  SUBTITLE,
  TITLE,
  TRACKING_PREFIX,
} from './constants';

describe('Constants', () => {
  describe('Form Title and Subtitle', () => {
    it('should have correct title', () => {
      expect(TITLE).to.exist;
      expect(TITLE).to.be.a('string');
      expect(TITLE).to.include('burial allowance');
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

  describe('Submission Address', () => {
    it('should have submission address object', () => {
      expect(SUBMISSION_ADDRESS).to.be.an('object');
    });

    it('should have name property', () => {
      expect(SUBMISSION_ADDRESS.name).to.exist;
      expect(SUBMISSION_ADDRESS.name).to.be.a('string');
      expect(SUBMISSION_ADDRESS.name).to.include('VA');
    });

    it('should have street property', () => {
      expect(SUBMISSION_ADDRESS.street).to.exist;
      expect(SUBMISSION_ADDRESS.street).to.be.a('string');
    });

    it('should have city property', () => {
      expect(SUBMISSION_ADDRESS.city).to.exist;
      expect(SUBMISSION_ADDRESS.city).to.be.a('string');
    });

    it('should have state property', () => {
      expect(SUBMISSION_ADDRESS.state).to.exist;
      expect(SUBMISSION_ADDRESS.state).to.be.a('string');
      expect(SUBMISSION_ADDRESS.state).to.have.lengthOf(2);
    });

    it('should have zip property', () => {
      expect(SUBMISSION_ADDRESS.zip).to.exist;
      expect(SUBMISSION_ADDRESS.zip).to.be.a('string');
      expect(SUBMISSION_ADDRESS.zip).to.match(/^\d{5}(-\d{4})?$/);
    });

    it('should have exactly 5 address fields', () => {
      expect(Object.keys(SUBMISSION_ADDRESS)).to.have.lengthOf(5);
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
      expect(SUBMISSION_ADDRESS).to.exist;
    });
  });
});
