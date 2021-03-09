import React from 'react';
import userEvent from '@testing-library/user-event';
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
  setTypeOfEyeCare,
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
    lat: Math.random() * 90,
    long: Math.random() * 180,
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

    const buttons = await screen.findAllByRole('radio');

    await waitFor(() => {
      expect(global.document.title).to.equal(
        'Choose a VA location for your primary care appointment | Veterans Affairs',
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
    expect(document.activeElement.id).to.equal('root_vaFacility_6');

    // Should verify that all radio buttons have the same name (508 accessibility)
    buttons.forEach(button => {
      expect(button.name).to.equal('root_vaFacility');
    });

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
          vapContactInfo: {
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

    // Providers should be sorted.
    const miles = screen.queryAllByText(/miles$/);

    expect(miles.length).to.equal(5);
    expect(() => {
      for (let i = 0; i < miles.length - 1; i++) {
        if (
          Number.parseFloat(miles[i].textContent) >
          Number.parseFloat(miles[i + 1].textContent)
        )
          throw new Error();
      }
    }).to.not.throw();
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
          vapContactInfo: {
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

    // Providers should be sorted.
    const miles = screen.queryAllByText(/miles$/);

    expect(miles.length).to.equal(5);

    expect(() => {
      for (let i = 0; i < miles.length - 1; i++) {
        if (
          Number.parseFloat(miles[i].textContent) >
          Number.parseFloat(miles[i + 1].textContent)
        )
          throw new Error();
      }
    }).to.not.throw();

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
          vapContactInfo: {
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

  it('should show no facilities message with up to two unsupported facilities for users with address', async () => {
    mockParentSites(['983', '984'], [parentSite983, parentSite984]);
    const facilityConfig = getDirectBookingEligibilityCriteriaMock({
      id: '123',
      typeOfCareId: '323',
      patientHistoryRequired: null,
    });
    const facilityDetails = getVAFacilityMock({
      id: '123',
      name: 'Bozeman VA medical center',
      lat: 39.1362562,
      long: -85.6804804,
    });
    facilityDetails.attributes.address = {
      physical: {
        zip: 'fake',
        city: 'Bozeman',
        state: 'MT',
        address1: 'fake',
        address2: null,
        address3: null,
      },
    };
    facilityDetails.attributes.phone = {
      main: '4065555858',
    };
    mockDirectBookingEligibilityCriteria(parentSiteIds, [
      facilityConfig,
      getDirectBookingEligibilityCriteriaMock({
        id: '124',
        typeOfCareId: '323',
        patientHistoryRequired: null,
      }),
      getDirectBookingEligibilityCriteriaMock({
        id: '125',
        typeOfCareId: '323',
        patientHistoryRequired: null,
      }),
    ]);
    mockRequestEligibilityCriteria(parentSiteIds, []);
    mockFacilitiesFetch('vha_123,vha_124,vha_125', [
      facilityDetails,
      getVAFacilityMock({
        id: '124',
        name: 'Facility 124',
        lat: 39.1362562,
        long: -85.6804804,
      }),
      getVAFacilityMock({
        id: '125',
        name: 'Facility 125',
        lat: 39.1362562,
        long: -86.6804804,
      }),
    ]);

    const state = {
      ...initialState,
      user: {
        ...initialState.user,
        profile: {
          ...initialState.user.profile,
          vapContactInfo: {
            residentialAddress: {
              addressLine1: '290 Ludlow Ave',
              city: 'Cincinnati',
              stateCode: 'OH',
              zipCode: '45220',
              latitude: 39.1362562,
              longitude: -84.6804804,
            },
          },
        },
      },
    };
    const store = createTestStore(state);
    await setTypeOfCare(store, /primary care/i);

    const screen = renderWithStoreAndRouter(<VAFacilityPage />, {
      store,
    });

    expect(await screen.findByText(/We couldn’t find a VA facility/i)).to.exist;
    expect(screen.baseElement).to.contain.text(
      'None of the facilities where you receive care accepts online appointments for primary care.',
    );
    expect(screen.getByText(/Bozeman VA medical center/i)).to.exist;
    expect(screen.baseElement).to.contain.text('Bozeman, MT');
    expect(screen.getByText(/406-555-5858/i)).to.exist;
    expect(screen.getByText(/Facility 124/i)).to.exist;
    expect(screen.queryByText(/Facility 125/i)).not.to.exist;
  });

  it('should show no facilities message with up to five unsupported facilities for users without address', async () => {
    mockParentSites(['983', '984'], [parentSite983, parentSite984]);
    const facilityConfig = getDirectBookingEligibilityCriteriaMock({
      id: '123',
      typeOfCareId: '323',
      patientHistoryRequired: null,
    });
    const facilityDetails = getVAFacilityMock({
      id: '123',
      name: 'Bozeman VA medical center',
    });
    facilityDetails.attributes.address = {
      physical: {
        zip: 'fake',
        city: 'Bozeman',
        state: 'MT',
        address1: 'fake',
        address2: null,
        address3: null,
      },
    };
    facilityDetails.attributes.phone = {
      main: '4065555858',
    };
    mockDirectBookingEligibilityCriteria(parentSiteIds, [
      facilityConfig,
      getDirectBookingEligibilityCriteriaMock({
        id: '124',
        typeOfCareId: '323',
        patientHistoryRequired: null,
      }),
      getDirectBookingEligibilityCriteriaMock({
        id: '125',
        typeOfCareId: '323',
        patientHistoryRequired: null,
      }),
      getDirectBookingEligibilityCriteriaMock({
        id: '126',
        typeOfCareId: '323',
        patientHistoryRequired: null,
      }),
      getDirectBookingEligibilityCriteriaMock({
        id: '127',
        typeOfCareId: '323',
        patientHistoryRequired: null,
      }),
      getDirectBookingEligibilityCriteriaMock({
        id: '128',
        typeOfCareId: '323',
        patientHistoryRequired: null,
      }),
    ]);
    mockRequestEligibilityCriteria(parentSiteIds, []);
    mockFacilitiesFetch('vha_123,vha_124,vha_125,vha_126,vha_127,vha_128', [
      facilityDetails,
      getVAFacilityMock({
        id: '124',
        name: 'Facility 124',
      }),
      getVAFacilityMock({
        id: '125',
        name: 'Facility 125',
      }),
      getVAFacilityMock({
        id: '126',
        name: 'Facility 126',
      }),
      getVAFacilityMock({
        id: '127',
        name: 'Facility 127',
      }),
      getVAFacilityMock({
        id: '128',
        name: 'Facility 128',
      }),
    ]);

    const store = createTestStore(initialState);
    await setTypeOfCare(store, /primary care/i);

    const screen = renderWithStoreAndRouter(<VAFacilityPage />, {
      store,
    });

    expect(await screen.findByText(/We couldn’t find a VA facility/i)).to.exist;
    expect(screen.baseElement).to.contain.text(
      'None of the facilities where you receive care accepts online appointments for primary care.',
    );
    expect(screen.getByText(/Bozeman VA medical center/i)).to.exist;
    expect(screen.baseElement).to.contain.text('Bozeman, MT');
    expect(screen.getByText(/406-555-5858/i)).to.exist;
    expect(screen.getByText(/Facility 124/i)).to.exist;
    expect(screen.getByText(/Facility 125/i)).to.exist;
    expect(screen.getByText(/Facility 126/i)).to.exist;
    expect(screen.getByText(/Facility 127/i)).to.exist;
    expect(screen.queryByText(/Facility 128/i)).not.to.exist;
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
      /This facility doesn’t accept online scheduling for this care/i,
    );
    const loadingEvent = global.window.dataLayer.find(
      ev => ev.event === 'loading-indicator-displayed',
    );

    // It should record GA event for loading modal
    expect(loadingEvent).to.exist;
    expect('loading-indicator-display-time' in loadingEvent).to.be.true;
  });

  it('should show eligibility modal again if user closes it out and hits continue again with the same facility selected', async () => {
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
      /This facility doesn’t accept online scheduling for this care/i,
    );
    const closeButton = screen.container.querySelector('.va-modal-close');
    fireEvent.click(closeButton);
    expect(screen.baseElement).not.to.contain.text(
      /This facility doesn’t accept online scheduling for this care/,
    );
    fireEvent.click(screen.getByText(/Continue/));
    await screen.findByText(
      /This facility doesn’t accept online scheduling for this care/i,
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
      /You’ve reached the limit for appointment requests/i,
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
    await screen.findByText(/We can’t find a recent appointment for you/i);
    expect(screen.getByRole('alertdialog')).to.be.ok;
  });

  it('should show additional info link if there are unsupported facilities within 100 miles', async () => {
    mockParentSites(parentSiteIds, [parentSite983, parentSite984]);
    mockDirectBookingEligibilityCriteria(parentSiteIds, [
      getDirectBookingEligibilityCriteriaMock({
        id: '983',
        typeOfCareId: '323',
      }),
      getDirectBookingEligibilityCriteriaMock({
        id: '983GC',
        typeOfCareId: '323',
      }),
      getDirectBookingEligibilityCriteriaMock({
        id: '984',
        typeOfCareId: '323',
        patientHistoryRequired: null,
      }),
      getDirectBookingEligibilityCriteriaMock({
        id: '984GC',
        typeOfCareId: '323',
        patientHistoryRequired: null,
      }),
    ]);
    mockRequestEligibilityCriteria(parentSiteIds, [
      getRequestEligibilityCriteriaMock({
        id: '983',
        typeOfCareId: '323',
      }),
      getRequestEligibilityCriteriaMock({
        id: '983GC',
        typeOfCareId: '323',
      }),
      getRequestEligibilityCriteriaMock({
        id: '984',
        typeOfCareId: '323',
        patientHistoryRequired: null,
      }),
      getRequestEligibilityCriteriaMock({
        id: '984GC',
        typeOfCareId: '323',
        patientHistoryRequired: null,
      }),
    ]);
    mockFacilitiesFetch('vha_442,vha_442GC,vha_552,vha_552GC', [
      {
        id: '983',
        attributes: {
          ...getVAFacilityMock().attributes,
          uniqueId: '983',
          name: 'Facility that is enabled',
        },
      },
      {
        id: '983GC',
        attributes: {
          ...getVAFacilityMock().attributes,
          uniqueId: '983GC',
          name: 'Facility that is also enabled',
        },
      },
      {
        id: '984',
        attributes: {
          ...getVAFacilityMock().attributes,
          uniqueId: '984',
          name: 'Facility that is disabled',
          lat: 39.1362562,
          // tweaked longitude to be around 80 miles away
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
        id: '984GC',
        attributes: {
          ...getVAFacilityMock().attributes,
          uniqueId: '984GC',
          name: 'Facility that is over 100 miles away and disabled',
          lat: 39.1362562,
          // tweaked longitude to be over 100 miles away
          long: -82.1804804,
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
    await setTypeOfCare(store, /primary care/i);
    const screen = renderWithStoreAndRouter(<VAFacilityPage />, {
      store,
    });
    expect(await screen.findByLabelText(/Facility that is enabled/i)).to.be.ok;
    expect(screen.queryByText(/Facility that is disabled/i)).not.to.be.ok;
    const additionalInfoButton = screen.getByText(
      /Why isn.t my facility listed/i,
    );
    userEvent.click(additionalInfoButton);
    expect(await screen.findByText(/Facility that is disabled/i)).to.be.ok;
    expect(screen.baseElement).to.contain.text('Bozeman, MT');
    expect(screen.getByText(/80\.4 miles/i)).to.be.ok;
    expect(screen.getByText(/555-555-5555, ext\. 1234/i)).to.be.ok;
    expect(
      screen.queryByText(/Facility that is over 100 miles away and disabled/i),
    ).not.to.be.ok;
    expect(
      screen.getByRole('link', { name: /different VA location/i }),
    ).to.have.attribute('href', '/find-locations');
  });

  it('should close additional info and re-sort unsupported facilities when sort method changes', async () => {
    mockParentSites(parentSiteIds, [parentSite983, parentSite984]);
    mockDirectBookingEligibilityCriteria(parentSiteIds, [
      getDirectBookingEligibilityCriteriaMock({
        id: '983',
        typeOfCareId: '323',
      }),
      getDirectBookingEligibilityCriteriaMock({
        id: '983GC',
        typeOfCareId: '323',
      }),
      getDirectBookingEligibilityCriteriaMock({
        id: '984',
        typeOfCareId: '323',
        patientHistoryRequired: null,
      }),
      getDirectBookingEligibilityCriteriaMock({
        id: '984GC',
        typeOfCareId: '323',
        patientHistoryRequired: null,
      }),
    ]);
    mockRequestEligibilityCriteria(parentSiteIds, [
      getRequestEligibilityCriteriaMock({
        id: '983',
        typeOfCareId: '323',
      }),
      getRequestEligibilityCriteriaMock({
        id: '983GC',
        typeOfCareId: '323',
      }),
      getRequestEligibilityCriteriaMock({
        id: '984',
        typeOfCareId: '323',
        patientHistoryRequired: null,
      }),
      getRequestEligibilityCriteriaMock({
        id: '984GC',
        typeOfCareId: '323',
        patientHistoryRequired: null,
      }),
    ]);
    mockFacilitiesFetch('vha_442,vha_442GC,vha_552,vha_552GC', [
      {
        id: '983',
        attributes: {
          ...getVAFacilityMock().attributes,
          uniqueId: '983',
          name: 'Facility that is enabled',
        },
      },
      {
        id: '983GC',
        attributes: {
          ...getVAFacilityMock().attributes,
          uniqueId: '983GC',
          name: 'Facility that is also enabled',
        },
      },
      {
        id: '984',
        attributes: {
          ...getVAFacilityMock().attributes,
          uniqueId: '984',
          name: 'Disabled facility near residential address',
          lat: 39.1362562,
          long: -83.1804804,
        },
      },
      {
        id: '984GC',
        attributes: {
          ...getVAFacilityMock().attributes,
          uniqueId: '984GC',
          name: 'Disabled facility near current location',
          lat: 53.2734,
          long: -7.77832031,
        },
      },
    ]);
    mockGetCurrentPosition();
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
    await setTypeOfCare(store, /primary care/i);
    const screen = renderWithStoreAndRouter(<VAFacilityPage />, {
      store,
    });
    expect(await screen.findByLabelText(/Facility that is enabled/i)).to.be.ok;
    let additionalInfoButton = screen.getByText(
      /Why isn.t my facility listed/i,
    );
    userEvent.click(additionalInfoButton);
    expect(
      await screen.findByText(/Disabled facility near residential address/i),
    ).to.be.ok;
    expect(screen.queryByText(/Disabled facility near current location/i)).not
      .to.be.ok;

    userEvent.click(screen.getByText(/use your current location/i));
    expect(await screen.findByLabelText(/Facility that is enabled/i)).to.be.ok;

    additionalInfoButton = screen.getByText(/Why isn.t my facility listed/i);
    userEvent.click(additionalInfoButton);
    expect(await screen.findByText(/Disabled facility near current location/i))
      .to.be.ok;
    expect(screen.queryByText(/Disabled facility near residential address/i))
      .not.to.be.ok;
  });

  it('should display correct facilities after changing type of care', async () => {
    const facilityIdsForTwoTypesOfCare = ['983', '983GC', '983QA', '984'];
    mockParentSites(parentSiteIds, [parentSite983, parentSite984]);
    mockDirectBookingEligibilityCriteria(
      parentSiteIds,
      facilityIdsForTwoTypesOfCare.map(id => {
        return {
          id,
          attributes: {
            ...directFacilityAttributes,
            id,
            coreSettings: [
              {
                ...directFacilityAttributes.coreSettings[0],
                id: '323',
              },
            ],
          },
        };
      }),
    );
    mockRequestEligibilityCriteria(
      parentSiteIds,
      facilityIdsForTwoTypesOfCare.map(id => {
        const requestSettings = [
          {
            ...requestFacilityAttributes.requestSettings[0],
            id: '323',
          },
        ];

        // turn on optometry for a couple facilities
        if (['984', '983QA'].includes(id)) {
          requestSettings.push({
            ...requestFacilityAttributes.requestSettings[0],
            id: '408',
          });
        }

        return {
          id,
          attributes: {
            ...requestFacilityAttributes,
            id,
            requestSettings,
          },
        };
      }),
    );
    const vhaIdentifiers = facilityIdsForTwoTypesOfCare.map(
      id => `vha_${id.replace('983', '442').replace('984', '552')}`,
    );
    mockFacilitiesFetch(
      vhaIdentifiers.join(','),
      facilities.filter(facility => vhaIdentifiers.includes(facility.id)),
    );
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
    expect(await screen.findAllByRole('radio')).to.have.length(4);

    await cleanup();

    await setTypeOfCare(store, /eye care/i);
    await setTypeOfEyeCare(store, /optometry/i);

    screen = renderWithStoreAndRouter(<VAFacilityPage />, {
      store,
    });

    expect(await screen.findAllByRole('radio')).to.have.length(2);
  });
});
