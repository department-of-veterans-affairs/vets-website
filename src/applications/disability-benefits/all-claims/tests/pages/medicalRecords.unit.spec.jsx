import { expect } from 'chai';
import { updateFormData } from '../../pages/medicalRecords';

describe('medicalRecords updateFormData', () => {
  it('should preserve hasOtherEvidence from oldFormData', () => {
    const oldFormData = {
      'view:selectableEvidenceTypes': {
        'view:hasOtherEvidence': true,
      },
    };
    const formData = {
      'view:selectableEvidenceTypes': {
        'view:hasVaMedicalRecords': true,
      },
    };
    const result = updateFormData(oldFormData, formData);
    expect(result).to.deep.equal({
      'view:selectableEvidenceTypes': {
        'view:hasVaMedicalRecords': true,
        'view:hasOtherEvidence': true,
      },
    });
  });

  it('should preserve false hasOtherEvidence value from oldFormData', () => {
    const oldFormData = {
      'view:selectableEvidenceTypes': {
        'view:hasOtherEvidence': false,
      },
    };
    const formData = {
      'view:selectableEvidenceTypes': {
        'view:hasVaMedicalRecords': true,
      },
    };
    const result = updateFormData(oldFormData, formData);
    expect(result).to.deep.equal({
      'view:selectableEvidenceTypes': {
        'view:hasVaMedicalRecords': true,
        'view:hasOtherEvidence': false,
      },
    });
  });

  it('should set hasOtherEvidence to undefined when not in oldFormData', () => {
    const oldFormData = {};
    const formData = {
      'view:selectableEvidenceTypes': {
        'view:hasVaMedicalRecords': true,
      },
    };
    const result = updateFormData(oldFormData, formData);
    expect(result).to.deep.equal({
      'view:selectableEvidenceTypes': {
        'view:hasVaMedicalRecords': true,
        'view:hasOtherEvidence': undefined,
      },
    });
  });

  it('should initialize selectableEvidenceTypes if missing in formData', () => {
    const oldFormData = {
      'view:selectableEvidenceTypes': {
        'view:hasOtherEvidence': true,
      },
    };
    const formData = {};
    const result = updateFormData(oldFormData, formData);
    expect(result).to.deep.equal({
      'view:selectableEvidenceTypes': {
        'view:hasOtherEvidence': true,
      },
    });
  });

  it('should preserve existing formData fields when preserving hasOtherEvidence', () => {
    const oldFormData = {
      'view:selectableEvidenceTypes': {
        'view:hasOtherEvidence': true,
      },
    };
    const formData = {
      existingField: 'value',
      'view:selectableEvidenceTypes': {
        'view:hasVaMedicalRecords': true,
        'view:hasPrivateMedicalRecords': false,
      },
    };
    const result = updateFormData(oldFormData, formData);
    expect(result).to.deep.equal({
      existingField: 'value',
      'view:selectableEvidenceTypes': {
        'view:hasVaMedicalRecords': true,
        'view:hasPrivateMedicalRecords': false,
        'view:hasOtherEvidence': true,
      },
    });
  });
});
