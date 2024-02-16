import React from 'react';
import { expect } from 'chai';
import { waitFor } from '@testing-library/dom';
import { mockFetch, setFetchJSONResponse } from 'platform/testing/unit/helpers';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';

import backendServices from 'platform/user/profile/constants/backendServices';
import moment from 'moment';
import { createTestStore, renderWithStoreAndRouter } from '../../mocks/setup';
import VAOSApp from '../../../components/VAOSApp';

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

  it('should render child content', async () => {
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

    expect(await screen.findByTestId('downtime-approaching-modal')).to.exist;
    expect(screen.getByText('Child content')).to.exist;
    expect(screen.queryByTestId('downtime-approaching-modal')).to.exist;
    expect(
      screen
        .queryByTestId('downtime-approaching-modal')
        .getAttribute('secondaryButtonText'),
    ).to.eq('Dismiss');
    const dismissBtn = screen.queryByTestId('downtime-approaching-modal')
      .__events.secondaryButtonClick;
    await dismissBtn();
    expect(screen.queryByTestId('toc-modal')).to.be.null;
  });
});
