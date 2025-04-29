import React from 'react';
import { expect } from 'chai';
import { render, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import sinon from 'sinon';
import configureStore from 'redux-mock-store';
import { $$ } from '@department-of-veterans-affairs/platform-forms-system/ui';
import { DefinitionTester } from '@department-of-veterans-affairs/platform-testing/schemaform-utils';

import getFixtureData, {
  FixtureDataType,
} from '../../fixtures/vets-json-api/getFixtureData';
import getData from '../../fixtures/mocks/mockStore';

const expectedFieldTypes = 'input, select, textarea';

const expectedFieldTypesWebComponents =
  'va-text-input, va-select, va-textarea, va-radio, va-checkbox, va-memorable-date';

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

export const testNumberOfFieldsByType = (
  formConfig,
  schema,
  uiSchema,
  expectedFields,
  pageTitle,
  data = {},
  options = {},
) => {
  describe(`${pageTitle} page`, () => {
    it('should have appropriate number of fields of each type', () => {
      const { container } = render(
        <FakeProvider>
          <DefinitionTester
            definitions={formConfig.defaultDefinitions}
            schema={schema}
            uiSchema={uiSchema}
            data={data}
            formData={{}}
            {...options}
          />
        </FakeProvider>,
      );

      expect(container.querySelectorAll('va-alert')).to.have.lengthOf(
        expectedFields['va-alert'] || 0,
      );
      expect(container.querySelectorAll('va-text-input')).to.have.lengthOf(
        expectedFields['va-text-input'] || 0,
      );
      expect(container.querySelectorAll('va-memorable-date')).to.have.lengthOf(
        expectedFields['va-memorable-date'] || 0,
      );
      expect(container.querySelectorAll('va-select')).to.have.lengthOf(
        expectedFields['va-select'] || 0,
      );
      expect(container.querySelectorAll('va-checkbox')).to.have.lengthOf(
        expectedFields['va-checkbox'] || 0,
      );
      expect(container.querySelectorAll('va-radio')).to.have.lengthOf(
        expectedFields['va-radio'] || 0,
      );
      expect(container.querySelectorAll('va-textarea')).to.have.lengthOf(
        expectedFields['va-textarea'] || 0,
      );
      expect(container.querySelectorAll('input')).to.have.lengthOf(
        expectedFields.input || 0,
      );
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

      const errors = getWebComponentErrors(container);
      expect(errors).to.have.lengthOf(expectedNumberOfErrors);
    });
  });
};

export const testSubmitsWithoutErrors = (
  formConfig,
  schema,
  uiSchema,
  pageTitle,
  data = getFixtureData(FixtureDataType.OVERFLOW),
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

export const testShowAlert = (
  formConfig,
  schema,
  uiSchema,
  pageTitle,
  data = {},
  setToShowAlert,
) => {
  describe(`${pageTitle} page`, () => {
    it('should show warning', async () => {
      const { container } = render(
        <FakeProvider>
          <DefinitionTester
            schema={schema}
            data={data}
            definitions={formConfig.defaultDefinitions}
            uiSchema={uiSchema}
          />
        </FakeProvider>,
      );

      expect($$('va-alert', container).length).to.equal(0);

      await setToShowAlert(container);
      expect($$('va-alert', container).length).to.equal(1);
    });
  });
};
