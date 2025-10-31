import { expect } from 'chai';
import { FORM_DESCRIPTIONS, MY_VA_SIP_FORMS } from '~/platform/forms/constants';

import {
  normalizeSubmissionStatus,
  formatSubmissionDisplayStatus,
} from '../helpers';

describe('profile helpers:', () => {
  describe('FORM_DESCRIPTIONS', () => {
    it('should have description information for each verified form', () => {
      MY_VA_SIP_FORMS.forEach(form => {
        expect(FORM_DESCRIPTIONS[form.id]).to.exist;
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
      ['VBMS'].forEach(value => {
        expect(normalizeSubmissionStatus(value)).to.equal('received');
      });
    });

    // Keeping this test commented out for discussion in PR.
    // it('should normalize "inProgress" from api submission status', () => {
    //   ['pending', 'uploaded', 'received', 'processing', 'success'].forEach(
    //     value => {
    //       expect(normalizeSubmissionStatus(value)).to.equal('inProgress');
    //     },
    //   );
    // });

    it('should return already normalized statuses unchanged', () => {
      // API sends already normalized values: 'inProgress', 'received', 'actionNeeded'
      expect(normalizeSubmissionStatus('inProgress')).to.equal('inProgress');
      expect(normalizeSubmissionStatus('received')).to.equal('received');
      expect(normalizeSubmissionStatus('actionNeeded')).to.equal(
        'actionNeeded',
      );
    });

    it('should handle edge case for vbms status', () => {
      // vbms is a special case that may not be normalized by API
      expect(normalizeSubmissionStatus('vbms')).to.equal('received');
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
