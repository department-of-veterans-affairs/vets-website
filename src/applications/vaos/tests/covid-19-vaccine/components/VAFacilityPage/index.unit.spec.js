/* eslint-disable no-plusplus */
import React from 'react';
import { expect } from 'chai';

import {
  mockFetch,
  setFetchJSONFailure,
} from '@department-of-veterans-affairs/platform-testing/helpers';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import { fireEvent, waitFor, within } from '@testing-library/dom';
import { cleanup } from '@testing-library/react';
import VAFacilityPage from '../../../../covid-19-vaccine/components/VAFacilityPage';
import {
  createTestStore,
  renderWithStoreAndRouter,
} from '../../../mocks/setup';
import { mockGetCurrentPosition } from '../../../mocks/helpers';
import { TYPE_OF_CARE_ID } from '../../../../covid-19-vaccine/utils';
import {
  createMockClinicByVersion,
  createMockFacilityByVersion,
} from '../../../mocks/data';
import {
  mockEligibilityFetchesByVersion,
  mockFacilitiesFetchByVersion,
} from '../../../mocks/fetch';
import { mockSchedulingConfigurations } from '../../../mocks/helpers.v2';
import { getSchedulingConfigurationMock } from '../../../mocks/v2';

const facilityIds = ['983', '983GB', '983GC', '983HK', '983QA', '984'];

// TODO: Make sure this works in staging before removal
// const vhaIds = facilityIds.map(
//   id => `vha_${id.replace('983', '442').replace('984', '552')}`,
// );

const facilities = facilityIds.map((id, index) =>
  createMockFacilityByVersion({
    id: id.replace('vha_', ''),
    name: `Fake facility name ${index + 1}`,
    lat: Math.random() * 90,
    long: Math.random() * 180,
    address: {
      line: [`Fake street ${index + 1}`],
      city: `Fake city ${index + 1}`,
      state: `Fake state ${index + 1}`,
      postalCode: `Fake zip ${index + 1}`,
    },
  }),
);

const closestFacility = facilities[2];
closestFacility.attributes.name = 'Closest facility';
closestFacility.attributes.lat = 39.50603012; // Dayton, OH
closestFacility.attributes.long = -84.3164749;

describe('VAOS vaccine flow: VAFacilityPage', () => {
  describe('When there are more than 5 facilities', () => {
    const initialState = {
      user: {
        profile: {
          facilities: [
            { facilityId: '983', isCerner: false },
            { facilityId: '983GB', isCerner: false },
            { facilityId: '983GC', isCerner: false },
            { facilityId: '983HK', isCerner: false },
            { facilityId: '983QA', isCerner: false },
            { facilityId: '984', isCerner: false },
          ],
        },
      },
    };

    beforeEach(() => mockFetch());

    it('should display list of facilities with show more button', async () => {
      const configs = facilities.map(facility =>
        getSchedulingConfigurationMock({
          id: facility.id,
          typeOfCareId: TYPE_OF_CARE_ID,
          directEnabled: true,
        }),
      );

      mockSchedulingConfigurations(configs);
      mockFacilitiesFetchByVersion({
        children: true,
        ids: facilityIds,
        facilities,
      });

      const store = createTestStore(initialState);

      const screen = renderWithStoreAndRouter(<VAFacilityPage />, {
        store,
      });

      const buttons = await screen.findAllByRole('radio');

      expect(await screen.findByText(/Choose a VA location/i)).to.exist;
      await waitFor(() => {
        expect(global.document.title).to.equal(
          'Choose a VA location | Veterans Affairs',
        );
      });

      expect(screen.baseElement).to.contain.text(
        'Here’s a list of VA facilities where you’re registered that offer COVID-19 vaccine appointments',
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
      expect(screen.baseElement).to.contain.text('Fake street 6');
      expect(screen.baseElement).to.contain.text(
        'Fake city 6, Fake state 6 Fake zip 6',
      );
      await waitFor(() =>
        expect(document.activeElement.id).to.equal('root_vaFacility_6'),
      );

      // Should verify that all radio buttons have the same name (508 accessibility)
      buttons.forEach(button => {
        expect(button.name).to.equal('root_vaFacility');
      });

      // Should validation message if no facility selected
      fireEvent.click(screen.getByText(/Continue/));
      expect(
        await screen.findByText(
          'Please select a location for your appointment',
        ),
      ).to.be.ok;
    });

    it('should sort by distance from current location if user clicks "use current location"', async () => {
      const configs = facilities.map(facility =>
        getSchedulingConfigurationMock({
          id: facility.id,
          typeOfCareId: TYPE_OF_CARE_ID,
          directEnabled: true,
        }),
      );

      mockSchedulingConfigurations(configs);
      mockFacilitiesFetchByVersion({
        children: true,
        ids: facilityIds,
        facilities,
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

      // Radio buttons only show up after all the data is loaded, which
      // should mean all page rendering is finished
      await screen.findAllByRole('radio');
      fireEvent.click(screen.getByText('use your current location'));
      await screen.findAllByRole('radio');
      expect(screen.baseElement).to.contain.text(
        'Facilities based on your location',
      );
      expect(screen.baseElement).not.to.contain.text(
        'use your current location',
      );

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
  });

  describe('When there are less than 5 facilities', () => {
    const initialState = {
      user: {
        profile: {
          facilities: [
            { facilityId: '983', isCerner: false },
            { facilityId: '984', isCerner: false },
          ],
        },
      },
    };

    beforeEach(() => {
      mockFetch();

      mockEligibilityFetchesByVersion({
        facilityId: '983',
        typeOfCareId: TYPE_OF_CARE_ID,
      });
      mockFacilitiesFetchByVersion({
        children: true,
        ids: ['983', '984'],
        facilities,
      });
      const configs = facilityIds.map(id =>
        getSchedulingConfigurationMock({
          id,
          typeOfCareId: TYPE_OF_CARE_ID,
          directEnabled: true,
        }),
      );
      mockSchedulingConfigurations(configs);
    });

    it('should show residential address and sort by distance if we have coordinates', async () => {
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
        'Here’s a list of VA facilities where you’re registered that offer COVID-19 vaccine appointments',
      );
      expect(screen.baseElement).to.contain.text(
        'Locations closest to you are listed first',
      );
      expect(screen.baseElement).to.contain.text(
        'Facilities based on your home address',
      );
      expect(screen.baseElement).to.contain.text('290 Ludlow Ave');
      expect(screen.baseElement).to.contain.text('Cincinatti, OhioOH 45220');
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

    it('should not display show more button if < 6 locations', async () => {
      const testState = {
        user: {
          profile: {
            facilities: [
              { facilityId: '983', isCerner: false },
              { facilityId: '983GB', isCerner: false },
              { facilityId: '983GC', isCerner: false },
              { facilityId: '983HK', isCerner: false },
              { facilityId: '983QA', isCerner: false },
            ],
          },
        },
      };
      const configs = facilities.slice(0, 5).map(facility =>
        getSchedulingConfigurationMock({
          id: facility.id,
          typeOfCareId: TYPE_OF_CARE_ID,
          directEnabled: true,
        }),
      );

      mockSchedulingConfigurations(configs);
      mockFacilitiesFetchByVersion({
        children: true,
        ids: facilityIds.slice(0, 5),
        facilities: facilities.slice(0, 5),
      });

      const store = createTestStore(testState);
      const screen = renderWithStoreAndRouter(<VAFacilityPage />, {
        store,
      });

      // Radio buttons only show up after all the data is loaded, which
      // should mean all page rendering is finished
      await screen.findAllByRole('radio');

      expect(
        screen.getByText(
          /Here’s a list of VA facilities where you’re registered that offer COVID-19 vaccine appointments/i,
        ),
      ).to.exist;

      // Should contain radio buttons
      facilities.slice(0, 5).forEach(f => {
        expect(screen.baseElement).to.contain.text(f.attributes.name);
      });

      expect(screen.baseElement).not.to.contain.text('more location');
    });

    it('should display previous user choices when returning to page', async () => {
      const store = createTestStore(initialState);

      let screen = renderWithStoreAndRouter(<VAFacilityPage />, {
        store,
      });

      // Radio buttons only show up after all the data is loaded, which
      // should mean all page rendering is finished
      await screen.findAllByRole('radio');

      fireEvent.click(await screen.findByLabelText(/Fake facility name 1/i));
      fireEvent.click(await screen.findByRole('button', { name: /Continue/i }));

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

    it('should show eligibility modal again if user closes it out and hits continue again with the same facility selected', async () => {
      const store = createTestStore(initialState);

      const screen = renderWithStoreAndRouter(<VAFacilityPage />, {
        store,
      });

      await screen.findByText(/Here’s a list of VA facilities/i);

      fireEvent.click(await screen.findByLabelText(/Fake facility name 5/i));
      fireEvent.click(screen.getByText(/Continue/));
      await screen.findByTestId('eligibilityModal');
      expect(screen.findByTestId('eligibilityModal')).to.exist;
      fireEvent.click(screen.getByText(/Continue/));
      await screen.findByTestId('eligibilityModal');
    });
  });

  describe('When there are errors', () => {
    const initialState = {
      user: {
        profile: {
          facilities: [
            { facilityId: '983', isCerner: false },
            { facilityId: '984', isCerner: false },
          ],
        },
      },
    };

    const facility983 = createMockFacilityByVersion({
      id: '983',
      name: 'Facility 983',
    });
    const facility984 = createMockFacilityByVersion({
      id: '984',
      name: 'Facility 984',
    });

    beforeEach(() => {
      mockFetch();

      mockSchedulingConfigurations([
        getSchedulingConfigurationMock({
          id: '983',
          typeOfCareId: TYPE_OF_CARE_ID,
          directEnabled: true,
        }),
        getSchedulingConfigurationMock({
          id: '984',
          typeOfCareId: TYPE_OF_CARE_ID,
          directEnabled: true,
        }),
      ]);
    });

    it('should display error messaging if user denied location permissions', async () => {
      mockGetCurrentPosition({ fail: true });
      mockFacilitiesFetchByVersion({
        children: true,
        facilities: [facility983, facility984],
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
                city: 'Cincinnati',
                stateCode: 'OH',
                zipCode: '45220',
                latitude: 39.1362562, // Cincinnati, OH
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
      expect(
        await screen.findByRole('heading', {
          level: 3,
          name: /Your browser is blocked from finding your current location/,
        }),
      ).to.be.ok;
    });

    it('should show no facilities message', async () => {
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

      mockFacilitiesFetchByVersion({
        children: true,
        facilities: [facility983, facility984],
      });
      mockSchedulingConfigurations([
        getSchedulingConfigurationMock({
          id: '983',
          typeOfCareId: TYPE_OF_CARE_ID,
          directEnabled: false,
        }),
        getSchedulingConfigurationMock({
          id: '984',
          typeOfCareId: TYPE_OF_CARE_ID,
          directEnabled: false,
        }),
      ]);

      const screen = renderWithStoreAndRouter(<VAFacilityPage />, {
        store,
      });

      expect(await screen.findByText(/We couldn’t find a VA facility/i)).to
        .exist;
      expect(screen.baseElement).to.contain.text(
        'We couldn’t find a VA facility where you receive care that accepts online appointments for COVID-19 vaccines',
      );
    });

    it('should display an error message when eligibility calls fail', async () => {
      const store = createTestStore(initialState);

      mockFacilitiesFetchByVersion({
        children: true,
        facilities: [facility983, facility984],
      });

      const screen = renderWithStoreAndRouter(<VAFacilityPage />, {
        store,
      });

      fireEvent.click(await screen.findByLabelText(/Facility 983/i));
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
      mockFacilitiesFetchByVersion({
        children: true,
        facilities: [facility983, facility984],
      });
      const clinic = createMockClinicByVersion({
        id: '1',
        stationId: '983',
        name: '',
      });
      mockEligibilityFetchesByVersion({
        facilityId: '983',
        typeOfCareId: TYPE_OF_CARE_ID,
        clinics: [clinic, clinic],
      });
      mockSchedulingConfigurations([
        getSchedulingConfigurationMock({
          id: '983',
          typeOfCareId: TYPE_OF_CARE_ID,
          directEnabled: true,
        }),
        getSchedulingConfigurationMock({
          id: '984',
          typeOfCareId: 'primaryCare',
          requestEnabled: false,
        }),
      ]);

      const store = createTestStore(initialState);

      const screen = renderWithStoreAndRouter(<VAFacilityPage />, {
        store,
      });

      expect(
        await screen.findByText(
          "We found one VA location where you're registered that offers COVID-19 vaccine appointments.",
        ),
      ).to.exist;

      expect(screen.baseElement).to.contain.text('Facility 983');

      fireEvent.click(await screen.findByText(/Continue/));
      await waitFor(() =>
        expect(screen.history.push.firstCall.args[0]).to.equal(
          '/new-covid-19-vaccine-appointment/choose-clinic',
        ),
      );
    });

    it('should show alert and not allow user to continue if only one facility and no clinics', async () => {
      mockFacilitiesFetchByVersion({
        children: true,
        facilities: [facility983, facility984],
      });
      mockEligibilityFetchesByVersion({
        facilityId: '983',
        typeOfCareId: TYPE_OF_CARE_ID,
        clinics: [],
        version: 2,
      });
      mockSchedulingConfigurations([
        getSchedulingConfigurationMock({
          id: '983',
          typeOfCareId: TYPE_OF_CARE_ID,
          directEnabled: true,
        }),
        getSchedulingConfigurationMock({
          id: '984',
          typeOfCareId: TYPE_OF_CARE_ID,
          directEnabled: false,
        }),
      ]);

      const store = createTestStore(initialState);

      const screen = renderWithStoreAndRouter(<VAFacilityPage />, {
        store,
      });

      // it should verify alert heading
      expect(
        await screen.findByRole('heading', {
          level: 2,
          name: 'We found one VA location for you',
        }),
      ).to.exist;

      expect(screen.baseElement).to.contain.text(
        'However, we couldn’t find any available slots right now',
      );

      expect(screen.getByText(/Continue/)).to.have.attribute('disabled');
    });

    it('should show error and not allow user to continue if only one facility and clinic call fails', async () => {
      mockFacilitiesFetchByVersion({
        children: true,
        facilities: [facility983, facility984],
      });
      mockSchedulingConfigurations([
        getSchedulingConfigurationMock({
          id: '983',
          typeOfCareId: TYPE_OF_CARE_ID,
          directEnabled: true,
        }),
        getSchedulingConfigurationMock({
          id: '984',
          typeOfCareId: TYPE_OF_CARE_ID,
          directEnabled: false,
        }),
      ]);

      const store = createTestStore(initialState);

      const screen = renderWithStoreAndRouter(<VAFacilityPage />, {
        store,
      });

      await screen.findByText(/We’re sorry. We’ve run into a problem/i);
    });

    it('should show eligibility modal with error if clinic call fails', async () => {
      mockFacilitiesFetchByVersion({
        children: true,
        facilities: [facility983, facility984],
      });
      mockSchedulingConfigurations([
        getSchedulingConfigurationMock({
          id: '983',
          typeOfCareId: TYPE_OF_CARE_ID,
          directEnabled: true,
        }),
        getSchedulingConfigurationMock({
          id: '984',
          typeOfCareId: TYPE_OF_CARE_ID,
          directEnabled: true,
        }),
      ]);

      setFetchJSONFailure(
        global.fetch.withArgs(
          `${environment.API_URL}
        /vaos/v2/locations/983/clinics?clinical_service=covid`,
        ),
        {
          errors: [],
        },
      );
      const store = createTestStore(initialState);

      const screen = renderWithStoreAndRouter(<VAFacilityPage />, {
        store,
      });

      await screen.findByText(/Here’s a list of VA facilities/i);

      fireEvent.click(await screen.findByLabelText(/Facility 983/i));
      fireEvent.click(screen.getByText(/Continue/));
      await screen.findByTestId('eligibilityModal');
      expect(
        within(screen.getByRole('alertdialog')).getByText(
          /Something went wrong/i,
        ),
      ).to.exist;
    });
  });
});
