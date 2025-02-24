import React from 'react';
import { Switch } from 'react-router-dom';
import { expect } from 'chai';
import { waitFor } from '@testing-library/dom';
import { mockFetch } from '@department-of-veterans-affairs/platform-testing/helpers';

import backendServices from 'platform/user/profile/constants/backendServices';
import Sinon from 'sinon';
import {
  createTestStore,
  renderWithStoreAndRouter,
} from '../tests/mocks/setup.js';
import EnrolledRoute from './EnrolledRoute.jsx';

const initialState = {
  featureToggles: {
    vaOnlineScheduling: true,
    vaOnlineSchedulingPast: true,
    vaOnlineSchedulingCancel: true,
    // eslint-disable-next-line camelcase
    show_new_schedule_view_appointments_page: true,
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
  let orig;
  beforeEach(() => {
    // This does not working:
    // const stub = Sinon.stub(window.location, 'replace');
    //
    // The following error occurs:
    // TypeError: Cannot redefine property: replace

    // So, doing this instead.
    // Save original location object...
    orig = { ...window.location };

    // Delete location object and redefine it
    delete window.location;
    window.location = {
      pathname: '/',
      replace: Sinon.stub().callsFake(path => {
        window.location.pathname += path;
        window.location.search = path.slice(path.indexOf('?'));
      }),
    };

    mockFetch();
  });

  afterEach(() => {
    // Restore location object
    window.location = { ...orig };
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

  it("should redirect to '/my-health'", async () => {
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

    expect(window.location.replace.lastCall.args[0]).to.equal('/my-health');
    expect(screen.queryByText('Child content')).not.to.exist;
  });
});
