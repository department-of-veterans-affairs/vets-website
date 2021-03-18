import React from 'react';
import { expect } from 'chai';

import {
  mockFetch,
  resetFetch,
  setFetchJSONFailure,
} from 'platform/testing/unit/helpers';
import environment from 'platform/utilities/environment';
import { fireEvent, waitFor, within } from '@testing-library/dom';
import { cleanup } from '@testing-library/react';
import VAFacilityPage from '../../../../project-cheetah/components/VAFacilityPage';
import {
  getVAFacilityMock,
  getDirectBookingEligibilityCriteriaMock,
  getClinicMock,
} from '../../../mocks/v0';
import {
  createTestStore,
  renderWithStoreAndRouter,
} from '../../../mocks/setup';
import {
  mockEligibilityFetches,
  mockRequestEligibilityCriteria,
  mockDirectBookingEligibilityCriteria,
  mockFacilitiesFetch,
  mockGetCurrentPosition,
} from '../../../mocks/helpers';
import { TYPE_OF_CARE_ID } from '../../../../project-cheetah/utils';

const initialState = {
  featureToggles: {
    vaOnlineSchedulingCheetah: true,
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

const facilityIds = ['983', '983GC', '983GB', '983HK', '983QA', '984'];

const directFacilities = facilityIds.map(id =>
  getDirectBookingEligibilityCriteriaMock({
    id,
    typeOfCareId: TYPE_OF_CARE_ID,
  }),
);

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

describe('VAOS vaccine flow: <VAFacilityPage>', () => {
  beforeEach(() => mockFetch());
  afterEach(() => resetFetch());

  it('should display 2 dosages COVID alert', async () => {
    mockDirectBookingEligibilityCriteria(
      parentSiteIds,
      directFacilities.slice(0, 5),
    );
    mockRequestEligibilityCriteria(parentSiteIds, []);
    mockFacilitiesFetch(vhaIds.slice(0, 5).join(','), facilities.slice(0, 5));
    mockEligibilityFetches({
      siteId: '983',
      facilityId: '983',
      typeOfCareId: TYPE_OF_CARE_ID,
    });
    const store = createTestStore(initialState);

    const screen = renderWithStoreAndRouter(<VAFacilityPage />, {
      store,
    });

    // Radio buttons only show up after all the data is loaded, which
    // should mean all page rendering is finished
    await screen.findAllByRole('radio');

    expect(screen.getByText(/Some COVID-19 vaccines require 2 doses/i)).to
      .exist;

    expect(
      screen.getByText(
        /If you get a vaccine that requires 2 doses, you'll need to return to the same facility for your second dose./i,
      ),
    ).to.exist;
  });

  it('should display list of facilities with show more button', async () => {
    mockDirectBookingEligibilityCriteria(parentSiteIds, directFacilities);
    mockRequestEligibilityCriteria(parentSiteIds, []);
    mockFacilitiesFetch(vhaIds.join(','), facilities);
    mockEligibilityFetches({
      siteId: '983',
      facilityId: '983',
      typeOfCareId: TYPE_OF_CARE_ID,
    });
    const store = createTestStore(initialState);

    const screen = renderWithStoreAndRouter(<VAFacilityPage />, {
      store,
    });

    const buttons = await screen.findAllByRole('radio');

    expect(await screen.findByText(/Choose a location/i)).to.exist;
    await waitFor(() => {
      expect(global.document.title).to.equal(
        'Choose a location | Veterans Affairs',
      );
    });

    expect(screen.baseElement).to.contain.text(
      'Below is a list of VA locations where you’re registered that offer COVID-19 vaccine appointments',
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
    await waitFor(() =>
      expect(document.activeElement.id).to.equal('root_vaFacility_6'),
    );

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
    mockDirectBookingEligibilityCriteria(parentSiteIds, directFacilities);
    mockRequestEligibilityCriteria(parentSiteIds, []);
    mockFacilitiesFetch(vhaIds.join(','), facilities);
    mockEligibilityFetches({
      siteId: '983',
      facilityId: '983',
      typeOfCareId: TYPE_OF_CARE_ID,
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

    const screen = renderWithStoreAndRouter(<VAFacilityPage />, {
      store,
    });

    // Radio buttons only show up after all the data is loaded, which
    // should mean all page rendering is finished
    await screen.findAllByRole('radio');

    expect(screen.baseElement).to.contain.text(
      'Below is a list of VA locations where you’re registered that offer COVID-19 vaccine appointments',
    );
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
    mockDirectBookingEligibilityCriteria(parentSiteIds, directFacilities);
    mockRequestEligibilityCriteria(parentSiteIds, []);
    mockFacilitiesFetch(vhaIds.join(','), facilities);
    mockEligibilityFetches({
      siteId: '983',
      facilityId: '983',
      typeOfCareId: TYPE_OF_CARE_ID,
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
    mockDirectBookingEligibilityCriteria(parentSiteIds, directFacilities);
    mockRequestEligibilityCriteria(parentSiteIds, []);
    mockFacilitiesFetch(vhaIds.join(','), facilities);
    mockEligibilityFetches({
      siteId: '983',
      facilityId: '983',
      typeOfCareId: TYPE_OF_CARE_ID,
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
    mockDirectBookingEligibilityCriteria(
      parentSiteIds,
      directFacilities.slice(0, 5),
    );
    mockRequestEligibilityCriteria(parentSiteIds, []);
    mockFacilitiesFetch(vhaIds.slice(0, 5).join(','), facilities.slice(0, 5));
    mockEligibilityFetches({
      siteId: '983',
      facilityId: '983',
      typeOfCareId: TYPE_OF_CARE_ID,
    });
    const store = createTestStore(initialState);

    const screen = renderWithStoreAndRouter(<VAFacilityPage />, {
      store,
    });

    // Radio buttons only show up after all the data is loaded, which
    // should mean all page rendering is finished
    await screen.findAllByRole('radio');

    expect(
      screen.getByText(
        /Below is a list of VA locations where you’re registered that offer COVID-19 vaccine appointments/i,
      ),
    ).to.exist;

    // Should contain radio buttons
    facilities.slice(0, 5).forEach(f => {
      expect(screen.baseElement).to.contain.text(f.attributes.name);
    });

    expect(screen.baseElement).not.to.contain.text('more location');
  });

  it('should display previous user choices when returning to page', async () => {
    mockDirectBookingEligibilityCriteria(parentSiteIds, directFacilities);
    mockRequestEligibilityCriteria(parentSiteIds, []);
    mockFacilitiesFetch(vhaIds.join(','), facilities);
    mockEligibilityFetches({
      siteId: '983',
      facilityId: '983',
      typeOfCareId: TYPE_OF_CARE_ID,
    });
    const store = createTestStore(initialState);

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

  it('should show no facilities message', async () => {
    const facilityConfig = getDirectBookingEligibilityCriteriaMock({
      id: '123',
      typeOfCareId: TYPE_OF_CARE_ID,
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
        typeOfCareId: TYPE_OF_CARE_ID,
        patientHistoryRequired: null,
      }),
    ]);
    mockRequestEligibilityCriteria(parentSiteIds, []);
    mockFacilitiesFetch('vha_123,vha_124', [
      facilityDetails,
      getVAFacilityMock({
        id: '124',
        name: 'Facility 124',
        lat: 39.1362562,
        long: -85.6804804,
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

    const screen = renderWithStoreAndRouter(<VAFacilityPage />, {
      store,
    });

    expect(await screen.findByText(/We couldn’t find a VA facility/i)).to.exist;
    expect(screen.baseElement).to.contain.text(
      'We couldn’t find a VA facility where you receive care that accepts online appointments for COVID-19 vaccines',
    );
  });

  it('should show eligibility modal again if user closes it out and hits continue again with the same facility selected', async () => {
    mockDirectBookingEligibilityCriteria(
      parentSiteIds,
      directFacilities.slice(0, 5),
    );
    mockRequestEligibilityCriteria(parentSiteIds, []);
    mockFacilitiesFetch(vhaIds.slice(0, 5).join(','), facilities.slice(0, 5));
    mockEligibilityFetches({
      siteId: '983',
      facilityId: '983QA',
      typeOfCareId: TYPE_OF_CARE_ID,
    });
    const store = createTestStore(initialState);

    const screen = renderWithStoreAndRouter(<VAFacilityPage />, {
      store,
    });

    await screen.findByText(/below is a list of VA locations/i);

    fireEvent.click(await screen.findByLabelText(/Fake facility name 5/i));
    fireEvent.click(screen.getByText(/Continue/));
    await screen.findByText(
      /Sorry, we could not find any available slots for your booking/i,
    );
    const closeButton = screen.container.querySelector('.va-modal-close');
    fireEvent.click(closeButton);
    expect(screen.baseElement).not.to.contain.text(
      /Sorry, we could not find any available slots for your booking/i,
    );
    fireEvent.click(screen.getByText(/Continue/));
    await screen.findByText(
      /Sorry, we could not find any available slots for your booking/i,
    );
  });

  it('should display an error message when eligibility calls fail', async () => {
    mockDirectBookingEligibilityCriteria(parentSiteIds, directFacilities);
    mockRequestEligibilityCriteria(parentSiteIds, []);
    mockFacilitiesFetch(vhaIds.join(','), facilities);
    const store = createTestStore(initialState);

    const screen = renderWithStoreAndRouter(<VAFacilityPage />, {
      store,
    });

    fireEvent.click(await screen.findByLabelText(/Fake facility name 2/i));
    fireEvent.click(screen.getByText(/Continue/));
    expect(await screen.findByText(/something went wrong on our end/i)).to
      .exist;
  });

  it('should display an error message when facilities call fails', async () => {
    const store = createTestStore(initialState);

    const screen = renderWithStoreAndRouter(<VAFacilityPage />, {
      store,
    });

    expect(await screen.findByText(/something went wrong on our end/i)).to
      .exist;
  });

  it('should show alert when only one facility is supported', async () => {
    mockDirectBookingEligibilityCriteria(
      parentSiteIds,
      directFacilities.slice(0, 1),
    );
    mockRequestEligibilityCriteria(parentSiteIds, []);
    mockFacilitiesFetch(vhaIds.slice(0, 1).join(','), facilities.slice(0, 1));
    const clinic = getClinicMock();
    clinic.attributes.siteCode = '983';
    mockEligibilityFetches({
      siteId: '983',
      facilityId: '983',
      typeOfCareId: TYPE_OF_CARE_ID,
      clinics: [clinic, clinic],
    });

    const store = createTestStore(initialState);

    const screen = renderWithStoreAndRouter(<VAFacilityPage />, {
      store,
    });

    await screen.findByText(/We found one VA location for you/i);

    expect(screen.baseElement).to.contain.text('Fake facility name 1');
    expect(screen.baseElement).to.contain.text('Fake city 1');

    fireEvent.click(await screen.findByText(/Continue/));
    await waitFor(() =>
      expect(screen.history.push.firstCall.args[0]).to.equal(
        '/new-covid-19-vaccine-booking/clinic',
      ),
    );
  });

  it('should show alert and continue to calendar when only one facility and clinic are available', async () => {
    mockDirectBookingEligibilityCriteria(
      parentSiteIds,
      directFacilities.slice(0, 1),
    );
    mockRequestEligibilityCriteria(parentSiteIds, []);
    mockFacilitiesFetch(vhaIds.slice(0, 1).join(','), facilities.slice(0, 1));
    const clinic = getClinicMock();
    clinic.attributes.siteCode = '983';
    mockEligibilityFetches({
      siteId: '983',
      facilityId: '983',
      typeOfCareId: TYPE_OF_CARE_ID,
      clinics: [clinic],
    });

    const store = createTestStore(initialState);

    const screen = renderWithStoreAndRouter(<VAFacilityPage />, {
      store,
    });

    await screen.findByText(/We found one VA location for you/i);

    expect(screen.baseElement).to.contain.text('Fake facility name 1');
    expect(screen.baseElement).to.contain.text('Fake city 1');

    fireEvent.click(await screen.findByText(/Continue/));
    await waitFor(() =>
      expect(screen.history.push.firstCall.args[0]).to.equal(
        '/new-covid-19-vaccine-booking/select-date-1',
      ),
    );
  });

  it('should show alert and not allow user to continue if only one facility and no clinics', async () => {
    mockDirectBookingEligibilityCriteria(
      parentSiteIds,
      directFacilities.slice(0, 1),
    );
    mockRequestEligibilityCriteria(parentSiteIds, []);
    mockFacilitiesFetch(vhaIds.slice(0, 1).join(','), facilities.slice(0, 1));
    mockEligibilityFetches({
      siteId: '983',
      facilityId: '983',
      typeOfCareId: TYPE_OF_CARE_ID,
      clinics: [],
    });

    const store = createTestStore(initialState);

    const screen = renderWithStoreAndRouter(<VAFacilityPage />, {
      store,
    });

    await screen.findByText(/We found one VA location for you/i);

    expect(screen.baseElement).to.contain.text(
      'However, we couldn’t find any available slots right now',
    );

    expect(screen.getByText(/Continue/)).to.have.attribute('disabled');
  });

  it('should show error and not allow user to continue if only one facility and clinic call fails', async () => {
    mockDirectBookingEligibilityCriteria(
      parentSiteIds,
      directFacilities.slice(0, 1),
    );
    mockRequestEligibilityCriteria(parentSiteIds, []);
    mockFacilitiesFetch(vhaIds.slice(0, 1).join(','), facilities.slice(0, 1));
    mockEligibilityFetches({
      siteId: '983',
      facilityId: '983',
      typeOfCareId: TYPE_OF_CARE_ID,
    });
    setFetchJSONFailure(
      global.fetch.withArgs(
        `${
          environment.API_URL
        }/vaos/v0/facilities/983/clinics?type_of_care_id=${TYPE_OF_CARE_ID}&system_id=983`,
      ),
      {
        errors: [],
      },
    );

    const store = createTestStore(initialState);

    const screen = renderWithStoreAndRouter(<VAFacilityPage />, {
      store,
    });

    await screen.findByText(/We’re sorry. We’ve run into a problem/i);
  });

  it('should show eligibility modal with error if clinic call fails', async () => {
    mockDirectBookingEligibilityCriteria(
      parentSiteIds,
      directFacilities.slice(0, 5),
    );
    mockRequestEligibilityCriteria(parentSiteIds, []);
    mockFacilitiesFetch(vhaIds.slice(0, 5).join(','), facilities.slice(0, 5));
    mockEligibilityFetches({
      siteId: '983',
      facilityId: '983QA',
      typeOfCareId: TYPE_OF_CARE_ID,
    });
    setFetchJSONFailure(
      global.fetch.withArgs(
        `${
          environment.API_URL
        }/vaos/v0/facilities/983QA/clinics?type_of_care_id=${TYPE_OF_CARE_ID}&system_id=983`,
      ),
      {
        errors: [],
      },
    );
    const store = createTestStore(initialState);

    const screen = renderWithStoreAndRouter(<VAFacilityPage />, {
      store,
    });

    await screen.findByText(/below is a list of VA locations/i);

    fireEvent.click(await screen.findByLabelText(/Fake facility name 5/i));
    fireEvent.click(screen.getByText(/Continue/));
    await screen.findByText(/We’re sorry. We’ve run into a problem/i);
    expect(
      within(screen.getByRole('alertdialog')).getByText(
        /Something went wrong/i,
      ),
    ).to.exist;
  });
});
