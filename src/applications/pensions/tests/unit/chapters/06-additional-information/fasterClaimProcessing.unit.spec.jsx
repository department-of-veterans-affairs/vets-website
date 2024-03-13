import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { expect } from 'chai';
import sinon from 'sinon';
import { render, waitFor } from '@testing-library/react';
import {
  $,
  $$,
} from '@department-of-veterans-affairs/platform-forms-system/ui';
import { DefinitionTester } from '@department-of-veterans-affairs/platform-testing/schemaform-utils';
import {
  testNumberOfWebComponentFields,
  testNumberOfErrorsOnSubmitForWebComponents,
} from '../pageTests.spec';
import getData from '../../../fixtures/mocks/mockStore';
import formConfig from '../../../../config/form';
import fasterClaimProcessing from '../../../../config/chapters/06-additional-information/fasterClaimProcessing';

const definitions = formConfig.defaultDefinitions;
const { schema, uiSchema } = fasterClaimProcessing;

describe('web component tests', () => {
  const pageTitle = 'Faster claim processing (optional)';
  const expectedNumberOfWebComponentFields = 1;
  testNumberOfWebComponentFields(
    formConfig,
    schema,
    uiSchema,
    expectedNumberOfWebComponentFields,
    pageTitle,
  );
  const expectedNumberOfErrorsOnSubmitForWebComponents = 1;
  testNumberOfErrorsOnSubmitForWebComponents(
    formConfig,
    schema,
    uiSchema,
    expectedNumberOfErrorsOnSubmitForWebComponents,
    pageTitle,
  );
});

describe('Faster claim processing page', () => {
  const middleware = [];
  const mockStore = configureStore(middleware);
  it('should render warning on Yes', async () => {
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
    expect($$('.usa-alert', container).length).to.equal(0);
    await waitFor(() => {
      const changeEvent = new CustomEvent('selected', {
        detail: { value: 'Y' },
      });
      $('va-radio', container).__events.vaValueChange(changeEvent);
      expect($$('.usa-alert', container).length).to.equal(1);
    });
    expect($('.usa-alert-info', container).textContent).to.contain(
      'will be submitted as',
    );
  });
  it('should render warning on No', async () => {
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
    expect($$('.usa-alert', container).length).to.equal(0);
    await waitFor(() => {
      const changeEvent = new CustomEvent('selected', {
        detail: { value: 'N' },
      });
      $('va-radio', container).__events.vaValueChange(changeEvent);
      expect($$('.usa-alert', container).length).to.equal(1);
    });
    expect($('.usa-alert-info', container).textContent).to.contain(
      'doesn’t qualify',
    );
  });
});
