import React from 'react';
import { expect } from 'chai';
import { Provider } from 'react-redux';
import { mount } from 'enzyme';
import App from '../components/App';

const createFakeStore = state => {
  return {
    getState: () => state,
    subscribe: () => {},
    dispatch: () => {},
  };
};

describe('App component', () => {
  const authNoRepState = {
    user: {
      login: {
        hasRepresentative: false,
      },
      profile: {
        session: {
          ssoe: true,
          oauth: false,
        },
      },
    },
  };
  const authWithRepState = {
    user: {
      login: {
        hasRepresentative: false,
      },
      profile: {
        session: {
          ssoe: true,
          oauth: false,
        },
      },
    },
  };
  const oAuthWithRepState = {
    user: {
      login: {
        hasRepresentative: false,
      },
      profile: {
        session: {
          ssoe: false,
          oauth: true,
        },
      },
    },
  };

  it('should render when authenticated (ssoe) with no rep', () => {
    const fakeStore = createFakeStore(authNoRepState);
    const wrapper = mount(
      <Provider store={fakeStore}>
        <App />
      </Provider>,
    );

    expect(wrapper.find('App').exists()).to.be.true;
    wrapper.unmount();
  });

  it('should render when authenticated (ssoe) with rep', () => {
    const fakeStore = createFakeStore(authWithRepState);
    const wrapper = mount(
      <Provider store={fakeStore}>
        <App />
      </Provider>,
    );
    expect(wrapper.find('App').exists()).to.be.true;
    wrapper.unmount();
  });

  it('should render when authenticated with oAuth', () => {
    const fakeStore = createFakeStore(oAuthWithRepState);
    const wrapper = mount(
      <Provider store={fakeStore}>
        <App />
      </Provider>,
    );
    expect(wrapper.find('App').exists()).to.be.true;
    wrapper.unmount();
  });
});
