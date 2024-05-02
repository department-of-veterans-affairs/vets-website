import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { DefinitionTester } from '@department-of-veterans-affairs/platform-testing/schemaform-utils';

const expectedFieldTypes = 'input, select, textarea';

const expectedFieldTypesWebComponents =
  'va-text-input, va-select, va-textarea, va-number-input, va-radio, va-checkbox, va-memorable-date';

const wrapperWebComponents = 'va-checkbox-group, va-memorable-date';

const createFakeStore = fakeState => {
  return (state = {}) => ({
    getState: () => ({
      ...state,
      fakeState,
    }),
    subscribe: () => {},
    dispatch: () => {},
  });
};

export const FakeProvider = ({ children, state }) => {
  const store = createFakeStore(state);
  const mockStore = store(state);
  return <Provider store={mockStore}>{children}</Provider>;
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
      const { container } = render(
        <FakeProvider>
          <DefinitionTester
            definitions={formConfig.defaultDefinitions}
            schema={schema}
            uiSchema={uiSchema}
            data={data}
            formData={{}}
          />
        </FakeProvider>,
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
      const { getByRole, queryAllByRole } = render(
        <FakeProvider>
          <DefinitionTester
            definitions={formConfig.defaultDefinitions}
            schema={schema}
            uiSchema={uiSchema}
            data={data}
            formData={{}}
          />
        </FakeProvider>,
      );

      getByRole('button', { name: /submit/i }).click();
      const errors = queryAllByRole('alert');
      expect(errors).to.have.lengthOf(expectedNumberOfErrors);
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
      const { container } = render(
        <FakeProvider>
          <DefinitionTester
            definitions={formConfig.defaultDefinitions}
            schema={schema}
            uiSchema={uiSchema}
            data={data}
            formData={{}}
          />
        </FakeProvider>,
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
    it('should show the correct number of errors on submit for web components', () => {
      const { container, getByRole } = render(
        <FakeProvider>
          <DefinitionTester
            definitions={formConfig.defaultDefinitions}
            schema={schema}
            uiSchema={uiSchema}
            data={data}
            formData={{}}
          />
        </FakeProvider>,
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

export const getWebComponentErrors = container => {
  const nodes = Array.from(
    container.querySelectorAll(
      `${expectedFieldTypesWebComponents}, ${wrapperWebComponents}`,
    ),
  );
  return nodes.filter(node => node.error);
};
