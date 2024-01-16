import React from 'react';
import { expect } from 'chai';
import { render, fireEvent, waitFor } from '@testing-library/react';

import { DefinitionTester } from '@department-of-veterans-affairs/platform-testing/schemaform-utils';
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
  const expectedNumberOfFields = 2;
  testNumberOfWebComponentFields(
    formConfig,
    schema,
    uiSchema,
    expectedNumberOfFields,
    pageTitle,
  );

  const expectedNumberOfErrors = 2;
  testNumberOfErrorsOnSubmitForWebComponents(
    formConfig,
    schema,
    uiSchema,
    expectedNumberOfErrors,
    pageTitle,
  );

  it('should not allow more than 168 hours of work', async () => {
    const data = { employers: [{}] };
    const { container, getByRole, queryAllByRole } = render(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={data}
        formData={{}}
      />,
    );

    const input = container.querySelector(
      'input[name="root_employers_0_jobHoursWeek"]',
    );
    input.value = 170;
    fireEvent.input(input);
    await waitFor(() => expect(input.value).to.equal('170'));
    getByRole('button', { name: /submit/i }).click();

    const errors = queryAllByRole('alert');
    await waitFor(() => expect(errors).to.have.lengthOf(1));
  });

  it('should render with multiple employers', () => {
    const data = { employers: [{}, {}] };
    const { container } = render(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={data}
        formData={{}}
      />,
    );

    expect(container.querySelectorAll('input')).to.have.lengthOf(2);
  });

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
