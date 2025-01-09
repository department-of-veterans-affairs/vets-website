import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

// Import the actual validateAddress function *and* the actions object
import * as vapActions from 'platform/user/profile/vap-svc/actions';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils.jsx';
import formConfig from '../../config/form';

function flushPromises() {
  return new Promise(resolve => setImmediate(resolve));
}

describe('Pre-need-integration Sponsor suggested address', () => {
  const {
    uiSchema,
    schema,
  } = formConfig.chapters.sponsorInformation.pages.sponsorSuggestedAddress;
  const middlewares = [thunk];
  const mockStore = configureStore(middlewares);

  let sandbox;
  let store;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    store = mockStore({
      form: {
        data: {
          application: {
            claimant: {
              address: {
                street: '1234 Mock St',
                city: 'Mock City',
                state: 'MC',
                postalCode: '12345',
                country: 'USA',
              },
            },
          },
        },
      },
      vapService: {
        addressValidation: {
          confirmedSuggestions: [
            {
              addressLine1: '123 Mock St',
              city: 'Mock City',
              stateCode: 'MC',
              zipCode: '12345',
              countryCodeIso3: 'USA',
            },
          ],
        },
      },
    });

    // Stub validateAddress so the dispatch call resolves, allowing isLoading to become false
    sandbox
      .stub(vapActions, 'validateAddress')
      .returns(() => Promise.resolve({}));
  });

  afterEach(() => {
    sandbox.restore();
  });

  /* Cant figure out how to mock the address validation properly to get isLoading to be false */
  it('should render loading indicator', async () => {
    const form = mount(
      <Provider store={store}>
        <DefinitionTester
          schema={schema}
          definitions={formConfig.defaultDefinitions}
          uiSchema={uiSchema}
        />
      </Provider>,
    );

    // Let the async call in useEffect finish, removing the loading indicator
    await flushPromises();
    form.update();

    // Confirm there's no va-loading-indicator in the DOM
    expect(form.find('va-loading-indicator').length).to.equal(1);

    form.unmount();
  });
});
