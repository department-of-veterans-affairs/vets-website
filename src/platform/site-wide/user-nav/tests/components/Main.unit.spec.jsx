import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';

import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';

import Main from '../../containers/Main';

describe('Main.jsx', () => {
  // Web components break injected header.
  // Learn more: src/applications/proxy-rewrite/README.md
  it('does not use VaModal web component', () => {
    const middleware = [];
    const mockStore = configureStore(middleware);
    const initState = {
      featureToggles: {},
      user: {
        login: {
          currentlyLoggedIn: false,
        },
        profile: {
          loa: {
            current: 1,
          },
          userFullName: {
            first: 'Luke',
          },
        },
      },
      navigation: {
        utilitiesMenuIsOpen: false,
      },
    };
    const store = mockStore(initState);
    const wrapper = mount(
      <Provider store={store}>
        <Main />
      </Provider>,
    );

    expect(Object.keys(wrapper.find('Modal'))).to.have.length;
    expect(Object.keys(wrapper.find('VaModal'))).to.not.have.length;

    wrapper.unmount();
  });
});
