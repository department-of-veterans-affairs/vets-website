/**
 * @module tests/pages/benefits-details.unit.spec
 * @description Unit tests for Benefits Details page dynamic title logic
 * VA Form 21-4192 - Request for Employment Information
 */

import { expect } from 'chai';

import { veteranPersonalInfoUiSchema } from './veteran-personal-info';

describe('Veteran Personal Info Page', () => {
  describe('validate name lengths', () => {
    let errorMessages = [];

    const errors = {
      addError: message => {
        errorMessages.push(message || '');
      },
    };

    beforeEach(() => {
      errorMessages = [];
    });

    it('should show a validation error if first name is longer than 12 characters', () => {
      const formData = {
        veteranPersonalInfo: {
          fullName: { first: 'ThisIsAVeryLongFirstName', last: 'Doe' },
        },
      };

      // expect a validation error for the first name field
      const firstNameValidation =
        veteranPersonalInfoUiSchema.veteranPersonalInfo.fullName.first[
          'ui:validations'
        ][1];
      firstNameValidation(errors, null, formData);

      expect(errorMessages[0]).to.exist;
      expect(errorMessages[0]).to.equal(
        'Please enter a name under 12 characters. If your name is longer, enter the first 12 characters only.',
      );
    });
  });
});
