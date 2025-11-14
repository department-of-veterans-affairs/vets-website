/**
 * @module tests/pages/veteran-identification-info.unit.spec
 * @description Unit test for veteran identification info page
 * VA Form 21-0779 - Request for Nursing Home Information in Connection with Claim for Aid and Attendance
 */

import { expect } from 'chai';

import {
  veteranIdentificationInfoUiSchema,
  veteranIdentificationInfoSchema,
} from './veteran-identification-info';

describe('Veteran Identification Info Page', () => {
  describe('uiSchema', () => {
    it('should have correct title', () => {
      expect(veteranIdentificationInfoUiSchema).to.have.property(
        'ui:title',
        "Veteran's identification information",
      );
    });

    it('should have veteranIdentificationInfo field configured with ssnOrVaFileNumberNoHintUI', () => {
      expect(veteranIdentificationInfoUiSchema).to.have.property(
        'veteranIdentificationInfo',
      );

      const fieldUI =
        veteranIdentificationInfoUiSchema.veteranIdentificationInfo;

      // Verify it has SSN field
      expect(fieldUI).to.have.property('ssn');
      expect(fieldUI.ssn).to.have.property(
        'ui:title',
        'Social Security number',
      );
      expect(fieldUI.ssn).to.have.property('ui:webComponentField');
      expect(fieldUI.ssn).to.have.property('ui:errorMessages');

      // Verify it has VA file number field
      expect(fieldUI).to.have.property('vaFileNumber');
      expect(fieldUI.vaFileNumber).to.have.property(
        'ui:title',
        'VA file number',
      );
      expect(fieldUI.vaFileNumber).to.have.property('ui:webComponentField');

      // Verify it has updateSchema for dynamic validation
      expect(fieldUI).to.have.nested.property('ui:options.updateSchema');
    });

    it('should have ui:options with updateUiSchema function', () => {
      expect(veteranIdentificationInfoUiSchema).to.have.nested.property(
        'ui:options.updateUiSchema',
      );
      expect(
        veteranIdentificationInfoUiSchema['ui:options'].updateUiSchema,
      ).to.be.a('function');
    });

    it('should return correct description based on patient type', () => {
      const { updateUiSchema } = veteranIdentificationInfoUiSchema[
        'ui:options'
      ];

      // Test when patient is veteran
      const veteranResult = updateUiSchema(
        { claimantQuestion: { patientType: 'veteran' } },
        { claimantQuestion: { patientType: 'veteran' } },
      );

      expect(veteranResult).to.deep.equal({
        'ui:description':
          'You must enter either a Social Security number or VA file number for the Veteran.',
      });

      // Test when patient is spouse or parent
      const spouseResult = updateUiSchema(
        { claimantQuestion: { patientType: 'spouseOrParent' } },
        { claimantQuestion: { patientType: 'spouseOrParent' } },
      );

      expect(spouseResult).to.deep.equal({
        'ui:description':
          'You must enter either a Social Security number or VA file number for the Veteran who is connected to the patient',
      });

      // Test when patient type is not set (defaults to veteran message)
      const defaultResult = updateUiSchema({}, {});

      expect(defaultResult).to.deep.equal({
        'ui:description':
          'You must enter either a Social Security number or VA file number for the Veteran who is connected to the patient',
      });
    });
  });

  describe('schema', () => {
    it('should be an object type', () => {
      expect(veteranIdentificationInfoSchema).to.have.property(
        'type',
        'object',
      );
    });

    it('should have veteranIdentificationInfo as required field', () => {
      expect(veteranIdentificationInfoSchema).to.have.property('required');
      expect(veteranIdentificationInfoSchema.required).to.be.an('array');
      expect(veteranIdentificationInfoSchema.required).to.include(
        'veteranIdentificationInfo',
      );
    });

    it('should have veteranIdentificationInfo in properties', () => {
      expect(veteranIdentificationInfoSchema).to.have.nested.property(
        'properties.veteranIdentificationInfo',
      );
    });

    it('should have correct schema structure for veteranIdentificationInfo', () => {
      const fieldSchema =
        veteranIdentificationInfoSchema.properties.veteranIdentificationInfo;

      expect(fieldSchema).to.have.property('type', 'object');
      expect(fieldSchema).to.have.property('properties');
      expect(fieldSchema.properties).to.have.property('ssn');
      expect(fieldSchema.properties).to.have.property('vaFileNumber');

      // Check SSN schema
      expect(fieldSchema.properties.ssn).to.have.property('type', 'string');
      expect(fieldSchema.properties.ssn).to.have.property('pattern');

      // Check VA file number schema
      expect(fieldSchema.properties.vaFileNumber).to.have.property(
        'type',
        'string',
      );
      expect(fieldSchema.properties.vaFileNumber).to.have.property('pattern');
    });
  });

  describe('SSN/VA File Number validation behavior', () => {
    let updateSchema;

    beforeEach(() => {
      updateSchema =
        veteranIdentificationInfoUiSchema.veteranIdentificationInfo[
          'ui:options'
        ].updateSchema;
    });

    it('should require SSN when SSN is provided', () => {
      const result = updateSchema(
        { veteranIdentificationInfo: { ssn: '123456789' } },
        { type: 'object' },
        {},
        0,
        'veteranIdentificationInfo',
      );

      expect(result).to.have.property('required');
      expect(result.required).to.deep.equal(['ssn']);
    });

    it('should require VA file number when only VA file number is provided', () => {
      const result = updateSchema(
        { veteranIdentificationInfo: { vaFileNumber: '12345678' } },
        { type: 'object' },
        {},
        0,
        'veteranIdentificationInfo',
      );

      expect(result).to.have.property('required');
      expect(result.required).to.deep.equal(['vaFileNumber']);
    });

    it('should require SSN when both SSN and VA file number are provided', () => {
      const result = updateSchema(
        {
          veteranIdentificationInfo: {
            ssn: '123456789',
            vaFileNumber: '12345678',
          },
        },
        { type: 'object' },
        {},
        0,
        'veteranIdentificationInfo',
      );

      expect(result).to.have.property('required');
      expect(result.required).to.deep.equal(['ssn']);
    });

    it('should default to requiring SSN when neither field is provided', () => {
      const result = updateSchema(
        { veteranIdentificationInfo: {} },
        { type: 'object' },
        {},
        0,
        'veteranIdentificationInfo',
      );

      expect(result).to.have.property('required');
      expect(result.required).to.deep.equal(['ssn']);
    });

    it('should default to requiring SSN when veteranIdentificationInfo is undefined', () => {
      const result = updateSchema(
        {},
        { type: 'object' },
        {},
        0,
        'veteranIdentificationInfo',
      );

      expect(result).to.have.property('required');
      expect(result.required).to.deep.equal(['ssn']);
    });

    it('should handle null values correctly', () => {
      const result = updateSchema(
        { veteranIdentificationInfo: { ssn: null, vaFileNumber: null } },
        { type: 'object' },
        {},
        0,
        'veteranIdentificationInfo',
      );

      expect(result).to.have.property('required');
      expect(result.required).to.deep.equal(['ssn']);
    });

    it('should handle empty string values', () => {
      const resultEmptySSN = updateSchema(
        { veteranIdentificationInfo: { ssn: '', vaFileNumber: '12345678' } },
        { type: 'object' },
        {},
        0,
        'veteranIdentificationInfo',
      );

      expect(resultEmptySSN.required).to.deep.equal(['vaFileNumber']);

      const resultEmptyVA = updateSchema(
        { veteranIdentificationInfo: { ssn: '123456789', vaFileNumber: '' } },
        { type: 'object' },
        {},
        0,
        'veteranIdentificationInfo',
      );

      expect(resultEmptyVA.required).to.deep.equal(['ssn']);

      const resultBothEmpty = updateSchema(
        { veteranIdentificationInfo: { ssn: '', vaFileNumber: '' } },
        { type: 'object' },
        {},
        0,
        'veteranIdentificationInfo',
      );

      expect(resultBothEmpty.required).to.deep.equal(['ssn']);
    });

    it('should preserve other schema properties when updating', () => {
      const originalSchema = {
        type: 'object',
        properties: { someOtherField: { type: 'string' } },
        additionalProperties: false,
      };

      const result = updateSchema(
        { veteranIdentificationInfo: { ssn: '123456789' } },
        originalSchema,
        {},
        0,
        'veteranIdentificationInfo',
      );

      expect(result).to.include.keys(
        'type',
        'properties',
        'additionalProperties',
        'required',
      );
      expect(result.type).to.equal('object');
      expect(result.properties).to.deep.equal({
        someOtherField: { type: 'string' },
      });
      expect(result.additionalProperties).to.equal(false);
      expect(result.required).to.deep.equal(['ssn']);
    });
  });

  describe('isPatientVeteran helper function', () => {
    it('should be used in updateUiSchema to determine description', () => {
      const { updateUiSchema } = veteranIdentificationInfoUiSchema[
        'ui:options'
      ];

      // The helper function checks claimantQuestion.patientType === 'veteran'
      const veteranData = { claimantQuestion: { patientType: 'veteran' } };
      const spouseData = {
        claimantQuestion: { patientType: 'spouseOrParent' },
      };
      const parentData = { claimantQuestion: { patientType: 'parent' } };
      const unknownData = { claimantQuestion: { patientType: 'unknown' } };

      const veteranResult = updateUiSchema(veteranData, veteranData);
      const spouseResult = updateUiSchema(spouseData, spouseData);
      const parentResult = updateUiSchema(parentData, parentData);
      const unknownResult = updateUiSchema(unknownData, unknownData);

      // When patient is veteran, show the simpler message
      expect(veteranResult['ui:description']).to.include('for the Veteran.');

      // When patient is spouse/parent/other, show the "connected to" message
      expect(spouseResult['ui:description']).to.include(
        'connected to the patient',
      );
      expect(parentResult['ui:description']).to.include(
        'connected to the patient',
      );
      expect(unknownResult['ui:description']).to.include(
        'connected to the patient',
      );
    });
  });

  describe('exports', () => {
    it('should export both uiSchema and schema', () => {
      expect(veteranIdentificationInfoUiSchema).to.be.an('object');
      expect(veteranIdentificationInfoSchema).to.be.an('object');
    });
  });
});
