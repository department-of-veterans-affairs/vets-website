import React from 'react';
import { expect } from 'chai';
import { Route } from 'react-router-dom';

import { mockFetch, resetFetch } from 'platform/testing/unit/helpers';

import { fireEvent, waitFor } from '@testing-library/dom';
import { cleanup } from '@testing-library/react';
import VAFacilityPage from '../../../../new-appointment/components/VAFacilityPage';
import {
  getParentSiteMock,
  getFacilityMock,
  getVAFacilityMock,
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
    // eslint-disable-next-line camelcase
    show_new_schedule_view_appointments_page: true,
  },
  user: {
    profile: {
      facilities: [
        { facilityId: '983', isCerner: true },
        { facilityId: '984', isCerner: false },
      ],
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
const parentSite984 = {
  id: '984',
  attributes: {
    ...getParentSiteMock().attributes,
    institutionCode: '984',
    authoritativeName: 'Some other VA facility',
    rootStationCode: '984',
    parentStationCode: '984',
  },
};

describe('VAOS integration: VA facility page with a multi-site user', () => {
  beforeEach(() => mockFetch());
  afterEach(() => resetFetch());

  it('should show form with required questions for both sites and facilities', async () => {
    mockParentSites(['983', '984'], [parentSite983, parentSite984]);
    const facility = {
      id: '984',
      attributes: {
        ...getFacilityMock().attributes,
        institutionCode: '984',
        city: 'Bozeman',
        stateAbbrev: 'MT',
        authoritativeName: 'Bozeman VA medical center',
        rootStationCode: '984',
        parentStationCode: '984',
        requestSupported: true,
      },
    };
    mockSupportedFacilities({
      siteId: '984',
      parentId: '984',
      typeOfCareId: '323',
      data: [facility],
    });
    const store = createTestStore(initialState);
    await setTypeOfCare(store, /primary care/i);

    const screen = renderWithStoreAndRouter(<VAFacilityPage />, {
      store,
    });

    await screen.findByText(/registered at the following VA/i);
    expect(screen.getByLabelText(/some other va facility/i)).to.have.attribute(
      'value',
      '984',
    );
    expect(screen.getByLabelText(/some va facility/i)).to.have.attribute(
      'value',
      '983',
    );

    fireEvent.click(screen.getByText(/Continue/));
    expect(await screen.findByRole('alert')).to.contain.text(
      'Please provide a response',
    );

    fireEvent.click(screen.getByLabelText(/some other va facility/i));
    expect(screen.baseElement).to.contain.text('Finding locations');
    await screen.findByText(
      /appointments are available at the following locations/i,
    );
    expect(screen.baseElement).to.contain.text(
      'Bozeman VA medical center (Bozeman, MT)',
    );

    fireEvent.click(screen.getByText(/Continue/));
    expect(await screen.findByRole('alert')).to.contain.text(
      'Please provide a response',
    );
  });

  it('should show message and disable Cerner site', async () => {
    const parentSite668 = {
      id: '668',
      attributes: {
        ...getParentSiteMock().attributes,
        institutionCode: '668',
        authoritativeName: 'Cerner facility',
        rootStationCode: '668',
        parentStationCode: '668',
      },
    };
    mockParentSites(['983', '668'], [parentSite983, parentSite668]);
    const store = createTestStore({
      ...initialState,
      user: {
        profile: {
          facilities: [
            { facilityId: '983', isCerner: false },
            { facilityId: '668', isCerner: true },
          ],
        },
      },
    });

    await setTypeOfCare(store, /primary care/i);

    const { findByText, getByLabelText, getByText } = renderWithStoreAndRouter(
      <VAFacilityPage />,
      {
        store,
      },
    );

    await findByText(/registered at the following VA/i);
    expect(getByLabelText(/some va facility/i)).to.have.attribute(
      'value',
      '983',
    );

    expect(getByLabelText(/cerner facility/i)).to.have.attribute(
      'value',
      '668',
    );
    expect(getByLabelText(/cerner facility/i)).to.have.attribute('disabled');

    expect(getByText('My VA Health')).to.have.tagName('a');
  });

  it('should display previous user choices when returning to page', async () => {
    mockParentSites(['983', '984'], [parentSite983, parentSite984]);
    mockSupportedFacilities({
      siteId: '984',
      parentId: '984',
      typeOfCareId: '323',
      data: [
        {
          id: '984',
          attributes: {
            ...getFacilityMock().attributes,
            institutionCode: '984',
            authoritativeName: 'Bozeman VA medical center',
            rootStationCode: '984',
            parentStationCode: '984',
            requestSupported: true,
          },
        },
      ],
    });
    mockEligibilityFetches({
      siteId: '984',
      facilityId: '984',
      typeOfCareId: '323',
    });
    const store = createTestStore(initialState);
    await setTypeOfCare(store, /primary care/i);

    let screen = renderWithStoreAndRouter(<VAFacilityPage />, {
      store,
    });

    await screen.findByText(/registered at the following VA/i);

    fireEvent.click(screen.getByLabelText(/some other va facility/i));
    await screen.findByText(
      /appointments are available at the following locations/i,
    );

    fireEvent.click(await screen.findByLabelText(/Bozeman VA medical center/i));

    await cleanup();

    screen = renderWithStoreAndRouter(<VAFacilityPage />, {
      store,
    });

    expect(
      await screen.findByLabelText(/Bozeman VA medical center/i),
    ).to.have.attribute('checked');
  });

  it('should maintain facilities state and use correct list when changing parent sites', async () => {
    mockParentSites(['983', '984'], [parentSite983, parentSite984]);
    mockSupportedFacilities({
      siteId: '984',
      parentId: '984',
      typeOfCareId: '323',
      data: [
        {
          id: '984',
          attributes: {
            ...getFacilityMock().attributes,
            institutionCode: '984',
            authoritativeName: 'Bozeman VA medical center',
            rootStationCode: '984',
            parentStationCode: '984',
            requestSupported: true,
          },
        },
      ],
    });
    mockSupportedFacilities({
      siteId: '983',
      parentId: '983',
      typeOfCareId: '323',
      data: [
        {
          id: '983',
          attributes: {
            ...getFacilityMock().attributes,
            institutionCode: '983',
            authoritativeName: 'Belgrade VA medical center',
            rootStationCode: '983',
            parentStationCode: '983',
            requestSupported: true,
          },
        },
      ],
    });
    const store = createTestStore(initialState);
    await setTypeOfCare(store, /primary care/i);

    const screen = renderWithStoreAndRouter(<VAFacilityPage />, {
      store,
    });

    await screen.findByText(/registered at the following VA/i);

    fireEvent.click(screen.getByLabelText(/some other va facility/i));
    await screen.findByLabelText(/Bozeman VA medical center/i);
    expect(screen.queryByLabelText(/Belgrade VA medical center/i)).not.to.exist;

    fireEvent.click(screen.getByLabelText(/some va facility/i));
    await screen.findByLabelText(/Belgrade VA medical center/i);
    expect(screen.queryByLabelText(/Bozeman VA medical center/i)).not.to.exist;

    // we want to make sure we're not matching a new fetch and are reusing the
    // existing facilities list, capture that count and change back to original
    // site choice
    const vaosCalls = global.fetch
      .getCalls()
      .filter(c => c.args[0].includes('/vaos')).length;

    fireEvent.click(screen.getByLabelText(/some other va facility/i));
    await screen.findByLabelText(/Bozeman VA medical center/i);
    expect(screen.queryByLabelText(/Belgrade VA medical center/i)).not.to.exist;

    expect(vaosCalls).to.equal(
      global.fetch.getCalls().filter(c => c.args[0].includes('/vaos')).length,
    );
  });

  it('should show unsupported facilities alert', async () => {
    mockParentSites(['983', '984'], [parentSite983, parentSite984]);
    mockSupportedFacilities({
      siteId: '984',
      parentId: '984',
      typeOfCareId: '323',
      data: [
        {
          id: '984',
          attributes: {
            ...getFacilityMock().attributes,
            institutionCode: '984',
            rootStationCode: '984',
            parentStationCode: '984',
          },
        },
      ],
    });
    const store = createTestStore(initialState);
    await setTypeOfCare(store, /primary care/i);

    const screen = renderWithStoreAndRouter(<VAFacilityPage />, {
      store,
    });

    await screen.findByText(/registered at the following VA/i);

    fireEvent.click(screen.getByLabelText(/some other va facility/i));

    expect(
      await screen.findByText(
        /there are no primary care appointments at this location/i,
      ),
    ).to.exist;
    expect(screen.getByText('our facility locator tool')).to.have.attribute(
      'href',
      '/find-locations/facility/vha_552',
    );
  });

  it('should show unsupported facilities alert with facility details', async () => {
    mockParentSites(['983', '984'], [parentSite983, parentSite984]);
    mockSupportedFacilities({
      siteId: '984',
      parentId: '984',
      typeOfCareId: '323',
      data: [
        {
          id: '984',
          attributes: {
            ...getFacilityMock().attributes,
            institutionCode: '984',
            rootStationCode: '984',
            parentStationCode: '984',
          },
        },
      ],
    });
    mockFacilityFetch('vha_552', {
      id: 'vha_552',
      attributes: {
        ...getVAFacilityMock().attributes,
        uniqueId: '552',
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
    });
    const store = createTestStore(initialState);
    await setTypeOfCare(store, /primary care/i);

    const screen = renderWithStoreAndRouter(<VAFacilityPage />, {
      store,
    });

    await screen.findByText(/registered at the following VA/i);

    fireEvent.click(screen.getByLabelText(/some other va facility/i));

    expect(
      await screen.findByText(
        /there are no primary care appointments at this location/i,
      ),
    ).to.exist;

    expect(await screen.findByText(/directions/i)).to.have.attribute(
      'href',
      'https://maps.google.com?saddr=Current+Location&daddr=2360 East Pershing Boulevard, Cheyenne, WY 82001-5356',
    );
    expect(screen.baseElement).to.contain.text('Cheyenne VA Medical Center');
    expect(screen.baseElement).to.contain.text('Cheyenne, WY 82001-5356');
    expect(screen.baseElement).to.contain.text('307-778-7550');
  });

  it('should show not supported message when direct is supported and not eligible, and requests are not supported', async () => {
    mockParentSites(['983', '984'], [parentSite983, parentSite984]);
    mockSupportedFacilities({
      siteId: '984',
      parentId: '984',
      typeOfCareId: '323',
      data: [
        {
          id: '984',
          attributes: {
            ...getFacilityMock().attributes,
            institutionCode: '984',
            authoritativeName: 'Bozeman VA medical center',
            rootStationCode: '984',
            parentStationCode: '984',
            directSchedulingSupported: true,
          },
        },
      ],
    });
    mockEligibilityFetches({
      siteId: '984',
      facilityId: '984',
      typeOfCareId: '323',
    });
    const store = createTestStore(initialState);
    await setTypeOfCare(store, /primary care/i);

    const screen = renderWithStoreAndRouter(<VAFacilityPage />, {
      store,
    });

    await screen.findByText(/registered at the following VA/i);

    fireEvent.click(screen.getByLabelText(/some other va facility/i));

    fireEvent.click(await screen.findByLabelText(/Bozeman VA medical center/i));
    await screen.findByText(
      /This facility does not allow scheduling requests/i,
    );

    expect(screen.getByText(/Continue/)).to.have.attribute('disabled');
  });

  it('should display an error message when eligibility calls fail', async () => {
    mockParentSites(['983', '984'], [parentSite983, parentSite984]);
    const facility = {
      id: '984',
      attributes: {
        ...getFacilityMock().attributes,
        institutionCode: '984',
        authoritativeName: 'Bozeman VA medical center',
        rootStationCode: '984',
        parentStationCode: '984',
        requestSupported: true,
      },
    };
    mockSupportedFacilities({
      siteId: '984',
      parentId: '984',
      typeOfCareId: '323',
      data: [facility],
    });
    const store = createTestStore(initialState);
    await setTypeOfCare(store, /primary care/i);

    const screen = renderWithStoreAndRouter(<VAFacilityPage />, {
      store,
    });

    await screen.findByText(/registered at the following VA/i);

    fireEvent.click(screen.getByLabelText(/some other va facility/i));
    await screen.findByText(
      /appointments are available at the following locations/i,
    );
    fireEvent.click(await screen.findByLabelText(/Bozeman VA medical center/i));

    expect(await screen.findByText(/something went wrong on our end/i)).to
      .exist;
  });

  it('should display an error message when facilities call fails', async () => {
    mockParentSites(['983', '984'], [parentSite983, parentSite984]);
    const store = createTestStore(initialState);
    await setTypeOfCare(store, /primary care/i);

    const screen = renderWithStoreAndRouter(<VAFacilityPage />, {
      store,
    });

    await screen.findByText(/registered at the following VA/i);

    fireEvent.click(screen.getByLabelText(/some other va facility/i));

    expect(await screen.findByText(/something went wrong on our end/i)).to
      .exist;
  });

  it('should show request limit alert', async () => {
    mockParentSites(['983', '984'], [parentSite983, parentSite984]);

    mockSupportedFacilities({
      siteId: '984',
      parentId: '984',
      typeOfCareId: '323',
      data: [
        {
          id: '984',
          attributes: {
            ...getFacilityMock().attributes,
            institutionCode: '984',
            authoritativeName: 'Bozeman VA medical center',
            rootStationCode: '984',
            parentStationCode: '984',
            requestSupported: true,
          },
        },
      ],
    });
    mockEligibilityFetches({
      siteId: '984',
      facilityId: '984',
      typeOfCareId: '323',
    });
    const store = createTestStore(initialState);
    await setTypeOfCare(store, /primary care/i);

    const screen = renderWithStoreAndRouter(<VAFacilityPage />, {
      store,
    });

    await screen.findByText(/registered at the following VA/i);

    fireEvent.click(screen.getByLabelText(/some other va facility/i));
    await screen.findByText(
      /appointments are available at the following locations/i,
    );

    fireEvent.click(await screen.findByLabelText(/Bozeman VA medical center/i));

    await screen.findByText(
      /You’ve reached the limit for appointment requests at this location/i,
    );
    expect(screen.getByText(/Continue/)).to.have.attribute('disabled');
  });

  it('should show request limit alert with facility info', async () => {
    mockParentSites(['983', '984'], [parentSite983, parentSite984]);

    mockSupportedFacilities({
      siteId: '984',
      parentId: '984',
      typeOfCareId: '323',
      data: [
        {
          id: '984',
          attributes: {
            ...getFacilityMock().attributes,
            institutionCode: '984',
            authoritativeName: 'Cheyenne VA Medical Center',
            rootStationCode: '984',
            parentStationCode: '984',
            requestSupported: true,
          },
        },
      ],
    });
    mockEligibilityFetches({
      siteId: '984',
      facilityId: '984',
      typeOfCareId: '323',
    });
    mockFacilityFetch('vha_552', {
      id: 'vha_552',
      attributes: {
        ...getVAFacilityMock().attributes,
        uniqueId: '552',
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
    });
    const store = createTestStore(initialState);
    await setTypeOfCare(store, /primary care/i);

    const screen = renderWithStoreAndRouter(<VAFacilityPage />, {
      store,
    });

    await screen.findByText(/registered at the following VA/i);

    fireEvent.click(screen.getByLabelText(/some other va facility/i));
    await screen.findByText(
      /appointments are available at the following locations/i,
    );

    fireEvent.click(
      await screen.findByLabelText(/Cheyenne VA medical center/i),
    );

    await screen.findByText(
      /You’ve reached the limit for appointment requests at this location/i,
    );

    await screen.findByText(/Cheyenne,/i);
    expect(screen.baseElement).to.contain.text('Cheyenne VA Medical Center');
    expect(screen.baseElement).to.contain.text('Cheyenne, WY 82001-5356');
    expect(screen.baseElement).to.contain.text('307-778-7550');

    expect(screen.getByText(/Continue/)).to.have.attribute('disabled');
  });

  it('should continue to request flow when eligible', async () => {
    // Sometimes we get 5 digit parents, make sure those work correctly
    const parentSite984GC = {
      id: '984GC',
      attributes: {
        ...getParentSiteMock().attributes,
        institutionCode: '984GC',
        authoritativeName: 'Some other VA facility',
        rootStationCode: '984',
        parentStationCode: '984GC',
      },
    };
    mockParentSites(['983', '984'], [parentSite983, parentSite984GC]);

    mockSupportedFacilities({
      siteId: '984',
      parentId: '984GC',
      typeOfCareId: '323',
      data: [
        {
          id: '984GC',
          attributes: {
            ...getFacilityMock().attributes,
            institutionCode: '984GC',
            authoritativeName: 'Bozeman VA medical center',
            rootStationCode: '984',
            parentStationCode: '984GC',
            requestSupported: true,
          },
        },
      ],
    });
    mockEligibilityFetches({
      siteId: '984',
      facilityId: '984GC',
      typeOfCareId: '323',
      limit: true,
    });
    const store = createTestStore(initialState);
    await setTypeOfCare(store, /primary care/i);

    const screen = renderWithStoreAndRouter(
      <Route component={VAFacilityPage} />,
      {
        store,
      },
    );

    await screen.findByText(/registered at the following VA/i);

    fireEvent.click(screen.getByLabelText(/some other va facility/i));
    await screen.findByText(
      /appointments are available at the following locations/i,
    );

    fireEvent.click(await screen.findByLabelText(/Bozeman VA medical center/i));

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
});
