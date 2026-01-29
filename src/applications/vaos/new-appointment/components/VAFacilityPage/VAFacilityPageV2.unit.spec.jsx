import userEvent from '@testing-library/user-event';
import { expect } from 'chai';
import React from 'react';

// eslint-disable-next-line import/no-unresolved
import { mockFetch } from '@department-of-veterans-affairs/platform-testing/helpers';
import { fireEvent, waitFor } from '@testing-library/dom';
import { cleanup } from '@testing-library/react';
import MockFacilityResponse from '../../../tests/fixtures/MockFacilityResponse';
import MockSchedulingConfigurationResponse, {
  MockServiceConfiguration,
} from '../../../tests/fixtures/MockSchedulingConfigurationResponse';
import {
  mockEligibilityFetches,
  mockFacilitiesApi,
  mockGetCurrentPosition,
  mockSchedulingConfigurationsApi,
} from '../../../tests/mocks/mockApis';
import {
  createTestStore,
  renderWithStoreAndRouter,
  setTypeOfCare,
  setTypeOfEyeCare,
} from '../../../tests/mocks/setup';
import { TYPE_OF_CARE_IDS } from '../../../utils/constants';
import VAFacilityPage from './VAFacilityPageV2';

describe.skip('VAOS Page: VAFacilityPage', () => {
  describe('when there are multiple facilities to choose from', () => {
    const initialState = {
      featureToggles: {
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

    const facilityIds = ['983', '983GC', '983GB', '983HK', '983QA', '984'];
    const facilities = facilityIds.map(
      (id, index) =>
        new MockFacilityResponse({
          id,
          name: `Fake facility name ${index + 1}`,
        }),
    );

    const closestFacility = facilities[2];
    closestFacility.attributes.name = 'Closest facility';
    closestFacility.attributes.lat = 39.50603012; // Dayton, OH
    closestFacility.attributes.long = -84.3164749;

    const firstAlphaFacility = facilities[3];
    firstAlphaFacility.attributes.name = 'ABC facility';

    beforeEach(() => mockFetch());

    it('should display error messaging if user denied location permissions', async () => {
      // Arrange
      mockFacilitiesApi({
        children: true,
        ids: ['983', '984'],
        response: [
          new MockFacilityResponse({
            id: '983',
            name: 'Facility 983',
          }),
          new MockFacilityResponse({
            id: '983GC',
            name: 'Facility 983GC',
          }),
        ],
      });
      mockSchedulingConfigurationsApi({
        response: [
          new MockSchedulingConfigurationResponse({
            facilityId: '983',
            services: [
              new MockServiceConfiguration({
                typeOfCareId: 'primaryCare',
                directEnabled: true,
                requestEnabled: false,
              }),
            ],
          }),
          new MockSchedulingConfigurationResponse({
            facilityId: '983GC',
            services: [
              new MockServiceConfiguration({
                typeOfCareId: 'primaryCare',
                directEnabled: true,
                requestEnabled: false,
              }),
            ],
          }),
        ],
      });

      mockEligibilityFetches({
        facilityId: '983',
        services: [
          new MockServiceConfiguration({
            typeOfCareId: 'primaryCare',
            limit: true,
            directPastVisits: true,
          }),
        ],
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

      // Act
      const screen = renderWithStoreAndRouter(<VAFacilityPage />, {
        store,
      });

      // Assert
      await screen.findAllByRole('radio');
      const facilitiesSelect = await screen.findByTestId('facilitiesSelect');
      // call VaSelect custom event for onChange handling
      facilitiesSelect.__events.vaSelect({
        detail: { value: 'distanceFromCurrentLocation' },
      });

      await waitFor(() => {
        expect(screen.baseElement).to.contain.text(
          'Your browser is blocked from finding your current location',
        );
      });
    });

    it('should not display show more button if < 6 locations', async () => {
      // Arrange
      mockFacilitiesApi({
        children: true,
        ids: ['983', '984'],
        response: facilities.slice(0, 5),
      });
      mockSchedulingConfigurationsApi({
        response: [
          new MockSchedulingConfigurationResponse({
            facilityId: '983',
            services: [
              new MockServiceConfiguration({
                typeOfCareId: 'primaryCare',
                directEnabled: true,
              }),
            ],
          }),
          new MockSchedulingConfigurationResponse({
            facilityId: '983GC',
            services: [
              new MockServiceConfiguration({
                typeOfCareId: 'primaryCare',
                directEnabled: true,
              }),
            ],
          }),
          new MockSchedulingConfigurationResponse({
            facilityId: '983GB',
            services: [
              new MockServiceConfiguration({
                typeOfCareId: 'primaryCare',
                directEnabled: true,
              }),
            ],
          }),
          new MockSchedulingConfigurationResponse({
            facilityId: '983HK',
            services: [
              new MockServiceConfiguration({
                typeOfCareId: 'primaryCare',
                directEnabled: true,
              }),
            ],
          }),
          new MockSchedulingConfigurationResponse({
            facilityId: '983QA',
            services: [
              new MockServiceConfiguration({
                typeOfCareId: 'primaryCare',
                directEnabled: true,
              }),
            ],
          }),
        ],
      });
      mockEligibilityFetches({
        facilityId: '983',
        typeOfCareId: TYPE_OF_CARE_IDS.PRIMARY_CARE,
        limit: true,
        requestPastVisits: true,
      });
      mockEligibilityFetches({
        facilityId: '983',
        typeOfCareId: 'primaryCare',
        limit: true,
        directPastVisits: true,
      });
      const store = createTestStore(initialState);
      await setTypeOfCare(store, /primary care/i);

      // Act
      const screen = renderWithStoreAndRouter(<VAFacilityPage />, {
        store,
      });

      // Assert
      // Radio buttons only show up after all the data is loaded, which
      // should mean all page rendering is finished
      await screen.findAllByRole('radio');

      expect(screen.getByText(/Which VA facility would you like to go to?/i)).to
        .exist;

      // Should contain radio buttons
      facilities.slice(0, 5).forEach(f => {
        expect(screen.baseElement).to.contain.text(f.attributes.name);
      });

      expect(screen.baseElement).not.to.contain.text('more location');
    });

    it('should display previous user choices when returning to page', async () => {
      // Arrange
      mockFacilitiesApi({
        children: true,
        ids: ['983', '984'],
        response: [
          new MockFacilityResponse({
            id: '983',
            name: 'Fake facility name 1',
          }),
          new MockFacilityResponse({
            id: '984',
          }),
        ],
      });
      mockSchedulingConfigurationsApi({
        response: [
          new MockSchedulingConfigurationResponse({
            facilityId: '983',
            services: [
              new MockServiceConfiguration({
                typeOfCareId: 'primaryCare',
                requestEnabled: true,
              }),
            ],
          }),
          new MockSchedulingConfigurationResponse({
            facilityId: '984',
            services: [
              new MockServiceConfiguration({
                typeOfCareId: 'primaryCare',
                requestEnabled: true,
              }),
            ],
          }),
        ],
      });
      mockEligibilityFetches({
        facilityId: '983',
        typeOfCareId: TYPE_OF_CARE_IDS.PRIMARY_CARE,
        limit: true,
        requestPastVisits: true,
      });
      mockEligibilityFetches({
        facilityId: '983',
        typeOfCareId: 'primaryCare',
        limit: true,
        directPastVisits: true,
      });
      const store = createTestStore(initialState);
      await setTypeOfCare(store, /primary care/i);

      // Act
      let screen = renderWithStoreAndRouter(<VAFacilityPage />, {
        store,
      });

      // Assert
      // Radio buttons only show up after all the data is loaded, which
      // should mean all page rendering is finished
      await screen.findAllByRole('radio');

      fireEvent.click(await screen.findByLabelText(/Fake facility name 1/i));

      await cleanup();

      screen = renderWithStoreAndRouter(<VAFacilityPage />, {
        store,
      });

      // Radio buttons only show up after all the data is loaded, which
      // should mean all page rendering is finished
      await screen.findAllByRole('radio');

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
      // Arrange
      mockFacilitiesApi({
        children: true,
        response: [
          new MockFacilityResponse({
            id: '983',
            name: 'Facility 983',
          })
            .setLatitude(39.1362562)
            .setLongitude(-85.6804804),
          new MockFacilityResponse({
            id: '984',
            name: 'Facility 984',
          })
            .setLatitude(39.1362562)
            .setLongitude(-86.6804804),
        ],
      });
      mockSchedulingConfigurationsApi({
        response: [
          new MockSchedulingConfigurationResponse({
            facilityId: '983',
            services: [
              new MockServiceConfiguration({
                typeOfCareId: 'primaryCare',
                directEnabled: false,
                requestEnabled: false,
              }),
            ],
          }),
          new MockSchedulingConfigurationResponse({
            facilityId: '984',
            services: [
              new MockServiceConfiguration({
                typeOfCareId: 'primaryCare',
                directEnabled: false,
                requestEnabled: false,
              }),
            ],
          }),
        ],
      });

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

      // Act
      const screen = renderWithStoreAndRouter(<VAFacilityPage />, {
        store,
      });

      // Assert
      expect(
        await screen.findByText(/You can’t schedule this appointment online/i),
      ).to.exist;
      expect(screen.baseElement).to.contain.text(
        'None of your VA facilities have online scheduling for primary care.',
      );
      expect(screen.getByText(/Facility 983/i)).to.exist;
      expect(screen.baseElement).to.contain.text('Facility 983');
      expect(screen.getAllByTestId('facility-telephone')).to.exist;
      expect(screen.getByText(/Facility 984/i)).to.exist;
    });

    it('should show no facilities message with up to five unsupported facilities for users without address', async () => {
      // Arrange
      const facilityDetails = new MockFacilityResponse({
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
      mockFacilitiesApi({
        children: true,
        ids: ['983', '984'],
        response: [
          facilityDetails,
          new MockFacilityResponse({
            id: '124',
            name: 'Facility 124',
          }),
          new MockFacilityResponse({
            id: '125',
            name: 'Facility 125',
          }),
          new MockFacilityResponse({
            id: '126',
            name: 'Facility 126',
          }),
          new MockFacilityResponse({
            id: '127',
            name: 'Facility 127',
          }),
          new MockFacilityResponse({
            id: '128',
            name: 'Facility 128',
          }),
        ],
      });

      const response = ['123', '124', '125', '126', '127', '128'].map(
        id =>
          new MockSchedulingConfigurationResponse({
            facilityId: id,
            services: [
              new MockServiceConfiguration({
                typeOfCareId: 'primaryCare',
                requestEnabled: false,
              }),
            ],
          }),
      );
      mockSchedulingConfigurationsApi({ response });

      const store = createTestStore(initialState);
      await setTypeOfCare(store, /primary care/i);

      // Act
      const screen = renderWithStoreAndRouter(<VAFacilityPage />, {
        store,
      });

      // Assert
      expect(
        await screen.findByText(/You can’t schedule this appointment online/i),
      ).to.exist;
      expect(screen.baseElement).to.contain.text(
        'None of your VA facilities have online scheduling for primary care.',
      );
      expect(screen.getByText(/Bozeman VA medical center/i)).to.exist;
      expect(screen.baseElement).to.contain.text('Bozeman VA medical center');
      expect(screen.getAllByTestId('facility-telephone')).to.exist;
      expect(screen.getByText(/Facility 124/i)).to.exist;
      expect(screen.getByText(/Facility 125/i)).to.exist;
      expect(screen.getByText(/Facility 126/i)).to.exist;
      expect(screen.getByText(/Facility 127/i)).to.exist;
      expect(screen.queryByText(/Facility 128/i)).not.to.exist;
    });

    it('should display an error message when facilities call fails', async () => {
      // Arrange
      const store = createTestStore(initialState);
      await setTypeOfCare(store, /primary care/i);

      mockFacilitiesApi({
        ids: ['983', '984'],
        responseCode: 500,
      });

      // Act
      const screen = renderWithStoreAndRouter(<VAFacilityPage />, {
        store,
      });

      // Assert
      expect(
        await screen.findByText(
          /We can’t schedule your appointment right now/i,
        ),
      ).to.exist;
    });

    it('should display correct facilities after changing type of care', async () => {
      // Arrange
      mockSchedulingConfigurationsApi({
        response: [
          new MockSchedulingConfigurationResponse({
            facilityId: '983',
            services: [
              new MockServiceConfiguration({
                typeOfCareId: 'primaryCare',
                requestEnabled: true,
              }),
            ],
          }),
          new MockSchedulingConfigurationResponse({
            facilityId: '983GB',
            services: [
              new MockServiceConfiguration({
                typeOfCareId: 'primaryCare',
                requestEnabled: true,
              }),
            ],
          }),
          new MockSchedulingConfigurationResponse({
            facilityId: '984',
            services: [
              new MockServiceConfiguration({
                typeOfCareId: 'optometry',
                requestEnabled: true,
              }),
            ],
          }),
          new MockSchedulingConfigurationResponse({
            facilityId: '984GB',
            services: [
              new MockServiceConfiguration({
                typeOfCareId: 'optometry',
                requestEnabled: true,
              }),
            ],
          }),
        ],
      });
      mockFacilitiesApi({
        children: true,
        ids: ['983', '984'],
        response: [
          new MockFacilityResponse({
            id: '983',
            name: 'First cerner facility',
          })
            .setLatitude(39.1362562)
            .setLongitude(-83.1804804),
          new MockFacilityResponse({ id: '983GB' }),
          new MockFacilityResponse({
            id: '984',
            name: 'Second Cerner facility',
          })
            .setLatitude(39.1362562)
            .setLongitude(-83.1804804),
          new MockFacilityResponse({ id: '984GB' }),
        ],
      });

      const store = createTestStore(initialState);
      await setTypeOfCare(store, /primary care/i);

      // Act
      let screen = renderWithStoreAndRouter(<VAFacilityPage />, {
        store,
      });

      // Assert
      expect(await screen.findAllByRole('radio')).to.have.length(2);

      await cleanup();

      await setTypeOfCare(store, /eye care/i);
      await setTypeOfEyeCare(store, /Optometry/);

      screen = renderWithStoreAndRouter(<VAFacilityPage />, {
        store,
      });

      expect(await screen.findAllByRole('radio')).to.have.length(2);
    });

    it('should display a list of facilities with a show more button', async () => {
      // Arrange
      const response = facilities.map(
        facility =>
          new MockSchedulingConfigurationResponse({
            facilityId: facility.id,
            services: [
              new MockServiceConfiguration({
                typeOfCareId: 'primaryCare',
                requestEnabled: true,
              }),
            ],
          }),
      );

      mockSchedulingConfigurationsApi({ response });
      mockFacilitiesApi({
        children: true,
        ids: ['983', '984'],
        response: facilities,
      });
      mockEligibilityFetches({
        facilityId: '983',
        typeOfCareId: TYPE_OF_CARE_IDS.PRIMARY_CARE,
        limit: true,
        requestPastVisits: true,
      });
      mockEligibilityFetches({
        facilityId: '983',
        typeOfCareId: 'primaryCare',
        limit: true,
        directPastVisits: true,
      });

      const store = createTestStore({
        ...initialState,
      });
      await setTypeOfCare(store, /primary care/i);

      // Act
      const screen = renderWithStoreAndRouter(<VAFacilityPage />, {
        store,
      });

      // Assert
      const buttons = await screen.findAllByRole('radio');

      await waitFor(() => {
        expect(global.document.title).to.equal(
          'Which VA facility would you like to go to? | Veterans Affairs',
        );
      });

      expect(screen.getByText(/Which VA facility would you like to go to?/i)).to
        .exist;

      expect(screen.baseElement).to.contain.text(
        'These are the facilities you’re registered at that offer primary care.',
      );

      expect(await screen.findByTestId('facilitiesSelect')).to.be.ok;

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
      const moreLocationsBtn = await screen.findByTestId('show-more-locations');
      // Check the text attribute (since va-button uses the 'text' prop for its label)
      expect(moreLocationsBtn.getAttribute('text')).to.equal(
        'Show 1 more location',
      );
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
        'You must provide a response',
      );
    });

    it('should sort by distance from home address if we have coordinates', async () => {
      // Arrange
      const response = facilities.map(
        facility =>
          new MockSchedulingConfigurationResponse({
            facilityId: facility.id,
            services: [
              new MockServiceConfiguration({
                typeOfCareId: 'primaryCare',
                requestEnabled: true,
              }),
            ],
          }),
      );

      mockSchedulingConfigurationsApi({ response });
      mockFacilitiesApi({
        children: true,
        ids: ['983', '984'],
        response: facilities,
      });
      mockEligibilityFetches({
        facilityId: '983',
        typeOfCareId: TYPE_OF_CARE_IDS.PRIMARY_CARE,
        limit: true,
        requestPastVisits: true,
      });
      mockEligibilityFetches({
        facilityId: '983',
        typeOfCareId: 'primaryCare',
        limit: true,
        directPastVisits: true,
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

      // Act
      const screen = renderWithStoreAndRouter(<VAFacilityPage />, {
        store,
      });

      // Assert
      // Radio buttons only show up after all the data is loaded, which
      // should mean all page rendering is finished
      await screen.findAllByRole('radio');

      expect(screen.getByText(/Which VA facility would you like to go to?/i)).to
        .exist;
      expect(screen.baseElement).to.contain.text('Closest to your home');

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

    it('should sort by distance from current location when user selects dropdown option for current location', async () => {
      // Arrange
      const response = facilities.map(
        facility =>
          new MockSchedulingConfigurationResponse({
            facilityId: facility.id,
            services: [
              new MockServiceConfiguration({
                typeOfCareId: 'primaryCare',
                requestEnabled: true,
              }),
            ],
          }),
      );

      mockSchedulingConfigurationsApi({ response });
      mockFacilitiesApi({
        children: true,
        ids: ['983', '984'],
        response: facilities,
      });
      mockEligibilityFetches({
        facilityId: '983',
        typeOfCareId: 'primaryCare',
        limit: true,
        directPastVisits: true,
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

      // Act
      const screen = renderWithStoreAndRouter(<VAFacilityPage />, {
        store,
      });

      // Assert
      await screen.findAllByRole('radio');

      const facilitiesSelect = await screen.findByTestId('facilitiesSelect');
      // call VaSelect custom event for onChange handling
      facilitiesSelect.__events.vaSelect({
        detail: { value: 'distanceFromCurrentLocation' },
      });

      await screen.findAllByRole('radio');
      expect(screen.baseElement).to.contain.text(
        'Closest to your current location',
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

      userEvent.click(screen.getAllByRole('radio')[0]);
      fireEvent.click(screen.getByText(/Continue/));
    });

    it('should sort alphabetically when user selects dropdown option for alphabetical', async () => {
      // Arrange
      const response = facilities.map(
        facility =>
          new MockSchedulingConfigurationResponse({
            facilityId: facility.id,
            services: [
              new MockServiceConfiguration({
                typeOfCareId: 'primaryCare',
                requestEnabled: true,
              }),
            ],
          }),
      );

      mockSchedulingConfigurationsApi({ response });
      mockFacilitiesApi({
        children: true,
        ids: ['983', '984'],
        response: facilities,
      });
      mockEligibilityFetches({
        facilityId: '983',
        typeOfCareId: 'primaryCare',
        limit: true,
        directPastVisits: true,
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

      // Act
      const screen = renderWithStoreAndRouter(<VAFacilityPage />, { store });

      // Assert
      await screen.findAllByRole('radio');
      // default sorted by home address
      let firstRadio = screen.container.querySelector('.form-radio-buttons');
      expect(firstRadio).to.contain.text('Closest facility');

      const facilitiesSelect = await screen.findByTestId('facilitiesSelect');
      // call VaSelect custom event for onChange handling
      facilitiesSelect.__events.vaSelect({
        detail: { value: 'alphabetical' },
      });

      await screen.findAllByRole('radio');
      expect(facilitiesSelect.value).to.equal('alphabetical');

      firstRadio = screen.container.querySelector('.form-radio-buttons');
      expect(firstRadio).to.contain.text('ABC facility');
    });

    it('should sort alphabetically when user does not have an address', async () => {
      // Arrange
      const response = facilities.reduce((acc, facility) => {
        if (facility.id === '983' || facility.id === '984') {
          const config = new MockSchedulingConfigurationResponse({
            facilityId: facility.id,
            services: [
              new MockServiceConfiguration({
                typeOfCareId: 'primaryCare',
                directEnabled: true,
                requestEnabled: false,
              }),
            ],
          });
          return [...acc, config];
        }
        return [...acc];
      }, []);

      mockSchedulingConfigurationsApi({ response });
      mockFacilitiesApi({
        children: true,
        response: [
          new MockFacilityResponse({
            id: '983',
            name: 'Facility 983',
          })
            .setLatitude(41.148179)
            .setLongitude(-104.786159),
          new MockFacilityResponse({
            id: '984',
            name: 'Closest facility',
          })
            .setLatitude('39.7424427')
            .setLongitude(-84.2651895),
        ],
      });
      mockGetCurrentPosition();
      const store = createTestStore({
        ...initialState,
        user: {
          ...initialState.user,
          profile: {
            ...initialState.user.profile,
            vapContactInfo: {},
          },
        },
      });
      await setTypeOfCare(store, /primary care/i);

      // Act
      const screen = renderWithStoreAndRouter(<VAFacilityPage />, { store });

      // Assert
      await screen.findAllByRole('radio');
      // default sorted by home address
      const firstRadio = screen.container.querySelector('.form-radio-buttons');
      expect(firstRadio).to.contain.text('Closest facility');
    });
  });

  describe('when there is a single supported facility', () => {
    const initialState = {
      featureToggles: {
        vaOnlineSchedulingDirect: true,
      },
      user: {
        profile: {
          facilities: [{ facilityId: '983', isCerner: false }],
        },
      },
    };

    beforeEach(() => {
      mockFetch();
    });

    it('should show facility information without form', async () => {
      // Arrange
      mockFacilitiesApi({
        children: true,
        ids: ['983'],
        response: [
          new MockFacilityResponse({
            id: '983',
            name: 'San Diego VA Medical Center',
          })
            .setAddress({
              line: ['2360 East Pershing Boulevard'],
              city: 'San Diego',
              state: 'CA',
              postalCode: '92128',
            })
            .setPhoneNumber('858-779-0338'),
        ],
      });
      mockEligibilityFetches({
        facilityId: '983',
        typeOfCareId: 'primaryCare',
        limit: true,
        directPastVisits: true,
      });
      mockSchedulingConfigurationsApi({
        response: [
          new MockSchedulingConfigurationResponse({
            facilityId: '983',
            services: [
              new MockServiceConfiguration({
                typeOfCareId: 'primaryCare',
                requestEnabled: true,
              }),
            ],
          }),
        ],
      });

      const store = createTestStore(initialState);
      await setTypeOfCare(store, /primary care/i);

      // Act
      const { baseElement, findByText, history } = renderWithStoreAndRouter(
        <VAFacilityPage />,
        {
          store,
        },
      );

      // Assert
      await findByText(
        /We found 1 VA facility for your primary care appointment./i,
      );

      expect(baseElement).to.contain.text('San Diego VA Medical Center');
      expect(baseElement).to.contain.text('San Diego, CaliforniaCA');

      fireEvent.click(await findByText(/Continue/));
      await waitFor(() =>
        expect(history.push.firstCall.args[0]).to.equal('va-request/'),
      );
    });

    it('should switch to multi facility view when type of care changes to one that has multiple supported facilities', async () => {
      // Arrange
      mockFacilitiesApi({
        children: true,
        ids: ['983'],
        response: [
          new MockFacilityResponse({
            id: '983',
            name: 'Facility 1',
          }),
          new MockFacilityResponse({
            id: '983GC',
            name: 'Facility 2',
          }),
          new MockFacilityResponse({
            id: '983GD',
            name: 'Facility 3',
          }),
        ],
      });
      mockEligibilityFetches({
        facilityId: '983',
        typeOfCareId: 'optometry',
        limit: true,
        directPastVisits: true,
      });
      mockEligibilityFetches({
        facilityId: '983GC',
        typeOfCareId: 'ophthalmology',
        limit: true,
        directPastVisits: true,
      });
      mockSchedulingConfigurationsApi({
        response: [
          new MockSchedulingConfigurationResponse({
            facilityId: '983',
            services: [
              new MockServiceConfiguration({
                typeOfCareId: 'optometry',
                requestEnabled: true,
              }),
            ],
          }),
          new MockSchedulingConfigurationResponse({
            facilityId: '983GC',
            services: [
              new MockServiceConfiguration({
                typeOfCareId: 'ophthalmology',
                directEnabled: true,
              }),
            ],
          }),
          new MockSchedulingConfigurationResponse({
            facilityId: '983GD',
            services: [
              new MockServiceConfiguration({
                typeOfCareId: 'ophthalmology',
                directEnabled: true,
              }),
            ],
          }),
        ],
      });

      const store = createTestStore(initialState);
      await setTypeOfCare(store, /eye care/i);
      await setTypeOfEyeCare(store, /Optometry/);

      // Act
      let screen = renderWithStoreAndRouter(<VAFacilityPage />, {
        store,
      });

      // Assert
      await screen.findByText(/You can.t schedule an appointment online/i);

      await cleanup();
      await setTypeOfEyeCare(store, /Ophthalmology/);
      screen = renderWithStoreAndRouter(<VAFacilityPage />, {
        store,
      });

      expect(await screen.findByRole('radio', { name: /Facility 2/i }));
      expect(screen.getByRole('radio', { name: /Facility 3/i }));
    });

    it('should filter out facilities without a physical location', async () => {
      // Arrange
      mockFacilitiesApi({
        children: true,
        ids: ['983'],
        response: [
          new MockFacilityResponse({
            id: '983',
            name: 'Facility 1',
          }),
          new MockFacilityResponse({
            id: '984',
            name: 'Facility 2',
          }).setAddress({ city: null, state: null }),
          new MockFacilityResponse({
            id: '983GA',
            name: 'Facility 3',
          }),
        ],
      });
      mockEligibilityFetches({
        facilityId: '983',
        typeOfCareId: 'primaryCare',
        limit: true,
        directPastVisits: true,
      });
      mockEligibilityFetches({
        facilityId: '984',
        typeOfCareId: 'primaryCare',
        limit: true,
        directPastVisits: true,
      });
      mockEligibilityFetches({
        facilityId: '983GA',
        typeOfCareId: 'primaryCare',
        limit: true,
        directPastVisits: true,
      });
      mockSchedulingConfigurationsApi({
        response: [
          new MockSchedulingConfigurationResponse({
            facilityId: '983',
            services: [
              new MockServiceConfiguration({
                typeOfCareId: 'primaryCare',
                directEnabled: true,
              }),
            ],
          }),
          new MockSchedulingConfigurationResponse({
            facilityId: '984',
            services: [
              new MockServiceConfiguration({
                typeOfCareId: 'primaryCare',
                directEnabled: true,
              }),
            ],
          }),
          new MockSchedulingConfigurationResponse({
            facilityId: '983GA',
            services: [
              new MockServiceConfiguration({
                typeOfCareId: 'primaryCare',
                directEnabled: true,
              }),
            ],
          }),
        ],
      });

      const store = createTestStore(initialState);
      await setTypeOfCare(store, /primary care/i);

      // Act
      const screen = renderWithStoreAndRouter(<VAFacilityPage />, {
        store,
      });

      // Assert
      await screen.findAllByRole('radio');

      expect(await screen.findByRole('radio', { name: /Facility 1/i }));
      expect(screen.getByRole('radio', { name: /Facility 3/i }));
      expect(screen.queryByText(/Facility 2/i)).not.to.exist;
    });
  });

  describe('when using Drupal Source of Truth', () => {
    beforeEach(() => mockFetch());

    it('should display Cerner sites in the facility list ', async () => {
      // Arrange
      const initialState = {
        drupalStaticData: {
          vamcEhrData: {
            loading: false,
            data: {
              ehrDataByVhaId: {
                442: {
                  vhaId: '442',
                  vamcFacilityName: 'Cheyenne VA Medical Center',
                  vamcSystemName: 'VA Cheyenne health care',
                  ehr: 'cerner',
                },
                552: {
                  vhaId: '552',
                  vamcFacilityName: 'Dayton VA Medical Center',
                  vamcSystemName: 'VA Dayton health care',
                  ehr: 'cerner',
                },
              },
              cernerFacilities: [
                {
                  vhaId: '442',
                  vamcFacilityName: 'Cheyenne VA Medical Center',
                  vamcSystemName: 'VA Cheyenne health care',
                  ehr: 'cerner',
                },
                {
                  vhaId: '552',
                  vamcFacilityName: 'Dayton VA Medical Center',
                  vamcSystemName: 'VA Dayton health care',
                  ehr: 'cerner',
                },
              ],
              vistaFacilities: [],
            },
          },
        },
        featureToggles: {
          vaOnlineSchedulingDirect: true,
        },
        user: {
          profile: {
            facilities: [
              {
                facilityId: '442', // Must use real facility id when using DSOT
                isCerner: false, // Not used when using DSOT
              },
              { facilityId: '552', isCerner: false },
            ],
          },
        },
      };

      mockFacilitiesApi({
        children: true,
        response: [
          new MockFacilityResponse({
            id: '983',
            name: 'First cerner facility',
          })
            .setLatitude(39.1362562)
            .setLongitude(-83.1804804),
          new MockFacilityResponse({
            id: '984',
            name: 'Second Cerner facility',
          })
            .setLatitude(39.1362562)
            .setLongitude(-83.1804804),
        ],
      });

      mockSchedulingConfigurationsApi({
        response: [
          new MockSchedulingConfigurationResponse({
            facilityId: '983',
            services: [
              new MockServiceConfiguration({
                typeOfCareId: 'primaryCare',
                directEnabled: true,
              }),
            ],
          }),
          new MockSchedulingConfigurationResponse({
            facilityId: '984',
            services: [
              new MockServiceConfiguration({
                typeOfCareId: 'primaryCare',
                directEnabled: true,
              }),
            ],
          }),
        ],
      });

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

      // Act
      const screen = renderWithStoreAndRouter(<VAFacilityPage />, {
        store,
      });

      // Assert
      // Make sure Cerner facilities show up
      expect(await screen.findByText(/First Cerner facility/i)).to.be.ok;
      expect(screen.getByText(/Second Cerner facility/i)).to.be.ok;

      // Make sure Cerner facilities show up only once
      expect(screen.getAllByText(/Second Cerner facility/i)).to.have.length(1);
      userEvent.click(screen.getByLabelText(/First cerner facility/i));
      userEvent.click(screen.getByText(/Continue/));
      await waitFor(() =>
        expect(screen.history.push.firstCall.args[0]).to.equal(
          'how-to-schedule',
        ),
      );
    });
  });
});
