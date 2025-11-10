/**
 * @module tests/utils/relationshipHelpers.unit.spec
 * @description Unit tests for relationship helper functions
 */

import { expect } from 'chai';
import {
  isClaimantVeteran,
  getClaimantRelationship,
} from '../../utils/relationshipHelpers';

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

    it('should return false for invalid formData', () => {
      expect(isClaimantVeteran(null)).to.be.false;
      expect(isClaimantVeteran(undefined)).to.be.false;
      expect(isClaimantVeteran({})).to.be.false;
      expect(isClaimantVeteran([])).to.be.false;
      expect(isClaimantVeteran('string')).to.be.false;
    });

    it('should return false when relationship is missing', () => {
      const formData = {
        claimantRelationship: {},
      };
      expect(isClaimantVeteran(formData)).to.be.false;
    });
  });

  describe('getClaimantRelationship', () => {
    it('should return veteran when relationship is veteran', () => {
      const formData = {
        claimantRelationship: {
          relationship: 'veteran',
        },
      };
      expect(getClaimantRelationship(formData)).to.equal('veteran');
    });

    it('should return spouse when relationship is spouse', () => {
      const formData = {
        claimantRelationship: {
          relationship: 'spouse',
        },
      };
      expect(getClaimantRelationship(formData)).to.equal('spouse');
    });

    it('should return child when relationship is child', () => {
      const formData = {
        claimantRelationship: {
          relationship: 'child',
        },
      };
      expect(getClaimantRelationship(formData)).to.equal('child');
    });

    it('should return parent when relationship is parent', () => {
      const formData = {
        claimantRelationship: {
          relationship: 'parent',
        },
      };
      expect(getClaimantRelationship(formData)).to.equal('parent');
    });

    it('should return unknown for missing relationship', () => {
      const formData = {};
      expect(getClaimantRelationship(formData)).to.equal('unknown');
    });

    it('should return unknown for empty relationship object', () => {
      const formData = {
        claimantRelationship: {},
      };
      expect(getClaimantRelationship(formData)).to.equal('unknown');
    });

    it('should return unknown for invalid formData', () => {
      expect(getClaimantRelationship(null)).to.equal('unknown');
      expect(getClaimantRelationship([])).to.equal('unknown');
      expect(getClaimantRelationship(undefined)).to.equal('unknown');
      expect(getClaimantRelationship('string')).to.equal('unknown');
    });
  });
});
