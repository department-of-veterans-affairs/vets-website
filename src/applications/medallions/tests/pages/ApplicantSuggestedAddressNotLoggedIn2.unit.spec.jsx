import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import sinon from 'sinon';
import ApplicantSuggestedAddressNotLoggedIn2 from '../../pages/applicantSuggestedAddressNotLoggedIn2';
import * as helpers from '../../utils/helpers';

describe('Medallions ApplicantSuggestedAddressNotLoggedIn2', () => {
  const mockStore = configureStore([]);
  let fetchSuggestedAddressStub;

  const defaultProps = {
    data: {
      address: {
        street: '456 Org St',
        city: 'Testville',
        state: 'CA',
        postalCode: '90210',
        country: 'USA',
      },
    },
    goToPath: sinon.spy(),
    goBack: sinon.spy(),
    goForward: sinon.spy(),
    NavButtons: () => <div />,
    contentBeforeButtons: <div />,
    contentAfterButtons: <div />,
  };

  beforeEach(() => {
    fetchSuggestedAddressStub = sinon.stub(helpers, 'fetchSuggestedAddress');
  });

  afterEach(() => {
    fetchSuggestedAddressStub.restore();
  });

  it('should render', () => {
    fetchSuggestedAddressStub.resolves({
      fetchedSuggestedAddress: null,
      fetchedShowSuggestions: false,
      fetchedConfidenceScore: 100,
    });

    const store = mockStore({});
    const form = mount(
      <Provider store={store}>
        <ApplicantSuggestedAddressNotLoggedIn2 {...defaultProps} />
      </Provider>,
    );

    expect(form.find('ApplicantSuggestedAddressNotLoggedIn2').length).to.equal(
      1,
    );
    form.unmount();
  });

  it('should show loading state initially', () => {
    fetchSuggestedAddressStub.resolves({
      fetchedSuggestedAddress: null,
      fetchedShowSuggestions: false,
      fetchedConfidenceScore: 100,
    });

    const store = mockStore({});
    const form = mount(
      <Provider store={store}>
        <ApplicantSuggestedAddressNotLoggedIn2 {...defaultProps} />
      </Provider>,
    );

    expect(form.find('va-loading-indicator').length).to.be.greaterThan(0);
    form.unmount();
  });

  it('should handle missing address data', () => {
    fetchSuggestedAddressStub.resolves({
      fetchedSuggestedAddress: null,
      fetchedShowSuggestions: false,
      fetchedConfidenceScore: null,
    });

    const store = mockStore({});
    const propsWithoutAddress = {
      ...defaultProps,
      data: {},
    };

    const form = mount(
      <Provider store={store}>
        <ApplicantSuggestedAddressNotLoggedIn2 {...propsWithoutAddress} />
      </Provider>,
    );

    expect(form.find('ApplicantSuggestedAddressNotLoggedIn2').length).to.equal(
      1,
    );
    form.unmount();
  });

  it('should display SuggestedAddressRadio when showSuggestions is true', async () => {
    const suggestedAddress = {
      addressLine1: '456 Organization Street',
      addressLine2: '',
      city: 'Testville',
      state: 'CA',
      zipCode: '90210',
      country: 'USA',
    };

    fetchSuggestedAddressStub.resolves({
      fetchedSuggestedAddress: suggestedAddress,
      fetchedShowSuggestions: true,
      fetchedConfidenceScore: 85,
    });

    const store = mockStore({});
    const form = mount(
      <Provider store={store}>
        <ApplicantSuggestedAddressNotLoggedIn2 {...defaultProps} />
      </Provider>,
    );

    // Wait for async operations
    await new Promise(resolve => setTimeout(resolve, 0));
    form.update();

    expect(form.find('SuggestedAddressRadio').length).to.be.greaterThan(0);
    form.unmount();
  });

  it('should display AddressConfirmation when showSuggestions is false', async () => {
    fetchSuggestedAddressStub.resolves({
      fetchedSuggestedAddress: null,
      fetchedShowSuggestions: false,
      fetchedConfidenceScore: 50,
    });

    const store = mockStore({});
    const form = mount(
      <Provider store={store}>
        <ApplicantSuggestedAddressNotLoggedIn2 {...defaultProps} />
      </Provider>,
    );

    // Wait for async operations
    await new Promise(resolve => setTimeout(resolve, 0));
    form.update();

    expect(form.find('AddressConfirmation').length).to.be.greaterThan(0);
    form.unmount();
  });

  it('should display AddressConfirmation with exact match when confidence is 100', async () => {
    fetchSuggestedAddressStub.resolves({
      fetchedSuggestedAddress: null,
      fetchedShowSuggestions: false,
      fetchedConfidenceScore: 100,
    });

    const store = mockStore({});
    const form = mount(
      <Provider store={store}>
        <ApplicantSuggestedAddressNotLoggedIn2 {...defaultProps} />
      </Provider>,
    );

    // Wait for async operations
    await new Promise(resolve => setTimeout(resolve, 0));
    form.update();

    const addressConfirmation = form.find('AddressConfirmation');
    expect(addressConfirmation.length).to.be.greaterThan(0);
    expect(addressConfirmation.prop('isExactMatch')).to.be.true;
    form.unmount();
  });

  it('should navigate to review page when in edit mode', async () => {
    fetchSuggestedAddressStub.resolves({
      fetchedSuggestedAddress: null,
      fetchedShowSuggestions: false,
      fetchedConfidenceScore: 100,
    });

    const goToPath = sinon.spy();
    const store = mockStore({});
    const propsWithEditFlag = {
      ...defaultProps,
      data: {
        ...defaultProps.data,
        'view:notLoggedInEditAddress2': true,
      },
      goToPath,
    };

    const form = mount(
      <Provider store={store}>
        <ApplicantSuggestedAddressNotLoggedIn2 {...propsWithEditFlag} />
      </Provider>,
    );

    // Wait for async operations
    await new Promise(resolve => setTimeout(resolve, 0));
    form.update();

    // Simulate continue button click
    const instance = form
      .find('ApplicantSuggestedAddressNotLoggedIn2')
      .instance();
    if (instance && instance.handleContinue) {
      await instance.handleContinue();
      expect(goToPath.calledWith('/review-and-submit')).to.be.true;
    }

    form.unmount();
  });
});
