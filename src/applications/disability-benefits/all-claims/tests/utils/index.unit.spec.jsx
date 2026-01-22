import { expect } from 'chai';
import sinon from 'sinon';
import {
  baseDoNew4142Logic,
  getWorkflowRedirect,
  isCompletingModern4142,
  onFormLoaded,
} from '../../utils';

describe('utils', () => {
  describe('isCompletingModern4142', () => {
    it('should return true if disability526Enable2024Form4142 is true', () => {
      const formData = { disability526Enable2024Form4142: true };
      expect(isCompletingModern4142(formData)).to.be.true;
    });

    it('should return false if disability526Enable2024Form4142 is false', () => {
      const formData = { disability526Enable2024Form4142: false };
      expect(isCompletingModern4142(formData)).to.be.false;
    });
  });

  describe('baseDoNew4142Logic', () => {
    it('should return true if all conditions are met', () => {
      const formData = {
        disability526Enable2024Form4142: true,
        'view:hasEvidence': true,
        'view:selectableEvidenceTypes': {
          'view:hasPrivateMedicalRecords': true,
        },
        'view:patientAcknowledgement': { 'view:acknowledgement': true },
        'view:uploadPrivateRecordsQualifier': {
          'view:hasPrivateRecordsToUpload': false,
        },
        patient4142Acknowledgement: false,
      };
      expect(baseDoNew4142Logic(formData)).to.be.true;
    });

    it('should return false if any condition is not met', () => {
      const formData = {
        disability526Enable2024Form4142: false,
      };
      expect(baseDoNew4142Logic(formData)).to.be.false;
    });
  });

  describe('onFormLoaded', () => {
    it('should redirect to modern 4142 choice if conditions are met', () => {
      const router = { push: sinon.spy() };
      const formData = {
        disability526Enable2024Form4142: true,
        'view:hasEvidence': true,
        'view:patientAcknowledgement': { 'view:acknowledgement': true },
        'view:uploadPrivateRecordsQualifier': {
          'view:hasPrivateRecordsToUpload': false,
        },
        'view:selectableEvidenceTypes': {
          'view:hasPrivateMedicalRecords': true,
        },
        patient4142Acknowledgement: false,
      };
      onFormLoaded({ formData, router });
      expect(
        router.push.calledWith('/supporting-evidence/private-medical-records'),
      ).to.be.true;
    });
  });
});

describe('getWorkflowRedirect when new conditions flag is ON', () => {
  it('returns /conditions/orientation when new conditions is ON and returnUrl is in current workflow', () => {
    const formData = { disabilityCompNewConditionsWorkflow: true };
    const returnUrl = '/disabilities/rated-disabilities';
    const pathname = '/somewhere-else';
    const target = getWorkflowRedirect({ formData, returnUrl, pathname });

    expect(target).to.equal('/conditions/orientation');
  });

  it('returns null (no redirect) when already on /conditions/orientation', () => {
    const formData = { disabilityCompNewConditionsWorkflow: true };
    const returnUrl = '/disabilities/rated-disabilities';
    const pathname = '/conditions/orientation';
    const target = getWorkflowRedirect({ formData, returnUrl, pathname });

    expect(target).to.equal(null);
  });
});

describe('getWorkflowRedirect when new conditions flag is OFF', () => {
  it('returns /veteran-information when new conditions is OFF and returnUrl is in new workflow', () => {
    const formData = { disabilityCompNewConditionsWorkflow: false };
    const returnUrl = '/conditions/orientation';
    const pathname = '/somewhere-else';
    const target = getWorkflowRedirect({ formData, returnUrl, pathname });

    expect(target).to.equal('/veteran-information');
  });

  it('returns null (no redirect) when already on /veteran-information', () => {
    const formData = { disabilityCompNewConditionsWorkflow: false };
    const returnUrl = '/conditions/orientation';
    const pathname = '/veteran-information';
    const target = getWorkflowRedirect({ formData, returnUrl, pathname });

    expect(target).to.equal(null);
  });
});
