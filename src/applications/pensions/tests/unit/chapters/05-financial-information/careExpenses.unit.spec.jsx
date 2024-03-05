import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import {
  testNumberOfWebComponentFields,
  testNumberOfErrorsOnSubmitForWebComponents,
  testNumberOfErrorsOnSubmit,
  testNumberOfFields,
} from '../pageTests.spec';
import formConfig from '../../../../config/form';
import careExpenses, {
  CareExpenseView,
} from '../../../../config/chapters/05-financial-information/careExpenses';

const { schema, uiSchema } = careExpenses;

describe('Unreimbursed care expenses pension page', () => {
  const pageTitle = 'Care expenses';
  const expectedNumberOfFields = 8;
  testNumberOfFields(
    formConfig,
    schema,
    uiSchema,
    expectedNumberOfFields,
    pageTitle,
  );

  const expectedNumberOfErrors = 2;
  testNumberOfErrorsOnSubmit(
    formConfig,
    schema,
    uiSchema,
    expectedNumberOfErrors,
    pageTitle,
  );

  const expectedNumberOfWebComponentFields = 6;
  testNumberOfWebComponentFields(
    formConfig,
    schema,
    uiSchema,
    expectedNumberOfWebComponentFields,
    pageTitle,
  );

  const expectedNumberOfErrorsForWebComponents = 4;
  testNumberOfErrorsOnSubmitForWebComponents(
    formConfig,
    schema,
    uiSchema,
    expectedNumberOfErrorsForWebComponents,
    pageTitle,
  );

  describe('CareExpenseView', () => {
    it('should render a list view', () => {
      const { container } = render(
        <CareExpenseView formData={{ provider: 'Doctor' }} />,
      );
      const text = container.querySelector('h3');
      expect(text.innerHTML).to.equal('Doctor');
    });
  });
});
