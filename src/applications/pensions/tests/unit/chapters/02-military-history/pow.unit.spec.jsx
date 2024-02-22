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
import getData from '../../../fixtures/mocks/mockStore';

import {
  testNumberOfErrorsOnSubmitForWebComponents,
  testNumberOfWebComponentFields,
} from '../pageTests.spec';
import formConfig from '../../../../config/form';
import pow from '../../../../config/chapters/02-military-history/pow';

const definitions = formConfig.defaultDefinitions;

const { schema, uiSchema } = pow;

describe('web component tests', () => {
  const pageTitle = 'military history';
  const expectedNumberOfFields = 1;
  testNumberOfWebComponentFields(
    formConfig,
    schema,
    uiSchema,
    expectedNumberOfFields,
    pageTitle,
  );

  const expectedNumberOfErrors = 1;
  testNumberOfErrorsOnSubmitForWebComponents(
    formConfig,
    schema,
    uiSchema,
    expectedNumberOfErrors,
    pageTitle,
  );
});

describe('pension pow information page', () => {
  const middleware = [];
  const mockStore = configureStore(middleware);
  it('should submit with valid data', async () => {
    const onSubmit = sinon.spy();
    const { data } = getData({ loggedIn: false });
    const { queryByText, container } = render(
      <Provider store={mockStore(data)}>
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
    const changeEvent = new CustomEvent('selected', {
      detail: { value: 'N' },
    });
    $('va-radio', container).__events.vaValueChange(changeEvent);

    fireEvent.click(submitBtn);
    await waitFor(() => {
      expect(onSubmit.called).to.be.true;
    });
  });
  it('should reveal date fields', async () => {
    const onSubmit = sinon.spy();
    const { data } = getData({ loggedIn: false });
    const { container } = render(
      <Provider store={mockStore(data)}>
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

    // Verify fields not visible
    expect($$('input,select', container).length).to.equal(0);

    await waitFor(() => {
      const changeEvent = new CustomEvent('selected', {
        detail: { value: 'Y' },
      });
      $('va-radio', container).__events.vaValueChange(changeEvent);

      // Verify fields are now visible
      expect($$('select', container).length).to.equal(4);
      expect($$('input', container).length).to.equal(2);
    });
  });
});
