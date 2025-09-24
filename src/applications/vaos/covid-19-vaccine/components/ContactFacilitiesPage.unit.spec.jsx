import { expect } from 'chai';
import React from 'react';

import { mockFetch } from '@department-of-veterans-affairs/platform-testing/helpers';
import { TYPE_OF_CARE_IDS } from '../../utils/constants';
import MockFacilityResponse from '../../tests/fixtures/MockFacilityResponse';
import MockSchedulingConfigurationResponse, {
  MockServiceConfiguration,
} from '../../tests/fixtures/MockSchedulingConfigurationResponse';
import {
  mockFacilitiesApi,
  mockSchedulingConfigurationsApi,
} from '../../tests/mocks/mockApis';
import {
  createTestStore,
  renderWithStoreAndRouter,
} from '../../tests/mocks/setup';
import ContactFacilitiesPage from './ContactFacilitiesPage';

describe('VAOS vaccine flow: ContactFacilitiesPage', () => {
  const initialState = {
    featureToggles: {
      vaOnlineSchedulingDirect: true,
    },
    appointments: {
      facilitySettings: [
        {
          id: '983',
          services: [
            {
              id: TYPE_OF_CARE_IDS.COVID_VACCINE_ID,
              direct: {
                enabled: true,
              },
            },
          ],
        },
      ],
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
  const facility1 = new MockFacilityResponse({
    id: '983',
    name: 'Facility that is enabled',
  })
    .setLatitude(39.1362562)
    .setLongitude(-83.1804804)
    .setPhoneNumber('5555555555x1234')
    .setAddress({ city: 'Bozeman', state: 'MT' });
  const facility2 = new MockFacilityResponse({
    id: '984',
    name: 'Facility that is furthest away',
  })
    .setLatitude(39.1362562)
    .setLongitude(-82.1804804)
    .setPhoneNumber('5555555555x1234')
    .setAddress({ city: 'Bozeman', state: 'MT' });

  beforeEach(() => {
    mockFetch();

    mockFacilitiesApi({
      ids: ['983', '984'],
      response: [new MockFacilityResponse()],
    });
  });

  it('should show closest two registered facilities', async () => {
    // Arrange
    mockFacilitiesApi({
      children: true,
      response: [facility1, facility2],
    });
    mockSchedulingConfigurationsApi({
      response: [
        new MockSchedulingConfigurationResponse({
          facilityId: '983',
          services: [
            new MockServiceConfiguration({
              typeOfCareId: 'primaryCare',
              requestEnabled: true,
            }),
          ],
        }),
        new MockSchedulingConfigurationResponse({
          facilityId: '984',
          services: [
            new MockServiceConfiguration({
              typeOfCareId: 'primaryCare',
              requestEnabled: true,
            }),
          ],
        }),
      ],
    });

    const store = createTestStore({
      ...initialState,
      user: {
        ...initialState.user,
        profile: {
          ...initialState.user.profile,
          vapContactInfo: {
            residentialAddress: {
              latitude: 39.1362562,
              longitude: -84.6804804,
            },
          },
        },
      },
    });

    // Act
    const screen = renderWithStoreAndRouter(<ContactFacilitiesPage />, {
      store,
    });

    // Assert
    expect(
      await screen.findByRole('link', { name: /Facility that is enabled/i }),
    ).to.be.ok;
    expect(
      screen.getByRole('heading', {
        name: 'We can’t schedule your second dose online',
        level: 1,
      }),
    ).to.be.ok;
    expect(screen.baseElement).to.contain.text('Bozeman, MontanaMT');
    expect(screen.getByText(/80\.4 miles/i)).to.be.ok;
    expect(screen.getAllByTestId('facility-telephone')).to.exist;

    expect(
      await screen.findByRole('link', {
        name: /Facility that is enabled/i,
      }),
    ).to.be.ok;
    expect(screen.getAllByTestId('facility-telephone')).to.exist;
    expect(screen.getAllByTestId('tty-telephone')).to.exist;
    expect(screen.queryByText(/Facility that is furthest away/i)).to.be.ok;
    expect(screen.getAllByRole('link').map(el => el.textContent)).to.deep.equal(
      ['Facility that is enabled', 'Facility that is furthest away'],
    );
  });

  it('should show two facilities in alpha order when no residential address', async () => {
    // Arrange
    mockFacilitiesApi({
      children: true,
      response: MockFacilityResponse.createResponses({
        facilityIds: ['983', '984'],
      }),
    });
    mockSchedulingConfigurationsApi({
      response: [
        new MockSchedulingConfigurationResponse({
          facilityId: '983',
          services: [
            new MockServiceConfiguration({
              typeOfCareId: 'primaryCare',
              requestEnabled: true,
            }),
          ],
        }),
        new MockSchedulingConfigurationResponse({
          facilityId: '984',
          services: [
            new MockServiceConfiguration({
              typeOfCareId: 'primaryCare',
              requestEnabled: true,
            }),
          ],
        }),
      ],
    });

    const store = createTestStore(initialState);

    // Act
    const screen = renderWithStoreAndRouter(<ContactFacilitiesPage />, {
      store,
    });

    // Assert
    expect(await screen.findByRole('link', { name: /Facility 983/i })).to.be.ok;
    expect(screen.getAllByRole('link').map(el => el.textContent)).to.deep.equal(
      ['Facility 983', 'Facility 984'],
    );
    expect(screen.getAllByTestId('tty-telephone')).to.exist;
  });

  it('should show error message', async () => {
    // Act
    const store = createTestStore(initialState);

    mockSchedulingConfigurationsApi({
      response: [
        new MockSchedulingConfigurationResponse({
          facilityId: '983',
          services: [
            new MockServiceConfiguration({
              typeOfCareId: TYPE_OF_CARE_IDS.COVID_VACCINE_ID,
              requestEnabled: true,
              directEnabled: true,
            }),
          ],
        }),
      ],
      responseCode: 500,
    });

    // Act
    const screen = renderWithStoreAndRouter(<ContactFacilitiesPage />, {
      store,
    });

    // Assert
    expect(
      await screen.findByRole('heading', {
        name: 'We’re sorry. We’ve run into a problem',
        level: 1,
      }),
    ).to.be.ok;
  });

  it('should show no facilities for online vaccine scheduling view', async () => {
    mockFacilitiesApi({
      children: true,
      response: [facility1, facility2],
    });
    mockSchedulingConfigurationsApi({
      response: [
        new MockSchedulingConfigurationResponse({
          facilityId: '983',
          services: [
            new MockServiceConfiguration({
              typeOfCareId: 'primaryCare',
              requestEnabled: true,
            }),
          ],
        }),
        new MockSchedulingConfigurationResponse({
          facilityId: '984',
          services: [
            new MockServiceConfiguration({
              typeOfCareId: 'primaryCare',
              requestEnabled: true,
            }),
          ],
        }),
      ],
    });

    const store = createTestStore({
      ...initialState,
      appointments: {
        facilitySettings: [
          {
            id: '983',
            services: [
              {
                id: TYPE_OF_CARE_IDS.COVID_VACCINE_ID,
                direct: { enabled: false },
              },
            ],
          },
        ],
      },
      user: {
        ...initialState.user,
        profile: {
          ...initialState.user.profile,
          vapContactInfo: {
            residentialAddress: {
              latitude: 39.1362562,
              longitude: -84.6804804,
            },
          },
        },
      },
    });
    const screen = renderWithStoreAndRouter(<ContactFacilitiesPage />, {
      store,
    });
    expect(
      await screen.findByRole('link', { name: /Facility that is enabled/i }),
    ).to.be.ok;
    expect(
      screen.getByRole('heading', {
        name: 'Contact a facility',
        level: 1,
      }),
    ).to.be.ok;
    expect(screen.getAllByRole('link').map(el => el.textContent)).to.deep.equal(
      ['Facility that is enabled', 'Facility that is furthest away'],
    );
    expect(screen.getByText(/Find a vaccine walk-in clinic near you/i)).to.be
      .ok;
    expect(
      screen.getByText(
        /You can go to a VA facility's vaccine clinic during walk-in hours to get the COVID-19 vaccine. You don't need an appointment, but be sure to check the facility's walk-in hours before you go./i,
      ),
    ).to.be.ok;
    expect(
      screen.getByTestId('find-facilities-link', {
        name: /Find VA facilities near you that offer COVID-19 vaccines/i,
      }),
    ).to.have.attribute(
      'href',
      '/find-locations/?facilityType=health&serviceType=Covid19Vaccine',
    );
  });
});
