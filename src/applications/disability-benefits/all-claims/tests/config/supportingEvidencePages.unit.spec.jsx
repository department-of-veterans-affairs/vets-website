import { expect } from 'chai';
import { add, format } from 'date-fns';
import { DATE_TEMPLATE } from '../../utils/dates/formatting';
import formConfig from '../../config/form';

const formatDate = date => format(date, DATE_TEMPLATE);
const daysFromToday = days => formatDate(add(new Date(), { days }));

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

const createEnhancementFlowFormData = (overrides = {}) => ({
  disability526SupportingEvidenceEnhancement: true,
  ...overrides,
});

const createLegacyFlowFormData = (overrides = {}) => ({
  disability526SupportingEvidenceEnhancement: false,
  ...overrides,
});

describe('Supporting Evidence Pages - Conditional Rendering', () => {
  const {
    evidenceTypes,
    evidenceRequest,
    medicalRecords,
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
});
