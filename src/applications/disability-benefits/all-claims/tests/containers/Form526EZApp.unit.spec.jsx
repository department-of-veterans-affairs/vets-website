import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';

import { Provider } from 'react-redux';
import { combineReducers, createStore } from 'redux';

import { commonReducer } from 'platform/startup/store';
import localStorage from 'platform/utilities/storage/localStorage';

import Form526Entry, { serviceRequired, idRequired } from '../../Form526EZApp';
import reducers from '../../reducers';
import {
  MVI_ADD_INITIATED,
  MVI_ADD_SUCCEEDED,
  MVI_ADD_FAILED,
} from '../../actions';

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
    mvi = '',
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
      mvi: {
        addPersonState: mvi,
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

  // Logged in & verified, but missing ID
  it('should render Missing ID page', () => {
    const tree = testPage({
      currentlyLoggedIn: true,
      verified: true,
      services: [],
    });
    expect(tree.find('main')).to.have.lengthOf(0);
    expect(tree.find('AlertBox')).to.have.lengthOf(1);
    expect(tree.find('AlertBox').text()).to.contain('BIRLS ID');
    tree.unmount();
  });

  // Logged in & verified, but missing 526 services
  it('should render Missing services page', () => {
    const tree = testPage({
      currentlyLoggedIn: true,
      verified: true,
      // only include 'EVSS_CLAIMS' service
      services: [idRequired[0]],
    });
    expect(tree.find('main')).to.have.lengthOf(0);
    expect(tree.find('AlertBox')).to.have.lengthOf(1);
    expect(tree.find('AlertBox').text()).to.contain('need some information');
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

  // Logged in & not verified (has services to allow proceeding)
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

  // Logged in but has add-person service (missing BIRLS or participant ID)
  it('should render add-person loader', () => {
    localStorage.setItem('hasSession', true);
    const tree = testPage({
      currentlyLoggedIn: true,
      verified: true,
      services: ['add-person'],
      mvi: MVI_ADD_INITIATED,
    });
    localStorage.removeItem('hasSession');
    expect(tree.find('main')).to.have.lengthOf(0);
    expect(tree.find('LoadingIndicator')).to.have.lengthOf(1);
    expect(tree.find('LoadingIndicator').text()).to.contain('additional work');
    tree.unmount();
  });

  // Logged in, has add-person service (missing BIRLS or participant ID), but
  // succeeded in adding id
  it('should render intro page after successful add person', () => {
    localStorage.setItem('hasSession', true);
    const tree = testPage({
      currentlyLoggedIn: true,
      verified: true,
      services: ['add-person', ...serviceRequired],
      mvi: MVI_ADD_SUCCEEDED,
    });
    localStorage.removeItem('hasSession');
    expect(tree.find('main').text()).to.contain('Start the form');
    tree.unmount();
  });

  // Logged in & failed add person call
  it('should render Missing services page after failed add person call', () => {
    const tree = testPage({
      currentlyLoggedIn: true,
      verified: true,
      services: ['add-person'],
      mvi: MVI_ADD_FAILED,
    });
    expect(tree.find('main')).to.have.lengthOf(0);
    expect(tree.find('AlertBox')).to.have.lengthOf(1);
    expect(tree.find('AlertBox').text()).to.contain('missing some information');
    tree.unmount();
  });
});
