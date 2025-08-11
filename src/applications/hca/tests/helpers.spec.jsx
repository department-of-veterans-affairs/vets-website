import React from 'react';
import { expect } from 'chai';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';

const expectedFieldTypes =
  'input, select, va-text-input, va-select, va-radio, va-checkbox, va-memorable-date';

const renderDefinitionTester = ({ formConfig, schema, uiSchema, data }) =>
  render(
    <DefinitionTester
      definitions={formConfig.defaultDefinitions}
      schema={schema}
      uiSchema={uiSchema}
      data={data}
      formData={{}}
    />,
  );

export const testNumberOfFormFields = (
  formConfig,
  schema,
  uiSchema,
  expectedNumberOfFields,
  pageTitle,
  data = {},
) => {
  describe(`${pageTitle} page`, () => {
    it('should render the correct number of form fields', () => {
      const { container } = renderDefinitionTester({
        formConfig,
        schema,
        uiSchema,
        data,
      });
      const fields = Array.from(container.querySelectorAll(expectedFieldTypes));
      expect(fields).to.have.lengthOf(expectedNumberOfFields);
    });
  });
};

export const testNumberOfErrorsOnSubmit = (
  formConfig,
  schema,
  uiSchema,
  expectedNumberOfErrors,
  pageTitle,
  data = {},
) => {
  describe(`${pageTitle} page`, () => {
    it('should render the correct number of errors on submit', async () => {
      const { container, getByRole } = renderDefinitionTester({
        formConfig,
        schema,
        uiSchema,
        data,
      });
      const submitButton = getByRole('button', { name: /submit/i });
      fireEvent.click(submitButton);
      await waitFor(() => {
        const errors = container.querySelectorAll('.usa-input-error');
        expect(errors).to.have.lengthOf(expectedNumberOfErrors);
      });
    });
  });
};
