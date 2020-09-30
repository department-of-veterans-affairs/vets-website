import React from 'react';
import { expect } from 'chai';

import { mockFetch, resetFetch } from 'platform/testing/unit/helpers';
import { fireEvent } from '@testing-library/dom';
import { cleanup } from '@testing-library/react';
import VAFacilityPage from '../../new-appointment/components/VAFacilityPage/VAFacilityPageV2';
import {
  getParentSiteMock,
  getFacilityMock,
  getVAFacilityMock,
} from '../mocks/v0';
import {
  createTestStore,
  setTypeOfCare,
  renderWithStoreAndRouter,
} from '../mocks/setup';
import {
  mockEligibilityFetches,
  mockParentSites,
  mockSupportedFacilities,
  mockFacilityFetch,
} from '../mocks/helpers';

const initialState = {
  featureToggles: {
    vaOnlineSchedulingVSPAppointmentNew: false,
    vaOnlineSchedulingDirect: true,
    vaOnlineSchedulingFlatFacilityPage: true,
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
    authoritativeName: 'Some VA facility 2',
    rootStationCode: '984',
    parentStationCode: '984',
  },
};

const parentSiteIds = ['983', '984'];

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
      authoritativeName: 'San Diego VA medical center',
      city: 'San Diego',
      stateAbbrev: 'CA',
      rootStationCode: '983',
      parentStationCode: '983',
      requestSupported: true,
    },
  },
  {
    id: '983GD',
    attributes: {
      ...getFacilityMock().attributes,
      institutionCode: '983GD',
      authoritativeName: 'San Diego VA medical center 2',
      city: 'San Diego',
      stateAbbrev: 'CA',
      rootStationCode: '983',
      parentStationCode: '983',
      requestSupported: true,
    },
  },
  {
    id: '983GE',
    attributes: {
      ...getFacilityMock().attributes,
      institutionCode: '983GE',
      authoritativeName: 'San Diego VA medical center 3',
      city: 'San Diego',
      stateAbbrev: 'CA',
      rootStationCode: '983',
      parentStationCode: '983',
      requestSupported: true,
    },
  },
  {
    id: '984GF',
    attributes: {
      ...getFacilityMock().attributes,
      institutionCode: '984GF',
      authoritativeName: 'San Diego VA medical center 4',
      city: 'San Diego',
      stateAbbrev: 'CA',
      rootStationCode: '984',
      parentStationCode: '984',
      requestSupported: true,
    },
  },
  {
    id: '984GG',
    attributes: {
      ...getFacilityMock().attributes,
      institutionCode: '984GG',
      authoritativeName: 'San Diego VA medical center 5',
      city: 'San Diego',
      stateAbbrev: 'CA',
      rootStationCode: '984',
      parentStationCode: '984',
      requestSupported: true,
    },
  },
];

describe('VAOS integration: VA flat facility page - multiple facilities', () => {
  beforeEach(() => mockFetch());
  afterEach(() => resetFetch());

  it('should display list of facilities with show more button', async () => {
    mockParentSites(parentSiteIds, [parentSite983, parentSite984]);

    parentSiteIds.forEach(id => {
      mockSupportedFacilities({
        siteId: id,
        parentId: id,
        typeOfCareId: '323',
        data: facilities.filter(f => f.attributes.parentStationCode === id),
      });
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

    expect(global.document.title).to.equal(
      'Choose a VA location for your appointment | Veterans Affairs',
    );

    await screen.findByText(
      /Choose a VA location for your Primary care appointment/i,
    );

    expect(screen.baseElement).to.contain.text(
      'Below is a list of VA locations where you’re registered that offer Primary care appointments',
    );

    // Should contain radio buttons
    facilities.slice(0, 5).forEach(f => {
      expect(screen.baseElement).to.contain.text(
        f.attributes.authoritativeName,
      );
    });

    // Should not show 6th facility
    expect(screen.baseElement).not.to.contain.text(
      'San Diego VA medical center 5',
    );

    // Find show more button and fire click event
    const moreLocationsBtn = screen.getByText('+ 1 more location');
    expect(moreLocationsBtn).to.have.tagName('span');
    fireEvent.click(moreLocationsBtn);

    // Should show 6th facility
    expect(screen.baseElement).to.contain.text('San Diego VA medical center 5');

    // Should validation message if no facility selected
    fireEvent.click(screen.getByText(/Continue/));
    expect(await screen.findByRole('alert')).to.contain.text(
      'Please provide a response',
    );
  });

  it('should display previous user choices when returning to page', async () => {
    mockParentSites(['984'], [parentSite984]);
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
        {
          id: '984GC',
          attributes: {
            ...getFacilityMock().attributes,
            institutionCode: '984GC',
            authoritativeName: 'San Diego VA medical center',
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
    const store = createTestStore({
      ...initialState,
      user: {
        profile: {
          facilities: [{ facilityId: '984', isCerner: false }],
        },
      },
    });
    await setTypeOfCare(store, /primary care/i);

    let screen = renderWithStoreAndRouter(<VAFacilityPage />, {
      store,
    });

    await screen.findByText(/below is a list of VA locations/i);

    fireEvent.click(await screen.findByLabelText(/Bozeman VA medical center/i));

    await cleanup();

    screen = renderWithStoreAndRouter(<VAFacilityPage />, {
      store,
    });

    expect(
      screen.getByLabelText(/Bozeman VA medical center/i),
    ).to.have.attribute('checked');
  });

  it('should show unsupported facilities alert with facility locator tool link', async () => {
    mockParentSites(['983', '984'], [parentSite983, parentSite984]);
    mockSupportedFacilities({
      siteId: '983',
      parentId: '983',
      typeOfCareId: '323',
      data: [],
    });
    mockSupportedFacilities({
      siteId: '984',
      parentId: '984',
      typeOfCareId: '323',
      data: [],
    });

    const store = createTestStore(initialState);
    await setTypeOfCare(store, /primary care/i);

    const screen = renderWithStoreAndRouter(<VAFacilityPage />, {
      store,
    });

    expect(
      await screen.findByText(
        /there are no primary care appointments at this location/i,
      ),
    ).to.exist;
    expect(screen.getByText('our facility locator tool')).to.have.attribute(
      'href',
      '/find-locations/facility/vha_442',
    );
  });

  it('should show unsupported facilities alert with facility details', async () => {
    mockParentSites(['983', '984'], [parentSite983, parentSite984]);
    mockSupportedFacilities({
      siteId: '983',
      parentId: '983',
      typeOfCareId: '323',
      data: [],
    });
    mockSupportedFacilities({
      siteId: '984',
      parentId: '984',
      typeOfCareId: '323',
      data: [],
    });
    mockFacilityFetch('vha_442', {
      id: 'vha_442',
      attributes: {
        ...getVAFacilityMock().attributes,
        uniqueId: '442',
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
        {
          id: '984GC',
          attributes: {
            ...getFacilityMock().attributes,
            institutionCode: '984GC',
            authoritativeName: 'San Diego VA medical center',
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
      data: [],
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

    await screen.findByText(/below is a list of VA locations/i);

    fireEvent.click(await screen.findByLabelText(/Bozeman VA medical center/i));
    fireEvent.click(screen.getByText(/Continue/));
    await screen.findByText(
      /This facility does not allow scheduling requests/i,
    );
  });

  it('should display an error message when eligibility calls fail', async () => {
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
        {
          id: '984GC',
          attributes: {
            ...getFacilityMock().attributes,
            institutionCode: '984GC',
            authoritativeName: 'San Diego VA medical center',
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
      data: [],
    });
    const store = createTestStore(initialState);
    await setTypeOfCare(store, /primary care/i);

    const screen = renderWithStoreAndRouter(<VAFacilityPage />, {
      store,
    });

    fireEvent.click(await screen.findByLabelText(/Bozeman VA medical center/i));
    fireEvent.click(screen.getByText(/Continue/));
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
        {
          id: '984GC',
          attributes: {
            ...getFacilityMock().attributes,
            institutionCode: '984GC',
            authoritativeName: 'San Diego VA medical center',
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
      data: [],
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

    fireEvent.click(await screen.findByLabelText(/Bozeman VA medical center/i));
    fireEvent.click(screen.getByText(/Continue/));
    await screen.findByText(
      /You’ve reached the limit for appointment requests at this location/i,
    );
  });

  it('should show past visits eligibility alert', async () => {
    mockParentSites(['983', '984'], [parentSite983, parentSite984]);

    mockSupportedFacilities({
      siteId: '984',
      parentId: '984',
      typeOfCareId: '502',
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
        {
          id: '984GC',
          attributes: {
            ...getFacilityMock().attributes,
            institutionCode: '984GC',
            authoritativeName: 'San Diego VA medical center',
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
      typeOfCareId: '502',
      data: [],
    });
    mockEligibilityFetches({
      siteId: '983',
      facilityId: '983',
      typeOfCareId: '502',
      limit: true,
    });
    mockEligibilityFetches({
      siteId: '984',
      facilityId: '984',
      typeOfCareId: '502',
      limit: true,
    });
    const store = createTestStore(initialState);
    await setTypeOfCare(store, /mental health/i);

    const screen = renderWithStoreAndRouter(<VAFacilityPage />, {
      store,
    });

    fireEvent.click(await screen.findByLabelText(/Bozeman VA medical center/i));
    fireEvent.click(screen.getByText(/Continue/));
    await screen.findByText(
      /We couldn’t find a recent appointment at this location/i,
    );
  });

  // TODO: should use correct eligibility info after a split type of care is changed
});
