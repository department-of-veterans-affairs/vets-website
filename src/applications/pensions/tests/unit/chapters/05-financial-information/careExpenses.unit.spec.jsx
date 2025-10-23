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
import { careExpenseTypePage } from '../../../../config/chapters/05-financial-information/careExpensesPages';

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
      'va-radio-option': 7,
    },
    pageTitle,
  );

  context('care type feature toggle options', () => {
    const uiOptions = careExpenseTypePage.uiSchema.careType['ui:options'];

    it('should have correct number of care type options', () => {
      global.window.sessionStorage.setItem('showPdfFormAlignment', 'true');
      const updatedSchema = uiOptions.updateSchema();
      const updatedUiSchema = uiOptions.updateUiSchema();

      expect(updatedSchema?.enum).to.have.lengthOf(4);
      expect(
        Object.keys(updatedUiSchema?.['ui:options']?.labels),
      ).to.have.lengthOf(4);
    });

    it('should have correct number of care type options', () => {
      global.window.sessionStorage.removeItem('showPdfFormAlignment');
      const updatedSchema = uiOptions.updateSchema();
      const updatedUiSchema = uiOptions.updateUiSchema();

      expect(updatedSchema.enum).to.have.lengthOf(2);
      expect(
        Object.keys(updatedUiSchema['ui:options'].labels),
      ).to.have.lengthOf(2);
    });
  });

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
