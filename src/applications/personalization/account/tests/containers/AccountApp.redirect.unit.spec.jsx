import React from 'react';
import sinon from 'sinon';
import { mount } from 'enzyme';
import { expect } from 'chai';
import { Provider } from 'react-redux';
import { combineReducers, createStore } from 'redux';

import { commonReducer } from 'platform/startup/store';
import localStorage from 'platform/utilities/storage/localStorage';

import AccountApp from '../../containers/AccountApp';

describe('<AccountApp>', () => {
  let wrapper;
  let oldLocation;

  function setUp(featureFlag = true) {
    oldLocation = window.location;
    delete window.location;
    window.location = { replace: sinon.spy() };
    const initialState = {
      user: {
        profile: {
          loa: {
            current: 3,
            highest: 3,
          },
          multifactor: true,
          loading: false,
        },
      },
      featureToggles: {
        'profile_show_profile_2.0': featureFlag,
      },
    };
    const store = createStore(combineReducers(commonReducer), initialState);
    wrapper = mount(
      <Provider store={store}>
        <AccountApp />
      </Provider>,
    );
  }

  afterEach(() => {
    window.location = oldLocation;
    wrapper.unmount();
  });

  it('should redirect to `profile/account-security` if the feature flag is set', () => {
    setUp();

    expect(window.location.replace.calledWith('/profile/account-security')).to
      .be.true;
  });

  it('should not redirect to `profile/account-security` if the feature flag is set but the "PROFILE_VERSION" localstorage key is set to "1"', () => {
    localStorage.setItem('PROFILE_VERSION', '1');

    setUp();

    expect(window.location.replace.calledWith('/profile/account-security')).to
      .be.false;
  });

  it('should not redirect to `profile/account-security` if the feature flag is not set', () => {
    setUp(false);

    expect(window.location.replace.calledWith('/profile/account-security')).to
      .be.false;
  });
});
