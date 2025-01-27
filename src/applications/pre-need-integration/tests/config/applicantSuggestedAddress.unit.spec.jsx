import React from 'react';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import { expect } from 'chai';
import { act } from 'react-dom/test-utils';
import { mount } from 'enzyme';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import thunk from 'redux-thunk';
import formConfig from '../../config/form';

const mockStore = configureMockStore([thunk]);

const payload = {
  claimant: {
    address: {
      street: '123 Test Street',
      city: 'City',
      state: 'MC',
      postalCode: '28226',
      country: 'USA',
    },
  },
};

const createStore = confirmedSuggestions =>
  mockStore({
    form: {
      data: {
        application: payload,
      },
    },
    vapService: {
      addressValidation: {
        confirmedSuggestions,
        addressFromUser: {
          addressLine1: '123 Test',
        },
      },
    },
  });

// Helper to flush promises in the event loop
const flushPromises = () => new Promise(resolve => setImmediate(resolve));

// Reusable test setup function
const renderComponent = async store => {
  let wrapper;

  await act(async () => {
    wrapper = mount(
      <Provider store={store}>
        <DefinitionTester
          schema={
            formConfig.chapters.applicantInformation.pages
              .applicantSuggestedAddress.schema
          }
          definitions={formConfig.defaultDefinitions}
          uiSchema={
            formConfig.chapters.applicantInformation.pages
              .applicantSuggestedAddress.uiSchema
          }
        />
      </Provider>,
    );
  });

  // Wait for all async effects to complete
  await act(async () => {
    await flushPromises();
  });

  // Trigger a re-render
  wrapper.update();

  return wrapper;
};

describe('Applicant Suggested Address', () => {
  it('should render suggested address radio if given a suggested address', async () => {
    const store = createStore([
      {
        addressLine1: '123 Mock St',
        city: 'Mock City',
        stateCode: 'MC',
        zipCode: '12345',
        countryCodeIso3: 'USA',
      },
    ]);

    const wrapper = await renderComponent(store);

    expect(wrapper.find('va-loading-indicator').length).to.equal(0);
    expect(wrapper.find('SuggestedAddressRadio').length).to.equal(1);
    expect(wrapper.find('AddressConfirmation').length).to.equal(0);

    wrapper.unmount();
  });

  it('should render confirm address if NOT given a suggested address', async () => {
    const store = createStore([]);

    const wrapper = await renderComponent(store);

    expect(wrapper.find('va-loading-indicator').length).to.equal(0);
    expect(wrapper.find('SuggestedAddressRadio').length).to.equal(0);
    expect(wrapper.find('AddressConfirmation').length).to.equal(1);

    wrapper.unmount();
  });
});
