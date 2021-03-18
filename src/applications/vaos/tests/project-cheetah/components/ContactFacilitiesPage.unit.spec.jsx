import React from 'react';
import { expect } from 'chai';

import { mockFetch, resetFetch } from 'platform/testing/unit/helpers';
import ContactFacilitiesPage from '../../../project-cheetah/components/ContactFacilitiesPage';
import {
  getVAFacilityMock,
  getRequestEligibilityCriteriaMock,
  getDirectBookingEligibilityCriteriaMock,
} from '../../mocks/v0';
import { createTestStore, renderWithStoreAndRouter } from '../../mocks/setup';
import {
  mockRequestEligibilityCriteria,
  mockDirectBookingEligibilityCriteria,
  mockFacilitiesFetch,
} from '../../mocks/helpers';

const initialState = {
  featureToggles: {
    vaOnlineSchedulingDirect: true,
    vaOnlineSchedulingCheetah: true,
  },
  appointments: {
    directScheduleSettings: [
      getDirectBookingEligibilityCriteriaMock({
        id: '983',
        typeOfCareId: 'covid',
      }).attributes,
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

const parentSiteIds = ['983', '984'];

describe('VAOS cheetah: <ContactFacilitiesPage>', () => {
  beforeEach(() => mockFetch());
  afterEach(() => resetFetch());

  it('should show closest two registered facilities', async () => {
    mockDirectBookingEligibilityCriteria(parentSiteIds, [
      getDirectBookingEligibilityCriteriaMock({
        id: '983',
        typeOfCareId: '301',
        patientHistoryRequired: null,
      }),
      getDirectBookingEligibilityCriteriaMock({
        id: '983GC',
        typeOfCareId: '301',
        patientHistoryRequired: null,
      }),
      getDirectBookingEligibilityCriteriaMock({
        id: '984',
        typeOfCareId: '301',
        patientHistoryRequired: null,
      }),
    ]);
    mockRequestEligibilityCriteria(parentSiteIds, [
      getRequestEligibilityCriteriaMock({
        id: '983',
        typeOfCareId: '301',
        patientHistoryRequired: null,
      }),
      getRequestEligibilityCriteriaMock({
        id: '983GC',
        typeOfCareId: '301',
        patientHistoryRequired: null,
      }),
      getRequestEligibilityCriteriaMock({
        id: '984',
        typeOfCareId: '301',
        patientHistoryRequired: null,
      }),
    ]);
    mockFacilitiesFetch('vha_442,vha_442GC,vha_552', [
      {
        id: '983',
        attributes: {
          ...getVAFacilityMock().attributes,
          uniqueId: '983',
          name: 'Facility that is enabled',
          lat: 39.1362562,
          long: -83.1804804,
          address: {
            physical: {
              city: 'Bozeman',
              state: 'MT',
            },
          },
          phone: {
            main: '5555555555x1234',
          },
        },
      },
      {
        id: '983GC',
        attributes: {
          ...getVAFacilityMock().attributes,
          uniqueId: '983GC',
          name: 'Facility that is also enabled',
          lat: 39.1362562,
          long: -83.0804804,
          address: {
            physical: {
              city: 'Belgrade',
              state: 'MT',
            },
          },
          phone: {
            main: '5555555556x1234',
          },
        },
      },
      {
        id: '984',
        attributes: {
          ...getVAFacilityMock().attributes,
          uniqueId: '984',
          name: 'Facility that is furthest away',
          lat: 39.1362562,
          long: -82.1804804,
          address: {
            physical: {
              city: 'Bozeman',
              state: 'MT',
            },
          },
          phone: {
            main: '5555555555x1234',
          },
        },
      },
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
    expect(screen.baseElement).to.contain.text('Bozeman, MT');
    expect(screen.getByText(/80\.4 miles/i)).to.be.ok;
    expect(screen.getByText(/555-555-5555, ext\. 1234/i)).to.be.ok;

    expect(
      await screen.findByRole('link', {
        name: /Facility that is also enabled/i,
      }),
    ).to.be.ok;
    expect(screen.baseElement).to.contain.text('Belgrade, MT');
    expect(screen.getByText(/85\.8 miles/i)).to.be.ok;
    expect(screen.getByText(/555-555-5556, ext\. 1234/i)).to.be.ok;

    expect(screen.queryByText(/Facility that is furthest away/i)).not.to.be.ok;
    expect(screen.getAllByRole('link').map(el => el.textContent)).to.deep.equal(
      [
        'Facility that is enabled',
        '555-555-5555, ext. 1234',
        'Facility that is also enabled',
        '555-555-5556, ext. 1234',
        'Search for more facilities',
      ],
    );
    expect(
      screen.getByRole('link', { name: /search for more facilities/i }),
    ).to.have.attribute('href', '/find-locations');
  });

  it('should show five facilities in alpha order when no residential address', async () => {
    mockDirectBookingEligibilityCriteria(parentSiteIds, [
      getDirectBookingEligibilityCriteriaMock({
        id: '983',
        typeOfCareId: '301',
        patientHistoryRequired: null,
      }),
      getDirectBookingEligibilityCriteriaMock({
        id: '983GC',
        typeOfCareId: '301',
        patientHistoryRequired: null,
      }),
      getDirectBookingEligibilityCriteriaMock({
        id: '984',
        typeOfCareId: '301',
        patientHistoryRequired: null,
      }),
      getDirectBookingEligibilityCriteriaMock({
        id: '984GC',
        typeOfCareId: '301',
        patientHistoryRequired: null,
      }),
      getDirectBookingEligibilityCriteriaMock({
        id: '984GD',
        typeOfCareId: '301',
        patientHistoryRequired: null,
      }),
      getDirectBookingEligibilityCriteriaMock({
        id: '984GA',
        typeOfCareId: '301',
        patientHistoryRequired: null,
      }),
    ]);
    mockRequestEligibilityCriteria(parentSiteIds, [
      getRequestEligibilityCriteriaMock({
        id: '983',
        typeOfCareId: '301',
        patientHistoryRequired: null,
      }),
      getRequestEligibilityCriteriaMock({
        id: '983GC',
        typeOfCareId: '301',
        patientHistoryRequired: null,
      }),
      getRequestEligibilityCriteriaMock({
        id: '984',
        typeOfCareId: '301',
        patientHistoryRequired: null,
      }),
      getRequestEligibilityCriteriaMock({
        id: '984GC',
        typeOfCareId: '301',
        patientHistoryRequired: null,
      }),
      getRequestEligibilityCriteriaMock({
        id: '984GD',
        typeOfCareId: '301',
        patientHistoryRequired: null,
      }),
      getRequestEligibilityCriteriaMock({
        id: '984GA',
        typeOfCareId: '301',
        patientHistoryRequired: null,
      }),
    ]);
    mockFacilitiesFetch(
      'vha_442,vha_442GC,vha_552,vha_552GC,vha_552GD,vha_552GA',
      [
        {
          id: '983',
          attributes: {
            ...getVAFacilityMock().attributes,
            uniqueId: '983',
            name: 'F facility',
          },
        },
        {
          id: '983GC',
          attributes: {
            ...getVAFacilityMock().attributes,
            uniqueId: '983GC',
            name: 'A facility',
          },
        },
        {
          id: '984',
          attributes: {
            ...getVAFacilityMock().attributes,
            uniqueId: '984',
            name: 'B facility',
          },
        },
        {
          id: '984GC',
          attributes: {
            ...getVAFacilityMock().attributes,
            uniqueId: '984GC',
            name: 'C facility',
          },
        },
        {
          id: '984GD',
          attributes: {
            ...getVAFacilityMock().attributes,
            uniqueId: '984GD',
            name: 'D facility',
          },
        },
        {
          id: '984GA',
          attributes: {
            ...getVAFacilityMock().attributes,
            uniqueId: '984GA',
            name: 'E facility',
          },
        },
      ],
    );
    const store = createTestStore(initialState);
    const screen = renderWithStoreAndRouter(<ContactFacilitiesPage />, {
      store,
    });
    expect(await screen.findByRole('link', { name: /A facility/i })).to.be.ok;
    expect(screen.getAllByRole('link').map(el => el.textContent)).to.deep.equal(
      [
        'A facility',
        'B facility',
        'C facility',
        'D facility',
        'E facility',
        'Search for more facilities',
      ],
    );
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
    mockDirectBookingEligibilityCriteria(parentSiteIds, [
      getDirectBookingEligibilityCriteriaMock({
        id: '983',
        typeOfCareId: 'covid',
        patientHistoryRequired: null,
      }),
    ]);
    mockRequestEligibilityCriteria(parentSiteIds, [
      getRequestEligibilityCriteriaMock({
        id: '983',
        typeOfCareId: 'covid',
        patientHistoryRequired: null,
      }),
    ]);
    mockFacilitiesFetch('vha_442', [
      {
        id: '983',
        attributes: {
          ...getVAFacilityMock().attributes,
          uniqueId: '983',
          name: 'Facility that is enabled',
          lat: 39.1362562,
          long: -83.1804804,
        },
      },
    ]);
    const store = createTestStore({
      ...initialState,
      appointments: {
        directScheduleSettings: [
          getDirectBookingEligibilityCriteriaMock({
            id: '983',
            typeOfCareId: 'covid',
            patientHistoryRequired: null,
          }).attributes,
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
      [
        'Facility that is enabled',
        'Search for more facilities',
        'Learn how to stay informed about COVID-19 vaccines at VA.',
      ],
    );
    expect(
      screen.getByRole('link', { name: /search for more facilities/i }),
    ).to.have.attribute('href', '/find-locations');
  });
});
