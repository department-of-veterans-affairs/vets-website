import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import {
  testNumberOfWebComponentFields,
  testComponentFieldsMarkedAsRequired,
  testNumberOfErrorsOnSubmit,
  testNumberOfFields,
  testSubmitsWithoutErrors,
  FakeProvider,
  testNumberOfFieldsByType,
} from '../pageTests.spec';
import formConfig from '../../../../config/form';
import careExpenses, {
  CareExpenseView,
} from '../../../../config/chapters/05-financial-information/careExpenses';

const { schema, uiSchema } = careExpenses;

describe('Unreimbursed care expenses pension page', () => {
  const pageTitle = 'Care expenses';
  const expectedNumberOfFields = 0;
  testNumberOfFields(
    formConfig,
    schema,
    uiSchema,
    expectedNumberOfFields,
    pageTitle,
  );

  const expectedNumberOfErrors = 0;
  testNumberOfErrorsOnSubmit(
    formConfig,
    schema,
    uiSchema,
    expectedNumberOfErrors,
    pageTitle,
  );

  const expectedNumberOfWebComponentFields = 10;
  testNumberOfWebComponentFields(
    formConfig,
    schema,
    uiSchema,
    expectedNumberOfWebComponentFields,
    pageTitle,
  );

  testComponentFieldsMarkedAsRequired(
    formConfig,
    schema,
    uiSchema,
    [
      `va-radio[label="Who receives care?"]`,
      `va-text-input[label="What’s the name of the care provider?"]`,
      `va-radio[label="Choose the type of care:"]`,
      `va-memorable-date[label="Care start date"]`,
      `va-radio[label="How often are the payments?"]`,
      `va-text-input[label="How much is each payment?"]`,
    ],
    pageTitle,
  );

  testSubmitsWithoutErrors(formConfig, schema, uiSchema, pageTitle);

  testNumberOfFieldsByType(
    formConfig,
    schema,
    uiSchema,
    {
      'va-text-input': 4,
      'va-memorable-date': 2,
      'va-checkbox': 1,
      'va-radio': 3,
    },
    pageTitle,
  );

  describe('CareExpenseView', () => {
    it('should render a list view', () => {
      const { container } = render(
        <FakeProvider>
          <CareExpenseView formData={{ provider: 'Doctor' }} />
        </FakeProvider>,
      );
      const text = container.querySelector('h3');
      expect(text.innerHTML).to.equal('Doctor');
    });
  });
});
