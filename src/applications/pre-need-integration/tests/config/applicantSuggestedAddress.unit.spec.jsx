import React from 'react';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import { expect } from 'chai';
import { act } from 'react-dom/test-utils';
import { mount } from 'enzyme';
import thunk from 'redux-thunk';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import { mockApiRequest } from 'platform/testing/unit/helpers';
import sinon from 'sinon';
import formConfig from '../../config/form';
import * as helpers from '../../utils/helpers';

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

const createStore = (formData = payload) =>
  mockStore({
    form: {
      data: {
        application: formData.application || payload.application,
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

const invalidAddressResponse = {
  addresses: [
    {
      address: {
        addressLine1: '456 Mock Street',
        city: 'Mock City',
        stateCode: 'MC',
        zipCode: '28226',
        countryCodeIso3: 'USA',
      },
      addressMetaData: {
        confidenceScore: 90,
      },
    },
  ],
};

const validAddressResponse = {
  addresses: [
    {
      address: {
        addressLine1: '456 Mock Street',
        city: 'Mock City',
        stateCode: 'MC',
        zipCode: '28226',
        countryCodeIso3: 'USA',
      },
      addressMetaData: {
        confidenceScore: 100,
      },
    },
  ],
};

describe('Applicant Suggested Address', () => {
  it('should render suggested address radio if given a suggested address', async () => {
    mockApiRequest(invalidAddressResponse);
    const store = createStore();
    const wrapper = await renderComponent(store);

    expect(wrapper.find('va-loading-indicator').length).to.equal(0);
    expect(wrapper.find('SuggestedAddressRadio').length).to.equal(1);
    expect(wrapper.find('AddressConfirmation').length).to.equal(0);

    wrapper.unmount();
  });

  it('should render confirm address if NOT given a suggested address', async () => {
    mockApiRequest(validAddressResponse);
    const store = createStore();
    const wrapper = await renderComponent(store);

    expect(wrapper.find('va-loading-indicator').length).to.equal(0);
    expect(wrapper.find('SuggestedAddressRadio').length).to.equal(0);
    expect(wrapper.find('AddressConfirmation').length).to.equal(1);

    wrapper.unmount();
  });

  it('should handle undefined address', async () => {
    const formData = {};
    const store = createStore(formData);
    const wrapper = await renderComponent(store);

    // Check the component's behavior when address is undefined
    expect(wrapper.find('va-loading-indicator').length).to.equal(1);
    expect(wrapper.find('SuggestedAddressRadio').length).to.equal(0);
    expect(wrapper.find('AddressConfirmation').length).to.equal(0);

    wrapper.unmount();
  });

  it('should handle null address', async () => {
    const formData = { application: { claimant: { address: null } } };
    const store = createStore(formData);
    const wrapper = await renderComponent(store);

    // Check the component's behavior when address is null
    expect(wrapper.find('va-loading-indicator').length).to.equal(1);
    expect(wrapper.find('SuggestedAddressRadio').length).to.equal(0);
    expect(wrapper.find('AddressConfirmation').length).to.equal(0);

    wrapper.unmount();
  });

  it('should handle defined address', async () => {
    const formData = {
      application: { claimant: { address: payload.claimant.address } },
    };
    const store = createStore(formData);
    const wrapper = await renderComponent(store);

    // Check the component's behavior when address is defined
    expect(wrapper.find('va-loading-indicator').length).to.equal(1);
    expect(wrapper.find('SuggestedAddressRadio').length).to.equal(0);
    expect(wrapper.find('AddressConfirmation').length).to.equal(0);

    wrapper.unmount();
  });
});

// New test suite for when isAuthorizedAgent returns true
describe('Applicant Suggested Address as Authorized Agent', () => {
  let isAuthorizedAgentStub;

  beforeEach(() => {
    // Stub isAuthorizedAgent to always return true
    isAuthorizedAgentStub = sinon
      .stub(helpers, 'isAuthorizedAgent')
      .returns(true);
  });

  afterEach(() => {
    // Restore the original function after each test
    isAuthorizedAgentStub.restore();
  });

  it('should render suggested address radio with authorized agent title if given a suggested address', async () => {
    mockApiRequest(invalidAddressResponse);
    const store = createStore();
    const wrapper = await renderComponent(store);

    expect(wrapper.find('va-loading-indicator').length).to.equal(0);
    expect(wrapper.find('SuggestedAddressRadio').length).to.equal(1);
    expect(wrapper.find('AddressConfirmation').length).to.equal(0);
    // Verify that the title prop reflects the authorized agent text
    expect(wrapper.find('SuggestedAddressRadio').prop('title')).to.equal(
      'Confirm applicant mailing address',
    );

    wrapper.unmount();
  });

  it('should render confirm address with authorized agent subHeader if NOT given a suggested address', async () => {
    mockApiRequest(validAddressResponse);
    const store = createStore();
    const wrapper = await renderComponent(store);

    expect(wrapper.find('va-loading-indicator').length).to.equal(0);
    expect(wrapper.find('SuggestedAddressRadio').length).to.equal(0);
    expect(wrapper.find('AddressConfirmation').length).to.equal(1);
    // Verify that the subHeader prop reflects the authorized agent text
    expect(wrapper.find('AddressConfirmation').prop('subHeader')).to.equal(
      'Check applicant mailing address',
    );

    wrapper.unmount();
  });
});
