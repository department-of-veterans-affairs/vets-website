/**
 * Lifted from src/applications/simple-forms/shared/tests/pages/pageTests.spec
 * to prevent cross-app import.
 */

import { DefinitionTester } from '@department-of-veterans-affairs/platform-testing/schemaform-utils';
import { expect } from 'chai';
import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';

const expectedFieldTypes = 'input, select, textarea';

const wrapperWebComponents = 'va-checkbox-group, va-memorable-date';

const expectedFieldTypesWebComponents =
  'va-text-input, va-telephone-input, va-file-input-multiple, va-select, va-textarea, va-radio, va-checkbox, va-memorable-date';

export const getProps = () => {
  return {
    mockStore: {
      getState: () => ({
        form: { data: {} },
        user: { login: { currentlyLoggedIn: false } },
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
      const { mockStore } = getProps();

      const { getByRole, queryAllByRole } = render(
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

      getByRole('button', { name: /submit/i }).click();
      const errors = queryAllByRole('alert');
      expect(errors).to.have.lengthOf(expectedNumberOfErrors);
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
    it('should show the correct number of errors on submit for web components', () => {
      const { mockStore } = getProps();

      const { container, getByRole } = render(
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

      getByRole('button', { name: /submit/i }).click();
      const nodes = Array.from(
        container.querySelectorAll(
          `${expectedFieldTypesWebComponents}, ${wrapperWebComponents}`,
        ),
      );
      const errors = nodes.filter(node => node.error);
      expect(errors).to.have.lengthOf(expectedNumberOfErrors);
    });
  });
};
