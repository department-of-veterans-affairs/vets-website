import { expect } from 'chai';
import sinon from 'sinon';
import { onFormLoaded, baseDoNew4142Logic } from '../utils/index';
import { getSharedVariable, clearSharedVariables } from '../utils/sharedState';

describe('onFormLoaded', () => {
  let mockRouter;
  let mockProps;

  beforeEach(() => {
    mockRouter = {
      push: sinon.spy(),
    };

    mockProps = {
      returnUrl: '/some/return/url',
      formData: {},
      router: mockRouter,
    };

    clearSharedVariables();
  });

  describe('baseDoNew4142Logic', () => {
    it('should return true when all conditions met', () => {
      const formData = {
        disability526Enable2024Form4142: true,
        'view:hasEvidence': true,
        'view:selectableEvidenceTypes': {
          'view:hasPrivateMedicalRecords': true,
        },
        'view:patientAcknowledgement': { 'view:acknowledgement': true },
      };
      expect(baseDoNew4142Logic(formData)).to.be.true;
    });

    it('should return false when upload qualifier indicates upload path', () => {
      const formData = {
        disability526Enable2024Form4142: true,
        'view:hasEvidence': true,
        'view:selectableEvidenceTypes': {
          'view:hasPrivateMedicalRecords': true,
        },
        'view:patientAcknowledgement': { 'view:acknowledgement': true },
        'view:uploadPrivateRecordsQualifier': {
          'view:hasPrivateRecordsToUpload': true,
        },
      };
      expect(baseDoNew4142Logic(formData)).to.be.false;
    });

    it('should return false when patient4142Acknowledgement already true', () => {
      const formData = {
        disability526Enable2024Form4142: true,
        'view:hasEvidence': true,
        'view:selectableEvidenceTypes': {
          'view:hasPrivateMedicalRecords': true,
        },
        'view:patientAcknowledgement': { 'view:acknowledgement': true },
        patient4142Acknowledgement: true,
      };
      expect(baseDoNew4142Logic(formData)).to.be.false;
    });
  });

  describe('when modern 4142 flow conditions are met', () => {
    it('redirects to private medical records and sets shared alert flag', () => {
      mockProps.formData = {
        disability526Enable2024Form4142: true,
        'view:hasEvidence': true,
        'view:patientAcknowledgement': { 'view:acknowledgement': true },
        'view:selectableEvidenceTypes': {
          'view:hasPrivateMedicalRecords': true,
        },
        'view:uploadPrivateRecordsQualifier': {
          'view:hasPrivateRecordsToUpload': false,
        },
        patient4142Acknowledgement: false,
      };

      onFormLoaded(mockProps);

      expect(mockRouter.push.calledOnce).to.be.true;
      expect(
        mockRouter.push.calledWith(
          '/supporting-evidence/private-medical-records',
        ),
      ).to.be.true;
      expect(getSharedVariable('alertNeedsShown4142')).to.be.true;
    });
  });

  describe('when modern 4142 flow conditions are NOT met', () => {
    it('uses returnUrl when feature flag disabled', () => {
      mockProps.formData = {
        disability526Enable2024Form4142: false,
        'view:hasEvidence': true,
        'view:patientAcknowledgement': { 'view:acknowledgement': true },
        'view:selectableEvidenceTypes': {
          'view:hasPrivateMedicalRecords': true,
        },
      };

      onFormLoaded(mockProps);

      expect(mockRouter.push.calledWith('/some/return/url')).to.be.true;
      expect(getSharedVariable('alertNeedsShown4142')).to.be.undefined;
    });

    it('uses returnUrl when patient acknowledgement missing', () => {
      mockProps.formData = {
        disability526Enable2024Form4142: true,
      };
      onFormLoaded(mockProps);
      expect(mockRouter.push.calledWith('/some/return/url')).to.be.true;
      expect(getSharedVariable('alertNeedsShown4142')).to.be.undefined;
    });

    it('uses returnUrl when patient acknowledgement is false', () => {
      mockProps.formData = {
        disability526Enable2024Form4142: true,
        'view:patientAcknowledgement': { 'view:acknowledgement': false },
      };
      onFormLoaded(mockProps);
      expect(mockRouter.push.calledWith('/some/return/url')).to.be.true;
      expect(getSharedVariable('alertNeedsShown4142')).to.be.undefined;
    });

    it('uses returnUrl when user chose upload path', () => {
      mockProps.formData = {
        disability526Enable2024Form4142: true,
        'view:hasEvidence': true,
        'view:patientAcknowledgement': { 'view:acknowledgement': true },
        'view:uploadPrivateRecordsQualifier': {
          'view:hasPrivateRecordsToUpload': true,
        },
      };
      onFormLoaded(mockProps);
      expect(mockRouter.push.calledWith('/some/return/url')).to.be.true;
      expect(getSharedVariable('alertNeedsShown4142')).to.be.undefined;
    });

    it('uses returnUrl when patient4142Acknowledgement already true', () => {
      mockProps.formData = {
        disability526Enable2024Form4142: true,
        'view:hasEvidence': true,
        'view:patientAcknowledgement': { 'view:acknowledgement': true },
        patient4142Acknowledgement: true,
      };
      onFormLoaded(mockProps);
      expect(mockRouter.push.calledWith('/some/return/url')).to.be.true;
      expect(getSharedVariable('alertNeedsShown4142')).to.be.undefined;
    });
  });

  describe('special returnUrl handling (feature flag toggled off after save)', () => {
    it('redirects to private medical records when returnUrl points to hidden page and flipper off', () => {
      mockProps.returnUrl =
        '/supporting-evidence/private-medical-records-authorize-release';
      mockProps.formData = {
        disability526Enable2024Form4142: false,
        'view:hasEvidence': true,
        'view:selectableEvidenceTypes': {
          'view:hasPrivateMedicalRecords': true,
        },
      };
      onFormLoaded(mockProps);
      expect(
        mockRouter.push.calledWith(
          '/supporting-evidence/private-medical-records',
        ),
      ).to.be.true;
    });

    it('still redirects via modern flow when flipper on and returnUrl authorize page', () => {
      mockProps.returnUrl =
        '/supporting-evidence/private-medical-records-authorize-release';
      mockProps.formData = {
        disability526Enable2024Form4142: true,
        'view:hasEvidence': true,
        'view:selectableEvidenceTypes': {
          'view:hasPrivateMedicalRecords': true,
        },
        'view:patientAcknowledgement': { 'view:acknowledgement': true },
      };
      onFormLoaded(mockProps);
      expect(
        mockRouter.push.calledWith(
          '/supporting-evidence/private-medical-records',
        ),
      ).to.be.true;
      expect(getSharedVariable('alertNeedsShown4142')).to.be.true;
    });

    it('should redirect to evidence types when user has no evidence', () => {
      mockProps.returnUrl =
        '/supporting-evidence/private-medical-records-authorize-release';
      mockProps.formData = {
        'view:hasEvidence': false,
      };

      onFormLoaded(mockProps);
      expect(mockRouter.push.calledWith('/supporting-evidence/evidence-types'))
        .to.be.true;
      expect(getSharedVariable('alertNeedsShown4142')).to.be.undefined;
    });

    it('should redirect from private medical records page when no evidence', () => {
      mockProps.returnUrl = '/supporting-evidence/private-medical-records';
      mockProps.formData = {
        'view:hasEvidence': false,
      };

      onFormLoaded(mockProps);

      expect(mockRouter.push.calledWith('/supporting-evidence/evidence-types'))
        .to.be.true;
    });

    it('should redirect to returnUrl when no special conditions are met', () => {
      mockProps.returnUrl = '/disabilities/rated-disabilities';
      mockProps.formData = {
        disability526Enable2024Form4142: true,
        'view:hasEvidence': true,
        'view:selectableEvidenceTypes': {
          'view:hasPrivateMedicalRecords': false,
        },
      };

      onFormLoaded(mockProps);

      expect(mockRouter.push.calledWith('/disabilities/rated-disabilities')).to
        .be.true;
      expect(getSharedVariable('alertNeedsShown4142')).to.be.undefined;
    });
  });

  describe('edge cases', () => {
    it('handles empty formData object', () => {
      mockProps.formData = {};
      onFormLoaded(mockProps);
      expect(mockRouter.push.calledWith('/some/return/url')).to.be.true;
    });

    it('handles undefined returnUrl', () => {
      mockProps.returnUrl = undefined;
      mockProps.formData = { disability526Enable2024Form4142: false };
      onFormLoaded(mockProps);
      expect(mockRouter.push.calledWith(undefined)).to.be.true;
    });
  });
});
