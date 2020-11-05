import React from 'react';
import { expect } from 'chai';

import { mockFetch, resetFetch } from 'platform/testing/unit/helpers';
import { fireEvent, waitFor } from '@testing-library/dom';
import { cleanup } from '@testing-library/react';
import VAFacilityPage from '../../../../new-appointment/components/VAFacilityPage/VAFacilityPageV2';
import {
  getParentSiteMock,
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
  mockGetCurrentPosition,
} from '../../../mocks/helpers';

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

const typeOfCareId = '323';
const typeOfCare = 'Primary Care';

const requestFacilityAttributes = getRequestEligibilityCriteriaMock()
  .attributes;

const facilityIds = ['983', '983GC', '983GB', '983HK', '983QA', '984'];

const requestFacilities = facilityIds.map(id => ({
  id,
  attributes: {
    ...requestFacilityAttributes,
    id,
    requestSettings: [
      {
        ...requestFacilityAttributes.requestSettings[0],
        id: typeOfCareId,
        typeOfCare,
      },
    ],
  },
}));

const directFacilityAttributes = getDirectBookingEligibilityCriteriaMock()
  .attributes;

const directFacilities = facilityIds.map(id => ({
  id,
  attributes: {
    ...directFacilityAttributes,
    id,
    coreSettings: [
      {
        ...directFacilityAttributes.coreSettings[0],
        id: typeOfCareId,
        typeOfCare,
      },
    ],
  },
}));

const vhaIds = facilityIds.map(
  id => `vha_${id.replace('983', '442').replace('984', '552')}`,
);

const facilities = vhaIds.map((id, index) => ({
  id,
  attributes: {
    ...getVAFacilityMock().attributes,
    uniqueId: id.replace('vha_', ''),
    name: `Fake facility name ${index + 1}`,
    lat: 40.8596747, // Clifton, NJ
    long: -74.1927881,
    address: {
      physical: {
        ...getVAFacilityMock().attributes.address.physical,
        city: `Fake city ${index + 1}`,
      },
    },
  },
}));

const closestFacility = facilities[2];
closestFacility.attributes.name = 'Closest facility';
closestFacility.attributes.lat = 39.50603012; // Dayton, OH
closestFacility.attributes.long = -84.3164749;

describe('VAOS integration: VA flat facility page - multiple facilities', () => {
  beforeEach(() => mockFetch());
  afterEach(() => resetFetch());

  it('should display list of facilities with show more button', async () => {
    mockParentSites(parentSiteIds, [parentSite983, parentSite984]);
    mockDirectBookingEligibilityCriteria(parentSiteIds, directFacilities);
    mockRequestEligibilityCriteria(parentSiteIds, requestFacilities);
    mockFacilitiesFetch(vhaIds.join(','), facilities);
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

    await screen.findAllByRole('radio');

    await waitFor(() => {
      expect(global.document.title).to.equal(
        'Choose a VA location for your appointment | Veterans Affairs',
      );
    });

    expect(
      screen.getByText(
        /Choose a VA location for your Primary care appointment/i,
      ),
    ).to.exist;

    expect(screen.baseElement).to.contain.text(
      'Below is a list of VA locations where you’re registered that offer Primary care appointments',
    );

    // Should contain radio buttons
    facilities.slice(0, 5).forEach(f => {
      expect(screen.baseElement).to.contain.text(f.attributes.name);
    });

    // Should not show address
    expect(screen.baseElement).not.to.contain.text(
      'Facilities based on your home address',
    );

    // Should not show 6th facility
    expect(screen.baseElement).not.to.contain.text('Fake facility name 6');

    // Find show more button and fire click event
    const moreLocationsBtn = screen.getByText('+ 1 more location');
    expect(moreLocationsBtn).to.have.tagName('span');
    fireEvent.click(moreLocationsBtn);

    // Should show 6th facility
    expect(screen.baseElement).to.contain.text('Fake facility name 6');

    // Should validation message if no facility selected
    fireEvent.click(screen.getByText(/Continue/));
    expect(await screen.findByRole('alert')).to.contain.text(
      'Please provide a response',
    );
  });

  it('should show residential address and sort by distance if we have coordinates', async () => {
    mockParentSites(parentSiteIds, [parentSite983, parentSite984]);
    mockDirectBookingEligibilityCriteria(parentSiteIds, directFacilities);
    mockRequestEligibilityCriteria(parentSiteIds, requestFacilities);
    mockFacilitiesFetch(vhaIds.join(','), facilities);
    mockEligibilityFetches({
      siteId: '983',
      facilityId: '983',
      typeOfCareId: '323',
    });
    const store = createTestStore({
      ...initialState,
      user: {
        ...initialState.user,
        profile: {
          ...initialState.user.profile,
          vet360: {
            residentialAddress: {
              addressLine1: '290 Ludlow Ave',
              city: 'Cincinatti',
              stateCode: 'OH',
              zipCode: '45220',
              latitude: 39.1362562, // Cincinatti, OH
              longitude: -84.6804804,
            },
          },
        },
      },
    });
    await setTypeOfCare(store, /primary care/i);

    const screen = renderWithStoreAndRouter(<VAFacilityPage />, {
      store,
    });

    // Radio buttons only show up after all the data is loaded, which
    // should mean all page rendering is finished
    await screen.findAllByRole('radio');

    expect(
      screen.getByText(
        /Choose a VA location for your Primary care appointment/i,
      ),
    ).to.exist;
    expect(screen.baseElement).to.contain.text(
      'Locations closest to you are at the top of the list',
    );
    expect(screen.baseElement).to.contain.text(
      'Facilities based on your home address',
    );
    expect(screen.baseElement).to.contain.text('290 Ludlow Ave');
    expect(screen.baseElement).to.contain.text('Cincinatti, OH 45220');
    expect(screen.baseElement).to.contain.text(' miles');

    // It should sort by distance, making Closest facility the first facility
    const firstRadio = screen.container.querySelector('.form-radio-buttons');
    expect(firstRadio).to.contain.text('Closest facility');
  });

  it('should sort by distance from current location if user clicks "use current location"', async () => {
    mockParentSites(parentSiteIds, [parentSite983, parentSite984]);
    mockDirectBookingEligibilityCriteria(parentSiteIds, directFacilities);
    mockRequestEligibilityCriteria(parentSiteIds, requestFacilities);
    mockFacilitiesFetch(vhaIds.join(','), facilities);
    mockEligibilityFetches({
      siteId: '983',
      facilityId: '983',
      typeOfCareId: '323',
    });
    mockGetCurrentPosition();
    const store = createTestStore({
      ...initialState,
      user: {
        ...initialState.user,
        profile: {
          ...initialState.user.profile,
          vet360: {
            residentialAddress: {
              addressLine1: '290 Ludlow Ave',
              city: 'Cincinatti',
              stateCode: 'OH',
              zipCode: '45220',
              latitude: 39.1362562, // Cincinatti, OH
              longitude: -84.6804804,
            },
          },
        },
      },
    });
    await setTypeOfCare(store, /primary care/i);

    const screen = renderWithStoreAndRouter(<VAFacilityPage />, {
      store,
    });

    await screen.findAllByRole('radio');
    fireEvent.click(screen.getByText('use your current location'));
    await screen.findAllByRole('radio');
    expect(screen.baseElement).to.contain.text(
      'Facilities based on your location',
    );
    expect(screen.baseElement).not.to.contain.text('use your current location');

    // Clicking use home address should revert sort back to distance from hoem address
    fireEvent.click(screen.getByText('use your home address on file'));
    expect(screen.baseElement).to.contain.text(
      'Facilities based on your home address',
    );
  });

  it('should display error messaging if user denied location permissions', async () => {
    mockParentSites(parentSiteIds, [parentSite983, parentSite984]);
    mockDirectBookingEligibilityCriteria(parentSiteIds, directFacilities);
    mockRequestEligibilityCriteria(parentSiteIds, requestFacilities);
    mockFacilitiesFetch(vhaIds.join(','), facilities);
    mockEligibilityFetches({
      siteId: '983',
      facilityId: '983',
      typeOfCareId: '323',
    });
    mockGetCurrentPosition({ fail: true });
    const store = createTestStore({
      ...initialState,
      user: {
        ...initialState.user,
        profile: {
          ...initialState.user.profile,
          vet360: {
            residentialAddress: {
              addressLine1: '290 Ludlow Ave',
              city: 'Cincinatti',
              stateCode: 'OH',
              zipCode: '45220',
              latitude: 39.1362562, // Cincinatti, OH
              longitude: -84.6804804,
            },
          },
        },
      },
    });
    await setTypeOfCare(store, /primary care/i);

    const screen = renderWithStoreAndRouter(<VAFacilityPage />, {
      store,
    });

    await screen.findAllByRole('radio');
    fireEvent.click(screen.getByText('use your current location'));
    await screen.findAllByRole('radio');
    expect(screen.baseElement).to.contain.text(
      'Your browser is blocked from finding your current location',
    );
  });

  it('should not display show more button if < 6 locations', async () => {
    mockParentSites(parentSiteIds, [parentSite983, parentSite984]);
    mockDirectBookingEligibilityCriteria(
      parentSiteIds,
      directFacilities.slice(0, 5),
    );
    mockRequestEligibilityCriteria(
      parentSiteIds,
      requestFacilities.slice(0, 5),
    );
    mockFacilitiesFetch(vhaIds.slice(0, 5).join(','), facilities.slice(0, 5));
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

    // Radio buttons only show up after all the data is loaded, which
    // should mean all page rendering is finished
    await screen.findAllByRole('radio');

    expect(
      screen.getByText(
        /Choose a VA location for your Primary care appointment/i,
      ),
    ).to.exist;

    // Should contain radio buttons
    facilities.slice(0, 5).forEach(f => {
      expect(screen.baseElement).to.contain.text(f.attributes.name);
    });

    expect(screen.baseElement).not.to.contain.text('more location');
  });

  it('should display previous user choices when returning to page', async () => {
    mockParentSites(parentSiteIds, [parentSite983, parentSite984]);
    mockDirectBookingEligibilityCriteria(parentSiteIds, directFacilities);
    mockRequestEligibilityCriteria(parentSiteIds, requestFacilities);
    mockFacilitiesFetch(vhaIds.join(','), facilities);
    mockEligibilityFetches({
      siteId: '983',
      facilityId: '983',
      typeOfCareId: '323',
    });
    const store = createTestStore(initialState);
    await setTypeOfCare(store, /primary care/i);

    let screen = renderWithStoreAndRouter(<VAFacilityPage />, {
      store,
    });

    // Radio buttons only show up after all the data is loaded, which
    // should mean all page rendering is finished
    await screen.findAllByRole('radio');

    fireEvent.click(await screen.findByLabelText(/Fake facility name 1/i));

    await cleanup();

    screen = renderWithStoreAndRouter(<VAFacilityPage />, {
      store,
    });

    expect(
      await screen.findByLabelText(/Fake facility name 1/i),
    ).to.have.attribute('checked');

    expect(
      await screen.queryByText(
        /You’ve reached the limit for appointment request/i,
      ),
    ).to.be.null;
  });

  it('should show unsupported facilities alert with facility locator tool link', async () => {
    mockParentSites(['983', '984'], [parentSite983, parentSite984]);
    mockDirectBookingEligibilityCriteria(parentSiteIds, []);
    mockRequestEligibilityCriteria(parentSiteIds, [requestFacilities]);

    const store = createTestStore(initialState);
    await setTypeOfCare(store, /primary care/i);

    const screen = renderWithStoreAndRouter(<VAFacilityPage />, {
      store,
    });

    expect(
      await screen.findByText(
        /We can’t find a VA facility where you receive care that accepts online appointments for primary care/i,
      ),
    ).to.exist;
  });

  it('should show not supported message when direct is supported and not eligible, and requests are not supported', async () => {
    mockParentSites(parentSiteIds, [parentSite983, parentSite984]);
    mockDirectBookingEligibilityCriteria(
      parentSiteIds,
      directFacilities.slice(0, 5),
    );
    mockRequestEligibilityCriteria(
      parentSiteIds,
      requestFacilities.slice(0, 4),
    );
    mockFacilitiesFetch(vhaIds.slice(0, 5).join(','), facilities.slice(0, 5));
    mockEligibilityFetches({
      siteId: '983',
      facilityId: '983QA',
      typeOfCareId: '323',
    });
    const store = createTestStore(initialState);
    await setTypeOfCare(store, /primary care/i);

    const screen = renderWithStoreAndRouter(<VAFacilityPage />, {
      store,
    });

    await screen.findByText(/below is a list of VA locations/i);

    fireEvent.click(await screen.findByLabelText(/Fake facility name 5/i));
    fireEvent.click(screen.getByText(/Continue/));
    await screen.findByText(
      /This facility does not allow scheduling requests/i,
    );
  });

  it('should show eligibility modal again if user closed out eligibility modal and clicked continue', async () => {
    mockParentSites(parentSiteIds, [parentSite983, parentSite984]);
    mockDirectBookingEligibilityCriteria(
      parentSiteIds,
      directFacilities.slice(0, 5),
    );
    mockRequestEligibilityCriteria(
      parentSiteIds,
      requestFacilities.slice(0, 4),
    );
    mockFacilitiesFetch(vhaIds.slice(0, 5).join(','), facilities.slice(0, 5));
    mockEligibilityFetches({
      siteId: '983',
      facilityId: '983QA',
      typeOfCareId: '323',
    });
    const store = createTestStore(initialState);
    await setTypeOfCare(store, /primary care/i);

    const screen = renderWithStoreAndRouter(<VAFacilityPage />, {
      store,
    });

    await screen.findByText(/below is a list of VA locations/i);

    fireEvent.click(await screen.findByLabelText(/Fake facility name 5/i));
    fireEvent.click(screen.getByText(/Continue/));
    await screen.findByText(
      /This facility does not allow scheduling requests/i,
    );
    const closeButton = screen.container.querySelector('.va-modal-close');
    fireEvent.click(closeButton);
    screen.debug();
    expect(screen.baseElement).not.to.contain.text(
      /This facility does not allow scheduling requests/,
    );
    fireEvent.click(screen.getByText(/Continue/));
    await screen.findByText(
      /This facility does not allow scheduling requests/i,
    );
  });

  it('should display an error message when eligibility calls fail', async () => {
    mockParentSites(parentSiteIds, [parentSite983, parentSite984]);
    mockDirectBookingEligibilityCriteria(parentSiteIds, directFacilities);
    mockRequestEligibilityCriteria(parentSiteIds, requestFacilities);
    mockFacilitiesFetch(vhaIds.join(','), facilities);
    const store = createTestStore(initialState);
    await setTypeOfCare(store, /primary care/i);

    const screen = renderWithStoreAndRouter(<VAFacilityPage />, {
      store,
    });

    fireEvent.click(await screen.findByLabelText(/Fake facility name 2/i));
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
    mockParentSites(parentSiteIds, [parentSite983, parentSite984]);
    mockDirectBookingEligibilityCriteria(parentSiteIds, directFacilities);
    mockRequestEligibilityCriteria(parentSiteIds, requestFacilities);
    mockFacilitiesFetch(vhaIds.join(','), facilities);
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

    fireEvent.click(await screen.findByLabelText(/Fake facility name 1/i));
    fireEvent.click(screen.getByText(/Continue/));
    await screen.findByText(
      /You’ve reached the limit for appointment requests at this location/i,
    );
  });

  it('should show past visits eligibility alert', async () => {
    mockParentSites(parentSiteIds, [parentSite983, parentSite984]);
    mockDirectBookingEligibilityCriteria(
      parentSiteIds,
      directFacilities.map(f => ({
        ...f,
        attributes: {
          ...f.attributes,
          coreSettings: [
            {
              ...f.attributes.coreSettings[0],
              id: '502',
              typeOfCare: 'Outpatient Mental Health',
            },
          ],
        },
      })),
    );
    mockRequestEligibilityCriteria(
      parentSiteIds,
      requestFacilities.map(f => ({
        ...f,
        attributes: {
          ...f.attributes,
          requestSettings: [
            {
              ...f.attributes.requestSettings[0],
              id: '502',
              typeOfCare: 'Outpatient Mental Health',
            },
          ],
        },
      })),
    );
    mockFacilitiesFetch(vhaIds.join(','), facilities);
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

    fireEvent.click(await screen.findByLabelText(/Fake facility name 1/i));
    fireEvent.click(screen.getByText(/Continue/));
    await screen.findByText(
      /We couldn’t find a recent appointment at this location/i,
    );
    expect(screen.getByRole('alertdialog')).to.be.ok;
  });

  // TODO: should use correct eligibility info after a split type of care is changed
});
