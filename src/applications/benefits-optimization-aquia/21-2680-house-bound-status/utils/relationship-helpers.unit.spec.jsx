/**
 * @module utils/relationshipHelpers.unit.spec
 * @description Unit tests for relationship helper functions
 */

import { expect } from 'chai';
import {
  isClaimantVeteran,
  getClaimantRelationship,
} from './relationship-helpers';

describe('relationshipHelpers', () => {
  describe('isClaimantVeteran', () => {
    it('should return true when claimant is veteran', () => {
      const formData = {
        claimantRelationship: {
          relationship: 'veteran',
        },
      };
      expect(isClaimantVeteran(formData)).to.be.true;
    });

    it('should return false when claimant is spouse', () => {
      const formData = {
        claimantRelationship: {
          relationship: 'spouse',
        },
      };
      expect(isClaimantVeteran(formData)).to.be.false;
    });

    it('should return false when claimant is child', () => {
      const formData = {
        claimantRelationship: {
          relationship: 'child',
        },
      };
      expect(isClaimantVeteran(formData)).to.be.false;
    });

    it('should return false when claimant is parent', () => {
      const formData = {
        claimantRelationship: {
          relationship: 'parent',
        },
      };
      expect(isClaimantVeteran(formData)).to.be.false;
    });

    it('should return false when relationship is undefined', () => {
      const formData = {
        claimantRelationship: {},
      };
      expect(isClaimantVeteran(formData)).to.be.false;
    });

    it('should return false when claimantRelationship is missing', () => {
      const formData = {};
      expect(isClaimantVeteran(formData)).to.be.false;
    });

    it('should return false when formData is null', () => {
      expect(isClaimantVeteran(null)).to.be.false;
    });

    it('should return false when formData is undefined', () => {
      expect(isClaimantVeteran(undefined)).to.be.false;
    });

    it('should return false when formData is an array', () => {
      expect(isClaimantVeteran([])).to.be.false;
    });

    it('should return false when formData is a string', () => {
      expect(isClaimantVeteran('veteran')).to.be.false;
    });

    it('should return false when formData is a number', () => {
      expect(isClaimantVeteran(123)).to.be.false;
    });
  });

  describe('getClaimantRelationship', () => {
    it('should return "veteran" when claimant is veteran', () => {
      const formData = {
        claimantRelationship: {
          relationship: 'veteran',
        },
      };
      expect(getClaimantRelationship(formData)).to.equal('veteran');
    });

    it('should return "spouse" when claimant is spouse', () => {
      const formData = {
        claimantRelationship: {
          relationship: 'spouse',
        },
      };
      expect(getClaimantRelationship(formData)).to.equal('spouse');
    });

    it('should return "child" when claimant is child', () => {
      const formData = {
        claimantRelationship: {
          relationship: 'child',
        },
      };
      expect(getClaimantRelationship(formData)).to.equal('child');
    });

    it('should return "parent" when claimant is parent', () => {
      const formData = {
        claimantRelationship: {
          relationship: 'parent',
        },
      };
      expect(getClaimantRelationship(formData)).to.equal('parent');
    });

    it('should return "unknown" when relationship is undefined', () => {
      const formData = {
        claimantRelationship: {},
      };
      expect(getClaimantRelationship(formData)).to.equal('unknown');
    });

    it('should return "unknown" when claimantRelationship is missing', () => {
      const formData = {};
      expect(getClaimantRelationship(formData)).to.equal('unknown');
    });

    it('should return "unknown" when formData is null', () => {
      expect(getClaimantRelationship(null)).to.equal('unknown');
    });

    it('should return "unknown" when formData is undefined', () => {
      expect(getClaimantRelationship(undefined)).to.equal('unknown');
    });

    it('should return "unknown" when formData is an array', () => {
      expect(getClaimantRelationship([])).to.equal('unknown');
    });

    it('should return "unknown" when formData is a string', () => {
      expect(getClaimantRelationship('veteran')).to.equal('unknown');
    });

    it('should return "unknown" when formData is a number', () => {
      expect(getClaimantRelationship(123)).to.equal('unknown');
    });

    it('should handle empty string relationship', () => {
      const formData = {
        claimantRelationship: {
          relationship: '',
        },
      };
      expect(getClaimantRelationship(formData)).to.equal('unknown');
    });
  });
});
