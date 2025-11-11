/**
 * @module tests/utils/dynamicTitleHelpers.unit.spec
 * @description Unit tests for dynamic title helper functions
 */

import { expect } from 'chai';
import {
  getHospitalizationStatusTitle,
  getHospitalizationDateTitle,
  getHospitalizationFacilityTitle,
} from '../../utils/dynamicTitleHelpers';

describe('dynamicTitleHelpers', () => {
  describe('getHospitalizationStatusTitle', () => {
    it('should return title with veteran name when veteran is claimant', () => {
      const formData = {
        claimantRelationship: {
          relationship: 'veteran',
        },
        veteranInformation: {
          veteranFullName: {
            first: 'John',
            last: 'Doe',
          },
        },
      };
      expect(getHospitalizationStatusTitle(formData)).to.equal(
        'Is John Doe hospitalized?',
      );
    });

    it('should return title with claimant name when claimant is not veteran', () => {
      const formData = {
        claimantRelationship: {
          relationship: 'spouse',
        },
        claimantInformation: {
          claimantFullName: {
            first: 'Jane',
            last: 'Smith',
          },
        },
      };
      expect(getHospitalizationStatusTitle(formData)).to.equal(
        'Is Jane Smith hospitalized?',
      );
    });

    it('should return fallback for veteran without name', () => {
      const formData = {
        claimantRelationship: {
          relationship: 'veteran',
        },
      };
      expect(getHospitalizationStatusTitle(formData)).to.equal(
        'Is the Veteran hospitalized?',
      );
    });

    it('should return fallback for claimant without name', () => {
      const formData = {
        claimantRelationship: {
          relationship: 'spouse',
        },
      };
      expect(getHospitalizationStatusTitle(formData)).to.equal(
        'Is the claimant hospitalized?',
      );
    });

    it('should handle child relationship', () => {
      const formData = {
        claimantRelationship: {
          relationship: 'child',
        },
        claimantInformation: {
          claimantFullName: {
            first: 'Bobby',
            last: 'Junior',
          },
        },
      };
      expect(getHospitalizationStatusTitle(formData)).to.equal(
        'Is Bobby Junior hospitalized?',
      );
    });

    it('should handle parent relationship', () => {
      const formData = {
        claimantRelationship: {
          relationship: 'parent',
        },
        claimantInformation: {
          claimantFullName: {
            first: 'Mary',
            last: 'Senior',
          },
        },
      };
      expect(getHospitalizationStatusTitle(formData)).to.equal(
        'Is Mary Senior hospitalized?',
      );
    });
  });

  describe('getHospitalizationDateTitle', () => {
    it('should return title with veteran name when veteran is claimant', () => {
      const formData = {
        claimantRelationship: {
          relationship: 'veteran',
        },
        veteranInformation: {
          veteranFullName: {
            first: 'John',
            last: 'Doe',
          },
        },
      };
      expect(getHospitalizationDateTitle(formData)).to.equal(
        'When was John Doe admitted to the hospital?',
      );
    });

    it('should return title with claimant name when claimant is not veteran', () => {
      const formData = {
        claimantRelationship: {
          relationship: 'spouse',
        },
        claimantInformation: {
          claimantFullName: {
            first: 'Jane',
            last: 'Smith',
          },
        },
      };
      expect(getHospitalizationDateTitle(formData)).to.equal(
        'When was Jane Smith admitted to the hospital?',
      );
    });

    it('should return you fallback for veteran without name', () => {
      const formData = {
        claimantRelationship: {
          relationship: 'veteran',
        },
      };
      expect(getHospitalizationDateTitle(formData)).to.equal(
        'When were you admitted to the hospital?',
      );
    });

    it('should return claimant fallback for claimant without name', () => {
      const formData = {
        claimantRelationship: {
          relationship: 'spouse',
        },
      };
      expect(getHospitalizationDateTitle(formData)).to.equal(
        'When was the claimant admitted to the hospital?',
      );
    });

    it('should use "was" with claimant name', () => {
      const formData = {
        claimantRelationship: {
          relationship: 'child',
        },
        claimantInformation: {
          claimantFullName: {
            first: 'Bobby',
            last: 'Junior',
          },
        },
      };
      expect(getHospitalizationDateTitle(formData)).to.equal(
        'When was Bobby Junior admitted to the hospital?',
      );
    });
  });

  describe('getHospitalizationFacilityTitle', () => {
    it('should return title with veteran name when veteran is claimant', () => {
      const formData = {
        claimantRelationship: {
          relationship: 'veteran',
        },
        veteranInformation: {
          veteranFullName: {
            first: 'John',
            last: 'Doe',
          },
        },
      };
      expect(getHospitalizationFacilityTitle(formData)).to.equal(
        "What's the name and address of the hospital where John Doe is admitted?",
      );
    });

    it('should return title with claimant name when claimant is not veteran', () => {
      const formData = {
        claimantRelationship: {
          relationship: 'spouse',
        },
        claimantInformation: {
          claimantFullName: {
            first: 'Jane',
            last: 'Smith',
          },
        },
      };
      expect(getHospitalizationFacilityTitle(formData)).to.equal(
        "What's the name and address of the hospital where Jane Smith is admitted?",
      );
    });

    it('should return veteran fallback when veteran name not available', () => {
      const formData = {
        claimantRelationship: {
          relationship: 'veteran',
        },
      };
      expect(getHospitalizationFacilityTitle(formData)).to.equal(
        "What's the name and address of the hospital where you are admitted?",
      );
    });

    it('should return claimant fallback when claimant name not available', () => {
      const formData = {
        claimantRelationship: {
          relationship: 'spouse',
        },
      };
      expect(getHospitalizationFacilityTitle(formData)).to.equal(
        "What's the name and address of the hospital where the claimant is admitted?",
      );
    });

    it('should handle child relationship with name', () => {
      const formData = {
        claimantRelationship: {
          relationship: 'child',
        },
        claimantInformation: {
          claimantFullName: {
            first: 'Bobby',
            last: 'Junior',
          },
        },
      };
      expect(getHospitalizationFacilityTitle(formData)).to.equal(
        "What's the name and address of the hospital where Bobby Junior is admitted?",
      );
    });
  });
});
