import { expect } from 'chai';
import sinon from 'sinon';
import { updateFormData, uiSchema } from '../../pages/medicalRecords';

const getValidator = () =>
  uiSchema['view:selectableEvidenceTypes']['ui:validations'][0].validator;

const runValidation = (formData, fieldData = {}) => {
  const errors = { addError: sinon.spy() };
  const schema = {};
  const messages = {
    atLeastOne: 'Please select at least one type of supporting evidence',
  };
  getValidator()(errors, fieldData, formData, schema, messages, {}, 0);
  return errors;
};

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

describe('medicalRecords validation (legacy flow with view:hasOtherEvidence)', () => {
  it('adds error when view:hasEvidence true, view:hasOtherEvidence true, but neither VA nor private medical records selected', () => {
    const formData = {
      'view:hasEvidence': true,
      'view:selectableEvidenceTypes': {
        'view:hasVaMedicalRecords': false,
        'view:hasPrivateMedicalRecords': false,
        'view:hasOtherEvidence': true,
      },
    };
    const fieldData = formData['view:selectableEvidenceTypes'];
    const errors = runValidation(formData, fieldData);
    expect(errors.addError.calledOnce).to.be.true;
    expect(errors.addError.firstCall.args[0]).to.equal(
      'Please select at least one type of supporting evidence',
    );
  });

  it('does not add error when view:hasEvidence true, view:hasOtherEvidence true, and at least one of VA or private is selected', () => {
    const formData = {
      'view:hasEvidence': true,
      'view:selectableEvidenceTypes': {
        'view:hasVaMedicalRecords': true,
        'view:hasPrivateMedicalRecords': false,
        'view:hasOtherEvidence': true,
      },
    };
    const fieldData = formData['view:selectableEvidenceTypes'];
    const errors = runValidation(formData, fieldData);
    expect(errors.addError.called).to.be.false;
  });

  it('does not add error when view:hasEvidence true and only private medical records selected', () => {
    const formData = {
      'view:hasEvidence': true,
      'view:selectableEvidenceTypes': {
        'view:hasVaMedicalRecords': false,
        'view:hasPrivateMedicalRecords': true,
        'view:hasOtherEvidence': false,
      },
    };
    const fieldData = formData['view:selectableEvidenceTypes'];
    const errors = runValidation(formData, fieldData);
    expect(errors.addError.called).to.be.false;
  });
});
