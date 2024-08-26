import { expect } from 'chai';

import {
  FORM_DESCRIPTIONS,
  SIP_ENABLED_FORMS,
  MY_VA_SIP_FORMS,
} from '~/platform/forms/constants';

import {
  normalizeSubmissionStatus,
  formatSubmissionDisplayStatus,
} from '../helpers';

describe('profile helpers:', () => {
  describe('FORM_DESCRIPTIONS', () => {
    it('should have description information for each verified form', () => {
      SIP_ENABLED_FORMS.forEach(form => {
        expect(FORM_DESCRIPTIONS[form]).to.exist;
      });
    });
  });

  describe('MY_VA_SIP_FORMS', () => {
    it('should have description information for each verified form', () => {
      MY_VA_SIP_FORMS.forEach(form => {
        expect(form.description).to.exist;
      });
    });
  });

  describe('normalizeSubmissionStatus', () => {
    it('throws TypeError if no string is provided', () => {
      expect(normalizeSubmissionStatus).to.throw(TypeError);
    });

    it('should normalize "actionNeeded" from api submission status', () => {
      ['error', 'expired'].forEach(value => {
        expect(normalizeSubmissionStatus(value)).to.equal('actionNeeded');
      });
    });

    it('should normalize "received" from api submission status', () => {
      ['received', 'processing', 'success', 'VBMS'].forEach(value => {
        expect(normalizeSubmissionStatus(value)).to.equal('received');
      });
    });

    it('should normalize "inProgress" from api submission status', () => {
      ['pending', 'uploaded'].forEach(value => {
        expect(normalizeSubmissionStatus(value)).to.equal('inProgress');
      });
    });
  });

  describe('formatSubmissionDisplayStatus', () => {
    it('returns undefind with unknownn api status', () => {
      expect(formatSubmissionDisplayStatus()).to.be.undefined;
    });

    it('returns xpcted strigs from normalized submission status', () => {
      expect(formatSubmissionDisplayStatus('inProgress')).to.equal(
        'Submission in Progress',
      );
      expect(formatSubmissionDisplayStatus('actionNeeded')).to.equal(
        'Action Needed',
      );
      expect(formatSubmissionDisplayStatus('received')).to.equal('Received');
    });
  });
});
