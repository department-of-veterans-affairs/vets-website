import { expect } from 'chai';
import sinon from 'sinon';
import {
  isCompletingModern4142,
  baseDoNew4142Logic,
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
