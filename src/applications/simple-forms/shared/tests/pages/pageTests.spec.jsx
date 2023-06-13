import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';

const expectedFieldTypes =
  'input, select, textarea, va-text-input, va-select, va-textarea, va-radio, va-checkbox';

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
    it('should show the correct number of errors on submit', () => {
      const { container, getByRole, queryAllByRole } = render(
        <DefinitionTester
          definitions={formConfig.defaultDefinitions}
          schema={schema}
          uiSchema={uiSchema}
          data={data}
          formData={{}}
        />,
      );

      getByRole('button', { name: /submit/i }).click();

      // get number of errors on web components
      const nodes = Array.from(container.querySelectorAll(expectedFieldTypes));
      const errors = nodes.filter(node => node.error);

      // get number of errors on rjsf components
      const alertErrors = queryAllByRole('alert');

      const totalNumberOfErrors = errors?.length + alertErrors?.length;
      expect(totalNumberOfErrors).to.equal(expectedNumberOfErrors);
    });
  });
};
