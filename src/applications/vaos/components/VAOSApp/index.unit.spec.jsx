import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import { waitFor } from '@testing-library/dom';
import { expect } from 'chai';
import { mockFetch, setFetchJSONResponse } from 'platform/testing/unit/helpers';
import React from 'react';

import { addDays, addMinutes, format, subDays } from 'date-fns';
import backendServices from 'platform/user/profile/constants/backendServices';
import VAOSApp from '.';
import {
  createTestStore,
  renderWithStoreAndRouter,
} from '../../tests/mocks/setup';

const initialState = {
  featureToggles: {
    vaOnlineScheduling: true,
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

describe('VAOS App: VAOSApp', () => {
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
        /We.re sorry, the appointments tool isn.t available right now/,
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
              startTime: subDays(new Date(), '1')?.toISOString(),
              endTime: addDays(new Date(), '1')?.toISOString(),
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
              startTime: addMinutes(new Date(), '30')?.toISOString(),
              endTime: addDays(new Date(), '1')?.toISOString(),
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
        .getAttribute('secondary-button-text'),
    ).to.eq('Dismiss');
    const dismissBtn = screen.queryByTestId('downtime-approaching-modal')
      .__events.secondaryButtonClick;
    await dismissBtn();
    expect(screen.queryByTestId('toc-modal')).to.be.null;
  });

  it('should render default maintenence message', async () => {
    // Arrange
    const yesterday = subDays(new Date(), '1');
    const today = addDays(new Date(), '1');

    setFetchJSONResponse(
      global.fetch.withArgs(`${environment.API_URL}/v0/maintenance_windows/`),
      {
        data: [
          {
            id: '139',
            type: 'maintenance_windows',
            attributes: {
              externalService: 'vaos',
              startTime: yesterday.toISOString(),
              endTime: today.toISOString(),
            },
          },
        ],
      },
    );
    const store = createTestStore(initialState);

    // Act
    const screen = renderWithStoreAndRouter(<VAOSApp>Child content</VAOSApp>, {
      store,
    });

    // Assert
    expect(await screen.findByText(/down for maintenance/)).to.exist;
    expect(
      `We're making updates to the tool on ${format(yesterday, 'MMMM do')}`,
    );
    expect(screen.queryByText('Child content')).to.not.exist;
  });
});
