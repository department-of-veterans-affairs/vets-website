import {
  mockFetch,
  setFetchJSONResponse,
} from '@department-of-veterans-affairs/platform-testing/helpers';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import { expect } from 'chai';
import { addDays, format, subDays } from 'date-fns';
import React from 'react';
import { NewBookingSection } from '.';
import MockFacilityResponse from '../tests/fixtures/MockFacilityResponse';
import { getSchedulingConfigurationMock } from '../tests/mocks/mock';
import {
  mockFacilitiesApi,
  mockSchedulingConfigurationsApi,
} from '../tests/mocks/mockApis';
import {
  createTestStore,
  renderWithStoreAndRouter,
} from '../tests/mocks/setup';

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
    // Arrange
    const store = createTestStore({
      ...initialState,
    });

    mockSchedulingConfigurationsApi({
      response: [
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
      ],
    });

    // Act
    const screen = renderWithStoreAndRouter(<NewBookingSection />, {
      store,
    });

    // Assert
    await screen.findByRole('heading', {
      level: 1,
      name: 'COVID-19 vaccine appointment',
    });
  });

  it('should redirect the user to the Contact Facility page when facilities are not available', async () => {
    // Arrange
    const store = createTestStore({
      ...initialState,
    });

    mockFacilitiesApi({
      children: true,
      response: [
        new MockFacilityResponse({ id: '983' }),
        new MockFacilityResponse({ id: '984' }),
      ],
    });
    mockSchedulingConfigurationsApi({
      response: [
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
      ],
    });

    // Act
    const screen = renderWithStoreAndRouter(<NewBookingSection />, {
      store,
    });

    // Assert
    expect(
      await screen.findByText(/Contact one of your registered VA facilities/i),
    ).to.be.ok;
  });

  it('should render warning message', async () => {
    // Arrange
    const store = createTestStore(initialState);

    mockFacilitiesApi({ ids: ['983', '984'] });
    mockSchedulingConfigurationsApi({
      response: [
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
      ],
    });
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
              startTime: format(
                subDays(new Date(), '1'),
                "yyyy-MM-dd'T'HH:mm:ss",
              ),
              endTime: format(
                addDays(new Date(), '1'),
                "yyyy-MM-dd'T'HH:mm:ss",
              ),
            },
          },
        ],
      },
    );

    // Act
    const screen = renderWithStoreAndRouter(<NewBookingSection />, {
      store,
      basename: '/new-covid-19-vaccine-appointment',
    });

    // Assert
    expect(
      await screen.findByRole('heading', {
        level: 3,
        name: /You may have trouble using the VA appointments tool right now/,
      }),
    ).to.exist;
  });

  it('should redirect to home page', async () => {
    // Arrange
    const state = {
      ...initialState,
      newAppointment: {
        isNewAppointmentStarted: false,
      },
    };
    const store = createTestStore(state);

    mockFacilitiesApi({
      ids: ['983'],
      response: [new MockFacilityResponse()],
    });
    mockFacilitiesApi({
      ids: ['983', '984'],
      response: [new MockFacilityResponse()],
    });
    mockSchedulingConfigurationsApi({
      response: [
        getSchedulingConfigurationMock({
          id: '983',
          typeOfCareId: 'covid',
          requestEnabled: true,
        }),
      ],
    });
    mockSchedulingConfigurationsApi({
      response: [
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
      ],
    });

    // Act
    const screen = renderWithStoreAndRouter(<NewBookingSection />, {
      store,
      path: '/covid-vaccine/doses-received',
    });

    // Assert
    expect(screen.history.location.pathname).to.equal('/');
  });

  it('should exempt started appointments from redirects', async () => {
    // Arrange
    const state = {
      ...initialState,
      newAppointment: {
        isNewAppointmentStarted: true,
      },
    };

    const store = createTestStore(state);

    mockFacilitiesApi({
      ids: ['983'],
      response: [new MockFacilityResponse()],
    });
    mockFacilitiesApi({
      ids: ['983', '984'],
      response: [new MockFacilityResponse()],
    });
    mockSchedulingConfigurationsApi({
      response: [
        getSchedulingConfigurationMock({
          id: '983',
          typeOfCareId: 'covid',
          requestEnabled: true,
        }),
      ],
    });
    mockSchedulingConfigurationsApi({
      response: [
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
      ],
    });

    // Act
    const screen = renderWithStoreAndRouter(<NewBookingSection />, {
      store,
      path: '/covid-vaccine/doses-received',
    });

    // Assert
    expect(screen.history.location.pathname).to.equal(
      '/covid-vaccine/doses-received',
    );
  });

  it('should exempt home page from redirects', async () => {
    // Arrange
    const state = {
      ...initialState,
      newAppointment: {
        isNewAppointmentStarted: false,
      },
    };

    const store = createTestStore(state);

    mockFacilitiesApi({
      ids: ['983'],
      response: [new MockFacilityResponse()],
    });
    mockFacilitiesApi({
      ids: ['983', '984'],
      response: [new MockFacilityResponse()],
    });
    mockSchedulingConfigurationsApi({
      response: [
        getSchedulingConfigurationMock({
          id: '983',
          typeOfCareId: 'covid',
          requestEnabled: true,
        }),
      ],
    });
    mockSchedulingConfigurationsApi({
      response: [
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
      ],
    });

    // Act
    const screen = renderWithStoreAndRouter(<NewBookingSection />, {
      store,
      path: '/covid-vaccine/',
    });

    // Assert
    expect(screen.history.location.pathname).to.equal('/covid-vaccine/');
  });

  it('should show error when facility availability check fails', async () => {
    // Arrange
    const store = createTestStore({
      ...initialState,
    });

    mockFacilitiesApi({
      ids: ['983', '984'],
      response: [new MockFacilityResponse()],
    });
    mockSchedulingConfigurationsApi({
      response: [
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
      ],
    });
    mockSchedulingConfigurationsApi({
      response: [
        getSchedulingConfigurationMock({
          id: '983',
          typeOfCareId: 'covid',
          requestEnabled: true,
        }),
      ],
      responseCode: 500,
    });

    // Act
    const screen = renderWithStoreAndRouter(<NewBookingSection />, {
      store,
    });

    // Assert
    expect(
      await screen.findByRole('heading', {
        level: 1,
        name: /We’re sorry. We’ve run into a problem/,
      }),
    ).to.exist;
  });
});
