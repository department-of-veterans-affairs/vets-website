import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { expect } from 'chai';
import sinon from 'sinon';
import { render, fireEvent, waitFor } from '@testing-library/react';

import {
  $,
  $$,
} from '@department-of-veterans-affairs/platform-forms-system/ui';

import { DefinitionTester } from '@department-of-veterans-affairs/platform-testing/schemaform-utils';
import {
  getWebComponentErrors,
  testNumberOfErrorsOnSubmitForWebComponents,
  testNumberOfFieldsByType,
  testNumberOfWebComponentFields,
} from '../pageTests.spec';
import getData from '../../../fixtures/mocks/mockStore';
import getFixtureData from '../../../fixtures/vets-json-api/getFixtureData';
import {
  changeCheckboxInGroup,
  fillDateInput,
  fillTextInput,
} from '../../testHelpers/webComponents';

import formConfig from '../../../../config/form';
import servicePeriod from '../../../../config/chapters/02-military-history/servicePeriod';

const definitions = formConfig.defaultDefinitions;

const { schema, uiSchema } = servicePeriod;

describe('pensions service period page', () => {
  const pageTitle = 'service period';
  const middleware = [];
  const mockStore = configureStore(middleware);

  const expectedNumberOfFields = 12;
  testNumberOfWebComponentFields(
    formConfig,
    schema,
    uiSchema,
    expectedNumberOfFields,
    pageTitle,
  );

  const expectedNumberOfErrors = 3;
  testNumberOfErrorsOnSubmitForWebComponents(
    formConfig,
    schema,
    uiSchema,
    expectedNumberOfErrors,
    pageTitle,
  );

  testNumberOfFieldsByType(
    formConfig,
    schema,
    uiSchema,
    {
      'va-text-input': 2,
      'va-memorable-date': 2,
      'va-checkbox': 8,
    },
    pageTitle,
  );

  it('should submit with no errors with all required fields filled in', async () => {
    const { data } = getData({ loggedIn: false });
    const { queryByText, container } = render(
      <Provider store={mockStore(data)}>
        <DefinitionTester
          schema={schema}
          data={getFixtureData()}
          definitions={formConfig.defaultDefinitions}
          uiSchema={uiSchema}
        />
      </Provider>,
    );

    const submitBtn = queryByText('Submit');

    await waitFor(() => {
      fireEvent.click(submitBtn);

      expect(getWebComponentErrors(container)).to.be.empty;
    });
  });
  it('should display warning if the veteran did not serve during a wartime period', async () => {
    const onSubmit = sinon.spy();
    const { data } = getData({ loggedIn: false });
    const store = mockStore(data);
    const { queryByText, container } = render(
      <Provider store={store}>
        <DefinitionTester
          definitions={definitions}
          schema={schema}
          uiSchema={uiSchema}
          data={{}}
          formData={{}}
          onSubmit={onSubmit}
        />
      </Provider>,
    );

    const submitBtn = queryByText('Submit');

    fireEvent.click(submitBtn);
    expect($$('va-alert', container).length).to.equal(0);

    const checkboxGroup = $('va-checkbox-group', container);
    await changeCheckboxInGroup(checkboxGroup, 'Army', 'army', true);

    fillTextInput(container, 'root_serviceNumber', '123456');

    await fillDateInput(
      container,
      'root_activeServiceDateRange_from',
      '1984-02-15',
    );

    await fillDateInput(
      container,
      'root_activeServiceDateRange_to',
      '1983-02-15',
    );

    await waitFor(() => {
      fireEvent.click(submitBtn);
      expect($$('va-alert', container).length).to.equal(1);
    });
  });
});
