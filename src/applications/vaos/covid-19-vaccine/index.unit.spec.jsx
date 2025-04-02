import React from 'react';
import moment from 'moment';
import { expect } from 'chai';
import {
  mockFetch,
  setFetchJSONResponse,
} from '@department-of-veterans-affairs/platform-testing/helpers';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import {
  createTestStore,
  renderWithStoreAndRouter,
} from '../tests/mocks/setup';
import { NewBookingSection } from '.';
import { mockFacilitiesFetch } from '../tests/mocks/fetch';
import { createMockFacility } from '../tests/mocks/data';
import { mockSchedulingConfigurations } from '../tests/mocks/helpers';
import { getSchedulingConfigurationMock } from '../tests/mocks/mock';

const initialState = {
  featureToggles: {
    vaOnlineSchedulingDirect: true,
  },
  user: {
    profile: {
      facilities: [
        { facilityId: '983', isCerner: false },
        { facilityId: '984', isCerner: false },
      ],
    },
  },
};

describe('VAOS vaccine flow: NewBookingSection', () => {
  beforeEach(() => {
    mockFetch();
  });

  it('should not redirect the user to the Contact Facility page when facilities are available', async () => {
    const store = createTestStore({
      ...initialState,
    });

    mockFacilitiesFetch({
      children: true,
      facilities: [
        createMockFacility({
          id: '983',
          name: 'A facility',
        }),
        createMockFacility({
          id: '984',
          name: 'B facility',
        }),
      ],
    });
    mockSchedulingConfigurations([
      getSchedulingConfigurationMock({
        id: '983',
        typeOfCareId: 'covid',
        requestEnabled: true,
        directEnabled: true,
      }),
      getSchedulingConfigurationMock({
        id: '984',
        typeOfCareId: 'primaryCare',
        requestEnabled: true,
      }),
    ]);

    const screen = renderWithStoreAndRouter(<NewBookingSection />, {
      store,
    });

    await screen.findByRole('heading', {
      level: 1,
      name: 'COVID-19 vaccine appointment',
    });
  });

  it('should redirect the user to the Contact Facility page when facilities are not available', async () => {
    const store = createTestStore({
      ...initialState,
    });

    mockFacilitiesFetch({
      children: true,
      facilities: [
        createMockFacility({
          id: '983',
          name: 'Facility that is enabled',
          lat: 39.1362562,
          long: -83.1804804,
          address: {
            city: 'Bozeman',
            state: 'MT',
          },
          phone: '5555555555x1234',
        }),
        createMockFacility({
          id: '984',
          name: 'Facility 2',
        }),
      ],
    });
    mockSchedulingConfigurations([
      getSchedulingConfigurationMock({
        id: '983',
        typeOfCareId: 'covid',
        requestEnabled: true,
      }),
      getSchedulingConfigurationMock({
        id: '984',
        typeOfCareId: 'primaryCare',
        requestEnabled: true,
      }),
    ]);

    const screen = renderWithStoreAndRouter(<NewBookingSection />, {
      store,
    });

    expect(
      await screen.findByText(/Contact one of your registered VA facilities/i),
    ).to.be.ok;
  });

  it('should render warning message', async () => {
    setFetchJSONResponse(
      global.fetch.withArgs(`${environment.API_URL}/v0/maintenance_windows/`),
      {
        data: [
          {
            id: '139',
            type: 'maintenance_windows',
            attributes: {
              externalService: 'vaosWarning',
              description: 'My description',
              startTime: moment.utc().subtract('1', 'days'),
              endTime: moment.utc().add('1', 'days'),
            },
          },
        ],
      },
    );
    const store = createTestStore(initialState);
    const screen = renderWithStoreAndRouter(<NewBookingSection />, {
      store,
      basename: '/new-covid-19-vaccine-appointment',
    });

    expect(
      await screen.findByRole('heading', {
        level: 3,
        name: /You may have trouble using the VA appointments tool right now/,
      }),
    ).to.exist;
  });

  it('should redirect to home page', async () => {
    const state = {
      ...initialState,
      newAppointment: {
        isNewAppointmentStarted: false,
      },
    };

    const store = createTestStore(state);
    const screen = renderWithStoreAndRouter(<NewBookingSection />, {
      store,
      path: '/covid-vaccine/doses-received',
    });

    expect(screen.history.location.pathname).to.equal('/');
  });

  it('should exempt started appointments from redirects', async () => {
    const state = {
      ...initialState,
      newAppointment: {
        isNewAppointmentStarted: true,
      },
    };

    const store = createTestStore(state);
    const screen = renderWithStoreAndRouter(<NewBookingSection />, {
      store,
      path: '/covid-vaccine/doses-received',
    });

    expect(screen.history.location.pathname).to.equal(
      '/covid-vaccine/doses-received',
    );
  });

  it('should exempt home page from redirects', async () => {
    const state = {
      ...initialState,
      newAppointment: {
        isNewAppointmentStarted: false,
      },
    };

    const store = createTestStore(state);
    const screen = renderWithStoreAndRouter(<NewBookingSection />, {
      store,
      path: '/covid-vaccine/',
    });

    expect(screen.history.location.pathname).to.equal('/covid-vaccine/');
  });

  it('should show error when facility availability check fails', async () => {
    const store = createTestStore({
      ...initialState,
    });

    const screen = renderWithStoreAndRouter(<NewBookingSection />, {
      store,
    });

    expect(
      await screen.findByRole('heading', {
        level: 1,
        name: /We’re sorry. We’ve run into a problem/,
      }),
    ).to.exist;
  });
});
