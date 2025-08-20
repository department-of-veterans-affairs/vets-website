import { expect } from 'chai';
import sinon from 'sinon';
import { uiSchema, schema } from '../pages/privateMedicalRecords';

// Mock data
const formData = {
  'view:uploadPrivateRecordsQualifier': {
    'view:hasPrivateRecordsToUpload': false,
  },
};

describe('privateMedicalRecords', () => {
  describe('uiSchema', () => {
    it('should call validateBooleanGroup when conditions are met', () => {
      const addError = sinon.spy();
      const errors = { addError };
      const fieldData = {};
      const mockFormData = {
        ...formData,
        disability526Enable2024Form4142: false,
      };

      const validationFn =
        uiSchema['view:patientAcknowledgement']['ui:validations'][0];
      validationFn(errors, fieldData, mockFormData);

      expect(addError.calledOnce).to.be.true;
    });

    it('should expand patientAcknowledgement when conditions are met', () => {
      const mockFormData = {
        ...formData,
        'view:hasPrivateRecordsToUpload': false,
      };
      const expandCondition =
        uiSchema['view:patientAcknowledgement']['ui:options']
          .expandUnderCondition;
      expect(expandCondition(mockFormData)).to.be.true;
    });

    it('should hide patientAcknowledgmentHelp when isCompletingModern4142 is true', () => {
      const { hideIf } = uiSchema['view:patientAcknowledgmentHelp'][
        'ui:options'
      ];
      const mockFormData = {
        ...formData,
        disability526Enable2024Form4142: true,
      };
      expect(hideIf(mockFormData)).to.be.true;
    });
  });

  describe('schema', () => {
    it('should have required properties for view:patientAcknowledgement', () => {
      expect(
        schema.properties['view:patientAcknowledgement'].required,
      ).to.include('view:acknowledgement');
    });

    it('should default view:acknowledgement to false', () => {
      expect(
        schema.properties['view:patientAcknowledgement'].properties[
          'view:acknowledgement'
        ].default,
      ).to.be.false;
    });
  });
});
