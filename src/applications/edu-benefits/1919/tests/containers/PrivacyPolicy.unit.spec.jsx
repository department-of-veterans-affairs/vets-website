import React from 'react';
import { Provider } from 'react-redux';
import { expect } from 'chai';
import { mount } from 'enzyme';
import configureStore from 'redux-mock-store';

import PrivacyPolicy from '../../containers/PrivacyPolicy';

const mockStore = configureStore([]);

describe('22-1919 <PrivacyPolicy>', () => {
  const createFakeStore = (formData = {}) => {
    return mockStore({
      form: {
        data: formData,
      },
    });
  };

  it('should display title from form data when certifyingOfficial role is present', () => {
    const formData = {
      certifyingOfficial: {
        role: { level: 'certifyingOfficial' },
      },
    };
    const store = createFakeStore(formData);
    const wrapper = mount(
      <Provider store={store}>
        <PrivacyPolicy />
      </Provider>,
    );

    expect(wrapper.text()).to.contain('Certifying official');

    wrapper.unmount();
  });

  it('should display "Owner" title when role level is owner', () => {
    const formData = {
      certifyingOfficial: {
        role: { level: 'owner' },
      },
    };
    const store = createFakeStore(formData);
    const wrapper = mount(
      <Provider store={store}>
        <PrivacyPolicy />
      </Provider>,
    );

    expect(wrapper.text()).to.contain('Owner');

    wrapper.unmount();
  });

  it('should display "Officer" title when role level is officer', () => {
    const formData = {
      certifyingOfficial: {
        role: { level: 'officer' },
      },
    };
    const store = createFakeStore(formData);
    const wrapper = mount(
      <Provider store={store}>
        <PrivacyPolicy />
      </Provider>,
    );

    expect(wrapper.text()).to.contain('Officer');

    wrapper.unmount();
  });

  it('should display custom title when role has other property', () => {
    const formData = {
      certifyingOfficial: {
        role: { other: 'Custom Title' },
      },
    };
    const store = createFakeStore(formData);
    const wrapper = mount(
      <Provider store={store}>
        <PrivacyPolicy />
      </Provider>,
    );

    expect(wrapper.text()).to.contain('Custom Title');

    wrapper.unmount();
  });
});
