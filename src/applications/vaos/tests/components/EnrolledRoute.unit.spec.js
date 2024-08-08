import React from 'react';
import { Switch } from 'react-router-dom';
import { expect } from 'chai';
import { waitFor } from '@testing-library/dom';
import { mockFetch } from '@department-of-veterans-affairs/platform-testing/helpers';

import backendServices from 'platform/user/profile/constants/backendServices';
import { createTestStore, renderWithStoreAndRouter } from '../mocks/setup';
import EnrolledRoute from '../../components/EnrolledRoute.jsx';

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
    },
  },
};

describe('VAOS Component: EnrolledRoute', () => {
  beforeEach(() => {
    mockFetch();
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
});
