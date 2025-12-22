/**
 * @module tests/pages/employment-last-payment.unit.spec
 * @description Unit tests for Employment Last Payment page conditional logic
 * VA Form 21-4192 - Request for Employment Information
 */

import { expect } from 'chai';

import {
  employmentLastPaymentUiSchema,
  employmentLastPaymentSchema,
} from './employment-last-payment';

describe('Employment Last Payment Page', () => {
  describe('updateSchema conditional required fields', () => {
    const { updateSchema } = employmentLastPaymentUiSchema['ui:options'];
    const baseSchema = employmentLastPaymentSchema;

    it('should require lump sum fields when lumpSumPayment is yes', () => {
      const formData = {
        employmentLastPayment: { lumpSumPayment: 'yes' },
      };

      const result = updateSchema(formData, baseSchema);
      const { required } = result.properties.employmentLastPayment;

      expect(required).to.include('grossAmountPaid');
      expect(required).to.include('datePaid');
    });

    it('should not require lump sum fields when lumpSumPayment is no', () => {
      const formData = {
        employmentLastPayment: { lumpSumPayment: 'no' },
      };

      const result = updateSchema(formData, baseSchema);
      const { required } = result.properties.employmentLastPayment;

      expect(required).to.not.include('grossAmountPaid');
      expect(required).to.not.include('datePaid');
    });

    it('should handle missing form data gracefully', () => {
      const result = updateSchema({}, baseSchema);
      const { required } = result.properties.employmentLastPayment;

      expect(required).to.not.include('grossAmountPaid');
      expect(required).to.not.include('datePaid');
    });
  });

  describe('expandUnderCondition logic', () => {
    it('should show lump sum fields only when yes is selected', () => {
      const {
        expandUnderCondition,
      } = employmentLastPaymentUiSchema.employmentLastPayment.grossAmountPaid[
        'ui:options'
      ];

      expect(expandUnderCondition('yes')).to.be.true;
      expect(expandUnderCondition('no')).to.be.false;
    });
  });
});
