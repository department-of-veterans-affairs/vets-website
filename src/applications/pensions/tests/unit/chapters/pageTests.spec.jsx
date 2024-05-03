import React from 'react';
import { expect } from 'chai';
import { render, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import sinon from 'sinon';
import configureStore from 'redux-mock-store';

import { DefinitionTester } from '@department-of-veterans-affairs/platform-testing/schemaform-utils';

import getFixtureData from '../../fixtures/vets-json-api/getFixtureData';
import getData from '../../fixtures/mocks/mockStore';

const expectedFieldTypes = 'input, select, textarea';

const expectedFieldTypesWebComponents =
  'va-text-input, va-select, va-textarea, va-number-input, va-radio, va-checkbox, va-memorable-date';

const wrapperWebComponents = 'va-checkbox-group, va-memorable-date';

export const FakeProvider = ({ children, state }) => {
  const middleware = [];
  const mockStore = configureStore(middleware);
  const { data } = getData(state);
  return <Provider store={mockStore(data)}>{children}</Provider>;
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

export const testSubmitsWithoutErrors = (
  formConfig,
  schema,
  uiSchema,
  pageTitle,
  data = getFixtureData('overflow'),
  stateData = {},
) => {
  describe(`${pageTitle} page`, () => {
    it('should submit with no errors with all valid data', () => {
      const state = getData({
        ...stateData,
        formData: data,
      });
      const onSubmit = sinon.spy();
      const { queryByText, container } = render(
        <FakeProvider state={state.data}>
          <DefinitionTester
            schema={schema}
            data={data}
            definitions={formConfig.defaultDefinitions}
            uiSchema={uiSchema}
            onSubmit={onSubmit}
          />
        </FakeProvider>,
      );
      const submitBtn = queryByText('Submit');

      fireEvent.click(submitBtn);

      expect(getWebComponentErrors(container)).to.be.empty;
      expect(onSubmit.called).to.be.true;
    });
  });
};
