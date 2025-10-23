import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import { $ } from 'platform/forms-system/src/js/utilities/ui';
import * as page from '../../pages/contributionLimitsAndDegreeLevel';

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

describe('Contribution Limits and Degree Level Page', () => {
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
    it('should export a valid schema with required fields', () => {
      expect(page.schema).to.be.an('object');
      expect(page.schema.type).to.equal('object');
      expect(page.schema.required).to.include.members([
        'maximumStudents',
        'degreeLevel',
        'maximumContributionAmount',
      ]);
    });

    it('should have correct property types and enum values', () => {
      expect(page.schema.properties.maximumStudents.type).to.equal('string');
      expect(page.schema.properties.degreeLevel.type).to.equal('string');
      expect(
        page.schema.properties.maximumContributionAmount.enum,
      ).to.deep.equal(['unlimited', 'specific']);
    });
  });

  describe('UI Schema Rendering', () => {
    it('should render all form fields with correct classes', () => {
      const { container } = renderPage();

      expect($('.vads-u-margin-bottom--2', container)).to.exist;
      expect($('.container', container)).to.exist;
      expect($('.degree-level', container)).to.exist;
      expect($('.college-or-professional-school', container)).to.exist;
    });
  });

  describe('Conditional Field Display', () => {
    it('should hide specific contribution amount field when unlimited option is selected', () => {
      const formData = {
        maximumContributionAmount: 'unlimited',
      };

      const { container } = renderPage(formData);

      const specificAmountField = $(
        'input[name="root_specificContributionAmount"]',
        container,
      );
      if (specificAmountField) {
        expect(specificAmountField.style.display).to.equal('none');
      }
    });
  });
});
