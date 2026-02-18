/**
 * @module utils/dynamicTitleHelpers.unit.spec
 * @description Unit tests for dynamic title helper functions
 */

import { expect } from 'chai';
import {
  getHospitalizationStatusTitle,
  getHospitalizationDateTitle,
  getHospitalizationFacilityTitle,
} from './dynamic-title-helpers';

describe('dynamicTitleHelpers', () => {
  describe('getHospitalizationStatusTitle', () => {
    it('should return title with veteran name when veteran is claimant', () => {
      const formData = {
        claimantRelationship: {
          relationship: 'veteran',
        },
        veteranInformation: {
          veteranFullName: {
            first: 'Anakin',
            last: 'Skywalker',
          },
        },
      };
      expect(getHospitalizationStatusTitle(formData)).to.equal(
        'Is Anakin Skywalker receiving hospital care?',
      );
    });

    it('should return title with claimant name when claimant is spouse', () => {
      const formData = {
        claimantRelationship: {
          relationship: 'spouse',
        },
        claimantInformation: {
          claimantFullName: {
            first: 'Padmé',
            last: 'Amidala',
          },
        },
      };
      expect(getHospitalizationStatusTitle(formData)).to.equal(
        'Is Padmé Amidala receiving hospital care?',
      );
    });

    it('should return default veteran text when veteran is claimant without name', () => {
      const formData = {
        claimantRelationship: {
          relationship: 'veteran',
        },
        veteranInformation: {
          veteranFullName: {},
        },
      };
      expect(getHospitalizationStatusTitle(formData)).to.equal(
        'Is the Veteran receiving hospital care?',
      );
    });

    it('should return default claimant text when claimant is not veteran without name', () => {
      const formData = {
        claimantRelationship: {
          relationship: 'spouse',
        },
        claimantInformation: {
          claimantFullName: {},
        },
      };
      expect(getHospitalizationStatusTitle(formData)).to.equal(
        'Is the claimant receiving hospital care?',
      );
    });

    it('should handle child relationship', () => {
      const formData = {
        claimantRelationship: {
          relationship: 'child',
        },
        claimantInformation: {
          claimantFullName: {
            first: 'Luke',
            last: 'Skywalker',
          },
        },
      };
      expect(getHospitalizationStatusTitle(formData)).to.equal(
        'Is Luke Skywalker receiving hospital care?',
      );
    });

    it('should handle parent relationship', () => {
      const formData = {
        claimantRelationship: {
          relationship: 'parent',
        },
        claimantInformation: {
          claimantFullName: {
            first: 'Shmi',
            last: 'Skywalker',
          },
        },
      };
      expect(getHospitalizationStatusTitle(formData)).to.equal(
        'Is Shmi Skywalker receiving hospital care?',
      );
    });

    it('should handle missing relationship', () => {
      const formData = {};
      expect(getHospitalizationStatusTitle(formData)).to.equal(
        'Is the claimant receiving hospital care?',
      );
    });

    it('should handle first name only', () => {
      const formData = {
        claimantRelationship: {
          relationship: 'veteran',
        },
        veteranInformation: {
          veteranFullName: {
            first: 'Yoda',
            last: '',
          },
        },
      };
      expect(getHospitalizationStatusTitle(formData)).to.equal(
        'Is Yoda receiving hospital care?',
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
            first: 'Anakin',
            last: 'Skywalker',
          },
        },
      };
      expect(getHospitalizationDateTitle(formData)).to.equal(
        'When was Anakin Skywalker admitted to the hospital?',
      );
    });

    it('should return title with claimant name when claimant is spouse', () => {
      const formData = {
        claimantRelationship: {
          relationship: 'spouse',
        },
        claimantInformation: {
          claimantFullName: {
            first: 'Padmé',
            last: 'Amidala',
          },
        },
      };
      expect(getHospitalizationDateTitle(formData)).to.equal(
        'When was Padmé Amidala admitted to the hospital?',
      );
    });

    it('should return "you" when veteran is claimant without name', () => {
      const formData = {
        claimantRelationship: {
          relationship: 'veteran',
        },
        veteranInformation: {
          veteranFullName: {},
        },
      };
      expect(getHospitalizationDateTitle(formData)).to.equal(
        'When were you admitted to the hospital?',
      );
    });

    it('should return default claimant text when claimant is not veteran without name', () => {
      const formData = {
        claimantRelationship: {
          relationship: 'spouse',
        },
        claimantInformation: {
          claimantFullName: {},
        },
      };
      expect(getHospitalizationDateTitle(formData)).to.equal(
        'When was the claimant admitted to the hospital?',
      );
    });

    it('should handle child relationship', () => {
      const formData = {
        claimantRelationship: {
          relationship: 'child',
        },
        claimantInformation: {
          claimantFullName: {
            first: 'Luke',
            last: 'Skywalker',
          },
        },
      };
      expect(getHospitalizationDateTitle(formData)).to.equal(
        'When was Luke Skywalker admitted to the hospital?',
      );
    });

    it('should handle parent relationship', () => {
      const formData = {
        claimantRelationship: {
          relationship: 'parent',
        },
        claimantInformation: {
          claimantFullName: {
            first: 'Shmi',
            last: 'Skywalker',
          },
        },
      };
      expect(getHospitalizationDateTitle(formData)).to.equal(
        'When was Shmi Skywalker admitted to the hospital?',
      );
    });

    it('should handle missing relationship', () => {
      const formData = {};
      expect(getHospitalizationDateTitle(formData)).to.equal(
        'When was the claimant admitted to the hospital?',
      );
    });

    it('should handle first name only', () => {
      const formData = {
        claimantRelationship: {
          relationship: 'veteran',
        },
        veteranInformation: {
          veteranFullName: {
            first: 'Han',
            last: '',
          },
        },
      };
      expect(getHospitalizationDateTitle(formData)).to.equal(
        'When was Han admitted to the hospital?',
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
            first: 'Anakin',
            last: 'Skywalker',
          },
        },
      };
      expect(getHospitalizationFacilityTitle(formData)).to.equal(
        "What's the name and address of the hospital where Anakin Skywalker is admitted?",
      );
    });

    it('should return title with claimant name when claimant is spouse', () => {
      const formData = {
        claimantRelationship: {
          relationship: 'spouse',
        },
        claimantInformation: {
          claimantFullName: {
            first: 'Padmé',
            last: 'Amidala',
          },
        },
      };
      expect(getHospitalizationFacilityTitle(formData)).to.equal(
        "What's the name and address of the hospital where Padmé Amidala is admitted?",
      );
    });

    it('should return "you" when veteran is claimant without name', () => {
      const formData = {
        claimantRelationship: {
          relationship: 'veteran',
        },
        veteranInformation: {
          veteranFullName: {},
        },
      };
      expect(getHospitalizationFacilityTitle(formData)).to.equal(
        "What's the name and address of the hospital where you are admitted?",
      );
    });

    it('should return default claimant text when claimant is not veteran without name', () => {
      const formData = {
        claimantRelationship: {
          relationship: 'spouse',
        },
        claimantInformation: {
          claimantFullName: {},
        },
      };
      expect(getHospitalizationFacilityTitle(formData)).to.equal(
        "What's the name and address of the hospital where the claimant is admitted?",
      );
    });

    it('should handle child relationship', () => {
      const formData = {
        claimantRelationship: {
          relationship: 'child',
        },
        claimantInformation: {
          claimantFullName: {
            first: 'Luke',
            last: 'Skywalker',
          },
        },
      };
      expect(getHospitalizationFacilityTitle(formData)).to.equal(
        "What's the name and address of the hospital where Luke Skywalker is admitted?",
      );
    });

    it('should handle parent relationship', () => {
      const formData = {
        claimantRelationship: {
          relationship: 'parent',
        },
        claimantInformation: {
          claimantFullName: {
            first: 'Shmi',
            last: 'Skywalker',
          },
        },
      };
      expect(getHospitalizationFacilityTitle(formData)).to.equal(
        "What's the name and address of the hospital where Shmi Skywalker is admitted?",
      );
    });

    it('should handle missing relationship', () => {
      const formData = {};
      expect(getHospitalizationFacilityTitle(formData)).to.equal(
        "What's the name and address of the hospital where the claimant is admitted?",
      );
    });

    it('should handle first name only', () => {
      const formData = {
        claimantRelationship: {
          relationship: 'veteran',
        },
        veteranInformation: {
          veteranFullName: {
            first: 'Chewbacca',
            last: '',
          },
        },
      };
      expect(getHospitalizationFacilityTitle(formData)).to.equal(
        "What's the name and address of the hospital where Chewbacca is admitted?",
      );
    });
  });
});
