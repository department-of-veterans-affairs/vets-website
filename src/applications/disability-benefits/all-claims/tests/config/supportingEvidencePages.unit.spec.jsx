import { expect } from 'chai';
import { add, format } from 'date-fns';
import { DATE_TEMPLATE } from '../../utils/dates/formatting';
import formConfig from '../../config/form';

const formatDate = date => format(date, DATE_TEMPLATE);
const daysFromToday = days => formatDate(add(new Date(), { days }));

/**
 * Creates form data representing a BDD (Benefits Delivery at Discharge) user
 * with a service period ending 90 days from today.
 *
 * @param {Object} [overrides] - Additional form data properties
 * @returns {Object} BDD form data
 */
const createBDDFormData = (overrides = {}) => ({
  'view:isBddData': true,
  serviceInformation: {
    servicePeriods: [
      {
        dateRange: {
          to: daysFromToday(90),
        },
      },
    ],
  },
  ...overrides,
});

/**
 * Creates form data with the supporting evidence enhancement toggle ON
 * and FileInputV3 ON (V0 pages using `va-file-input-multiple`).
 *
 * @param {Object} [overrides] - Additional form data properties
 * @returns {Object} Enhancement flow form data
 */
const createEnhancementFlowFormData = (overrides = {}) => ({
  disability526SupportingEvidenceEnhancement: true,
  disability526SupportingEvidenceFileInputV3: true,
  ...overrides,
});

/**
 * Creates form data with the supporting evidence enhancement toggle OFF
 * (legacy flow).
 *
 * @param {Object} [overrides] - Additional form data properties
 * @returns {Object} Legacy flow form data
 */
const createLegacyFlowFormData = (overrides = {}) => ({
  disability526SupportingEvidenceEnhancement: false,
  ...overrides,
});

describe('Supporting Evidence Pages - Conditional Rendering', () => {
  const {
    evidenceTypes,
    evidenceRequest,
    medicalRecords,
    privateMedicalRecordsUpload,
    privateMedicalRecordsUploadV1,
    privateMedicalRecordsAttachments,
    evidenceChoiceIntro,
    evidenceChoiceAdditionalDocuments,
    evidenceChoiceAdditionalDocumentsV1,
    additionalDocuments,
    summaryOfEvidence,
  } = formConfig.chapters.supportingEvidence.pages;

  describe('evidenceTypes depends', () => {
    it('should return true for non-BDD legacy flow', () => {
      const formData = createLegacyFlowFormData();
      expect(evidenceTypes.depends(formData)).to.be.true;
    });

    it('should return false for BDD users', () => {
      const formData = createBDDFormData();
      expect(evidenceTypes.depends(formData)).to.be.false;
    });

    it('should return false for enhancement flow users', () => {
      const formData = createEnhancementFlowFormData();
      expect(evidenceTypes.depends(formData)).to.be.false;
    });
  });

  describe('evidenceRequest depends', () => {
    it('should return true for non-BDD enhancement flow users', () => {
      const formData = createEnhancementFlowFormData();
      expect(evidenceRequest.depends(formData)).to.be.true;
    });

    it('should return false for BDD users', () => {
      const formData = createBDDFormData(createEnhancementFlowFormData());
      expect(evidenceRequest.depends(formData)).to.be.false;
    });

    it('should return false for legacy flow users', () => {
      const formData = createLegacyFlowFormData();
      expect(evidenceRequest.depends(formData)).to.be.false;
    });
  });

  describe('medicalRecords depends', () => {
    it('should return true for non-BDD enhancement flow users with medical records', () => {
      const formData = createEnhancementFlowFormData({
        'view:hasMedicalRecords': true,
      });
      expect(medicalRecords.depends(formData)).to.be.true;
    });

    it('should return false for non-BDD enhancement flow users without medical records', () => {
      const formData = createEnhancementFlowFormData({
        'view:hasMedicalRecords': false,
      });
      expect(medicalRecords.depends(formData)).to.be.false;
    });

    it('should return false for BDD users', () => {
      const formData = createBDDFormData(
        createEnhancementFlowFormData({ 'view:hasMedicalRecords': true }),
      );
      expect(medicalRecords.depends(formData)).to.be.false;
    });

    it('should return false for legacy flow users', () => {
      const formData = createLegacyFlowFormData({
        'view:hasEvidence': true,
      });
      expect(medicalRecords.depends(formData)).to.be.false;
    });
  });

  describe('privateMedicalRecordsUpload depends', () => {
    it('should return true for enhancement flow with private evidence and uploading', () => {
      const formData = createEnhancementFlowFormData({
        'view:selectableEvidenceTypes': {
          'view:hasPrivateMedicalRecords': true,
        },
        'view:uploadPrivateRecordsQualifier': {
          'view:hasPrivateRecordsToUpload': true,
        },
      });
      expect(privateMedicalRecordsUpload.depends(formData)).to.be.true;
    });

    it('should return false for legacy flow', () => {
      const formData = createLegacyFlowFormData({
        'view:selectableEvidenceTypes': {
          'view:hasPrivateMedicalRecords': true,
        },
        'view:uploadPrivateRecordsQualifier': {
          'view:hasPrivateRecordsToUpload': true,
        },
      });
      expect(privateMedicalRecordsUpload.depends(formData)).to.be.false;
    });

    it('should return false without private evidence', () => {
      const formData = createEnhancementFlowFormData({
        'view:selectableEvidenceTypes': {
          'view:hasPrivateMedicalRecords': false,
        },
      });
      expect(privateMedicalRecordsUpload.depends(formData)).to.be.false;
    });

    it('should return false when not uploading private records', () => {
      const formData = createEnhancementFlowFormData({
        'view:selectableEvidenceTypes': {
          'view:hasPrivateMedicalRecords': true,
        },
        'view:uploadPrivateRecordsQualifier': {
          'view:hasPrivateRecordsToUpload': false,
        },
      });
      expect(privateMedicalRecordsUpload.depends(formData)).to.be.false;
    });
  });

  describe('privateMedicalRecordsUploadV1 depends', () => {
    it('should return true for enhancement flow with v3 OFF and private evidence uploading', () => {
      const formData = createEnhancementFlowFormData({
        disability526SupportingEvidenceFileInputV3: false,
        'view:selectableEvidenceTypes': {
          'view:hasPrivateMedicalRecords': true,
        },
        'view:uploadPrivateRecordsQualifier': {
          'view:hasPrivateRecordsToUpload': true,
        },
      });
      expect(privateMedicalRecordsUploadV1.depends(formData)).to.be.true;
    });

    it('should return false when v3 is ON', () => {
      const formData = createEnhancementFlowFormData({
        'view:selectableEvidenceTypes': {
          'view:hasPrivateMedicalRecords': true,
        },
        'view:uploadPrivateRecordsQualifier': {
          'view:hasPrivateRecordsToUpload': true,
        },
      });
      expect(privateMedicalRecordsUploadV1.depends(formData)).to.be.false;
    });

    it('should return false for legacy flow', () => {
      const formData = createLegacyFlowFormData({
        'view:selectableEvidenceTypes': {
          'view:hasPrivateMedicalRecords': true,
        },
        'view:uploadPrivateRecordsQualifier': {
          'view:hasPrivateRecordsToUpload': true,
        },
      });
      expect(privateMedicalRecordsUploadV1.depends(formData)).to.be.false;
    });
  });

  describe('privateMedicalRecordsAttachments depends', () => {
    it('should return true for legacy flow with private evidence and uploading', () => {
      const formData = createLegacyFlowFormData({
        'view:selectableEvidenceTypes': {
          'view:hasPrivateMedicalRecords': true,
        },
        'view:uploadPrivateRecordsQualifier': {
          'view:hasPrivateRecordsToUpload': true,
        },
      });
      expect(privateMedicalRecordsAttachments.depends(formData)).to.be.true;
    });

    it('should return false for enhancement flow', () => {
      const formData = createEnhancementFlowFormData({
        'view:selectableEvidenceTypes': {
          'view:hasPrivateMedicalRecords': true,
        },
        'view:uploadPrivateRecordsQualifier': {
          'view:hasPrivateRecordsToUpload': true,
        },
      });
      expect(privateMedicalRecordsAttachments.depends(formData)).to.be.false;
    });

    it('should return false without private evidence', () => {
      const formData = createLegacyFlowFormData({
        'view:selectableEvidenceTypes': {
          'view:hasPrivateMedicalRecords': false,
        },
      });
      expect(privateMedicalRecordsAttachments.depends(formData)).to.be.false;
    });

    it('should return false when not uploading private records', () => {
      const formData = createLegacyFlowFormData({
        'view:selectableEvidenceTypes': {
          'view:hasPrivateMedicalRecords': true,
        },
        'view:uploadPrivateRecordsQualifier': {
          'view:hasPrivateRecordsToUpload': false,
        },
      });
      expect(privateMedicalRecordsAttachments.depends(formData)).to.be.false;
    });
  });

  describe('evidenceChoiceIntro depends', () => {
    it('should return true for enhancement flow', () => {
      const formData = createEnhancementFlowFormData();
      expect(evidenceChoiceIntro.depends(formData)).to.be.true;
    });

    it('should return false for legacy flow', () => {
      const formData = createLegacyFlowFormData();
      expect(evidenceChoiceIntro.depends(formData)).to.be.false;
    });
  });

  describe('evidenceChoiceAdditionalDocuments depends', () => {
    it('should return true for enhancement flow with other evidence', () => {
      const formData = createEnhancementFlowFormData({
        'view:selectableEvidenceTypes': {
          'view:hasOtherEvidence': true,
        },
      });
      expect(evidenceChoiceAdditionalDocuments.depends(formData)).to.be.true;
    });

    it('should return false for enhancement flow without other evidence', () => {
      const formData = createEnhancementFlowFormData({
        'view:selectableEvidenceTypes': {
          'view:hasOtherEvidence': false,
        },
      });
      expect(evidenceChoiceAdditionalDocuments.depends(formData)).to.be.false;
    });

    it('should return false for legacy flow with other evidence', () => {
      const formData = createLegacyFlowFormData({
        'view:selectableEvidenceTypes': {
          'view:hasOtherEvidence': true,
        },
      });
      expect(evidenceChoiceAdditionalDocuments.depends(formData)).to.be.false;
    });
  });

  describe('evidenceChoiceAdditionalDocumentsV1 depends', () => {
    it('should return true for enhancement flow with v3 OFF and other evidence', () => {
      const formData = createEnhancementFlowFormData({
        disability526SupportingEvidenceFileInputV3: false,
        'view:selectableEvidenceTypes': {
          'view:hasOtherEvidence': true,
        },
      });
      expect(evidenceChoiceAdditionalDocumentsV1.depends(formData)).to.be.true;
    });

    it('should return false when v3 is ON', () => {
      const formData = createEnhancementFlowFormData({
        'view:selectableEvidenceTypes': {
          'view:hasOtherEvidence': true,
        },
      });
      expect(evidenceChoiceAdditionalDocumentsV1.depends(formData)).to.be.false;
    });

    it('should return false for legacy flow', () => {
      const formData = createLegacyFlowFormData({
        'view:selectableEvidenceTypes': {
          'view:hasOtherEvidence': true,
        },
      });
      expect(evidenceChoiceAdditionalDocumentsV1.depends(formData)).to.be.false;
    });
  });

  describe('additionalDocuments depends', () => {
    it('should return true for legacy flow with other evidence', () => {
      const formData = createLegacyFlowFormData({
        'view:selectableEvidenceTypes': {
          'view:hasOtherEvidence': true,
        },
      });
      expect(additionalDocuments.depends(formData)).to.be.true;
    });

    it('should return false for legacy flow without other evidence', () => {
      const formData = createLegacyFlowFormData({
        'view:selectableEvidenceTypes': {
          'view:hasOtherEvidence': false,
        },
      });
      expect(additionalDocuments.depends(formData)).to.be.false;
    });

    it('should return false for enhancement flow with other evidence', () => {
      const formData = createEnhancementFlowFormData({
        'view:selectableEvidenceTypes': {
          'view:hasOtherEvidence': true,
        },
      });
      expect(additionalDocuments.depends(formData)).to.be.false;
    });
  });

  describe('summaryOfEvidence depends', () => {
    it('should not have a depends function (always shown)', () => {
      expect(summaryOfEvidence.depends).to.be.undefined;
    });
  });
});
