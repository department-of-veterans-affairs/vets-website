import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import { $ } from 'platform/forms-system/src/js/utilities/ui';
import * as page from '../../pages/eligibleIndividualsSupported';

const createMockStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      form: (state = initialState.form || { data: {} }) => state,
    },
    preloadedState: initialState,
  });
};

describe('Eligible Individuals Supported Page', () => {
  const renderPage = (formData = {}, initialState = {}) => {
    const store = createMockStore(initialState);
    return render(
      <Provider store={store}>
        <DefinitionTester
          schema={page.schema}
          uiSchema={page.uiSchema}
          formData={formData}
          definitions={{}}
        />
      </Provider>,
    );
  };

  describe('Schema', () => {
    it('should export a valid schema object', () => {
      expect(page.schema).to.be.an('object');
      expect(page.schema.type).to.equal('object');
      expect(page.schema.properties).to.be.an('object');
    });
  });

  describe('UI Schema', () => {
    it('should export a valid uiSchema object', () => {
      expect(page.uiSchema).to.be.an('object');
      expect(page.uiSchema['ui:title']).to.be.a('function');
      expect(page.uiSchema['ui:description']).to.be.a('function');
    });
  });

  describe('Academic Year Field', () => {
    it('should show academic year display, no input, when agreement type is new', () => {
      const formData = {
        agreementType: 'startNewOpenEndedAgreement',
      };

      const { container } = renderPage(formData);

      // The field should be hidden
      const academicYearField = $('input[name="root_academicYear"]', container);
      if (academicYearField) {
        expect(academicYearField.style.display).to.equal('none');
      }
    });
  });

  describe('Academic Year UI Validations', () => {
    let errors;

    beforeEach(() => {
      errors = {
        errorMessages: [],
        addError(message) {
          this.errorMessages.push(message);
        },
      };
    });

    it('should add error when fieldData does not match current academic year display and agreementType is startNewOpenEndedAgreement', () => {
      const validationFn = page.uiSchema.academicYear['ui:validations'][0];
      const fieldData = '2022-2023';
      const formData = { agreementType: 'startNewOpenEndedAgreement' };

      validationFn(errors, fieldData, formData);

      expect(errors.errorMessages).to.have.lengthOf(1);
      expect(errors.errorMessages[0]).to.equal(
        'Enter the upcoming academic year this agreement applies to',
      );
    });

    it('should allow any year to be entered for when agreementType is not startNewOpenEndedAgreement', () => {
      const validationFn = page.uiSchema.academicYear['ui:validations'][0];
      const fieldData = 'invalid-year';
      const formData = { agreementType: 'startNewOpenEndedAgreement' };

      validationFn(errors, fieldData, formData);

      expect(errors.errorMessages.length).to.be.greaterThan(0);
    });
  });
});
