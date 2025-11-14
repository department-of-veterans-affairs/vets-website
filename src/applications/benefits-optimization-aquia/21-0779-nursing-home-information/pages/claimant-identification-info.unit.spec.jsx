/**
 * @module tests/pages/claimant-identification-info.unit.spec
 * @description Unit test for claimant identification info page
 * VA Form 21-0779 - Request for Nursing Home Information in Connection with Claim for Aid and Attendance
 */

import { expect } from 'chai';

import {
  claimantIdentificationInfoUiSchema,
  claimantIdentificationInfoSchema,
} from './claimant-identification-info';

describe('Claimant Identification Info Page', () => {
  describe('uiSchema', () => {
    it('should have correct title', () => {
      expect(claimantIdentificationInfoUiSchema).to.have.property(
        'ui:title',
        "Patient's identification information",
      );
    });

    it('should have claimantIdentificationInfo field configured with ssnOrVaFileNumberNoHintUI', () => {
      expect(claimantIdentificationInfoUiSchema).to.have.property(
        'claimantIdentificationInfo',
      );

      const fieldUI =
        claimantIdentificationInfoUiSchema.claimantIdentificationInfo;

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
      expect(claimantIdentificationInfoUiSchema).to.have.nested.property(
        'ui:options.updateUiSchema',
      );
      expect(
        claimantIdentificationInfoUiSchema['ui:options'].updateUiSchema,
      ).to.be.a('function');
    });

    it('should return correct description from updateUiSchema', () => {
      const { updateUiSchema } = claimantIdentificationInfoUiSchema[
        'ui:options'
      ];
      const result = updateUiSchema({}, {});

      expect(result).to.deep.equal({
        'ui:description':
          'You must enter either a Social Security number or VA file number for the patient.',
      });
    });
  });

  describe('schema', () => {
    it('should be an object type', () => {
      expect(claimantIdentificationInfoSchema).to.have.property(
        'type',
        'object',
      );
    });

    it('should have claimantIdentificationInfo as required field', () => {
      expect(claimantIdentificationInfoSchema).to.have.property('required');
      expect(claimantIdentificationInfoSchema.required).to.be.an('array');
      expect(claimantIdentificationInfoSchema.required).to.include(
        'claimantIdentificationInfo',
      );
    });

    it('should have claimantIdentificationInfo in properties', () => {
      expect(claimantIdentificationInfoSchema).to.have.nested.property(
        'properties.claimantIdentificationInfo',
      );
    });

    it('should have correct schema structure for claimantIdentificationInfo', () => {
      const fieldSchema =
        claimantIdentificationInfoSchema.properties.claimantIdentificationInfo;

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
        claimantIdentificationInfoUiSchema.claimantIdentificationInfo[
          'ui:options'
        ].updateSchema;
    });

    it('should require SSN when SSN is provided', () => {
      const result = updateSchema(
        { claimantIdentificationInfo: { ssn: '123456789' } },
        { type: 'object' },
        {},
        0,
        'claimantIdentificationInfo',
      );

      expect(result).to.have.property('required');
      expect(result.required).to.deep.equal(['ssn']);
    });

    it('should require VA file number when only VA file number is provided', () => {
      const result = updateSchema(
        { claimantIdentificationInfo: { vaFileNumber: '12345678' } },
        { type: 'object' },
        {},
        0,
        'claimantIdentificationInfo',
      );

      expect(result).to.have.property('required');
      expect(result.required).to.deep.equal(['vaFileNumber']);
    });

    it('should require SSN when both SSN and VA file number are provided', () => {
      const result = updateSchema(
        {
          claimantIdentificationInfo: {
            ssn: '123456789',
            vaFileNumber: '12345678',
          },
        },
        { type: 'object' },
        {},
        0,
        'claimantIdentificationInfo',
      );

      expect(result).to.have.property('required');
      expect(result.required).to.deep.equal(['ssn']);
    });

    it('should default to requiring SSN when neither field is provided', () => {
      const result = updateSchema(
        { claimantIdentificationInfo: {} },
        { type: 'object' },
        {},
        0,
        'claimantIdentificationInfo',
      );

      expect(result).to.have.property('required');
      expect(result.required).to.deep.equal(['ssn']);
    });

    it('should default to requiring SSN when claimantIdentificationInfo is undefined', () => {
      const result = updateSchema(
        {},
        { type: 'object' },
        {},
        0,
        'claimantIdentificationInfo',
      );

      expect(result).to.have.property('required');
      expect(result.required).to.deep.equal(['ssn']);
    });

    it('should handle null values correctly', () => {
      const result = updateSchema(
        { claimantIdentificationInfo: { ssn: null, vaFileNumber: null } },
        { type: 'object' },
        {},
        0,
        'claimantIdentificationInfo',
      );

      expect(result).to.have.property('required');
      expect(result.required).to.deep.equal(['ssn']);
    });

    it('should handle empty string values', () => {
      const resultEmptySSN = updateSchema(
        { claimantIdentificationInfo: { ssn: '', vaFileNumber: '12345678' } },
        { type: 'object' },
        {},
        0,
        'claimantIdentificationInfo',
      );

      expect(resultEmptySSN.required).to.deep.equal(['vaFileNumber']);

      const resultEmptyVA = updateSchema(
        { claimantIdentificationInfo: { ssn: '123456789', vaFileNumber: '' } },
        { type: 'object' },
        {},
        0,
        'claimantIdentificationInfo',
      );

      expect(resultEmptyVA.required).to.deep.equal(['ssn']);

      const resultBothEmpty = updateSchema(
        { claimantIdentificationInfo: { ssn: '', vaFileNumber: '' } },
        { type: 'object' },
        {},
        0,
        'claimantIdentificationInfo',
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
        { claimantIdentificationInfo: { ssn: '123456789' } },
        originalSchema,
        {},
        0,
        'claimantIdentificationInfo',
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

  describe('exports', () => {
    it('should export both uiSchema and schema', () => {
      expect(claimantIdentificationInfoUiSchema).to.be.an('object');
      expect(claimantIdentificationInfoSchema).to.be.an('object');
    });
  });
});
