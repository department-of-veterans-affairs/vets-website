import { expect } from 'chai';
import sinon from 'sinon';
import {
  isCompletingModern4142,
  baseDoNew4142Logic,
  onFormLoaded,
  redirectLegacyToEnhancement,
  redirectEnhancementToLegacy,
  hasEvidenceChoice,
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

    it('should redirect to evidence-request when legacy to enhancement transition needed', () => {
      const router = { push: sinon.spy() };
      const formData = {
        disability526SupportingEvidenceEnhancement: true,
      };
      onFormLoaded({
        returnUrl: '/supporting-evidence/evidence-types',
        formData,
        router,
      });
      expect(router.push.calledWith('/supporting-evidence/evidence-request')).to
        .be.true;
    });

    it('should redirect to evidence-types when enhancement to legacy transition needed', () => {
      const router = { push: sinon.spy() };
      const formData = {
        disability526SupportingEvidenceEnhancement: false,
      };
      onFormLoaded({
        returnUrl: '/supporting-evidence/evidence-request',
        formData,
        router,
      });
      expect(router.push.calledWith('/supporting-evidence/evidence-types')).to
        .be.true;
    });
  });

  describe('redirectLegacyToEnhancement', () => {
    it('should return true when returnUrl matches and formData indicates enhancement flow', () => {
      expect(
        redirectLegacyToEnhancement({
          returnUrl: '/supporting-evidence/evidence-types',
          formData: { disability526SupportingEvidenceEnhancement: true },
        }),
      ).to.be.true;
    });

    it('should return false otherwise', () => {
      expect(
        redirectLegacyToEnhancement({
          returnUrl: '/supporting-evidence/evidence-request',
          formData: { disability526SupportingEvidenceEnhancement: true },
        }),
      ).to.be.false;
      expect(
        redirectLegacyToEnhancement({
          returnUrl: '/supporting-evidence/evidence-types',
          formData: { disability526SupportingEvidenceEnhancement: false },
        }),
      ).to.be.false;
    });
  });

  describe('redirectEnhancementToLegacy', () => {
    it('should return true when returnUrl matches enhancement pages and formData indicates legacy flow', () => {
      expect(
        redirectEnhancementToLegacy({
          returnUrl: '/supporting-evidence/evidence-request',
          formData: { disability526SupportingEvidenceEnhancement: false },
        }),
      ).to.be.true;
      expect(
        redirectEnhancementToLegacy({
          returnUrl: '/supporting-evidence/medical-records',
          formData: { disability526SupportingEvidenceEnhancement: false },
        }),
      ).to.be.true;
    });

    it('should return false otherwise', () => {
      expect(
        redirectEnhancementToLegacy({
          returnUrl: '/supporting-evidence/evidence-request',
          formData: { disability526SupportingEvidenceEnhancement: true },
        }),
      ).to.be.false;
      expect(
        redirectEnhancementToLegacy({
          returnUrl: '/supporting-evidence/evidence-types',
          formData: { disability526SupportingEvidenceEnhancement: false },
        }),
      ).to.be.false;
    });
  });

  describe('hasEvidenceChoice', () => {
    it('returns true when the radio selection is yes', () => {
      expect(hasEvidenceChoice({ 'view:hasEvidenceChoice': true })).to.be.true;
    });

    it('returns false when no selection or uploads exist', () => {
      expect(hasEvidenceChoice({})).to.be.false;
    });
  });
});
