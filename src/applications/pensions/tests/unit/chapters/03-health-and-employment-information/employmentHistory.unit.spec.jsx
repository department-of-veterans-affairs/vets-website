import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import {
  testNumberOfErrorsOnSubmitForWebComponents,
  testNumberOfWebComponentFields,
} from '../pageTests.spec';
import formConfig from '../../../../config/form';
import generateEmployersSchemas, {
  EmployerView,
} from '../../../../config/chapters/03-health-and-employment-information/employmentHistory';

const { schema, uiSchema } = generateEmployersSchemas();

describe('pensions employment history', () => {
  const pageTitle = 'employment history';
  const expectedNumberOfFields = 3;
  testNumberOfWebComponentFields(
    formConfig,
    schema,
    uiSchema,
    expectedNumberOfFields,
    pageTitle,
  );

  const expectedNumberOfErrors = 3;
  testNumberOfErrorsOnSubmitForWebComponents(
    formConfig,
    schema,
    uiSchema,
    expectedNumberOfErrors,
    pageTitle,
  );

  describe('EmployerView', () => {
    it('should render a list view', () => {
      const { container } = render(
        <EmployerView formData={{ jobTitle: 'Contractor' }} />,
      );
      const text = container.querySelector('h3');
      expect(text.innerHTML).to.equal('Contractor');
    });
  });
});
