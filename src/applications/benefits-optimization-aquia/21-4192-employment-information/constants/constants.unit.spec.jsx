/**
 * @module tests/constants.unit.spec
 * @description Unit tests for application constants
 */

import { expect } from 'chai';
import {
  EMPLOYMENT_STATUS,
  SECTIONS,
  SUBMISSION_STATUS,
  SUBTITLE,
  TERMINATION_REASONS,
  TIME_LOST_UNITS,
  TITLE,
} from './constants';

describe('Constants', () => {
  describe('Form Title and Subtitle', () => {
    it('should have correct title', () => {
      expect(TITLE).to.exist;
      expect(TITLE).to.be.a('string');
      expect(TITLE).to.include('Employment Information');
    });

    it('should have correct subtitle', () => {
      expect(SUBTITLE).to.exist;
      expect(SUBTITLE).to.equal(
        'Request for Employment Information in Connection with Claim for Disability Benefits (VA Form 21-4192)',
      );
    });
  });

  describe('Submission Status', () => {
    it('should have submission status object', () => {
      expect(SUBMISSION_STATUS).to.be.an('object');
    });

    it('should have NOT_ATTEMPTED status', () => {
      expect(SUBMISSION_STATUS.NOT_ATTEMPTED).to.equal('not-attempted');
    });

    it('should have PENDING status', () => {
      expect(SUBMISSION_STATUS.PENDING).to.equal('pending');
    });

    it('should have SUCCEEDED status', () => {
      expect(SUBMISSION_STATUS.SUCCEEDED).to.equal('succeeded');
    });

    it('should have FAILED status', () => {
      expect(SUBMISSION_STATUS.FAILED).to.equal('failed');
    });

    it('should have exactly 4 status types', () => {
      expect(Object.keys(SUBMISSION_STATUS)).to.have.lengthOf(4);
    });
  });

  describe('Form Sections', () => {
    it('should have sections object', () => {
      expect(SECTIONS).to.be.an('object');
    });

    it('should have EMPLOYER_INFORMATION section', () => {
      expect(SECTIONS.EMPLOYER_INFORMATION).to.equal('employer-information');
    });

    it('should have VETERAN_INFORMATION section', () => {
      expect(SECTIONS.VETERAN_INFORMATION).to.equal('veteran-information');
    });

    it('should have EMPLOYMENT_DETAILS section', () => {
      expect(SECTIONS.EMPLOYMENT_DETAILS).to.equal('employment-details');
    });

    it('should have TERMINATION_INFO section', () => {
      expect(SECTIONS.TERMINATION_INFO).to.equal('termination-info');
    });

    it('should have BENEFITS_INFO section', () => {
      expect(SECTIONS.BENEFITS_INFO).to.equal('benefits-info');
    });

    it('should have RESERVE_GUARD section', () => {
      expect(SECTIONS.RESERVE_GUARD).to.equal('reserve-guard');
    });

    it('should have CERTIFICATION section', () => {
      expect(SECTIONS.CERTIFICATION).to.equal('certification');
    });

    it('should have exactly 7 sections', () => {
      expect(Object.keys(SECTIONS)).to.have.lengthOf(7);
    });
  });

  describe('Employment Status', () => {
    it('should have employment status object', () => {
      expect(EMPLOYMENT_STATUS).to.be.an('object');
    });

    it('should have CURRENT status', () => {
      expect(EMPLOYMENT_STATUS.CURRENT).to.equal('current');
    });

    it('should have TERMINATED status', () => {
      expect(EMPLOYMENT_STATUS.TERMINATED).to.equal('terminated');
    });

    it('should have exactly 2 employment status types', () => {
      expect(Object.keys(EMPLOYMENT_STATUS)).to.have.lengthOf(2);
    });
  });

  describe('Termination Reasons', () => {
    it('should have termination reasons object', () => {
      expect(TERMINATION_REASONS).to.be.an('object');
    });

    it('should have RESIGNED reason', () => {
      expect(TERMINATION_REASONS.RESIGNED).to.equal('resigned');
    });

    it('should have LAID_OFF reason', () => {
      expect(TERMINATION_REASONS.LAID_OFF).to.equal('laid_off');
    });

    it('should have RETIRED_DISABILITY reason', () => {
      expect(TERMINATION_REASONS.RETIRED_DISABILITY).to.equal(
        'retired_disability',
      );
    });

    it('should have RETIRED_AGE reason', () => {
      expect(TERMINATION_REASONS.RETIRED_AGE).to.equal('retired_age');
    });

    it('should have OTHER reason', () => {
      expect(TERMINATION_REASONS.OTHER).to.equal('other');
    });

    it('should have exactly 5 termination reasons', () => {
      expect(Object.keys(TERMINATION_REASONS)).to.have.lengthOf(5);
    });
  });

  describe('Time Lost Units', () => {
    it('should have time lost units object', () => {
      expect(TIME_LOST_UNITS).to.be.an('object');
    });

    it('should have DAYS unit', () => {
      expect(TIME_LOST_UNITS.DAYS).to.equal('days');
    });

    it('should have HOURS unit', () => {
      expect(TIME_LOST_UNITS.HOURS).to.equal('hours');
    });

    it('should have exactly 2 time units', () => {
      expect(Object.keys(TIME_LOST_UNITS)).to.have.lengthOf(2);
    });
  });

  describe('Constant Values Format', () => {
    it('should use kebab-case for section values', () => {
      Object.values(SECTIONS).forEach(value => {
        expect(value).to.match(/^[a-z]+(-[a-z]+)*$/);
      });
    });

    it('should use kebab-case for submission status values', () => {
      Object.values(SUBMISSION_STATUS).forEach(value => {
        expect(value).to.match(/^[a-z]+(-[a-z]+)*$/);
      });
    });

    it('should use lowercase for employment status values', () => {
      Object.values(EMPLOYMENT_STATUS).forEach(value => {
        expect(value).to.match(/^[a-z]+$/);
      });
    });

    it('should use snake_case or lowercase for termination reasons', () => {
      Object.values(TERMINATION_REASONS).forEach(value => {
        expect(value).to.match(/^[a-z]+(_[a-z]+)*$/);
      });
    });

    it('should use lowercase for time units', () => {
      Object.values(TIME_LOST_UNITS).forEach(value => {
        expect(value).to.match(/^[a-z]+$/);
      });
    });
  });

  describe('Constant Immutability', () => {
    it('should not allow adding new status types', () => {
      const originalLength = Object.keys(SUBMISSION_STATUS).length;
      SUBMISSION_STATUS.NEW_STATUS = 'new';
      expect(Object.keys(SUBMISSION_STATUS)).to.have.lengthOf(
        originalLength + 1,
      );
      delete SUBMISSION_STATUS.NEW_STATUS;
    });

    it('should export all constants', () => {
      expect(TITLE).to.exist;
      expect(SUBTITLE).to.exist;
      expect(SUBMISSION_STATUS).to.exist;
      expect(SECTIONS).to.exist;
      expect(EMPLOYMENT_STATUS).to.exist;
      expect(TERMINATION_REASONS).to.exist;
      expect(TIME_LOST_UNITS).to.exist;
    });
  });
});
