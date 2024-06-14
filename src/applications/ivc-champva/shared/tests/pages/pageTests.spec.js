/**
 * Lifted from src/applications/simple-forms/shared/tests/pages/pageTests.spec
 * to prevent cross-app import.
 */

import { DefinitionTester } from '@department-of-veterans-affairs/platform-testing/schemaform-utils';
import { expect } from 'chai';
import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';

const expectedFieldTypesWebComponents =
  'va-text-input, va-select, va-textarea, va-number-input, va-radio, va-checkbox, va-memorable-date';

export const getProps = () => {
  return {
    mockStore: {
      getState: () => ({
        form: { data: {} },
      }),
      subscribe: () => {},
      dispatch: () => ({
        setFormData: () => {},
      }),
    },
  };
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
      const { mockStore } = getProps();

      const { container } = render(
        <Provider store={mockStore}>
          <DefinitionTester
            definitions={formConfig.defaultDefinitions}
            schema={schema}
            uiSchema={uiSchema}
            data={data}
            formData={{}}
          />
        </Provider>,
      );

      expect(
        container.querySelectorAll(expectedFieldTypesWebComponents),
      ).to.have.lengthOf(expectedNumberOfFields);
    });
  });
};

export const testComponentRender = (componentName, component) => {
  describe(`${componentName}`, () => {
    it('should render', () => {
      const { mockStore } = getProps();

      const { container } = render(
        <Provider store={mockStore}>{component}</Provider>,
      );

      expect(container).to.exist;
      expect(component).to.exist;
    });
  });
};
