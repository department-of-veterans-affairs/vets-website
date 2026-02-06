import React from 'react';
import { Provider } from 'react-redux';
import { expect } from 'chai';
import { render, waitFor } from '@testing-library/react';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import navigationState from 'platform/forms-system/src/js/utilities/navigation/navigationState';

const expectedFieldTypes = 'input, select, textarea';

const expectedFieldTypesWebComponents =
  'va-text-input, va-file-input, va-select, va-textarea, va-radio, va-checkbox, va-memorable-date, va-telephone-input, va-combo-box';

const wrapperWebComponents = 'va-checkbox-group, va-memorable-date';

const getProps = () => {
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
    it('should show the correct number of errors on submit', async () => {
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

      // Wait for the DOM to update after form validation
      await new Promise(resolve => setTimeout(resolve, 0));

      await waitFor(() => {
        const alerts = queryAllByRole('alert');

        // Filter out screen reader announcements (sr-only with aria-live="polite")
        const errors = alerts.filter(
          alert =>
            !(
              alert.classList.contains('sr-only') &&
              alert.getAttribute('aria-live') === 'polite'
            ),
        );
        expect(errors).to.have.lengthOf(expectedNumberOfErrors);
      });
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

      // this is only relevant for pages with components whose validation relies on navigation state, e.g. va-telephone-input
      navigationState.setNavigationEvent();
      getByRole('button', { name: /submit/i }).click();

      // Wait for the DOM to update after form validation
      await new Promise(resolve => setTimeout(resolve, 0));

      await waitFor(
        () => {
          const nodes = Array.from(
            container.querySelectorAll(
              `${expectedFieldTypesWebComponents}, ${wrapperWebComponents}`,
            ),
          );
          const errors = nodes.filter(node => node.error);
          expect(errors).to.have.lengthOf(expectedNumberOfErrors);
        },
        { timeout: 1000 },
      );
    });
  });
};
