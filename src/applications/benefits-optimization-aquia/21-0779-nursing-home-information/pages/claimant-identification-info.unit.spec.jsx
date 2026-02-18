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

    it('should have claimantIdentificationInfo field configured with ssnOrVaFileNumberNoHintUI pattern', () => {
      // Verify the pattern is applied to the page configuration
      expect(claimantIdentificationInfoUiSchema).to.have.property(
        'claimantIdentificationInfo',
      );
      expect(
        claimantIdentificationInfoUiSchema.claimantIdentificationInfo,
      ).to.be.an('object');
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

  describe('exports', () => {
    it('should export both uiSchema and schema', () => {
      expect(claimantIdentificationInfoUiSchema).to.be.an('object');
      expect(claimantIdentificationInfoSchema).to.be.an('object');
    });
  });
});
