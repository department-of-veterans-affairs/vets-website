import React from 'react';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import { expect } from 'chai';
import { act } from 'react-dom/test-utils';
import { mount } from 'enzyme';
import thunk from 'redux-thunk';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import { mockApiRequest } from 'platform/testing/unit/helpers';
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

const createStore = () =>
  mockStore({
    form: {
      data: {
        application: payload,
      },
    },
  });

// Helper to flush promises in the event loop
const flushPromises = () => new Promise(resolve => setImmediate(resolve));

// Reusable test setup function
const renderComponent = async store => {
  let wrapper;
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.applicantInformation.pages.applicantSuggestedAddress;
  await act(async () => {
    wrapper = mount(
      <Provider store={store}>
        <DefinitionTester
          schema={schema}
          definitions={formConfig.defaultDefinitions}
          uiSchema={uiSchema}
        />
      </Provider>,
    );
  });

  // Wait for all async effects to complete
  await act(async () => {
    await flushPromises();
  });
  wrapper.update();

  return wrapper;
};

/* eslint-disable camelcase */
const invalid_address_response = {
  addresses: [
    {
      address: {
        address_line1: '456 Mock Street',
        city: 'Mock City',
        state_code: 'MC',
        zip_code: '28226',
        country_code_iso3: 'USA',
      },
      address_meta_data: {
        confidence_score: 90,
      },
    },
  ],
};

const valid_address_response = {
  addresses: [
    {
      address: {
        address_line1: '456 Mock Street',
        city: 'Mock City',
        state_code: 'MC',
        zip_code: '28226',
        country_code_iso3: 'USA',
      },
      address_meta_data: {
        confidence_score: 100,
      },
    },
  ],
};

describe('Applicant Suggested Address', () => {
  it('should render suggested address radio if given a suggested address', async () => {
    mockApiRequest(invalid_address_response);
    const store = createStore();
    const wrapper = await renderComponent(store);

    expect(wrapper.find('va-loading-indicator').length).to.equal(0);
    expect(wrapper.find('SuggestedAddressRadio').length).to.equal(1);
    expect(wrapper.find('AddressConfirmation').length).to.equal(0);

    wrapper.unmount();
  });

  it('should render confirm address if NOT given a suggested address', async () => {
    mockApiRequest(valid_address_response);
    const store = createStore();
    const wrapper = await renderComponent(store);

    expect(wrapper.find('va-loading-indicator').length).to.equal(0);
    expect(wrapper.find('SuggestedAddressRadio').length).to.equal(0);
    expect(wrapper.find('AddressConfirmation').length).to.equal(1);

    wrapper.unmount();
  });
});
