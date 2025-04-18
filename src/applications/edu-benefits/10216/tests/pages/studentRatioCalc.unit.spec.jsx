import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { expect } from 'chai';
import configureStore from 'redux-mock-store';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import { $, $$ } from 'platform/forms-system/src/js/utilities/ui';
import formConfig from '../../config/form';

const mockStore = configureStore([]);

const renderWithStore = (state = {}) => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.studentRatioCalcChapter.pages.studentRatioCalc;

  const store = mockStore({
    form: { data: state },
  });

  return render(
    <Provider store={store}>
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
      />
    </Provider>,
  );
};

describe('Student Ratio Calculation page', () => {
  it('Renders the page with the correct number of inputs', () => {
    const { container, getByRole } = renderWithStore({});

    expect($$('va-text-input', container).length).to.equal(2);
    expect($$('va-memorable-date', container).length).to.equal(1);
    expect($$('va-alert', container).length).to.equal(1);
    getByRole('button', { name: /submit/i }).click();
    expect($$('va-memorable-date[error]', container).length).to.equal(1);
  });
  it('Shows correct date validation message when date more than 30 days from term start date', async () => {
    const data = {
      institutionDetails: {
        institutionName: 'Example',
        facilityCode: '12345678',
        termStartDate: '2024-01-01',
      },
      studentRatioCalcChapter: {
        dateOfCalculation: '2025-01-01',
      },
    };
    const errors = {
      messages: [],
      addError: message => {
        errors.messages.push(message);
      },
    };
    const validateDate =
      formConfig.chapters.studentRatioCalcChapter.pages.studentRatioCalc
        .uiSchema.studentRatioCalcChapter.dateOfCalculation[
        'ui:validations'
      ][0];
    validateDate(errors, '2025-01-01', data);

    const { container } = renderWithStore(data);
    const date = $('va-memorable-date', container);
    fireEvent.blur(date);

    waitFor(() => {
      expect($$('va-memorable-date[error]', container).length).to.equal(1);
      expect(date.error).to.contain(
        'Please enter a date within 30 calendar days of the term start date',
      );
      expect(errors.messages).to.contain(
        'Please enter a date within 30 calendar days of the term start date',
      );
    });
  });
  it('Shows correct validation message when student ratio exceeds 35%', async () => {
    const data = {
      institutionDetails: {
        institutionName: 'Example',
        facilityCode: '12345678',
        termStartDate: '2025-01-01',
      },
      studentRatioCalcChapter: {
        beneficiaryStudent: 36,
        numOfStudent: 100,
        dateOfCalculation: '2025-01-02',
      },
    };
    const errors = {
      messages: [],
      addError: message => {
        errors.messages.push(message);
      },
    };
    const validateRatio =
      formConfig.chapters.studentRatioCalcChapter.pages.studentRatioCalc
        .uiSchema.studentRatioCalcChapter.beneficiaryStudent[
        'ui:validations'
      ][0];
    validateRatio(errors, '36', data);

    const { container } = renderWithStore(data);
    const input = $(
      'va-text-input[name="root_studentRatioCalcChapter_beneficiaryStudent"]',
      container,
    );
    fireEvent.blur(input);

    waitFor(() => {
      expect($$('va-text-input[error]', container).length).to.equal(1);
      expect(input.error).to.contain(
        'The calculation percentage exceeds 35%. Please check your numbers, and if you believe this is an error, contact your ELR',
      );
      expect(errors.messages).to.contain(
        'The calculation percentage exceeds 35%. Please check your numbers, and if you believe this is an error, contact your ELR',
      );
      expect($('va-alert[status="error"]', container)).to.exist;
    });
  });
});
