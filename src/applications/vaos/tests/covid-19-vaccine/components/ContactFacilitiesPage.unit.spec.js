import React from 'react';
import { expect } from 'chai';

import { mockFetch } from '@department-of-veterans-affairs/platform-testing/helpers';
import ContactFacilitiesPage from '../../../covid-19-vaccine/components/ContactFacilitiesPage';
import { createTestStore, renderWithStoreAndRouter } from '../../mocks/setup';
import { createMockFacilityByVersion } from '../../mocks/data';
import { mockFacilitiesFetchByVersion } from '../../mocks/fetch';
import { mockSchedulingConfigurations } from '../../mocks/helpers.v2';
import { getSchedulingConfigurationMock } from '../../mocks/v2';

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
              id: 'covid',
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

  beforeEach(() => {
    mockFetch();
  });

  it('should show closest two registered facilities', async () => {
    mockFacilitiesFetchByVersion({
      children: true,
      facilities: [
        createMockFacilityByVersion({
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
        createMockFacilityByVersion({
          id: '984',
          name: 'Facility that is furthest away',
          lat: 39.1362562,
          long: -82.1804804,
          address: {
            city: 'Bozeman',
            state: 'MT',
          },
          phone: '5555555555x1234',
        }),
      ],
    });
    mockSchedulingConfigurations([
      getSchedulingConfigurationMock({
        id: '983',
        typeOfCareId: 'primaryCare',
        requestEnabled: true,
      }),
      getSchedulingConfigurationMock({
        id: '984',
        typeOfCareId: 'primaryCare',
        requestEnabled: true,
      }),
    ]);

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
    const screen = renderWithStoreAndRouter(<ContactFacilitiesPage />, {
      store,
    });
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

  it('should show five facilities in alpha order when no residential address', async () => {
    mockFacilitiesFetchByVersion({
      children: true,
      facilities: [
        createMockFacilityByVersion({
          id: '983',
          name: 'A facility',
        }),
        createMockFacilityByVersion({
          id: '984',
          name: 'B facility',
        }),
      ],
    });
    mockSchedulingConfigurations([
      getSchedulingConfigurationMock({
        id: '983',
        typeOfCareId: 'primaryCare',
        requestEnabled: true,
      }),
      getSchedulingConfigurationMock({
        id: '984',
        typeOfCareId: 'primaryCare',
        requestEnabled: true,
      }),
    ]);

    const store = createTestStore(initialState);
    const screen = renderWithStoreAndRouter(<ContactFacilitiesPage />, {
      store,
    });
    expect(await screen.findByRole('link', { name: /A facility/i })).to.be.ok;
    expect(screen.getAllByRole('link').map(el => el.textContent)).to.deep.equal(
      ['A facility', 'B facility'],
    );
    expect(screen.getAllByTestId('tty-telephone')).to.exist;
  });

  it('should show error message', async () => {
    const store = createTestStore(initialState);
    const screen = renderWithStoreAndRouter(<ContactFacilitiesPage />, {
      store,
    });
    expect(
      await screen.findByRole('heading', {
        name: 'We’re sorry. We’ve run into a problem',
        level: 1,
      }),
    ).to.be.ok;
  });

  it('should show no facilities for online vaccine scheduling view', async () => {
    mockFacilitiesFetchByVersion({
      children: true,
      facilities: [
        createMockFacilityByVersion({
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
        createMockFacilityByVersion({
          id: '984',
          name: 'Facility that is furthest away',
          lat: 39.1362562,
          long: -82.1804804,
          address: {
            city: 'Bozeman',
            state: 'MT',
          },
          phone: '5555555555x1234',
        }),
      ],
    });
    mockSchedulingConfigurations([
      getSchedulingConfigurationMock({
        id: '983',
        typeOfCareId: 'primaryCare',
        requestEnabled: true,
      }),
      getSchedulingConfigurationMock({
        id: '984',
        typeOfCareId: 'primaryCare',
        requestEnabled: true,
      }),
    ]);

    const store = createTestStore({
      ...initialState,
      appointments: {
        facilitySettings: [
          {
            id: '983',
            services: [{ id: 'covid', direct: { enabled: false } }],
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
