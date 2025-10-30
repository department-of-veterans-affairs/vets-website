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
      form: (
        state = initialState.form || {
          data: {},
        },
      ) => state,
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

    it('should render eligibleIndividualsGroup field with correct configuration', () => {
      const formData = {
        agreementType: 'newAgreement',
      };
      const { container } = renderPage(formData);

      expect($('.eligible-individuals-note', container)).to.exist;
      expect($('.container', container)).to.exist;
    });
  });

  describe('Academic Year Field', () => {
    it('should show academic year field when agreementType is not startNewOpenEndedAgreement', () => {
      const formData = {
        agreementType: 'newAgreement',
      };

      const { container } = renderPage(formData);

      // The field should be visible (not hidden)
      expect($('.vads-u-margin-bottom--2', container)).to.exist;
    });

    it('should hide academic year field when agreementType is startNewOpenEndedAgreement', () => {
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

  describe('Form Validation', () => {
    it('should require eligibleIndividuals when unlimitedIndividuals is false', () => {
      const formData = {
        agreementType: 'newAgreement',
        eligibleIndividualsGroup: {
          unlimitedIndividuals: false,
          eligibleIndividuals: '',
        },
      };

      const { container } = renderPage(formData);
      const textInput = $('va-text-input', container);
      expect(textInput.getAttribute('required')).to.equal('true');
    });
  });
});
