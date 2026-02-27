/**
 * @module tests/pages/benefits-details.unit.spec
 * @description Unit tests for Benefits Details page dynamic title logic
 * VA Form 21-4192 - Request for Employment Information
 */

import { expect } from 'chai';

import { veteranInformationUiSchema } from './veteran-information';

describe('Veteran Information Page', () => {
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
        veteranInformation: {
          veteranFullName: { first: 'ThisIsAVeryLongFirstName', last: 'Doe' },
        },
      };

      // expect a validation error for the first name field
      const firstNameValidation =
        veteranInformationUiSchema.veteranInformation.veteranFullName.first[
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
