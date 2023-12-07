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
import getData from '../../fixtures/mocks/mockStore';

import {
  testNumberOfErrorsOnSubmitForWebComponents,
  testNumberOfWebComponentFields,
} from '../pageTests.spec';
import formConfig from '../../../config/form';
import generalHistory from '../../../config/chapters/military-history/generalHistory';

const definitions = formConfig.defaultDefinitions;

const { schema, uiSchema } = generalHistory;

describe('web component tests', () => {
  const pageTitle = 'military history';
  const expectedNumberOfFields = 2;
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

describe('pension applicant information page', () => {
  const middleware = [];
  const mockStore = configureStore(middleware);
  it('should submit with no errors when No is selected', async () => {
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
  it('should not submit with errors when Yes is selected', async () => {
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
      detail: { value: 'Y' },
    });
    $('va-radio', container).__events.vaValueChange(changeEvent);

    fireEvent.click(submitBtn);
    await waitFor(() => {
      expect(onSubmit.called).to.be.false;
    });
  });
  it('should reveal name fields', async () => {
    const onSubmit = sinon.spy();
    const { data } = getData({ loggedIn: false });
    const store = mockStore(data);
    const { container } = render(
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

    waitFor(() => {
      expect($$('input', container).length).to.equal(1);
      expect($$('va-radio', container).length).to.equal(1);
      expect($('button[type="submit"]', container)).to.exist;

      const changeEvent = new CustomEvent('selected', {
        detail: { value: 'Y' },
      });
      $('va-radio', container).__events.vaValueChange(changeEvent);

      expect($$('va-radio-option', container).length).to.eq(2);
      // Verify fields are now visible
      expect($$('input', container).length).to.equal(4);
    });
  });
});
