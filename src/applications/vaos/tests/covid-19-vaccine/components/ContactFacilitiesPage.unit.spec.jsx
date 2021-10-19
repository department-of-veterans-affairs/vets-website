import React from 'react';
import { expect } from 'chai';

import { mockFetch } from 'platform/testing/unit/helpers';
import ContactFacilitiesPage from '../../../covid-19-vaccine/components/ContactFacilitiesPage';
import {
  getRequestEligibilityCriteriaMock,
  getDirectBookingEligibilityCriteriaMock,
} from '../../mocks/v0';
import { createTestStore, renderWithStoreAndRouter } from '../../mocks/setup';
import {
  mockRequestEligibilityCriteria,
  mockDirectBookingEligibilityCriteria,
  mockFacilitiesFetch,
} from '../../mocks/helpers';
import {
  createMockAppointmentByVersion,
  createMockFacilityByVersion,
} from '../../mocks/data';

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

const parentSiteIds = ['983', '984'];

describe('VAOS COVID-19 Vaccine: <ContactFacilitiesPage>', () => {
  beforeEach(() => mockFetch());

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
        version: 0,
      }),
      createMockFacilityByVersion({
        id: '983GC',
        name: 'Facility that is also enabled',
        lat: 39.1362562,
        long: -83.0804804,
        address: {
          city: 'Belgrade',
          state: 'MT',
        },
        phone: '5555555556x1234',
        version: 0,
      }),
      createMockAppointmentByVersion({
        id: '984',
        name: 'Facility that is furthest away',
        lat: 39.1362562,
        long: -82.1804804,
        address: {
          city: 'Bozeman',
          state: 'MT',
        },
        phone: '5555555555x1234',
        version: 0,
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
    expect(screen.getByText(/555-555-5555, ext\. 1234/i)).to.be.ok;

    expect(
      await screen.findByRole('link', {
        name: /Facility that is also enabled/i,
      }),
    ).to.be.ok;
    expect(screen.baseElement).to.contain.text('Belgrade, MontanaMT');
    expect(screen.getByText(/85\.8 miles/i)).to.be.ok;
    expect(screen.getByText(/555-555-5556, ext\. 1234/i)).to.be.ok;

    expect(screen.queryByText(/Facility that is furthest away/i)).not.to.be.ok;
    expect(screen.getAllByRole('link').map(el => el.textContent)).to.deep.equal(
      [
        'Facility that is enabled',
        '555-555-5555, ext. 1234',
        '711',
        'Facility that is also enabled',
        '555-555-5556, ext. 1234',
        '711',
      ],
    );
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
        createMockFacilityByVersion({
          id: '983',
          name: 'F facility',
          version: 0,
        }),
        createMockFacilityByVersion({
          id: '983GC',
          name: 'A facility',
          version: 0,
        }),
        createMockFacilityByVersion({
          id: '984',
          name: 'B facility',
          version: 0,
        }),
        createMockFacilityByVersion({
          id: '984GC',
          name: 'C facility',
          version: 0,
        }),
        createMockFacilityByVersion({
          id: '984GD',
          name: 'D facility',
          version: 0,
        }),
        createMockFacilityByVersion({
          id: '984GA',
          name: 'E facility',
          version: 0,
        }),
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
        '711',
        'B facility',
        '711',
        'C facility',
        '711',
        'D facility',
        '711',
        'E facility',
        '711',
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
      createMockFacilityByVersion({
        id: '983',
        name: 'Facility that is enabled',
        lat: 39.1362562,
        long: -83.1804804,
        version: 0,
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
      [
        'Facility that is enabled',
        '711',
        'Find VA facilities near you that offer COVID-19 vaccines',
      ],
    );
    expect(screen.getByText(/Find a vaccine walk-in clinic near you/i)).to.be
      .ok;
    expect(
      screen.getByText(
        /You can go to a VA facility's vaccine clinic during walk-in hours to get the COVID-19 vaccine. You don't need an appointment, but be sure to check the facility's walk-in hours before you go./i,
      ),
    ).to.be.ok;
    expect(
      screen.getByRole('link', {
        name: /Find VA facilities near you that offer COVID-19 vaccines/i,
      }),
    ).to.have.attribute(
      'href',
      '/find-locations/?facilityType=health&serviceType=Covid19Vaccine',
    );
  });
});
