import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';

import { Provider } from 'react-redux';
import { combineReducers, createStore } from 'redux';

import { commonReducer } from 'platform/startup/store';
import reducers from '../../reducers';
import localStorage from 'platform/utilities/storage/localStorage';

import Form526Entry, { serviceRequired } from '../../Form526EZApp';

const fakeSipsIntro = user => {
  const { profile, login } = user;
  if (!login.currentlyLoggedIn) {
    return 'Log in to continue';
  }
  if (!profile.verified) {
    return 'Need to be verified';
  }
  // 'Not authorized' shouldn't be seen (an alert will show instead)
  return profile.services.length ? 'Start the form' : 'Not authorized';
};

describe('Form 526EZ Entry Page', () => {
  const testPage = ({
    verified = false,
    currentlyLoggedIn = true,
    services = [],
  } = {}) => {
    const initialState = {
      form: {
        loadedStatus: 'success',
        savedStatus: '',
        loadedData: {
          metadata: {},
        },
      },
      user: {
        login: {
          currentlyLoggedIn,
        },
        profile: {
          verified,
          services,
          loading: false,
          status: '',
        },
      },
      currentLocation: {
        pathname: '/introduction',
        search: '',
      },
    };
    const fakeStore = createStore(
      combineReducers({
        ...commonReducer,
        ...reducers,
      }),
      initialState,
    );
    return mount(
      <Provider store={fakeStore}>
        <Form526Entry
          location={initialState.currentLocation}
          user={initialState.user}
        >
          <main>{fakeSipsIntro(initialState.user)}</main>
        </Form526Entry>
      </Provider>,
    );
  };

  // Not logged in
  it('should render content when not logged in', () => {
    const tree = testPage({
      currentlyLoggedIn: false,
    });
    expect(tree.find('RoutedSavableApp')).to.have.lengthOf(1);
    expect(tree.find('main').text()).to.contain('Log in');
    tree.unmount();
  });

  // Logged in & verified, but missing services
  it('should render Missing services page', () => {
    const tree = testPage({
      currentlyLoggedIn: true,
      verified: true,
    });
    expect(tree.find('main')).to.have.lengthOf(0);
    expect(tree.find('AlertBox')).to.have.lengthOf(1);
    expect(tree.find('AlertBox').text()).to.contain('missing some information');
    tree.unmount();
  });

  // Logged in & verified & has services
  it('should render form app content', () => {
    const tree = testPage({
      currentlyLoggedIn: true,
      verified: true,
      services: serviceRequired,
    });
    expect(tree.find('main').text()).to.contain('Start the form');
    tree.unmount();
  });

  // Logged in & not verified (missing services)
  it('should render verify your identity page', () => {
    localStorage.setItem('hasSession', true);
    const tree = testPage({
      currentlyLoggedIn: true,
      verified: false,
      services: serviceRequired,
    });
    localStorage.removeItem('hasSession');
    expect(tree.find('main').text()).to.contain('Need to be verified');

    tree.unmount();
  });
});
