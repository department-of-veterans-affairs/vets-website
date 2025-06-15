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
      featureToggles: {
        showMebLettersMaintenanceAlert: false,
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

    expect(wrapper.html()).to.include('Your VA education letter');

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
      featureToggles: {
        showMebLettersMaintenanceAlert: false,
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
      'Your education decision letter isn’t available',
    );

    expect(wrapper.html()).to.include(
      'If you applied for Post-9/11 GI Bill benefits on VA.gov',
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
      featureToggles: {
        showMebLettersMaintenanceAlert: false,
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
