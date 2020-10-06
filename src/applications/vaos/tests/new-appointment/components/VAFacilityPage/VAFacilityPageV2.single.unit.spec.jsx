import React from 'react';
import { expect } from 'chai';
import { Route } from 'react-router-dom';

import { mockFetch, resetFetch } from 'platform/testing/unit/helpers';
import { fireEvent, waitFor } from '@testing-library/dom';
import VAFacilityPage from '../../../../new-appointment/components/VAFacilityPage/VAFacilityPageV2';
import {
  getParentSiteMock,
  getClinicMock,
  getVAFacilityMock,
  getFacilityMock,
} from '../../../mocks/v0';
import {
  createTestStore,
  setTypeOfCare,
  renderWithStoreAndRouter,
} from '../../../mocks/setup';
import {
  mockEligibilityFetches,
  mockParentSites,
  mockSupportedFacilities,
  mockFacilityFetch,
} from '../../../mocks/helpers';

const initialState = {
  featureToggles: {
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

describe('VAOS integration: VA flat facility page - single facility', () => {
  beforeEach(() => {
    mockFetch();
    mockParentSites(['983'], [parentSite983]);
    const facilities = [
      {
        id: '983',
        attributes: {
          ...getFacilityMock().attributes,
          institutionCode: '983',
          authoritativeName: 'Bozeman VA medical center',
          rootStationCode: '983',
          parentStationCode: '983',
          requestSupported: true,
        },
      },
    ];
    mockSupportedFacilities({
      siteId: '983',
      parentId: '983',
      typeOfCareId: '323',
      data: facilities,
    });
  });

  afterEach(() => resetFetch());

  it('should show alert when only one facility is supported', async () => {
    const parentSite5digit = {
      id: '983GC',
      attributes: {
        ...getParentSiteMock().attributes,
        institutionCode: '983GC',
        authoritativeName: 'Some VA facility',
        rootStationCode: '983',
        parentStationCode: '983GC',
      },
    };
    mockParentSites(['983'], [parentSite5digit]);
    const facilities = [
      {
        id: '983GC',
        attributes: {
          ...getFacilityMock().attributes,
          institutionCode: '983GC',
          city: 'Belgrade',
          stateAbbrev: 'MT',
          authoritativeName: 'Belgrade VA clinic',
          rootStationCode: '983',
          parentStationCode: '983GC',
          requestSupported: true,
        },
      },
    ];
    mockSupportedFacilities({
      siteId: '983',
      parentId: '983GC',
      typeOfCareId: '323',
      data: facilities,
    });
    mockEligibilityFetches({
      siteId: '983',
      facilityId: '983GC',
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

    expect(baseElement).to.contain.text('Finding locations');
    await findByText(/we found one VA location for you/i);

    expect(baseElement).to.contain.text('Belgrade VA clinic');
    expect(baseElement).to.contain.text('Belgrade, MT');
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
    const parentSite5digit = {
      id: '983GC',
      attributes: {
        ...getParentSiteMock().attributes,
        institutionCode: '983GC',
        authoritativeName: 'Some VA facility',
        rootStationCode: '983',
        parentStationCode: '983GC',
      },
    };
    mockParentSites(['983'], [parentSite5digit]);
    const facilities = [
      {
        id: '983GC',
        attributes: {
          ...getFacilityMock().attributes,
          institutionCode: '983GC',
          rootStationCode: '983',
          parentStationCode: '983GC',
          directSchedulingSupported: true,
        },
      },
    ];
    mockSupportedFacilities({
      siteId: '983',
      parentId: '983GC',
      typeOfCareId: '323',
      data: facilities,
    });
    mockEligibilityFetches({
      siteId: '983',
      facilityId: '983GC',
      typeOfCareId: '323',
      clinics: [
        {
          id: '308',
          attributes: {
            ...getClinicMock(),
            siteCode: '983',
            clinicId: '308',
            institutionCode: '983GC',
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

    expect(screen.baseElement).to.contain.text('Finding locations');
    await screen.findByText(/we found one VA location for you/i);

    expect(screen.baseElement).to.contain.text(
      'However, this facility does not allow online requests',
    );
    expect(await screen.findByText(/Continue/)).to.have.attribute('disabled');
  });

  it('should show eligibility alert with facility info', async () => {
    const parentSite5digit = {
      id: '983GC',
      attributes: {
        ...getParentSiteMock().attributes,
        institutionCode: '983GC',
        rootStationCode: '983',
        parentStationCode: '983GC',
      },
    };
    mockParentSites(['983'], [parentSite5digit]);
    const facilities = [
      {
        id: '983GC',
        attributes: {
          ...getFacilityMock().attributes,
          institutionCode: '983GC',
          rootStationCode: '983',
          parentStationCode: '983GC',
        },
      },
    ];
    mockSupportedFacilities({
      siteId: '983',
      parentId: '983GC',
      typeOfCareId: '323',
      data: facilities,
    });
    const facility = {
      id: 'vha_442GC',
      attributes: {
        ...getVAFacilityMock().attributes,
        uniqueId: '442GC',
        name: 'Cheyenne VA Medical Center',
        address: {
          physical: {
            zip: '82001-5356',
            city: 'Cheyenne',
            state: 'WY',
            address1: '2360 East Pershing Boulevard',
          },
        },
        phone: {
          main: '307-778-7550',
        },
      },
    };
    mockFacilityFetch('vha_442GC', facility);
    const store = createTestStore(initialState);
    await setTypeOfCare(store, /primary care/i);

    const screen = renderWithStoreAndRouter(
      <Route component={VAFacilityPage} />,
      {
        store,
      },
    );

    await screen.findByText(/Cheyenne VA Medical Center/);

    expect(screen.baseElement).to.contain.text(
      'There are no primary care appointments at this location',
    );
    expect(screen.baseElement).to.contain.text('Cheyenne VA Medical Center');
    expect(screen.baseElement).to.contain.text('Cheyenne, WY 82001-5356');
    expect(screen.baseElement).to.contain.text('307-778-7550');
    expect(await screen.findByText(/directions/i)).to.have.attribute(
      'href',
      'https://maps.google.com?saddr=Current+Location&daddr=2360 East Pershing Boulevard, Cheyenne, WY 82001-5356',
    );

    expect(await screen.findByText(/Continue/)).to.have.attribute('disabled');
  });

  it('should show eligibility alert without facility info', async () => {
    const parentSite5digit = {
      id: '983GC',
      attributes: {
        ...getParentSiteMock().attributes,
        institutionCode: '983GC',
        rootStationCode: '983',
        parentStationCode: '983GC',
      },
    };
    mockParentSites(['983'], [parentSite5digit]);
    const facilities = [
      {
        id: '983GC',
        attributes: {
          ...getFacilityMock().attributes,
          institutionCode: '983GC',
          rootStationCode: '983',
          parentStationCode: '983GC',
        },
      },
    ];
    mockSupportedFacilities({
      siteId: '983',
      parentId: '983GC',
      typeOfCareId: '323',
      data: facilities,
    });
    const store = createTestStore(initialState);
    await setTypeOfCare(store, /primary care/i);

    const screen = renderWithStoreAndRouter(<VAFacilityPage />, {
      store,
    });

    expect(screen.baseElement).to.contain.text('Finding locations');
    await screen.findByText(
      /There are no primary care appointments at this location/,
    );
    expect(screen.getByText(/facility locator/i)).to.have.attribute(
      'href',
      '/find-locations/facility/vha_442GC',
    );

    expect(await screen.findByText(/Continue/)).to.have.attribute('disabled');
  });

  it('should show past visits eligibility alert', async () => {
    mockParentSites(['983'], [parentSite983]);
    const facilities = [
      {
        id: '983',
        attributes: {
          ...getFacilityMock().attributes,
          institutionCode: '983',
          authoritativeName: 'Bozeman VA medical center',
          rootStationCode: '983',
          parentStationCode: '983',
          requestSupported: true,
        },
      },
    ];
    mockSupportedFacilities({
      siteId: '983',
      parentId: '983',
      typeOfCareId: '502',
      data: facilities,
    });
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

    await screen.findByText(/Bozeman VA medical center/i);
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

    await screen.findByText(/Bozeman VA medical center/i);

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
