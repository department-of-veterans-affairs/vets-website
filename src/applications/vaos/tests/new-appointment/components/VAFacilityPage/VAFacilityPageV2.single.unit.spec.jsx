import React from 'react';
import { expect } from 'chai';

import { mockFetch, resetFetch } from 'platform/testing/unit/helpers';
import { fireEvent, waitFor } from '@testing-library/dom';
import VAFacilityPage from '../../../../new-appointment/components/VAFacilityPage/VAFacilityPageV2';
import {
  getParentSiteMock,
  getClinicMock,
  getVAFacilityMock,
  getRequestEligibilityCriteriaMock,
  getDirectBookingEligibilityCriteriaMock,
} from '../../../mocks/v0';
import {
  createTestStore,
  setTypeOfCare,
  renderWithStoreAndRouter,
} from '../../../mocks/setup';
import {
  mockEligibilityFetches,
  mockParentSites,
  mockRequestEligibilityCriteria,
  mockDirectBookingEligibilityCriteria,
  mockFacilitiesFetch,
} from '../../../mocks/helpers';

const initialState = {
  featureToggles: {
    vaOnlineSchedulingCommunityCare: false,
    vaOnlineSchedulingVSPAppointmentNew: false,
    vaOnlineSchedulingDirect: true,
    vaOnlineSchedulingFlatFacilityPage: true,
  },
  user: {
    profile: {
      facilities: [{ facilityId: '983', isCerner: false }],
    },
  },
};

const parentSite983 = {
  id: '983',
  attributes: {
    ...getParentSiteMock().attributes,
    institutionCode: '983',
    authoritativeName: 'Some VA facility',
    rootStationCode: '983',
    parentStationCode: '983',
  },
};

const requestFacilityAttributes = getRequestEligibilityCriteriaMock()
  .attributes;

const requestFacilities = [
  {
    id: '983',
    attributes: {
      ...requestFacilityAttributes,
      id: '983',
      requestSettings: [
        {
          ...requestFacilityAttributes.requestSettings[0],
          id: '323',
          typeOfCare: 'Primary Care',
        },
      ],
    },
  },
];

const directFacilityAttributes = getDirectBookingEligibilityCriteriaMock()
  .attributes;

const directFacilities = [
  {
    id: '983',
    attributes: {
      ...directFacilityAttributes,
      id: '983',
      coreSettings: [
        {
          ...directFacilityAttributes.coreSettings[0],
          id: '323',
          typeOfCare: 'Primary Care',
        },
      ],
    },
  },
];

const facilities = [
  {
    id: 'vha_442',
    attributes: {
      ...getVAFacilityMock().attributes,
      uniqueId: '442',
      name: 'San Diego VA Medical Center',
      address: {
        physical: {
          address1: '2360 East Pershing Boulevard',
          city: 'San Diego',
          state: 'CA',
          zip: '92128',
        },
      },
      phone: {
        main: '858-779-0338',
      },
    },
  },
];

describe('VAOS integration: VA flat facility page - single facility', () => {
  beforeEach(() => {
    mockFetch();
    const siteIds = ['983'];
    mockParentSites(siteIds, [parentSite983]);
    mockDirectBookingEligibilityCriteria(siteIds, directFacilities);
    mockRequestEligibilityCriteria(siteIds, requestFacilities);
    mockFacilitiesFetch('vha_442', facilities);
  });

  afterEach(() => resetFetch());

  it('should show alert when only one facility is supported', async () => {
    mockEligibilityFetches({
      siteId: '983',
      facilityId: '983',
      typeOfCareId: '323',
      limit: true,
      requestPastVisits: true,
    });

    const store = createTestStore(initialState);
    await setTypeOfCare(store, /primary care/i);

    const {
      baseElement,
      findByText,
      getByText,
      history,
    } = renderWithStoreAndRouter(<VAFacilityPage />, {
      store,
    });

    await findByText(/we found one VA location for you/i);

    expect(baseElement).to.contain.text('San Diego VA Medical Center');
    expect(baseElement).to.contain.text('San Diego, CA');
    expect(getByText(/search for a nearby location/i)).to.have.attribute(
      'href',
      '/find-locations',
    );

    fireEvent.click(await findByText(/Continue/));
    await waitFor(() =>
      expect(history.push.firstCall.args[0]).to.equal(
        '/new-appointment/request-date',
      ),
    );
  });

  it('should show not supported message when direct is supported and not eligible, and requests are not supported', async () => {
    mockRequestEligibilityCriteria(['983'], []);
    mockEligibilityFetches({
      siteId: '983',
      facilityId: '983',
      typeOfCareId: '323',
      clinics: [
        {
          id: '308',
          attributes: {
            ...getClinicMock(),
            siteCode: '983',
            clinicId: '308',
            institutionCode: '983',
            clinicFriendlyLocationName: 'Green team clinic',
          },
        },
      ],
      pastClinics: false,
    });
    const store = createTestStore(initialState);
    await setTypeOfCare(store, /primary care/i);

    const screen = renderWithStoreAndRouter(<VAFacilityPage />, {
      store,
    });

    await screen.findByText(/we found one VA location for you/i);

    expect(screen.baseElement).to.contain.text(
      'However, this facility does not allow online requests',
    );
    expect(await screen.findByText(/Continue/)).to.have.attribute('disabled');
  });

  it('should show past visits eligibility alert', async () => {
    const siteIds = ['983'];
    mockParentSites(siteIds, [parentSite983]);
    mockDirectBookingEligibilityCriteria(siteIds, []);
    mockRequestEligibilityCriteria(siteIds, [
      {
        id: '983',
        attributes: {
          ...requestFacilityAttributes,
          id: '983',
          requestSettings: [
            {
              ...requestFacilityAttributes.requestSettings[0],
              id: '502',
              typeOfCare: 'Outpatient Mental Health',
            },
          ],
        },
      },
    ]);

    mockEligibilityFetches({
      siteId: '983',
      facilityId: '983',
      typeOfCareId: '502',
      limit: true,
    });
    const store = createTestStore(initialState);
    await setTypeOfCare(store, /mental health/i);

    const screen = renderWithStoreAndRouter(<VAFacilityPage />, {
      store,
    });

    await screen.findByText(/San Diego VA Medical Center/i);
    fireEvent.click(screen.getByText(/Continue/));
    await screen.findByText(
      /you need to have been seen within the past 12 months/,
    );
    expect(screen.getByText(/search for a nearby location/i)).to.have.attribute(
      'href',
      '/find-locations',
    );
  });

  it('should show request limits eligibility alert', async () => {
    mockEligibilityFetches({
      siteId: '983',
      facilityId: '983',
      typeOfCareId: '323',
      requestPastVisits: true,
    });
    const store = createTestStore(initialState);
    await setTypeOfCare(store, /primary care/i);

    const screen = renderWithStoreAndRouter(<VAFacilityPage />, {
      store,
    });

    await screen.findByText(/San Diego VA Medical Center/i);

    expect(screen.baseElement).to.contain.text(
      'you have more outstanding requests than this facility allows',
    );
    expect(screen.getByText(/search for a nearby location/i)).to.have.attribute(
      'href',
      '/find-locations',
    );

    expect(await screen.findByText(/Continue/)).to.have.attribute('disabled');
  });

  it('should show error message on eligibility failure', async () => {
    const store = createTestStore(initialState);
    await setTypeOfCare(store, /primary care/i);

    const screen = renderWithStoreAndRouter(<VAFacilityPage />, {
      store,
    });

    expect(await screen.findByText(/Something went wrong on our end/)).to.exist;

    expect(await screen.findByText(/Continue/)).to.have.attribute('disabled');
  });
});
