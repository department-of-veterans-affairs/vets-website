import React from 'react';
import { expect } from 'chai';
import { fireEvent, waitFor } from '@testing-library/dom';
import set from 'platform/utilities/data/set';
import {
  mockFetch,
  resetFetch,
  setFetchJSONResponse,
} from 'platform/testing/unit/helpers';
import environment from 'platform/utilities/environment';

import backendServices from 'platform/user/profile/constants/backendServices';
import { createTestStore, renderWithStoreAndRouter } from '../../mocks/setup';
import VAOSApp from '../../../components/VAOSApp';
import moment from 'moment';

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

describe('VAOS <VAOSApp>', () => {
  beforeEach(() => {
    mockFetch();
  });

  afterEach(() => {
    resetFetch();
  });

  it('should render child content when logged in', async () => {
    const store = createTestStore(initialState);
    const screen = renderWithStoreAndRouter(<VAOSApp>Child content</VAOSApp>, {
      store,
    });

    expect(await screen.findByText('Child content')).to.exist;
    await waitFor(() => {
      expect(
        global.window.dataLayer.some(
          e => e.event === 'phased-roll-out-enabled',
        ),
      ).to.be.true;
    });
  });

  it('should not record roll out event when not using flat facility page', async () => {
    const stateWithCernerUser = set(
      'user.profile.facilities[0].isCerner',
      true,
      initialState,
    );
    stateWithCernerUser.user.profile.facilities[0].usesCernerAppointments = true;
    const store = createTestStore(stateWithCernerUser);
    const screen = renderWithStoreAndRouter(<VAOSApp>Child content</VAOSApp>, {
      store,
    });

    expect(await screen.findByText('Child content')).to.exist;
    expect(
      global.window.dataLayer.some(e => e.event === 'phased-roll-out-enabled'),
    ).to.be.false;
  });

  it('should render unavailable message when flag is off', async () => {
    const store = createTestStore({
      ...initialState,
      featureToggles: {
        ...initialState.featureToggles,
        vaOnlineScheduling: false,
      },
    });
    const screen = renderWithStoreAndRouter(<VAOSApp>Child content</VAOSApp>, {
      store,
    });

    expect(
      await screen.findByText(
        /VA online scheduling application isn’t available/,
      ),
    ).to.exist;
    expect(screen.queryByText('Child content')).not.to.exist;
  });

  it('should render maintenance message', async () => {
    setFetchJSONResponse(
      global.fetch.withArgs(`${environment.API_URL}/v0/maintenance_windows/`),
      {
        data: [
          {
            id: '139',
            type: 'maintenance_windows',
            attributes: {
              externalService: 'vaos',
              description: 'My description',
              startTime: moment.utc().subtract('1', 'days'),
              endTime: moment.utc().add('1', 'days'),
            },
          },
        ],
      },
    );
    const store = createTestStore(initialState);
    const screen = renderWithStoreAndRouter(<VAOSApp>Child content</VAOSApp>, {
      store,
    });

    expect(await screen.findByText(/down for maintenance/)).to.exist;
    expect(screen.queryByText('Child content')).to.not.exist;
  });
  it('should render maintenance approaching message', async () => {
    setFetchJSONResponse(
      global.fetch.withArgs(`${environment.API_URL}/v0/maintenance_windows/`),
      {
        data: [
          {
            id: '139',
            type: 'maintenance_windows',
            attributes: {
              externalService: 'vaos',
              description: 'My description',
              startTime: moment.utc().add('30', 'minutes'),
              endTime: moment.utc().add('1', 'days'),
            },
          },
        ],
      },
    );
    const store = createTestStore(initialState);
    const screen = renderWithStoreAndRouter(<VAOSApp>Child content</VAOSApp>, {
      store,
    });

    expect(await screen.findByText(/will be down for maintenance/)).to.exist;
    expect(screen.getByText('Child content')).to.exist;
    fireEvent.click(screen.getByText('Dismiss'));
    await waitFor(
      () => expect(screen.queryByText(/unavailable soon/)).to.not.exist,
    );
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
    const screen = renderWithStoreAndRouter(<VAOSApp>Child content</VAOSApp>, {
      store,
    });

    await waitFor(() => {
      expect(
        screen.getByText(
          /We’re sorry. We can’t find any VA medical facility registrations for you/,
        ),
      ).to.be.ok;
    });
  });
});
