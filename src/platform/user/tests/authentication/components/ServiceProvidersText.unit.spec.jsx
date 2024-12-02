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

const getServiceProvidersTextData = ({ propsIsBold = false }) => {
  const props = {
    isBold: propsIsBold,
  };
  const store = mockStore({});
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
  it('should display 4 CSPS if loginGovDisabled flag is disabled', () => {
    const { wrapper } = getServiceProvidersTextData({});
    expect(serviceProviders.includes(wrapper.text()));
    wrapper.unmount();
  });
  it.skip('should display bold if `isBold` is truthy', () => {
    const { wrapper } = getServiceProvidersTextData({
      propsIsBold: true,
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
}) => {
  const props = {
    isFormBased: propsIsFormBased,
    hasExtraTodo: propsHasExtraTodo,
  };
  const store = mockStore({});
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
