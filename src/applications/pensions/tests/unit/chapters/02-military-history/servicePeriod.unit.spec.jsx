import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { expect } from 'chai';
import sinon from 'sinon';
import { render, fireEvent, waitFor } from '@testing-library/react';

import { $$ } from '@department-of-veterans-affairs/platform-forms-system/ui';

import { DefinitionTester } from '@department-of-veterans-affairs/platform-testing/schemaform-utils';
import {
  testNumberOfErrorsOnSubmitForWebComponents,
  testNumberOfWebComponentFields,
} from '../pageTests.spec';
import getData from '../../../fixtures/mocks/mockStore';

import formConfig from '../../../../config/form';
import servicePeriod from '../../../../config/chapters/02-military-history/servicePeriod';

const definitions = formConfig.defaultDefinitions;

const { schema, uiSchema } = servicePeriod;

describe('pensions service periods page', () => {
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

  it('should submit with no errors with all required fields filled in', async () => {
    const { data } = getData({ loggedIn: false });
    const { queryByText, container } = render(
      <Provider store={mockStore(data)}>
        <DefinitionTester
          schema={schema}
          data={{}}
          definitions={formConfig.defaultDefinitions}
          uiSchema={uiSchema}
        />
      </Provider>,
    );

    const submitBtn = queryByText('Submit');
    const branchOfService = container.querySelector(
      'va-checkbox[name="root_serviceBranch_army"]',
    );
    const startMonth = container.querySelector(
      '#root_activeServiceDateRange_fromMonth',
    );
    const startDay = container.querySelector(
      '#root_activeServiceDateRange_fromDay',
    );
    const startYear = container.querySelector(
      '#root_activeServiceDateRange_fromYear',
    );
    const endMonth = container.querySelector(
      '#root_activeServiceDateRange_toMonth',
    );
    const endDay = container.querySelector(
      '#root_activeServiceDateRange_toDay',
    );
    const endYear = container.querySelector(
      '#root_activeServiceDateRange_toYear',
    );
    const serviceNumber = container.querySelector(
      'va-text-input[name="root_serviceNumber"]',
    );

    fireEvent.click(submitBtn);
    waitFor(() => {
      expect($$('.usa-input-error-message', container)).not.to.be.empty;

      fireEvent.click(branchOfService);
      fireEvent.change(serviceNumber, { value: '123456' });
      fireEvent.change(startMonth, { target: { value: '2' } });
      fireEvent.change(startDay, { target: { value: '15' } });
      fireEvent.change(startYear, { target: { value: '1975' } });
      fireEvent.change(endMonth, { target: { value: '2' } });
      fireEvent.change(endDay, { target: { value: '15' } });
      fireEvent.change(endYear, { target: { value: '1985' } });
      fireEvent.click(submitBtn);

      expect($$('.usa-input-error-message', container)).to.be.empty;
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
    const branchOfService = container.querySelector(
      'va-checkbox[name="root_serviceBranch_army"]',
    );
    const startMonth = container.querySelector(
      '#root_activeServiceDateRange_fromMonth',
    );
    const startDay = container.querySelector(
      '#root_activeServiceDateRange_fromDay',
    );
    const startYear = container.querySelector(
      '#root_activeServiceDateRange_fromYear',
    );
    const endMonth = container.querySelector(
      '#root_activeServiceDateRange_toMonth',
    );
    const endDay = container.querySelector(
      '#root_activeServiceDateRange_toDay',
    );
    const endYear = container.querySelector(
      '#root_activeServiceDateRange_toYear',
    );
    const serviceNumber = container.querySelector(
      'va-text-input[name="root_serviceNumber"]',
    );

    fireEvent.click(submitBtn);
    waitFor(() => {
      expect($$('va-alert', container).length).to.equal(0);
      fireEvent.click(branchOfService);
      fireEvent.change(serviceNumber, { value: '123456' });
      fireEvent.change(startMonth, { target: { value: '2' } });
      fireEvent.change(startDay, { target: { value: '15' } });
      fireEvent.change(startYear, { target: { value: '1983' } });
      fireEvent.change(endMonth, { target: { value: '2' } });
      fireEvent.change(endDay, { target: { value: '15' } });
      fireEvent.change(endYear, { target: { value: '1984' } });
      fireEvent.click(submitBtn);
      expect($$('va-alert', container).length).to.equal(1);
    });
  });
});
