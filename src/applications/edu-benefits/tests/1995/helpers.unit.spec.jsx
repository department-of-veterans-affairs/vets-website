import { expect } from 'chai';

import {
  display1995StemFlow,
  displayStemEligibility,
  isChapter33,
  buildSubmitEventData,
} from '../../1995/helpers';

import minimalData from './schema/minimal-test.json';
import maximalData from './schema/maximal-test.json';

const defaultForm = {
  benefit: 'chapter33',
  isEdithNourseRogersScholarship: true,
  'view:exhaustionOfBenefits': true,
  'view:exhaustionOfBenefitsAfterPursuingTeachingCert': true,
  isEnrolledStem: true,
  isPursuingTeachingCert: true,
};
describe('helpers', () => {
  describe('isChapter33', () => {
    it('if benefit is chapter33', () => {
      expect(isChapter33(defaultForm)).to.equal(true);
    });
    it('if benefit is fryScholarship', () => {
      const form = {
        ...defaultForm,
        benefit: 'fryScholarship',
      };
      expect(isChapter33(form)).to.equal(true);
    });
    it('is not if benefit is chapter30', () => {
      const form = {
        ...defaultForm,
        benefit: 'chapter30',
      };
      expect(isChapter33(form)).to.equal(false);
    });
  });
  describe('displayStemEligibility', () => {
    it('is not displayed', () => {
      expect(displayStemEligibility(defaultForm)).to.equal(false);
    });
    it('when benefit is not chapter33', () => {
      const form = {
        ...defaultForm,
        benefit: 'chapter30',
      };
      expect(displayStemEligibility(form)).to.equal(true);
    });
    it('when benefit is not selected', () => {
      const form = {
        ...defaultForm,
        benefit: undefined,
      };
      expect(displayStemEligibility(form)).to.equal(false);
    });
    it('when either exhaustionOfBenefitses are false', () => {
      const form = {
        ...defaultForm,
        'view:exhaustionOfBenefits': false,
        'view:exhaustionOfBenefitsAfterPursuingTeachingCert': false,
      };
      expect(displayStemEligibility(form)).to.equal(true);
    });
    it('when isEnrolledStem and isPursuingTeachingCert are false', () => {
      const form = {
        ...defaultForm,
        isEnrolledStem: false,
        isPursuingTeachingCert: false,
      };
      expect(displayStemEligibility(form)).to.equal(true);
    });
  });

  it('display1995StemFlow', () => {
    it(' if eligible and isEdithNourseRogersScholarship', () => {
      expect(display1995StemFlow(defaultForm)).to.equal(true);
    });
    it('is not displayed if not EdithNourseRogersScholarship', () => {
      const form = {
        ...defaultForm,
        isEdithNourseRogersScholarship: false,
      };
      expect(display1995StemFlow(form)).to.equal(false);
    });
  });

  describe('buildSubmitEventData', () => {
    it('if minimal form data used', () => {
      expect(buildSubmitEventData(minimalData.data)).to.deep.equal({
        'benefits-used-recently': undefined,
        'new-service-periods-to-record': undefined,
        'service-details': [],
        'service-before-1978': undefined,
        'edu-desired-facility-name': 'Test',
        'edu-desired-type-of-education': 'correspondence',
        'edu-desired-facility-state': undefined,
        'edu-desired-facility-city': undefined,
        'edu-prior-facility-name': undefined,
        'edu-prior-facility-state': undefined,
        'edu-prior-facility-city': undefined,
        'edu-prior-facility-end-date': undefined,
        'preferred-contact-method': undefined,
        married: undefined,
        'dependent-children': undefined,
        'dependent-parent': undefined,
        'direct-deposit-method': undefined,
        'direct-deposit-account-type': undefined,
      });
    });
    it('if maximal form data used', () => {
      expect(buildSubmitEventData(maximalData.data)).to.deep.equal({
        'benefits-used-recently': 'chapter33',
        'new-service-periods-to-record': 'Yes',
        'service-details': [
          {
            'service-branch': 'Army',
            'service-start-date': '1995-01-01',
            'service-end-date': '1996-01-01',
          },
          {
            'service-branch': 'Navy',
            'service-start-date': undefined,
            'service-end-date': undefined,
          },
        ],
        'service-before-1978': 'Yes',
        'edu-desired-facility-name': 'Test',
        'edu-desired-type-of-education': 'correspondence',
        'edu-desired-facility-state': 'TN',
        'edu-desired-facility-city': 'Test',
        'edu-prior-facility-name': 'Old Test School',
        'edu-prior-facility-state': 'TN',
        'edu-prior-facility-city': 'Terst',
        'edu-prior-facility-end-date': '2018-03-02',
        'preferred-contact-method': 'mail',
        married: 'Yes',
        'dependent-children': 'No',
        'dependent-parent': 'No',
        'direct-deposit-method': 'startUpdate',
        'direct-deposit-account-type': 'checking',
      });
    });
  });
});
