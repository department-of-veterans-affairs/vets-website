/* eslint-disable camelcase */
import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import ServiceProvidersText, {
  ServiceProvidersTextCreateAcct,
} from 'platform/user/authentication/components/ServiceProvidersText';

const serviceProviders = ['Login.gov', 'ID.me', 'DS Logon', 'My HealtheVet'];
const mockStore = configureMockStore();

const getServiceProvidersTextData = ({
  propsIsBold = false,
  featureToggle = true,
}) => {
  const props = {
    isBold: propsIsBold,
  };
  const store = mockStore({
    featureToggles: {
      login_gov_disabled: featureToggle,
    },
  });
  const wrapper = mount(
    <Provider store={store}>
      <ServiceProvidersText {...props} />
    </Provider>,
  );
  return {
    props,
    store,
    wrapper,
  };
};

describe('ServiceProvidersText', () => {
  it('should display 3 CSPS if loginGovDisabled flag is enabled', () => {
    const { wrapper } = getServiceProvidersTextData({});
    expect(
      serviceProviders
        .filter(csp => csp !== 'Login.gov')
        .includes(wrapper.text()),
    );
    wrapper.unmount();
  });
  it('should display 4 CSPS if loginGovDisabled flag is disabled', () => {
    const { wrapper } = getServiceProvidersTextData({
      featureToggle: false,
    });
    expect(serviceProviders.includes(wrapper.text()));
    wrapper.unmount();
  });
  it('should display bold if `isBold` is truthy', () => {
    const { wrapper } = getServiceProvidersTextData({
      propsIsBold: true,
      featureToggle: false,
    });
    expect(wrapper.find('strong').length).to.eql(4);
    wrapper.unmount();
  });
  it('should display normal if `isBold` is falsy', () => {
    const { wrapper } = getServiceProvidersTextData({
      propsIsBold: false,
    });
    expect(wrapper.find('strong').exists()).to.be.false;
    wrapper.unmount();
  });
});

const getServiceProvidersTextCreateAcctData = ({
  propsIsFormBased = false,
  propsHasExtraTodo = false,
  featureToggle = true,
}) => {
  const props = {
    isFormBased: propsIsFormBased,
    hasExtraTodo: propsHasExtraTodo,
  };
  const store = mockStore({
    featureToggles: {
      login_gov_disabled: featureToggle,
    },
  });
  const wrapper = mount(
    <Provider store={store}>
      <ServiceProvidersTextCreateAcct {...props} />
    </Provider>,
  );
  return {
    wrapper,
  };
};

describe('ServiceProvidersTextCreateAcct', () => {
  it('should render string if `isFormBased` prop is truthy', () => {
    const { wrapper } = getServiceProvidersTextCreateAcctData({
      propsIsFormBased: true,
    });
    expect(wrapper.text()).to.include(
      'completed this form without signing in, and you',
    );
    wrapper.unmount();
  });
  it('should NOT render string if `isFormBased` prop is falsy', () => {
    const { wrapper } = getServiceProvidersTextCreateAcctData({
      propsIsFormBased: false,
    });
    expect(wrapper.text()).to.not.include(
      'completed this form without signing in, and you',
    );
    wrapper.unmount();
  });
  it('should NOT render Login.gov if feature flag is enabled', () => {
    const { wrapper } = getServiceProvidersTextCreateAcctData({
      featureToggle: true,
    });
    expect(wrapper.text()).to.not.include('Login.gov');
    wrapper.unmount();
  });
  it('should render Login.gov if feature flag is disabled', () => {
    const { wrapper } = getServiceProvidersTextCreateAcctData({
      featureToggle: false,
    });
    expect(wrapper.text()).to.include('Login.gov');
    wrapper.unmount();
  });
  it('should render string if `hasExtraTodo` prop is truthy', () => {
    const { wrapper } = getServiceProvidersTextCreateAcctData({
      propsHasExtraTodo: true,
    });
    expect(wrapper.text()).to.include(
      'When you sign in or create an account, you’ll be able to:',
    );
    wrapper.unmount();
  });
  it('should NOT render string if `hasExtraTodo` prop is falsy', () => {
    const { wrapper } = getServiceProvidersTextCreateAcctData({
      propsHasExtraTodo: false,
    });
    expect(wrapper.text()).to.not.include(
      'When you sign in or create an account, you’ll be able to:',
    );
    wrapper.unmount();
  });
});
