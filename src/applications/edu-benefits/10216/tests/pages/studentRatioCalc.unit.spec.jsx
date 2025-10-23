import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { expect } from 'chai';
import configureStore from 'redux-mock-store';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import { $, $$ } from 'platform/forms-system/src/js/utilities/ui';
import formConfig from '../../config/form';
import { isValidStudentRatio } from '../../utilities';

const mockStore = configureStore([]);

const renderWithStore = (state = {}) => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.studentRatioCalcChapter.pages.studentRatioCalc;

  const store = mockStore({
    form: { data: state },
  });

  const providerRender = render(
    <Provider store={store}>
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
      />
    </Provider>,
  );
  const validateDate =
    uiSchema.studentRatioCalcChapter.dateOfCalculation['ui:validations'][0];
  const validateNumOfStudents =
    uiSchema.studentRatioCalcChapter.numOfStudent['ui:validations'][0];
  const validateRatio =
    uiSchema.studentRatioCalcChapter.beneficiaryStudent['ui:validations'][0];

  return {
    ...providerRender,
    validateDate,
    validateNumOfStudents,
    validateRatio,
  };
};

describe('Student Ratio Calculation page', () => {
  it('Renders the page with the correct number of inputs', async () => {
    const { container, getByRole } = renderWithStore({});

    expect($$('va-text-input', container).length).to.equal(2);
    expect($$('va-memorable-date', container).length).to.equal(1);
    expect($$('va-alert', container).length).to.equal(1);
    getByRole('button', { name: /submit/i }).click();
    await waitFor(() => {
      expect($$('va-memorable-date[error]', container).length).to.equal(1);
    });
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
        'The calculation percentage exceeds 35%. Please check your numbers, and if you believe this calculation is an error, contact your ELR',
      );
      expect(errors.messages).to.contain(
        'The calculation percentage exceeds 35%. Please check your numbers, and if you believe this calculation is an error, contact your ELR',
      );
      expect($('va-alert[status="error"]', container)).to.exist;
    });
  });
  it('Shows correct validation message when number of students is more than beneficiary students', async () => {
    const data = {
      institutionDetails: {
        institutionName: 'Example',
        facilityCode: '12345678',
        termStartDate: '2025-01-01',
      },
      studentRatioCalcChapter: {
        beneficiaryStudent: 100,
        numOfStudent: 25,
        dateOfCalculation: '2025-01-02',
      },
    };
    const errors = {
      messages: [],
      addError: message => {
        errors.messages.push(message);
      },
    };
    const validateNumOfStudents =
      formConfig.chapters.studentRatioCalcChapter.pages.studentRatioCalc
        .uiSchema.studentRatioCalcChapter.numOfStudent['ui:validations'][0];
    validateNumOfStudents(errors, '25', data);

    const { container } = renderWithStore(data);
    const input = $(
      'va-text-input[name="root_studentRatioCalcChapter_numOfStudent"]',
      container,
    );
    fireEvent.blur(input);

    waitFor(() => {
      expect($$('va-text-input[error]', container).length).to.equal(1);
      expect(input.error).to.contain(
        'Number of VA beneficiaries cannot surpass the total number of students',
      );
      expect(errors.messages).to.contain(
        'Number of VA beneficiaries cannot surpass the total number of students',
      );
    });
  });
  it('returns true when beneficiary ≤ total (and both ≥ 0)', () => {
    const formData = {
      studentRatioCalcChapter: { beneficiaryStudent: 20, numOfStudent: 100 },
    };
    expect(isValidStudentRatio(formData)).to.equal(true);
  });

  it('adds an error when date is > 30 days after termStartDate', () => {
    const { validateDate } = renderWithStore();
    const errors = { messages: [], addError: m => errors.messages.push(m) };
    const formData = { institutionDetails: { termStartDate: '2025-01-01' } };

    validateDate(errors, '2025-02-05', formData);

    expect(errors.messages).to.contain(
      'Please enter a date within 30 calendar days of the term start date',
    );
  });

  it('does NOT add an error when date is within 30 days of termStartDate', () => {
    const { validateDate } = renderWithStore();
    const errors = { messages: [], addError: m => errors.messages.push(m) };
    const formData = { institutionDetails: { termStartDate: '2025-01-01' } };

    validateDate(errors, '2025-01-30', formData);

    expect(errors.messages).to.be.empty;
  });

  it('adds an error when total students < beneficiaries', () => {
    const { validateNumOfStudents } = renderWithStore();
    const errors = { messages: [], addError: m => errors.messages.push(m) };
    const formData = { studentRatioCalcChapter: { beneficiaryStudent: 100 } };

    validateNumOfStudents(errors, '25', formData);

    expect(errors.messages).to.contain(
      'Number of VA beneficiaries cannot surpass the total number of students',
    );
  });

  it('does NOT add an error when total students ≥ beneficiaries', () => {
    const { validateNumOfStudents } = renderWithStore();
    const errors = { messages: [], addError: m => errors.messages.push(m) };
    const formData = { studentRatioCalcChapter: { beneficiaryStudent: 25 } };

    validateNumOfStudents(errors, '100', formData);

    expect(errors.messages).to.be.empty;
  });

  it('adds an error when the ratio exceeds 35%', () => {
    const { validateRatio } = renderWithStore();
    const errors = { messages: [], addError: m => errors.messages.push(m) };
    const formData = {
      studentRatioCalcChapter: { beneficiaryStudent: 36, numOfStudent: 100 },
    };

    validateRatio(errors, '36', formData);

    expect(errors.messages).to.contain(
      'The calculation percentage exceeds 35%. Please check your numbers, and if you believe this calculation is an error, contact your ELR',
    );
  });

  it('does NOT add an error when the ratio is 35% or below', () => {
    const { validateRatio } = renderWithStore();
    const errors = { messages: [], addError: m => errors.messages.push(m) };
    const formData = {
      studentRatioCalcChapter: { beneficiaryStudent: 35, numOfStudent: 100 },
    };

    validateRatio(errors, '35', formData);

    expect(errors.messages).to.be.empty;
  });
});
