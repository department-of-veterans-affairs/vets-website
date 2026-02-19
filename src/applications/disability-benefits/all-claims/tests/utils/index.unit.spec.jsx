import { expect } from 'chai';
import sinon from 'sinon';
import {
  isCompletingModern4142,
  baseDoNew4142Logic,
  onFormLoaded,
  redirectLegacyToEnhancement,
  redirectEnhancementToLegacy,
  redirectOldFlowToNewFlow,
  isNewConditionsOn,
  isNewConditionsOff,
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

  describe('isNewConditionsOn', () => {
    it('returns true when disabilityCompNewConditionsWorkflow is true', () => {
      expect(isNewConditionsOn({ disabilityCompNewConditionsWorkflow: true }))
        .to.be.true;
    });

    it('returns false when disabilityCompNewConditionsWorkflow is false', () => {
      expect(isNewConditionsOn({ disabilityCompNewConditionsWorkflow: false }))
        .to.be.false;
    });

    it('returns false when disabilityCompNewConditionsWorkflow is undefined', () => {
      expect(isNewConditionsOn({})).to.be.false;
    });

    it('returns false when formData is undefined', () => {
      expect(isNewConditionsOn(undefined)).to.be.false;
    });

    it('returns false when formData is null', () => {
      expect(isNewConditionsOn(null)).to.be.false;
    });
  });

  describe('isNewConditionsOff', () => {
    it('returns true when disabilityCompNewConditionsWorkflow is false', () => {
      expect(isNewConditionsOff({ disabilityCompNewConditionsWorkflow: false }))
        .to.be.true;
    });

    it('returns true when disabilityCompNewConditionsWorkflow is absent', () => {
      expect(isNewConditionsOff({})).to.be.true;
    });

    it('returns false when disabilityCompNewConditionsWorkflow is true', () => {
      expect(isNewConditionsOff({ disabilityCompNewConditionsWorkflow: true }))
        .to.be.false;
    });
  });

  describe('redirectOldFlowToNewFlow', () => {
    const newFlowFormData = { disabilityCompNewConditionsWorkflow: true };
    const oldFlowFormData = { disabilityCompNewConditionsWorkflow: false };
    const noFlagFormData = {};

    describe('when new conditions workflow is ON', () => {
      it('returns true for /claim-type', () => {
        expect(
          redirectOldFlowToNewFlow({
            returnUrl: '/claim-type',
            formData: newFlowFormData,
          }),
        ).to.be.true;
      });

      it('returns true for /disabilities/orientation', () => {
        expect(
          redirectOldFlowToNewFlow({
            returnUrl: '/disabilities/orientation',
            formData: newFlowFormData,
          }),
        ).to.be.true;
      });

      it('returns true for /disabilities/rated-disabilities', () => {
        expect(
          redirectOldFlowToNewFlow({
            returnUrl: '/disabilities/rated-disabilities',
            formData: newFlowFormData,
          }),
        ).to.be.true;
      });

      it('returns true for /disabilities/summary', () => {
        expect(
          redirectOldFlowToNewFlow({
            returnUrl: '/disabilities/summary',
            formData: newFlowFormData,
          }),
        ).to.be.true;
      });

      it('returns true for /new-disabilities/add', () => {
        expect(
          redirectOldFlowToNewFlow({
            returnUrl: '/new-disabilities/add',
            formData: newFlowFormData,
          }),
        ).to.be.true;
      });

      it('returns true for /new-disabilities/follow-up', () => {
        expect(
          redirectOldFlowToNewFlow({
            returnUrl: '/new-disabilities/follow-up',
            formData: newFlowFormData,
          }),
        ).to.be.true;
      });

      it('returns true for parameterized old-flow paths like /new-disabilities/follow-up/0', () => {
        expect(
          redirectOldFlowToNewFlow({
            returnUrl: '/new-disabilities/follow-up/0',
            formData: newFlowFormData,
          }),
        ).to.be.true;
      });

      it('returns true for parameterized old-flow paths like /new-disabilities/follow-up/3', () => {
        expect(
          redirectOldFlowToNewFlow({
            returnUrl: '/new-disabilities/follow-up/3',
            formData: newFlowFormData,
          }),
        ).to.be.true;
      });

      it('returns false for new-flow paths like /conditions/summary', () => {
        expect(
          redirectOldFlowToNewFlow({
            returnUrl: '/conditions/summary',
            formData: newFlowFormData,
          }),
        ).to.be.false;
      });

      it('returns false for unrelated paths like /veteran-information', () => {
        expect(
          redirectOldFlowToNewFlow({
            returnUrl: '/veteran-information',
            formData: newFlowFormData,
          }),
        ).to.be.false;
      });

      it('returns false for /contact-information', () => {
        expect(
          redirectOldFlowToNewFlow({
            returnUrl: '/contact-information',
            formData: newFlowFormData,
          }),
        ).to.be.false;
      });

      it('returns false for evidence paths', () => {
        expect(
          redirectOldFlowToNewFlow({
            returnUrl: '/supporting-evidence/evidence-types',
            formData: newFlowFormData,
          }),
        ).to.be.false;
      });
    });

    describe('when new conditions workflow is OFF', () => {
      it('returns false for old-flow paths when flag is false', () => {
        expect(
          redirectOldFlowToNewFlow({
            returnUrl: '/claim-type',
            formData: oldFlowFormData,
          }),
        ).to.be.false;
      });

      it('returns false for old-flow paths when flag is absent', () => {
        expect(
          redirectOldFlowToNewFlow({
            returnUrl: '/new-disabilities/add',
            formData: noFlagFormData,
          }),
        ).to.be.false;
      });

      it('returns false for /disabilities/rated-disabilities when flag is off', () => {
        expect(
          redirectOldFlowToNewFlow({
            returnUrl: '/disabilities/rated-disabilities',
            formData: oldFlowFormData,
          }),
        ).to.be.false;
      });
    });

    describe('edge cases', () => {
      it('returns false when returnUrl is undefined', () => {
        expect(
          redirectOldFlowToNewFlow({
            returnUrl: undefined,
            formData: newFlowFormData,
          }),
        ).to.be.false;
      });

      it('returns false when returnUrl is null', () => {
        expect(
          redirectOldFlowToNewFlow({
            returnUrl: null,
            formData: newFlowFormData,
          }),
        ).to.be.false;
      });

      it('returns false when returnUrl is empty string', () => {
        expect(
          redirectOldFlowToNewFlow({
            returnUrl: '',
            formData: newFlowFormData,
          }),
        ).to.be.false;
      });

      it('does not match partial path prefixes (e.g. /claim-type-something)', () => {
        // /claim-type-something should not match /claim-type because
        // the check is exact match OR startsWith('/claim-type/')
        expect(
          redirectOldFlowToNewFlow({
            returnUrl: '/claim-type-something',
            formData: newFlowFormData,
          }),
        ).to.be.false;
      });
    });
  });

  describe('onFormLoaded — old-flow redirect', () => {
    // Minimal formData that won't trigger other redirect branches
    const baseFormData = {
      disability526Enable2024Form4142: false,
    };

    it('redirects to /contact-information when new conditions is ON and returnUrl is an old-flow path', () => {
      const router = { push: sinon.spy() };
      const formData = {
        ...baseFormData,
        disabilityCompNewConditionsWorkflow: true,
      };
      onFormLoaded({
        returnUrl: '/new-disabilities/add',
        formData,
        router,
      });
      expect(router.push.calledOnce).to.be.true;
      expect(router.push.calledWith('/contact-information')).to.be.true;
    });

    it('redirects to /contact-information for /claim-type when new conditions is ON', () => {
      const router = { push: sinon.spy() };
      const formData = {
        ...baseFormData,
        disabilityCompNewConditionsWorkflow: true,
      };
      onFormLoaded({
        returnUrl: '/claim-type',
        formData,
        router,
      });
      expect(router.push.calledWith('/contact-information')).to.be.true;
    });

    it('redirects to /contact-information for /disabilities/rated-disabilities when new conditions is ON', () => {
      const router = { push: sinon.spy() };
      const formData = {
        ...baseFormData,
        disabilityCompNewConditionsWorkflow: true,
      };
      onFormLoaded({
        returnUrl: '/disabilities/rated-disabilities',
        formData,
        router,
      });
      expect(router.push.calledWith('/contact-information')).to.be.true;
    });

    it('redirects to /contact-information for /disabilities/orientation when new conditions is ON', () => {
      const router = { push: sinon.spy() };
      const formData = {
        ...baseFormData,
        disabilityCompNewConditionsWorkflow: true,
      };
      onFormLoaded({
        returnUrl: '/disabilities/orientation',
        formData,
        router,
      });
      expect(router.push.calledWith('/contact-information')).to.be.true;
    });

    it('redirects to /contact-information for /disabilities/summary when new conditions is ON', () => {
      const router = { push: sinon.spy() };
      const formData = {
        ...baseFormData,
        disabilityCompNewConditionsWorkflow: true,
      };
      onFormLoaded({
        returnUrl: '/disabilities/summary',
        formData,
        router,
      });
      expect(router.push.calledWith('/contact-information')).to.be.true;
    });

    it('redirects to /contact-information for /new-disabilities/follow-up/0 when new conditions is ON', () => {
      const router = { push: sinon.spy() };
      const formData = {
        ...baseFormData,
        disabilityCompNewConditionsWorkflow: true,
      };
      onFormLoaded({
        returnUrl: '/new-disabilities/follow-up/0',
        formData,
        router,
      });
      expect(router.push.calledWith('/contact-information')).to.be.true;
    });

    it('does NOT redirect to /contact-information when new conditions is OFF', () => {
      const router = { push: sinon.spy() };
      const formData = {
        ...baseFormData,
        disabilityCompNewConditionsWorkflow: false,
      };
      onFormLoaded({
        returnUrl: '/new-disabilities/add',
        formData,
        router,
      });
      // Should fall through to the default branch and push returnUrl
      expect(router.push.calledWith('/new-disabilities/add')).to.be.true;
    });

    it('does NOT redirect to /contact-information when flag is absent', () => {
      const router = { push: sinon.spy() };
      const formData = { ...baseFormData };
      onFormLoaded({
        returnUrl: '/claim-type',
        formData,
        router,
      });
      expect(router.push.calledWith('/claim-type')).to.be.true;
    });

    it('does NOT redirect for new-flow paths even when new conditions is ON', () => {
      const router = { push: sinon.spy() };
      const formData = {
        ...baseFormData,
        disabilityCompNewConditionsWorkflow: true,
      };
      onFormLoaded({
        returnUrl: '/conditions/summary',
        formData,
        router,
      });
      // Should fall through to the default and push returnUrl
      expect(router.push.calledWith('/conditions/summary')).to.be.true;
    });

    it('does NOT redirect for unrelated paths when new conditions is ON', () => {
      const router = { push: sinon.spy() };
      const formData = {
        ...baseFormData,
        disabilityCompNewConditionsWorkflow: true,
      };
      onFormLoaded({
        returnUrl: '/veteran-information',
        formData,
        router,
      });
      expect(router.push.calledWith('/veteran-information')).to.be.true;
    });

    it('old-flow redirect takes priority over other redirect branches', () => {
      const router = { push: sinon.spy() };
      // Set up formData that would also trigger the evidence enhancement redirect
      const formData = {
        ...baseFormData,
        disabilityCompNewConditionsWorkflow: true,
        disability526SupportingEvidenceEnhancement: true,
      };
      // Use a returnUrl that matches old-flow (not evidence)
      onFormLoaded({
        returnUrl: '/new-disabilities/add',
        formData,
        router,
      });
      // Should redirect to /contact-information, not evidence-request
      expect(router.push.calledWith('/contact-information')).to.be.true;
    });
  });
});
