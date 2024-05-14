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
  testNumberOfErrorsOnSubmitForWebComponents,
  testNumberOfFieldsByType,
  testNumberOfWebComponentFields,
} from '../pageTests.spec';
import getData from '../../../fixtures/mocks/mockStore';

import formConfig from '../../../../config/form';
import accountInformation from '../../../../config/chapters/06-additional-information/accountInformation';

const definitions = formConfig.defaultDefinitions;
const { schema, uiSchema } = accountInformation;

describe('web component tests', () => {
  const pageTitle = 'account information';
  const expectedNumberOfFields = 4;
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
      'va-alert': 1,
      'va-text-input': 3,
      'va-radio': 1,
    },
    pageTitle,
  );
});

describe('Pensions account information page', () => {
  const middleware = [];
  const mockStore = configureStore(middleware);

  it('should show error on bad routing number', async () => {
    const onSubmit = sinon.spy();
    const { data } = getData({ loggedIn: false });
    const { container } = render(
      <Provider store={mockStore(data)}>
        <DefinitionTester
          definitions={definitions}
          schema={schema}
          uiSchema={uiSchema}
          data={{
            bankAccount: {
              accountType: 'checking',
              bankName: 'Best Bank',
              accountNumber: '001122334455',
              routingNumber: '012345678',
            },
          }}
          formData={{}}
          onSubmit={onSubmit}
        />
      </Provider>,
    );
    fireEvent.submit($('form', container));
    await waitFor(() => {
      const errors = '.usa-input-error, va-radio[error], va-text-input[error]';
      expect($$(errors, container).length).to.equal(1);
      expect(onSubmit.called).to.be.false;
    });
  });

  it('should submit with valid data', async () => {
    const onSubmit = sinon.spy();
    const { data } = getData({ loggedIn: false });

    const { container } = render(
      <Provider store={mockStore(data)}>
        <DefinitionTester
          definitions={definitions}
          schema={schema}
          uiSchema={uiSchema}
          data={{
            bankAccount: {
              accountType: 'checking',
              bankName: 'Best Bank',
              accountNumber: '001122334455',
              routingNumber: '123123123',
            },
          }}
          formData={{}}
          onSubmit={onSubmit}
        />
      </Provider>,
    );
    fireEvent.submit($('form', container));
    await waitFor(() => {
      const errors = '.usa-input-error, va-radio[error], va-text-input[error]';
      expect($$(errors, container).length).to.equal(0);
      expect(onSubmit.called).to.be.true;
    });
  });
});
