import React from 'react';
import { expect } from 'chai';
import configureMockStore from 'redux-mock-store';
import { shallow } from 'enzyme';
import { Provider } from 'react-redux';
import {
  TOEClaimStatus,
  MEBClaimStatus,
} from '../../fixtures/claimStatus.json';
import InboxPage from '../../../containers/InboxPage';

describe('Render as a logged in user <InboxPage />', () => {
  const mockStore = configureMockStore();

  it('should renders HasLetters UI', () => {
    const initialState = {
      data: {
        TOEClaimStatus,
        MEBClaimStatus,
        MEBClaimStatusFetchInProgress: false,
        MEBClaimStatusFetchComplete: true,
        TOEClaimStatusFetchInProgress: false,
        TOEClaimStatusFetchComplete: true,
      },
      getClaimStatus: () => {},
      user: {
        login: {
          currentlyLoggedIn: true,
        },
      },
    };

    const store = mockStore(initialState);
    const wrapper = shallow(
      <Provider store={store}>
        <InboxPage />,
      </Provider>,
    );

    expect(wrapper.html()).to.include(
      'Download your VA education decision letter',
    );

    expect(wrapper.html()).to.include('November 03, 2022');
    wrapper.unmount();
  });

  it('should render NoLetters UI', () => {
    const initialState = {
      data: {
        TOEClaimStatus: {},
        MEBClaimStatus: {},
        MEBClaimStatusFetchInProgress: false,
        MEBClaimStatusFetchComplete: true,
        TOEClaimStatusFetchInProgress: false,
        TOEClaimStatusFetchComplete: true,
      },
      getClaimStatus: () => {},
      user: {
        login: {
          currentlyLoggedIn: true,
        },
      },
    };

    const store = mockStore(initialState);
    const wrapper = shallow(
      <Provider store={store}>
        <InboxPage />,
      </Provider>,
    );

    expect(wrapper.html()).to.include(
      'Your decision letter isn’t available online',
    );

    expect(wrapper.html()).to.include(
      'Your letter won’t be here if 1 of these situations is true for you:',
    );
    wrapper.unmount();
  });

  it('should show spinner while fetching APIs', () => {
    const initialState = {
      data: {
        TOEClaimStatus: {},
        MEBClaimStatus: {},
        MEBClaimStatusFetchInProgress: true,
        MEBClaimStatusFetchComplete: null,
        TOEClaimStatusFetchInProgress: true,
        TOEClaimStatusFetchComplete: null,
      },
      getClaimStatus: () => {},
      user: {
        login: {
          currentlyLoggedIn: true,
        },
      },
    };
    const store = mockStore(initialState);
    const wrapper = shallow(
      <Provider store={store}>
        <InboxPage />,
      </Provider>,
    );

    expect(wrapper.html()).to.include(
      'Please wait while we load the application for you',
    );
    wrapper.unmount();
  });
});
