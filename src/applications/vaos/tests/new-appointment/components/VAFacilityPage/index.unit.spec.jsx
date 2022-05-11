import React from 'react';
import userEvent from '@testing-library/user-event';
import { expect } from 'chai';

import { mockFetch } from 'platform/testing/unit/helpers';
import { fireEvent, waitFor, within } from '@testing-library/dom';
import { cleanup } from '@testing-library/react';
import VAFacilityPage from '../../../../new-appointment/components/VAFacilityPage/VAFacilityPageV2';
import {
  getParentSiteMock,
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
  mockGetCurrentPosition,
} from '../../../mocks/helpers';
import {
  mockSchedulingConfigurations,
  mockVAOSParentSites,
} from '../../../mocks/helpers.v2';
import { getSchedulingConfigurationMock } from '../../../mocks/v2';
import { NewAppointment } from '../../../../new-appointment';
import { FETCH_STATUS } from '../../../../utils/constants';
import { createMockFacilityByVersion } from '../../../mocks/data';
import { mockFacilitiesFetchByVersion } from '../../../mocks/fetch';

describe('VAOS <VAFacilityPage>', () => {
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

    const requestFacilityAttributes = getRequestEligibilityCriteriaMock()
      .attributes;

    const facilityIds = ['983', '983GC', '983GB', '983HK', '983QA', '984'];

    const requestFacilities = facilityIds.map(id =>
      getRequestEligibilityCriteriaMock({
        id,
        typeOfCareId,
      }),
    );

    const directFacilities = facilityIds.map(id =>
      getDirectBookingEligibilityCriteriaMock({
        id,
        typeOfCareId,
      }),
    );

    const vhaIds = facilityIds.map(
      id => `vha_${id.replace('983', '442').replace('984', '552')}`,
    );

    const facilities = vhaIds.map((id, index) =>
      createMockFacilityByVersion({
        id: id.replace('vha_', ''),
        name: `Fake facility name ${index + 1}`,
        lat: Math.random() * 90,
        long: Math.random() * 180,
        address: {
          city: `Fake city ${index + 1}`,
        },
        version: 0,
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
      mockParentSites(parentSiteIds, [parentSite983, parentSite984]);
      mockDirectBookingEligibilityCriteria(parentSiteIds, directFacilities);
      mockRequestEligibilityCriteria(parentSiteIds, requestFacilities);
      mockFacilitiesFetchByVersion({ facilities, version: 0 });
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
      mockParentSites(parentSiteIds, [parentSite983, parentSite984]);
      mockDirectBookingEligibilityCriteria(
        parentSiteIds,
        directFacilities.slice(0, 5),
      );
      mockRequestEligibilityCriteria(
        parentSiteIds,
        requestFacilities.slice(0, 5),
      );
      mockFacilitiesFetchByVersion({
        facilities: facilities.slice(0, 5),
        version: 0,
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

      // Radio buttons only show up after all the data is loaded, which
      // should mean all page rendering is finished
      await screen.findAllByRole('radio');

      expect(screen.getByText(/Choose a VA location/i)).to.exist;

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
      mockFacilitiesFetchByVersion({
        facilities,
        version: 0,
      });
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
      const facilityDetails = createMockFacilityByVersion({
        id: '123',
        name: 'Bozeman VA medical center',
        lat: 39.1362562,
        long: -85.6804804,
        version: 0,
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
      mockFacilitiesFetchByVersion({
        facilities: [
          facilityDetails,
          createMockFacilityByVersion({
            id: '124',
            name: 'Facility 124',
            lat: 39.1362562,
            long: -85.6804804,
            version: 0,
          }),
          createMockFacilityByVersion({
            id: '125',
            name: 'Facility 125',
            lat: 39.1362562,
            long: -86.6804804,
            version: 0,
          }),
        ],
        version: 0,
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

      const screen = renderWithStoreAndRouter(<VAFacilityPage />, {
        store,
      });

      expect(await screen.findByText(/We couldn’t find a VA facility/i)).to
        .exist;
      expect(screen.baseElement).to.contain.text(
        'None of the facilities where you receive care accepts online appointments for primary care.',
      );
      expect(screen.getByText(/Bozeman VA medical center/i)).to.exist;
      expect(screen.baseElement).to.contain.text('Bozeman, MontanaMT');
      expect(screen.getAllByTestId('facility-telephone')).to.exist;
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
      const facilityDetails = createMockFacilityByVersion({
        id: '123',
        name: 'Bozeman VA medical center',
        version: 0,
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
      mockFacilitiesFetchByVersion({
        facilities: [
          facilityDetails,
          createMockFacilityByVersion({
            id: '124',
            name: 'Facility 124',
            version: 0,
          }),
          createMockFacilityByVersion({
            id: '125',
            name: 'Facility 125',
            version: 0,
          }),
          createMockFacilityByVersion({
            id: '126',
            name: 'Facility 126',
            version: 0,
          }),
          createMockFacilityByVersion({
            id: '127',
            name: 'Facility 127',
            version: 0,
          }),
          createMockFacilityByVersion({
            id: '128',
            name: 'Facility 128',
            version: 0,
          }),
        ],
        version: 0,
      });

      const store = createTestStore(initialState);
      await setTypeOfCare(store, /primary care/i);

      const screen = renderWithStoreAndRouter(<VAFacilityPage />, {
        store,
      });

      expect(await screen.findByText(/We couldn’t find a VA facility/i)).to
        .exist;
      expect(screen.baseElement).to.contain.text(
        'None of the facilities where you receive care accepts online appointments for primary care.',
      );
      expect(screen.getByText(/Bozeman VA medical center/i)).to.exist;
      expect(screen.baseElement).to.contain.text('Bozeman, MontanaMT');
      expect(screen.getAllByTestId('facility-telephone')).to.exist;
      expect(screen.getByText(/Facility 124/i)).to.exist;
      expect(screen.getByText(/Facility 125/i)).to.exist;
      expect(screen.getByText(/Facility 126/i)).to.exist;
      expect(screen.getByText(/Facility 127/i)).to.exist;
      expect(screen.queryByText(/Facility 128/i)).not.to.exist;
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
      mockFacilitiesFetchByVersion({
        facilities: [
          createMockFacilityByVersion({
            id: '983',
            name: 'Facility that is enabled',
            version: 0,
          }),
          createMockFacilityByVersion({
            id: '983GC',
            name: 'Facility that is also enabled',
            version: 0,
          }),
          createMockFacilityByVersion({
            id: '984',
            name: 'Facility that is disabled',
            lat: 39.1362562,
            // tweaked longitude to be around 80 miles away
            long: -83.1804804,
            address: {
              city: 'Bozeman',
              state: 'MT',
            },
            phone: '5555555555x1234',
            version: 0,
          }),
          createMockFacilityByVersion({
            id: '984GC',
            name: 'Facility that is over 100 miles away and disabled',
            lat: 39.1362562,
            // tweaked longitude to be over 100 miles away
            long: -82.1804804,
            version: 0,
          }),
        ],
        version: 0,
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
      const screen = renderWithStoreAndRouter(<VAFacilityPage />, {
        store,
      });
      expect(await screen.findByLabelText(/Facility that is enabled/i)).to.be
        .ok;
      expect(screen.queryByText(/Facility that is disabled/i)).not.to.be.ok;
      const additionalInfoButton = screen.getByText(
        /Why isn.t my facility listed/i,
      );
      userEvent.click(additionalInfoButton);
      await screen.findByText(/Facility that is disabled/i);
      expect(screen.baseElement).to.contain.text('Bozeman, MontanaMT');
      expect(screen.getByText(/80\.4 miles/i)).to.be.ok;
      expect(screen.getByTestId('facility-telephone')).to.exist;
      expect(
        screen.queryByText(
          /Facility that is over 100 miles away and disabled/i,
        ),
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
      mockFacilitiesFetchByVersion({
        facilities: [
          createMockFacilityByVersion({
            id: '983',
            name: 'Facility that is enabled',
            version: 0,
          }),
          createMockFacilityByVersion({
            id: '983GC',
            name: 'Facility that is also enabled',
            version: 0,
          }),
          createMockFacilityByVersion({
            id: '984',
            name: 'Disabled facility near residential address',
            lat: 39.1362562,
            long: -83.1804804,
            version: 0,
          }),
          createMockFacilityByVersion({
            id: '984GC',
            name: 'Disabled facility near current location',
            lat: 53.2734,
            long: -7.77832031,
            version: 0,
          }),
        ],
        version: 0,
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
      expect(await screen.findByLabelText(/Facility that is enabled/i)).to.be
        .ok;
      let additionalInfoButton = screen.getByText(
        /Why isn.t my facility listed/i,
      );
      userEvent.click(additionalInfoButton);
      expect(
        await screen.findByText(/Disabled facility near residential address/i),
      ).to.be.ok;
      expect(screen.queryByText(/Disabled facility near current location/i)).not
        .to.be.ok;

      const facilitiesSelect = await screen.findByTestId('facilitiesSelect');
      // call VaSelect custom event for onChange handling
      facilitiesSelect.__events.vaSelect({
        detail: { value: 'distanceFromCurrentLocation' },
      });

      expect(await screen.findByLabelText(/Facility that is enabled/i)).to.be
        .ok;

      additionalInfoButton = screen.getByText(/Why isn.t my facility listed/i);
      userEvent.click(additionalInfoButton);
      expect(
        await screen.findByText(/Disabled facility near current location/i),
      ).to.be.ok;
      expect(screen.queryByText(/Disabled facility near residential address/i))
        .not.to.be.ok;
    });

    it.skip('should display correct facilities after changing type of care', async () => {
      const facilityIdsForTwoTypesOfCare = ['983', '983GC', '983QA', '984'];
      mockParentSites(parentSiteIds, [parentSite983, parentSite984]);
      mockDirectBookingEligibilityCriteria(
        parentSiteIds,
        facilityIdsForTwoTypesOfCare.map(id =>
          getDirectBookingEligibilityCriteriaMock({ id, typeOfCareId: '323' }),
        ),
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
      mockFacilitiesFetchByVersion({
        facilities: facilities.filter(facility =>
          vhaIdentifiers.includes(facility.id),
        ),
        version: 0,
      });
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

    it('should display Cerner sites in the facility list ', async () => {
      mockParentSites(parentSiteIds, [parentSite983, parentSite984]);
      mockDirectBookingEligibilityCriteria(parentSiteIds, [
        getDirectBookingEligibilityCriteriaMock({
          id: '983',
          typeOfCareId: '323',
        }),
        getDirectBookingEligibilityCriteriaMock({
          id: '983GC',
          typeOfCareId: '323',
          patientHistoryRequired: null,
        }),
        getDirectBookingEligibilityCriteriaMock({
          id: '984',
          typeOfCareId: '323',
          patientHistoryRequired: null,
        }),
      ]);
      mockRequestEligibilityCriteria(parentSiteIds, [
        getRequestEligibilityCriteriaMock({
          id: '983',
          typeOfCareId: '323',
          patientHistoryRequired: null,
        }),
        getRequestEligibilityCriteriaMock({
          id: '983GC',
          typeOfCareId: '323',
          patientHistoryRequired: null,
        }),
        getRequestEligibilityCriteriaMock({
          id: '984',
          typeOfCareId: '323',
          patientHistoryRequired: null,
        }),
      ]);
      mockFacilitiesFetchByVersion({
        facilities: [
          createMockFacilityByVersion({
            id: '983',
            name: 'First cerner facility',
            lat: 39.1362562,
            long: -83.1804804,
            version: 0,
          }),
          createMockFacilityByVersion({
            id: '983GC',
            name: 'Second cerner facility',
            lat: 39.1362562,
            long: -83.1804804,
            version: 0,
          }),
          createMockFacilityByVersion({
            id: '984',
            name: 'Vista facility',
            lat: 39.1362562,
            long: -83.1804804,
            version: 0,
          }),
        ],
        version: 0,
      });
      const store = createTestStore({
        ...initialState,
        user: {
          ...initialState.user,
          profile: {
            ...initialState.user.profile,
            facilities: [
              { facilityId: '983', isCerner: true },
              { facilityId: '984', isCerner: false },
            ],
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

      // Make sure Cerner facilities show up
      expect(await screen.findByText(/First Cerner facility/i)).to.be.ok;
      expect(screen.getByText(/Second Cerner facility/i)).to.be.ok;

      // Make sure Cerner link shows up
      const cernerSiteLabel = document.querySelector(
        `label[for="${screen.getByLabelText(/First Cerner facility/i).id}"]`,
      );
      expect(
        within(cernerSiteLabel)
          .getByRole('link', { name: /My VA Health/ })
          .getAttribute('href'),
      ).to.contain('pages%2Fscheduling%2Fupcoming');

      userEvent.click(screen.getByText(/Why isn.t my facility listed/i));
      await waitFor(() => {
        expect(screen.getByText(/Vista facility/i));
      });

      // Make sure Cerner facilities show up only once
      expect(screen.getAllByText(/Second Cerner facility/i)).to.have.length(1);
      userEvent.click(screen.getByLabelText(/First cerner facility/i));
      userEvent.click(screen.getByText(/Continue/));
      await waitFor(() =>
        expect(screen.history.push.firstCall.args[0]).to.equal(
          '/new-appointment/how-to-schedule',
        ),
      );
    });

    it('should display a list of facilities with a show more button', async () => {
      mockParentSites(parentSiteIds, [parentSite983, parentSite984]);
      mockDirectBookingEligibilityCriteria(parentSiteIds, directFacilities);
      mockRequestEligibilityCriteria(parentSiteIds, requestFacilities);
      mockFacilitiesFetchByVersion({ facilities, version: 0 });
      mockEligibilityFetches({
        siteId: '983',
        facilityId: '983',
        typeOfCareId: '323',
      });
      const store = createTestStore({
        ...initialState,
        featureToggles: {
          vaOnlineSchedulingVariantTesting: true,
        },
      });
      await setTypeOfCare(store, /primary care/i);

      const screen = renderWithStoreAndRouter(<VAFacilityPage />, {
        store,
      });

      const buttons = await screen.findAllByRole('radio');

      await waitFor(() => {
        expect(global.document.title).to.equal(
          'Choose a VA location | Veterans Affairs',
        );
      });

      expect(screen.getByText(/Choose a VA location/i)).to.exist;

      expect(screen.baseElement).to.contain.text(
        'Select a VA facility where you’re registered that offers primary care appointments.',
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

    it('should sort by distance from home address if we have coordinates', async () => {
      mockParentSites(parentSiteIds, [parentSite983, parentSite984]);
      mockDirectBookingEligibilityCriteria(parentSiteIds, directFacilities);
      mockRequestEligibilityCriteria(parentSiteIds, requestFacilities);
      mockFacilitiesFetchByVersion({ facilities, version: 0 });
      mockEligibilityFetches({
        siteId: '983',
        facilityId: '983',
        typeOfCareId: '323',
      });
      const store = createTestStore({
        ...initialState,
        featureToggles: {
          vaOnlineSchedulingVariantTesting: true,
        },
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

      expect(screen.getByText(/Choose a VA location/i)).to.exist;
      expect(screen.baseElement).to.contain.text('By your home address');

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
      mockParentSites(parentSiteIds, [parentSite983, parentSite984]);
      mockDirectBookingEligibilityCriteria(parentSiteIds, directFacilities);
      mockRequestEligibilityCriteria(parentSiteIds, requestFacilities);
      mockFacilitiesFetchByVersion({ facilities, version: 0 });
      mockEligibilityFetches({
        siteId: '983',
        facilityId: '983',
        typeOfCareId: '323',
      });
      mockGetCurrentPosition();
      const store = createTestStore({
        ...initialState,
        featureToggles: {
          vaOnlineSchedulingVariantTesting: true,
        },
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

      const facilitiesSelect = await screen.findByTestId('facilitiesSelect');
      // call VaSelect custom event for onChange handling
      facilitiesSelect.__events.vaSelect({
        detail: { value: 'distanceFromCurrentLocation' },
      });

      await screen.findAllByRole('radio');
      expect(screen.baseElement).to.contain.text('By your current location');

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
      await waitFor(() => {
        expect(
          global.window.dataLayer.find(
            ev => ev.event === 'vaos-variant-final-distanceFromCurrentLocation',
          ),
        ).to.exist;
      });
    });

    it('should sort alphabetically when user selects dropdown option for alphabetical', async () => {
      mockParentSites(parentSiteIds, [parentSite983, parentSite984]);
      mockDirectBookingEligibilityCriteria(parentSiteIds, directFacilities);
      mockRequestEligibilityCriteria(parentSiteIds, requestFacilities);
      mockFacilitiesFetchByVersion({ facilities, version: 0 });
      mockEligibilityFetches({
        siteId: '983',
        facilityId: '983',
        typeOfCareId: '323',
      });
      mockGetCurrentPosition();
      const store = createTestStore({
        ...initialState,
        featureToggles: {
          vaOnlineSchedulingVariantTesting: true,
        },
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

      const screen = renderWithStoreAndRouter(<VAFacilityPage />, { store });
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
      expect(
        global.window.dataLayer.find(
          ev => ev.event === 'vaos-variant-method-alphabetical',
        ),
      ).to.exist;
    });

    it('should sort alphabetically when user does not have an address', async () => {
      mockParentSites(parentSiteIds, [parentSite983, parentSite984]);
      mockDirectBookingEligibilityCriteria(parentSiteIds, directFacilities);
      mockRequestEligibilityCriteria(parentSiteIds, requestFacilities);
      mockFacilitiesFetchByVersion({ facilities, version: 0 });
      mockEligibilityFetches({
        siteId: '983',
        facilityId: '983',
        typeOfCareId: '323',
      });
      mockGetCurrentPosition();
      const store = createTestStore({
        ...initialState,
        featureToggles: {
          vaOnlineSchedulingVariantTesting: true,
        },
        user: {
          ...initialState.user,
          profile: {
            ...initialState.user.profile,
            vapContactInfo: {},
          },
        },
      });
      await setTypeOfCare(store, /primary care/i);

      const screen = renderWithStoreAndRouter(<VAFacilityPage />, { store });
      await screen.findAllByRole('radio');
      // default sorted by home address
      const firstRadio = screen.container.querySelector('.form-radio-buttons');
      expect(firstRadio).to.contain.text('ABC facility');
    });

    it('should fire variant shown and default sort method events when variant shown', async () => {
      const store = createTestStore({
        ...initialState,
        featureToggles: {
          vaOnlineSchedulingVariantTesting: true,
        },
        newAppointment: {
          ...initialState.newAppointment,
          facilityPageSortMethod: 'alphabetical',
          childFacilitiesStatus: FETCH_STATUS.succeeded,
          data: {
            vaFacility: '983',
          },
          pages: {
            vaFacilityV2: {
              properties: {
                vaFacility: {
                  enum: [{}, {}],
                },
              },
            },
          },
        },
      });

      renderWithStoreAndRouter(<NewAppointment />, {
        store,
      });

      await waitFor(() => {
        expect(
          global.window.dataLayer.find(ev => ev.event === 'vaos-variant-shown'),
        ).to.exist;
        expect(
          global.window.dataLayer.find(
            ev => ev.event === 'vaos-variant-default-alphabetical',
          ),
        ).to.exist;
      });
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
      const siteIds = ['983'];

      mockParentSites(siteIds, [
        getParentSiteMock({ id: '983', name: 'Some facility name' }),
      ]);
      mockDirectBookingEligibilityCriteria(siteIds, [
        getDirectBookingEligibilityCriteriaMock({
          id: '983',
          typeOfCareId: '323',
        }),
      ]);
      mockRequestEligibilityCriteria(siteIds, [
        getRequestEligibilityCriteriaMock({
          id: '983',
          typeOfCareId: '323',
        }),
      ]);
      mockFacilitiesFetchByVersion({
        facilities: [
          createMockFacilityByVersion({
            id: '442',
            name: 'San Diego VA Medical Center',
            address: {
              line: ['2360 East Pershing Boulevard'],
              city: 'San Diego',
              state: 'CA',
              postalCode: '92128',
            },
            phone: '858-779-0338',
            version: 0,
          }),
        ],
        version: 0,
      });
    });
    it('should show facility information without form', async () => {
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
      expect(baseElement).to.contain.text('San Diego, CaliforniaCA');

      fireEvent.click(await findByText(/Continue/));
      await waitFor(() =>
        expect(history.push.firstCall.args[0]).to.equal(
          '/new-appointment/request-date',
        ),
      );
    });

    it('should switch to multi facility view when type of care changes to one that has multiple supported facilities', async () => {
      const siteIds = ['983'];
      mockDirectBookingEligibilityCriteria(siteIds, []);
      mockRequestEligibilityCriteria(siteIds, [
        getRequestEligibilityCriteriaMock({ id: '983', typeOfCareId: '408' }),
        getRequestEligibilityCriteriaMock({ id: '983GC', typeOfCareId: '407' }),
        getRequestEligibilityCriteriaMock({ id: '983GD', typeOfCareId: '407' }),
      ]);
      mockFacilitiesFetchByVersion({
        facilities: [
          createMockFacilityByVersion({
            id: '442',
            name: 'Facility 1',
            version: 0,
          }),
          createMockFacilityByVersion({
            id: '442GC',
            name: 'Facility 2',
            version: 0,
          }),
          createMockFacilityByVersion({
            id: '442GD',
            name: 'Facility 3',
            version: 0,
          }),
        ],
        version: 0,
      });
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

  describe('when using V2 api', () => {
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
    beforeEach(() => mockFetch());
    it('should display list of facilities with show more button', async () => {
      mockVAOSParentSites(
        ['983', '984'],
        [
          getParentSiteMock({ id: '983', name: 'Some VA facility' }),
          getParentSiteMock({ id: '984', name: 'Some VA facility 2' }),
        ],
      );
      mockSchedulingConfigurations([
        getSchedulingConfigurationMock({
          id: '983',
          typeOfCareId: 'primaryCare',
          requestEnabled: true,
        }),
        getSchedulingConfigurationMock({
          id: '984',
          typeOfCareId: 'primaryCare',
          directEnabled: true,
        }),
        getSchedulingConfigurationMock({
          id: '984GC',
          typeOfCareId: 'primaryCare',
        }),
      ]);
      mockFacilitiesFetchByVersion({
        ids: ['983', '984'],
        facilities: [
          createMockFacilityByVersion({ id: '983', name: 'A facility name' }),
          createMockFacilityByVersion({
            id: '984',
            name: 'Another facility name',
          }),
          createMockFacilityByVersion({
            id: '984GC',
            name: 'Disabled facility name',
          }),
        ],
        children: true,
      });
      mockEligibilityFetches({
        siteId: '983',
        facilityId: '983',
        typeOfCareId: '323',
      });
      const store = createTestStore({
        ...initialState,
        featureToggles: {
          ...initialState.featureToggles,
          vaOnlineSchedulingFacilitiesServiceV2: true,
        },
      });
      await setTypeOfCare(store, /primary care/i);

      const screen = renderWithStoreAndRouter(<VAFacilityPage />, {
        store,
      });
      await screen.findAllByRole('radio');

      await waitFor(() => {
        expect(global.document.title).to.equal(
          'Choose a VA location | Veterans Affairs',
        );
      });

      expect(screen.getByText(/Choose a VA location/i)).to.exist;

      expect(screen.baseElement).to.contain.text(
        'Select a VA facility where you’re registered that offers primary care appointments',
      );

      expect(screen.baseElement).to.contain.text('A facility name');
      expect(screen.baseElement).to.contain.text('Another facility name');
      expect(screen.baseElement).not.to.contain.text('Disabled facility name');

      // Should validation message if no facility selected
      fireEvent.click(screen.getByText(/Continue/));
      expect(await screen.findByRole('alert')).to.contain.text(
        'Please provide a response',
      );
    });
  });
});
