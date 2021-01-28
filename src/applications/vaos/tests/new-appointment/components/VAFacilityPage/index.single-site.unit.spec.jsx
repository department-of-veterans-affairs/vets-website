import React from 'react';
import { expect } from 'chai';
import { Route } from 'react-router-dom';

import { mockFetch, resetFetch } from 'platform/testing/unit/helpers';
import set from 'platform/utilities/data/set';

import { fireEvent, waitFor } from '@testing-library/dom';
import { cleanup } from '@testing-library/react';
import VAFacilityPage from '../../../../new-appointment/components/VAFacilityPage';
import {
  getParentSiteMock,
  getFacilityMock,
  getVAFacilityMock,
  getClinicMock,
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
  mockSupportedFacilities,
  mockFacilityFetch,
} from '../../../mocks/helpers';

const initialState = {
  featureToggles: {
    vaOnlineSchedulingVSPAppointmentNew: false,
    vaOnlineSchedulingDirect: true,
    // eslint-disable-next-line camelcase
    show_new_schedule_view_appointments_page: true,
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

describe('VAOS integration: VA facility page with a single-site user', () => {
  beforeEach(() => mockFetch());
  afterEach(() => resetFetch());

  it('should show form with single required facility question', async () => {
    mockParentSites(['983'], [parentSite983]);
    const facilities = [
      {
        id: '983',
        attributes: {
          ...getFacilityMock().attributes,
          institutionCode: '983',
          city: 'Bozeman',
          stateAbbrev: 'MT',
          authoritativeName: 'Bozeman VA medical center',
          rootStationCode: '983',
          parentStationCode: '983',
          requestSupported: true,
        },
      },
      {
        id: '983GC',
        attributes: {
          ...getFacilityMock().attributes,
          institutionCode: '983GC',
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
    mockEligibilityFetches({
      siteId: '983',
      facilityId: '983',
      typeOfCareId: '323',
    });
    const store = createTestStore(initialState);
    await setTypeOfCare(store, /primary care/i);

    const screen = renderWithStoreAndRouter(<VAFacilityPage />, {
      store,
    });

    await screen.findByText(
      /appointments are available at the following locations/i,
    );

    expect(global.document.title).to.equal(
      'Choose a VA location for your appointment | Veterans Affairs',
    );
    expect(screen.baseElement).to.contain.text(
      'Choose a VA location for your appointment',
    );
    expect(screen.baseElement).to.contain.text(
      'Bozeman VA medical center (Bozeman, MT)',
    );

    fireEvent.click(screen.getByText(/Continue/));

    expect(await screen.findByRole('alert')).to.contain.text(
      'Please provide a response',
    );
  });

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

    const { findByText, baseElement, history } = renderWithStoreAndRouter(
      <Route component={VAFacilityPage} />,
      {
        store,
      },
    );

    await findByText(
      /We found one facility that accepts online scheduling for this care/i,
    );

    expect(baseElement).to.contain.text('Belgrade VA clinic');
    expect(baseElement).to.contain.text('Belgrade, MT');

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

    await screen.findByText(
      /The facility we found doesn’t accept online scheduling for this care/i,
    );

    expect(screen.baseElement).to.contain.text(
      'Not all VA facilities offer online scheduling for all types of care',
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

    await screen.findByText(
      /There are no primary care appointments at this location/,
    );
    expect(screen.getByText(/facility locator/i)).to.have.attribute(
      'href',
      '/find-locations/facility/vha_442GC',
    );

    expect(await screen.findByText(/Continue/)).to.have.attribute('disabled');
  });

  describe('with a single supported facility', () => {
    beforeEach(() => {
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
    });

    it('should show past visits eligibility alert', async () => {
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

      expect(screen.baseElement).to.contain.text(
        'you need to have had a mental health appointment at this facility within the last 12 months',
      );

      expect(await screen.findByText(/Continue/)).to.have.attribute('disabled');
    });

    it('should show request limits eligibility alert', async () => {
      mockEligibilityFetches({
        siteId: '983',
        facilityId: '983',
        typeOfCareId: '502',
        requestPastVisits: true,
      });
      const store = createTestStore(initialState);
      await setTypeOfCare(store, /mental health/i);

      const screen = renderWithStoreAndRouter(<VAFacilityPage />, {
        store,
      });

      await screen.findByText(/Bozeman VA medical center/i);

      expect(screen.baseElement).to.contain.text(
        'you need to schedule or cancel your open appointment requests at this facility',
      );

      expect(await screen.findByText(/Continue/)).to.have.attribute('disabled');
    });

    it('should show error message on eligibility failure', async () => {
      const store = createTestStore(initialState);
      await setTypeOfCare(store, /mental health/i);

      const screen = renderWithStoreAndRouter(<VAFacilityPage />, {
        store,
      });

      expect(await screen.findByText(/Something went wrong on our end/)).to
        .exist;

      expect(await screen.findByText(/Continue/)).to.have.attribute('disabled');
    });
  });
  describe('with multiple supported facilities', () => {
    beforeEach(() => {
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
        {
          id: '983GC',
          attributes: {
            ...getFacilityMock().attributes,
            authoritativeName: 'Belgrade VA medical center',
            institutionCode: '983GC',
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
    });

    it('should show past visits eligibility alert', async () => {
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

      fireEvent.click(
        await screen.findByLabelText(/Bozeman VA medical center/i),
      );

      await screen.findByText(
        /We couldn’t find a recent appointment at this location/i,
      );

      expect(await screen.findByText(/Continue/)).to.have.attribute('disabled');
    });

    it('should show request limit eligibility alert', async () => {
      mockEligibilityFetches({
        siteId: '983',
        facilityId: '983',
        typeOfCareId: '502',
        requestPastVisits: true,
      });
      const store = createTestStore(initialState);
      await setTypeOfCare(store, /mental health/i);

      const screen = renderWithStoreAndRouter(<VAFacilityPage />, {
        store,
      });

      fireEvent.click(
        await screen.findByLabelText(/Bozeman VA medical center/i),
      );

      await screen.findByText(
        /You’ve reached the limit for appointment requests at this location/i,
      );

      expect(await screen.findByText(/Continue/)).to.have.attribute('disabled');
    });

    it('should fetch new eligibility info when switching facilities', async () => {
      mockEligibilityFetches({
        siteId: '983',
        facilityId: '983',
        typeOfCareId: '502',
        limit: true,
      });
      mockEligibilityFetches({
        siteId: '983',
        facilityId: '983GC',
        typeOfCareId: '502',
        requestPastVisits: true,
      });
      const store = createTestStore(initialState);
      await setTypeOfCare(store, /mental health/i);

      const screen = renderWithStoreAndRouter(<VAFacilityPage />, {
        store,
      });

      fireEvent.click(
        await screen.findByLabelText(/Bozeman VA medical center/i),
      );

      await screen.findByText(
        /We couldn’t find a recent appointment at this location/i,
      );
      expect(await screen.findByText(/Continue/)).to.have.attribute('disabled');

      fireEvent.click(
        await screen.findByLabelText(/Belgrade VA medical center/i),
      );

      await screen.findByText(
        /You’ve reached the limit for appointment requests at this location/i,
      );
      expect(await screen.findByText(/Continue/)).to.have.attribute('disabled');
    });

    it('should save facility choice when returning to page', async () => {
      mockEligibilityFetches({
        siteId: '983',
        facilityId: '983',
        typeOfCareId: '502',
        limit: true,
      });
      const store = createTestStore(initialState);
      await setTypeOfCare(store, /mental health/i);

      let screen = renderWithStoreAndRouter(<VAFacilityPage />, {
        store,
      });

      fireEvent.click(
        await screen.findByLabelText(/Bozeman VA medical center/i),
      );

      await cleanup();

      screen = renderWithStoreAndRouter(<Route component={VAFacilityPage} />, {
        store,
      });

      expect(
        await screen.findByText(
          /We couldn’t find a recent appointment at this location/i,
        ),
      ).to.exist;
      expect(
        screen.getByLabelText(/Bozeman VA medical center/i),
      ).to.have.attribute('checked');
    });

    it('should show request limit eligibility alert', async () => {
      mockEligibilityFetches({
        siteId: '983',
        facilityId: '983',
        typeOfCareId: '502',
        requestPastVisits: true,
      });
      const store = createTestStore(initialState);
      await setTypeOfCare(store, /mental health/i);

      const screen = renderWithStoreAndRouter(<VAFacilityPage />, {
        store,
      });

      fireEvent.click(
        await screen.findByLabelText(/Bozeman VA medical center/i),
      );

      await screen.findByText(
        /You’ve reached the limit for appointment requests at this location/i,
      );

      expect(await screen.findByText(/Continue/)).to.have.attribute('disabled');
    });

    it('should show an error on eligibility request failure', async () => {
      const store = createTestStore(initialState);
      await setTypeOfCare(store, /mental health/i);

      const screen = renderWithStoreAndRouter(<VAFacilityPage />, {
        store,
      });

      fireEvent.click(
        await screen.findByLabelText(/Bozeman VA medical center/i),
      );
      await screen.findByText(/something went wrong/i);
      expect(screen.queryByText(/Continue/)).to.have.attribute('disabled');
    });
  });

  it('should start direct schedule flow when eligible', async () => {
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
    const clinics = [
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
    ];
    mockEligibilityFetches({
      siteId: '983',
      facilityId: '983GC',
      typeOfCareId: '323',
      clinics,
      pastClinics: true,
    });
    const store = createTestStore(initialState);
    await setTypeOfCare(store, /primary care/i);

    const screen = renderWithStoreAndRouter(
      <Route component={VAFacilityPage} />,
      {
        store,
      },
    );

    await waitFor(() =>
      expect(screen.getByText(/Continue/)).not.to.have.attribute('disabled'),
    );
    fireEvent.click(screen.getByText(/Continue/));
    await waitFor(() =>
      expect(screen.history.push.firstCall.args[0]).to.equal(
        '/new-appointment/clinics',
      ),
    );
  });

  it('should start request flow when not direct schedule eligible', async () => {
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
          directSchedulingSupported: true,
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

    const screen = renderWithStoreAndRouter(
      <Route component={VAFacilityPage} />,
      {
        store,
      },
    );

    await waitFor(() =>
      expect(screen.getByText(/Continue/)).not.to.have.attribute('disabled'),
    );
    fireEvent.click(screen.getByText(/Continue/));
    await waitFor(() =>
      expect(screen.history.push.firstCall.args[0]).to.equal(
        '/new-appointment/request-date',
      ),
    );
  });

  it('should show an error on facility request failure', async () => {
    const store = createTestStore(initialState);
    await setTypeOfCare(store, /primary care/i);

    const screen = renderWithStoreAndRouter(<VAFacilityPage />, {
      store,
    });

    await screen.findByText(/something went wrong/i);
    expect(screen.queryByText(/Continue/)).not.to.exist;
  });

  it('should show a message when no sites are available', async () => {
    mockParentSites(['983'], []);
    const store = createTestStore(initialState);
    await setTypeOfCare(store, /primary care/i);

    const screen = renderWithStoreAndRouter(<VAFacilityPage />, {
      store,
    });

    await screen.findByText(
      /We can’t find a VA health system where you’re registered/i,
    );
    expect(screen.getByText(/Continue/)).to.have.attribute('disabled');
  });

  it('should use correct eligibility info after a split type of care is changed', async () => {
    mockParentSites(
      ['983'],
      [
        {
          id: '983',
          attributes: {
            ...getParentSiteMock().attributes,
            institutionCode: '983',
            rootStationCode: '983',
            parentStationCode: '983',
          },
        },
      ],
    );
    mockSupportedFacilities({
      siteId: '983',
      parentId: '983',
      typeOfCareId: '408',
      data: [
        {
          id: '983GC',
          attributes: {
            ...getFacilityMock().attributes,
            authoritativeName: 'Bozeman medical center',
            institutionCode: '983GC',
            rootStationCode: '983',
            parentStationCode: '983',
            requestSupported: true,
          },
        },
        {
          id: '983BC',
          attributes: {
            ...getFacilityMock().attributes,
            institutionCode: '983BC',
            rootStationCode: '983',
            parentStationCode: '983',
            requestSupported: true,
          },
        },
      ],
    });
    mockSupportedFacilities({
      siteId: '983',
      parentId: '983',
      typeOfCareId: '407',
      data: [
        {
          id: '983AZ',
          attributes: {
            ...getFacilityMock().attributes,
            authoritativeName: 'Belgrade medical center',
            institutionCode: '983AZ',
            rootStationCode: '983',
            parentStationCode: '983',
            requestSupported: true,
          },
        },
        {
          id: '983BZ',
          attributes: {
            ...getFacilityMock().attributes,
            institutionCode: '983BZ',
            rootStationCode: '983',
            parentStationCode: '983',
            requestSupported: true,
          },
        },
      ],
    });
    mockEligibilityFetches({
      siteId: '983',
      facilityId: '983GC',
      typeOfCareId: '408',
      requestPastVisits: true,
    });
    mockEligibilityFetches({
      siteId: '983',
      facilityId: '983AZ',
      typeOfCareId: '407',
      limit: true,
    });
    const store = createTestStore(initialState);
    await setTypeOfCare(store, /eye care/i);
    await setTypeOfEyeCare(store, /optometry/i);

    let screen = renderWithStoreAndRouter(<VAFacilityPage />, {
      store,
    });

    fireEvent.click(await screen.findByLabelText(/Bozeman medical center/i));
    await screen.findByText(
      /You’ve reached the limit for appointment requests at this location/i,
    );

    await cleanup();

    await setTypeOfEyeCare(store, /Ophthalmology/i);
    screen = renderWithStoreAndRouter(<VAFacilityPage />, {
      store,
    });

    fireEvent.click(await screen.findByLabelText(/Belgrade medical center/i));
    expect(
      await screen.findByText(
        /We couldn’t find a recent appointment at this location/i,
      ),
    ).to.exist;
  });

  it('should show single disabled radio button option if Cerner only', async () => {
    const parentSite = {
      id: '983',
      attributes: {
        ...getParentSiteMock().attributes,
        institutionCode: '983',
        authoritativeName: 'Some VA facility',
        rootStationCode: '983',
        parentStationCode: '983',
      },
    };
    mockParentSites(['983'], [parentSite]);

    const store = createTestStore(
      set(
        'user.profile.facilities',
        [
          {
            facilityId: '983',
            isCerner: true,
          },
        ],
        initialState,
      ),
    );
    await setTypeOfCare(store, /primary care/i);

    const screen = renderWithStoreAndRouter(
      <Route component={VAFacilityPage} />,
      {
        store,
      },
    );

    await screen.findByText(/registered at the following VA/i);
    expect(screen.getByLabelText(/some va facility/i)).to.have.attribute(
      'value',
      'var983',
    );
    expect(screen.getByLabelText(/some va facility/i)).to.have.attribute(
      'disabled',
    );

    fireEvent.click(await screen.findByText(/Go to My VA Health/));
  });
});
