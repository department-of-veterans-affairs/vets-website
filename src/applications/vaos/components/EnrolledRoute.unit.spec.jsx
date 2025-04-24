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
    vaOnlineSchedulingCancel: true,
    vaOnlineSchedulingMhvRouteGuards: false,
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
    // Stub window.location.replace to prevent actual redirection
    replaceStub = sinon.stub();
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { replace: replaceStub },
    });
  });

  afterEach(() => {
    // Restore the original window.location
    delete window.location;
    window.location = { replace: () => {} }; // Reset to a default implementation
  });

  it('should render route when logged in', async () => {
    const store = createTestStore(initialState);
    const screen = renderWithStoreAndRouter(
      <>
        <Switch>
          <EnrolledRoute component={() => <div>Child content</div>} />
        </Switch>
      </>,
      {
        store,
      },
    );

    expect(await screen.findByText('Child content')).to.exist;
  });

  it('should not render route content when not logged in', async () => {
    const myInitialState = {
      ...initialState,
      user: {
        ...initialState.user,
        login: {
          currentlyLoggedIn: false,
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
      {
        store,
      },
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

  it('should render can’t find any VA medical facility registrations message', async () => {
    const myInitialState = {
      ...initialState,
      user: {
        ...initialState.user,
        profile: {
          ...initialState.user.profile,
          facilities: [],
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
      {
        store,
      },
    );

    await waitFor(() => {
      expect(
        screen.getByText(
          /We’re sorry. We can’t find any VA medical facility registrations for you/,
        ),
      ).to.be.ok;
    });
    expect(screen.queryByText('Child content')).not.to.exist;
  });
  it('should redirect to /my-health when vaOnlineSchedulingMhvRouteGuards is enabled and no facilities are registered', async () => {
    const myInitialState = {
      ...initialState,
      featureToggles: {
        ...initialState.featureToggles,
        vaOnlineSchedulingMhvRouteGuards: true, // Enable the feature flag
      },
      user: {
        ...initialState.user,
        profile: {
          ...initialState.user.profile,
          facilities: [], // No facilities registered
        },
      },
    };
    const store = createTestStore(myInitialState);
    renderWithStoreAndRouter(
      <>
        <Switch>
          <EnrolledRoute component={() => <div>Child content</div>} />
        </Switch>
      </>,
      {
        store,
      },
    );
    // Assert that the user is redirected to /my-health
    await waitFor(() => {
      expect(replaceStub.calledWith('/my-health')).to.be.true;
    });
  });
  it('should redirect to /my-health when vaOnlineSchedulingMhvRouteGuards is enabled and user is not LOA3', async () => {
    const myInitialState = {
      ...initialState,
      featureToggles: {
        ...initialState.featureToggles,
        vaOnlineSchedulingMhvRouteGuards: true, // Enable the feature flag
      },
      user: {
        ...initialState.user,
        profile: {
          ...initialState.user.profile,
          loa: { current: 1 },
        },
      },
    };
    const store = createTestStore(myInitialState);
    renderWithStoreAndRouter(
      <>
        <Switch>
          <EnrolledRoute component={() => <div>Child content</div>} />
        </Switch>
      </>,
      {
        store,
      },
    );

    // Assert that the user is redirected to /my-health
    await waitFor(() => {
      expect(replaceStub.calledWith('/my-health')).to.be.true;
    });
  });
});
