import React from 'react';
import { Switch } from 'react-router-dom';
import { expect } from 'chai';
import { waitFor } from '@testing-library/dom';
import { mockFetch } from '@department-of-veterans-affairs/platform-testing/helpers';
import sinon from 'sinon';

import backendServices from 'platform/user/profile/constants/backendServices';
import {
  createTestStore,
  renderWithStoreAndRouter,
} from '../tests/mocks/setup';
import EnrolledRoute from './EnrolledRoute';

const initialState = {
  featureToggles: {
    vaOnlineScheduling: true,
    loading: false,
  },
  user: {
    login: {
      currentlyLoggedIn: true,
    },
    profile: {
      loading: false,
      verified: true,
      services: [backendServices.USER_PROFILE, backendServices.FACILITIES],
      facilities: [{ facilityId: '983', isCerner: false }],
      loa: { current: 3 },
    },
  },
};

describe('VAOS Component: EnrolledRoute', () => {
  let replaceStub;

  before(() => {
    mockFetch();
  });

  beforeEach(() => {
    replaceStub = sinon.stub();
    const desc =
      Object.getOwnPropertyDescriptor(window.location, 'replace') || {};
    if (desc.writable) {
      window.location.replace = replaceStub;
      window.location.href = 'http://localhost';
    } else {
      Object.defineProperty(window, 'location', {
        configurable: true,
        value: { replace: replaceStub, origin: 'http://localhost' },
      });
    }
  });

  it('renders route content when logged in and registered', async () => {
    const store = createTestStore(initialState);
    const screen = renderWithStoreAndRouter(
      <>
        <Switch>
          <EnrolledRoute component={() => <div>Child content</div>} />
        </Switch>
      </>,
      { store },
    );
    expect(await screen.findByText('Child content')).to.exist;
  });

  it('shows loading indicator when not logged in', async () => {
    const myInitialState = {
      ...initialState,
      user: { ...initialState.user, login: { currentlyLoggedIn: false } },
    };
    const store = createTestStore(myInitialState);
    const screen = renderWithStoreAndRouter(
      <>
        <Switch>
          <EnrolledRoute component={() => <div>Child content</div>} />
        </Switch>
      </>,
      { store },
    );
    const loadingIndicatorSelector = screen.container.querySelector(
      'va-loading-indicator',
    );
    await waitFor(() => {
      expect(loadingIndicatorSelector).to.exist;
      expect(loadingIndicatorSelector).to.have.attribute(
        'message',
        'Redirecting to login...',
      );
    });
  });

  it('redirects to /my-health when user has no facilities', async () => {
    const myInitialState = {
      ...initialState,
      user: {
        ...initialState.user,
        profile: {
          ...initialState.user.profile,
          facilities: [],
          loa: { current: 3 },
        },
      },
    };
    const store = createTestStore(myInitialState);
    const screen = renderWithStoreAndRouter(
      <>
        <Switch>
          <EnrolledRoute component={() => <div>Child content</div>} />
        </Switch>
      </>,
      { store },
    );
    expect(screen.queryByText('Child content')).not.to.exist;
    await waitFor(() => {
      expect(replaceStub.calledWith('http://localhost/my-health')).to.be.true;
    });
  });

  it('redirects to /my-health when user is not LOA3', async () => {
    const myInitialState = {
      ...initialState,
      user: {
        ...initialState.user,
        profile: {
          ...initialState.user.profile,
          facilities: [{ facilityId: '983', isCerner: false }],
          loa: { current: 2 },
        },
      },
    };
    const store = createTestStore(myInitialState);
    const screen = renderWithStoreAndRouter(
      <>
        <Switch>
          <EnrolledRoute component={() => <div>Child content</div>} />
        </Switch>
      </>,
      { store },
    );
    expect(screen.queryByText('Child content')).not.to.exist;
    await waitFor(() => {
      expect(replaceStub.calledWith('http://localhost/my-health')).to.be.true;
    });
  });
});
