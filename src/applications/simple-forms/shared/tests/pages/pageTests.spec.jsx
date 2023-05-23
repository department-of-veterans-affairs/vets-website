import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';

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
      const { container } = render(
        <DefinitionTester
          definitions={formConfig.defaultDefinitions}
          schema={schema}
          uiSchema={uiSchema}
          data={data}
          formData={{}}
        />,
      );

      expect(
        container.querySelectorAll('input, select, textarea'),
      ).to.have.lengthOf(expectedNumberOfFields);
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
    it('should show the correct number of errors on submit', () => {
      const { getByRole, queryAllByRole } = render(
        <DefinitionTester
          definitions={formConfig.defaultDefinitions}
          schema={schema}
          uiSchema={uiSchema}
          data={data}
          formData={{}}
        />,
      );

      getByRole('button', { name: /submit/i }).click();
      const errors = queryAllByRole('alert');
      expect(errors).to.have.lengthOf(expectedNumberOfErrors);
    });
  });
};
