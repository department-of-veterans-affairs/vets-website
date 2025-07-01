import React from 'react';
import { expect } from 'chai';
import { render, waitFor } from '@testing-library/react';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';

const expectedFieldTypes = 'input, select, textarea';
const expectedFieldTypesWebComponents =
  'va-text-input, va-select, va-textarea, va-number-input, va-radio, va-checkbox, va-memorable-date';

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

export const testNumberOfFields = (
  formConfig,
  schema,
  uiSchema,
  expectedNumberOfFields,
  pageTitle,
  data = {},
) => {
  describe(`${pageTitle} page`, () => {
    it('should have appropriate number of fields', () => {
      const { container } = renderDefinitionTester({
        formConfig,
        schema,
        uiSchema,
        data,
      });
      expect(container.querySelectorAll(expectedFieldTypes)).to.have.lengthOf(
        expectedNumberOfFields,
      );
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
    it('should show the correct number of errors on submit', async () => {
      const { getByRole, queryAllByRole } = renderDefinitionTester({
        formConfig,
        schema,
        uiSchema,
        data,
      });
      getByRole('button', { name: /submit/i }).click();
      const errors = queryAllByRole('alert');
      await waitFor(() =>
        expect(errors).to.have.lengthOf(expectedNumberOfErrors),
      );
    });
  });
};

export const testNumberOfWebComponentFields = (
  formConfig,
  schema,
  uiSchema,
  expectedNumberOfFields,
  pageTitle,
  data = {},
) => {
  describe(`${pageTitle} page`, () => {
    it('should have appropriate number of web components', () => {
      const { container } = renderDefinitionTester({
        formConfig,
        schema,
        uiSchema,
        data,
      });
      expect(
        container.querySelectorAll(expectedFieldTypesWebComponents),
      ).to.have.lengthOf(expectedNumberOfFields);
    });
  });
};

export const testNumberOfErrorsOnSubmitForWebComponents = (
  formConfig,
  schema,
  uiSchema,
  expectedNumberOfErrors,
  pageTitle,
  data = {},
) => {
  describe(`${pageTitle} page`, () => {
    it('should show the correct number of errors on submit for web components', async () => {
      const { container, getByRole } = renderDefinitionTester({
        formConfig,
        schema,
        uiSchema,
        data,
      });
      getByRole('button', { name: /submit/i }).click();
      const nodes = Array.from(
        container.querySelectorAll(expectedFieldTypesWebComponents),
      );
      const errors = nodes.filter(node => node.error);
      await waitFor(() =>
        expect(errors).to.have.lengthOf(expectedNumberOfErrors),
      );
    });
  });
};
