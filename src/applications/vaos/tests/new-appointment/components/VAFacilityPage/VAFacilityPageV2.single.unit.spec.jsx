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
  setTypeOfEyeCare,
} from '../../../mocks/setup';
import {
  mockEligibilityFetches,
  mockParentSites,
  mockRequestEligibilityCriteria,
  mockDirectBookingEligibilityCriteria,
  mockFacilitiesFetch,
} from '../../../mocks/helpers';
import { cleanup } from '@testing-library/react';

const initialState = {
  featureToggles: {
    vaOnlineSchedulingCommunityCare: false,
    vaOnlineSchedulingDirect: true,
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

    const { baseElement, findByText, history } = renderWithStoreAndRouter(
      <VAFacilityPage />,
      {
        store,
      },
    );

    await findByText(
      /We found one VA facility for your primary care appointment./i,
    );

    expect(baseElement).to.contain.text('San Diego VA Medical Center');
    expect(baseElement).to.contain.text('San Diego, CA');

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

    await screen.findByText(
      /The facility we found doesn’t accept online scheduling for this care/i,
    );

    expect(screen.baseElement).to.contain.text(
      'You’ll need to call this facility to request your appointment',
    );
    expect(await screen.findByText(/Continue/)).to.have.attribute('disabled');
  });

  it('should show past visits eligibility alert', async () => {
    const siteIds = ['983'];
    mockParentSites(siteIds, [parentSite983]);
    mockDirectBookingEligibilityCriteria(siteIds, []);
    mockRequestEligibilityCriteria(siteIds, [
      getRequestEligibilityCriteriaMock({
        id: '983',
        typeOfCareId: '502',
      }),
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
      /you need to have had a mental health appointment at this facility within the last 12 months/,
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
      'Before requesting an appointment at this location, you need to schedule or cancel your open appointment requests at this facility',
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

  it('should switch between single and multi facility views when type of eye care changes', async () => {
    const siteIds = ['983'];
    mockDirectBookingEligibilityCriteria(siteIds, []);
    mockRequestEligibilityCriteria(siteIds, [
      getRequestEligibilityCriteriaMock({ id: '983', typeOfCareId: '408' }),
      getRequestEligibilityCriteriaMock({ id: '983GC', typeOfCareId: '407' }),
      getRequestEligibilityCriteriaMock({ id: '983GD', typeOfCareId: '407' }),
    ]);
    mockFacilitiesFetch('vha_442,vha_442GC,vha_442GD', [
      getVAFacilityMock({ id: '442', name: 'Facility 1' }),
      getVAFacilityMock({ id: '442GC', name: 'Facility 2' }),
      getVAFacilityMock({ id: '442GD', name: 'Facility 3' }),
    ]);
    mockEligibilityFetches({
      siteId: '983',
      facilityId: '983',
      typeOfCareId: '408',
      limit: true,
      requestPastVisits: true,
    });

    const store = createTestStore(initialState);
    await setTypeOfCare(store, /eye care/i);
    await setTypeOfEyeCare(store, /optometry/i);

    let screen = renderWithStoreAndRouter(<VAFacilityPage />, {
      store,
    });

    await screen.findByText(
      /We found one VA facility for your optometry appointment./i,
    );

    expect(screen.baseElement).to.contain.text('Facility 1');

    await cleanup();
    await setTypeOfEyeCare(store, /Ophthalmology/i);
    screen = renderWithStoreAndRouter(<VAFacilityPage />, {
      store,
    });

    expect(await screen.findByRole('radio', { name: /Facility 2/i }));
    expect(screen.getByRole('radio', { name: /Facility 3/i }));
  });
});
