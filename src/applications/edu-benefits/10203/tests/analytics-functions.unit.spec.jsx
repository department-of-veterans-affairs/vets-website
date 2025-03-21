import { expect } from 'chai';
import sinon from 'sinon';
import * as recordEventModule from 'platform/monitoring/record-event';
import analyticFunction from '../analytics-functions';

describe('AnalyticFunction Tests', () => {
  let recordEventStub;

  beforeEach(() => {
    // Stub the recordEvent function
    recordEventStub = sinon.stub(recordEventModule, 'default');
  });

  afterEach(() => {
    recordEventStub.restore();
  });

  describe('currentlyUsedBenefits', () => {
    it('should call recordEvent for each selected benefit', () => {
      const formData = {
        'view:benefit': {
          benefit1: true,
          benefit2: false,
          benefit3: true,
        },
      };

      analyticFunction.currentlyUsedBenefits(formData);

      expect(recordEventStub.calledTwice).to.be.true;
      expect(recordEventStub.firstCall.args[0]).to.deep.equal({
        event: 'edu-form-change',
        'edu-form-field':
          'Which benefit have you used or are you currently using?',
        'edu-form-value': 'benefit1',
        'edu-form-action': 'clicked',
      });
      expect(recordEventStub.secondCall.args[0]).to.deep.equal({
        event: 'edu-form-change',
        'edu-form-field':
          'Which benefit have you used or are you currently using?',
        'edu-form-value': 'benefit3',
        'edu-form-action': 'clicked',
      });
    });
  });

  describe('ineligibilityAlert', () => {
    it('should call recordEvent with correct data', () => {
      const data = {
        isChapter33: true,
        isEnrolledStem: false,
        isPursuingTeachingCert: true,
        isPursuingClinicalTraining: false,
        benefitLeft: 'sixMonths',
      };

      analyticFunction.ineligibilityAlert(data);

      expect(recordEventStub.calledOnce).to.be.true;
      expect(recordEventStub.firstCall.args[0]).to.deep.equal({
        event: 'edu-stem-scholarship-ineligibility-alert',
        'edu-eligibility-criteria-post911-met': true,
        'edu-eligibility-criteria-stem-or-teaching-met': true,
        'edu-eligibility-criteria-used-all-benefits-met': true,
        'edu-eligibility-criteria-months-remaining-for-use': 'sixMonths',
      });
    });
  });

  describe('exitApplication', () => {
    it('should call recordEvent once with the correct event name', () => {
      analyticFunction.exitApplication();

      expect(recordEventStub.calledOnce).to.be.true;
      expect(recordEventStub.firstCall.args[0]).to.deep.equal({
        event: 'cta-primary-button-click',
      });
    });
  });
});
