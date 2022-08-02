import React from 'react';
import { expect } from 'chai';

import { mockFetch } from 'platform/testing/unit/helpers';
import { fireEvent, waitFor } from '@testing-library/dom';
import VAFacilityPage from '../../../../new-appointment/components/VAFacilityPage/VAFacilityPageV2';
import {
  getParentSiteMock,
  getClinicMock,
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
} from '../../../mocks/helpers';
import {
  getSchedulingConfigurationMock,
  getV2ClinicMock,
} from '../../../mocks/v2';
import { mockSchedulingConfigurations } from '../../../mocks/helpers.v2';
import {
  mockEligibilityFetchesByVersion,
  mockFacilitiesFetchByVersion,
} from '../../../mocks/fetch';
import { createMockFacilityByVersion } from '../../../mocks/data';

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

describe('VAOS <VAFacilityPage> eligibility check', () => {
  describe('when there is a single supported facility', () => {
    const initialState = {
      featureToggles: {
        vaOnlineSchedulingCommunityCare: false,
        vaOnlineSchedulingDirect: true,
      },
      user: {
        profile: {
          facilities: [{ facilityId: '983', isCerner: false }],
        },
      },
    };
    const siteIds = ['983'];

    beforeEach(() => {
      mockFetch();

      mockParentSites(siteIds, [parentSite983]);
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

    it('should show no clinics message when direct is supported, no clinics available, requests not supported', async () => {
      mockRequestEligibilityCriteria(['983'], []);
      mockDirectBookingEligibilityCriteria(siteIds, [
        getDirectBookingEligibilityCriteriaMock({
          id: '983',
          typeOfCareId: '211',
        }),
      ]);
      mockEligibilityFetches({
        siteId: '983',
        facilityId: '983',
        typeOfCareId: '211',
        clinics: [
          {
            id: '308',
            attributes: {
              ...getClinicMock(),
              siteCode: '983',
              clinicId: '308',
              institutionCode: '983',
              clinicFriendlyLocationName: 'Green team clinic',
            },
          },
        ],
        directPastVisits: true,
        pastClinics: false,
      });
      const store = createTestStore(initialState);
      await setTypeOfCare(store, /amputation care/i);

      const screen = renderWithStoreAndRouter(<VAFacilityPage />, {
        store,
      });

      await screen.findByText(
        /doesn’t have any available clinics that support online scheduling/i,
      );

      expect(await screen.findByText(/Continue/)).to.have.attribute('disabled');
    });

    it('should show past visits message when not eligible for direct, requests are supported, no past visit', async () => {
      mockParentSites(siteIds, [parentSite983]);
      mockDirectBookingEligibilityCriteria(siteIds, []);
      mockRequestEligibilityCriteria(siteIds, [
        getRequestEligibilityCriteriaMock({
          id: '983',
          typeOfCareId: '502',
        }),
      ]);

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

      await screen.findByText(/San Diego VA Medical Center/i);
      fireEvent.click(screen.getByText(/Continue/));
      await screen.findByText(
        /you need to have had a mental health appointment at this facility within the last 12 months/,
      );
    });

    it('should show request limits message when not eligible for direct, requests are supported, over request limit', async () => {
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

      await screen.findByText(/San Diego VA Medical Center/i);

      expect(screen.baseElement).to.contain.text(
        'You can’t request another appointment until you schedule or cancel your open requests',
      );

      expect(await screen.findByText(/Continue/)).to.have.attribute('disabled');
    });

    it('should show error message when checks fail', async () => {
      const store = createTestStore(initialState);
      await setTypeOfCare(store, /primary care/i);

      const screen = renderWithStoreAndRouter(<VAFacilityPage />, {
        store,
      });

      expect(await screen.findByText(/Something went wrong on our end/)).to
        .exist;

      expect(await screen.findByText(/Continue/)).to.have.attribute('disabled');
    });
  });

  describe('when there are multiple facilities to choose from', () => {
    const initialState = {
      featureToggles: {
        vaOnlineSchedulingCommunityCare: false,
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
    const parentSiteIds = ['983', '984'];

    const facilityIds = ['983', '983GC', '983GB', '983HK', '983QA', '984'];
    const typeOfCareId = '323';
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

    beforeEach(() => mockFetch());
    it('should show past visits message when direct is supported, no past visits, requests not supported', async () => {
      mockParentSites(parentSiteIds, [parentSite983, parentSite984]);
      mockDirectBookingEligibilityCriteria(parentSiteIds, [
        parentSiteIds,
        getDirectBookingEligibilityCriteriaMock({
          id: '983',
          typeOfCareId: '502',
          patientHistoryRequired: 'Yes',
          patientHistoryDuration: 365,
        }),
        getDirectBookingEligibilityCriteriaMock({
          id: '984',
          typeOfCareId: '502',
          patientHistoryRequired: 'Yes',
          patientHistoryDuration: 365,
        }),
      ]);
      mockRequestEligibilityCriteria(parentSiteIds, []);
      mockFacilitiesFetchByVersion({
        facilities: facilities.filter(
          // Will have to remove the vha_ part of these ids when moving to
          // version 2
          f => f.id === 'vha_442' || f.id === 'vha_552',
        ),
        version: 0,
      });
      mockEligibilityFetches({
        siteId: '983',
        facilityId: '983',
        typeOfCareId: '502',
      });
      const store = createTestStore(initialState);
      await setTypeOfCare(store, /mental health/i);

      const screen = renderWithStoreAndRouter(<VAFacilityPage />, {
        store,
      });

      await screen.findByText(/Select a VA facility/i);

      fireEvent.click(await screen.findByLabelText(/Fake facility name 1/i));
      fireEvent.click(screen.getByText(/Continue/));
      await screen.findByTestId('eligibilityModal');
      expect(screen.baseElement).to.contain.text('last 12 months');
      const loadingEvent = global.window.dataLayer.find(
        ev => ev.event === 'loading-indicator-displayed',
      );

      // It should record GA event for loading modal
      expect(loadingEvent).to.exist;
      expect('loading-indicator-display-time' in loadingEvent).to.be.true;
    });

    it('should show no clinics message when direct is supported, no available clinics, requests not supported', async () => {
      mockParentSites(parentSiteIds, [parentSite983, parentSite984]);
      mockDirectBookingEligibilityCriteria(
        parentSiteIds,
        facilityIds.slice(0, 5).map(id =>
          getDirectBookingEligibilityCriteriaMock({
            id,
            typeOfCareId: '211',
          }),
        ),
      );
      mockRequestEligibilityCriteria(
        parentSiteIds,
        facilityIds.slice(0, 4).map(id =>
          getRequestEligibilityCriteriaMock({
            id,
            typeOfCareId: '211',
          }),
        ),
      );
      mockFacilitiesFetchByVersion({
        facilities: facilities.slice(0, 5),
        version: 0,
      });
      mockEligibilityFetches({
        siteId: '983',
        facilityId: '983QA',
        typeOfCareId: '211',
        directPastVisits: true,
      });
      const store = createTestStore(initialState);
      await setTypeOfCare(store, /amputation care/i);

      const screen = renderWithStoreAndRouter(<VAFacilityPage />, {
        store,
      });

      await screen.findByText(/Select a VA facility/i);

      fireEvent.click(await screen.findByLabelText(/Fake facility name 5/i));
      fireEvent.click(screen.getByText(/Continue/));
      await screen.findByTestId('eligibilityModal');
      const loadingEvent = global.window.dataLayer.find(
        ev => ev.event === 'loading-indicator-displayed',
      );

      // It should record GA event for loading modal
      expect(loadingEvent).to.exist;
      expect('loading-indicator-display-time' in loadingEvent).to.be.true;
    });

    it('should continue when primary care, direct is supported, clinics available, no matching clinics, requests not supported', async () => {
      mockParentSites(parentSiteIds, [parentSite983, parentSite984]);
      mockDirectBookingEligibilityCriteria(
        parentSiteIds,
        directFacilities.slice(0, 5),
      );
      mockRequestEligibilityCriteria(
        parentSiteIds,
        requestFacilities.slice(0, 4),
      );
      mockFacilitiesFetchByVersion({
        facilities: facilities.slice(0, 5),
        version: 0,
      });
      mockEligibilityFetches({
        siteId: '983',
        facilityId: '983QA',
        typeOfCareId: '323',
        directPastVisits: true,
        clinics: [
          {
            id: '308',
            attributes: {
              ...getClinicMock(),
              siteCode: '983',
              clinicId: '308',
              institutionCode: '983',
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

      await screen.findByText(/Select a VA facility/i);

      fireEvent.click(await screen.findByLabelText(/Fake facility name 5/i));
      fireEvent.click(screen.getByText(/Continue/));
      await waitFor(() => {
        expect(screen.history.push.lastCall.args[0]).to.equal(
          '/new-appointment/clinics',
        );
      });
    });

    it('should continue when mental health, direct is supported, clinics available, no matching clinics, requests not supported', async () => {
      mockParentSites(parentSiteIds, [parentSite983, parentSite984]);
      mockDirectBookingEligibilityCriteria(
        parentSiteIds,
        facilityIds.slice(0, 5).map(id =>
          getDirectBookingEligibilityCriteriaMock({
            id,
            typeOfCareId: '502',
          }),
        ),
      );
      mockRequestEligibilityCriteria(
        parentSiteIds,
        facilityIds.slice(0, 4).map(id =>
          getRequestEligibilityCriteriaMock({
            id,
            typeOfCareId: '502',
          }),
        ),
      );
      mockFacilitiesFetchByVersion({
        facilities: facilities.slice(0, 5),
        version: 0,
      });
      mockEligibilityFetches({
        siteId: '983',
        facilityId: '983QA',
        typeOfCareId: '502',
        directPastVisits: true,
        clinics: [
          {
            id: '308',
            attributes: {
              ...getClinicMock(),
              siteCode: '983',
              clinicId: '308',
              institutionCode: '983',
              clinicFriendlyLocationName: 'Green team clinic',
            },
          },
        ],
        pastClinics: false,
      });
      const store = createTestStore(initialState);
      await setTypeOfCare(store, /mental health/i);

      const screen = renderWithStoreAndRouter(<VAFacilityPage />, {
        store,
      });

      await screen.findByText(/Select a VA facility/i);

      fireEvent.click(await screen.findByLabelText(/Fake facility name 5/i));
      fireEvent.click(screen.getByText(/Continue/));
      await waitFor(() => {
        expect(screen.history.push.lastCall.args[0]).to.equal(
          '/new-appointment/clinics',
        );
      });
    });

    it('should show eligibility modal again when user closes it out and hits continue with the same facility', async () => {
      mockParentSites(parentSiteIds, [parentSite983, parentSite984]);
      mockDirectBookingEligibilityCriteria(
        parentSiteIds,
        directFacilities.slice(0, 5),
      );
      mockRequestEligibilityCriteria(
        parentSiteIds,
        requestFacilities.slice(0, 4),
      );
      mockFacilitiesFetchByVersion({
        facilities: facilities.slice(0, 5),
        version: 0,
      });
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

      await screen.findByText(/Select a VA facility/i);

      fireEvent.click(await screen.findByLabelText(/Fake facility name 5/i));
      fireEvent.click(screen.getByText(/Continue/));
      await screen.findByTestId('eligibilityModal');
      expect(screen.baseElement).not.to.contain.text(
        /We couldn’t find a clinic for this type of care/i,
      );
      fireEvent.click(await screen.findByText(/Continue/));
      await screen.findByTestId('eligibilityModal');
    });

    it('should show error message when eligibility calls fail', async () => {
      mockParentSites(parentSiteIds, [parentSite983, parentSite984]);
      mockDirectBookingEligibilityCriteria(parentSiteIds, directFacilities);
      mockRequestEligibilityCriteria(parentSiteIds, requestFacilities);
      mockFacilitiesFetchByVersion({
        facilities,
        version: 0,
      });
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

    it('should show request limit message and link to the requested appointments, when current appt is over the request limit', async () => {
      // Given the user is requesting an appointment
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

      // And the facitility page is presented
      const screen = renderWithStoreAndRouter(<VAFacilityPage />, {
        store,
      });

      // When the user selects the facility
      fireEvent.click(await screen.findByLabelText(/Fake facility name 1/i));
      fireEvent.click(screen.getByText(/Continue/));

      // Then they are presented with the message that they are over the request limit
      await screen.findByTestId('eligibilityModal');

      // And the link in the over the limit message takes the user to the requested appt page
      expect(
        screen.getByRole('link', {
          name: /your appointment list/i,
        }),
      ).to.have.attribute('href', '/requested');
    });

    it('should show past visits message when not eligible for direct, requests are supported, no past visit', async () => {
      mockParentSites(parentSiteIds, [parentSite983, parentSite984]);
      mockDirectBookingEligibilityCriteria(
        parentSiteIds,
        facilityIds.map(id =>
          getDirectBookingEligibilityCriteriaMock({
            id,
            typeOfCareId: '502',
          }),
        ),
      );
      mockRequestEligibilityCriteria(
        parentSiteIds,
        facilityIds.map(id =>
          getRequestEligibilityCriteriaMock({
            id,
            typeOfCareId: '502',
            patientHistoryDuration: 1095,
          }),
        ),
      );
      mockFacilitiesFetchByVersion({
        facilities,
        version: 0,
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

      fireEvent.click(await screen.findByLabelText(/Fake facility name 1/i));
      fireEvent.click(screen.getByText(/Continue/));
      await screen.findByTestId('eligibilityModal');
      expect(screen.getByRole('alertdialog')).to.be.ok;
      expect(screen.baseElement).to.contain.text('last 36 months');
      fireEvent.click(screen.getByRole('button', { name: /Continue/i }));

      await waitFor(
        () =>
          expect(
            screen.queryByText(/We can’t find a recent appointment for you/i),
          ).to.not.exist,
      );
    });

    it('should continue to requests if direct is supported but disabled by feature toggle', async () => {
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
      mockFacilitiesFetchByVersion({
        facilities,
        version: 0,
      });
      mockEligibilityFetches({
        siteId: '983',
        facilityId: '983',
        typeOfCareId: '502',
        limit: true,
        requestPastVisits: true,
        directPastVisits: true,
      });
      const store = createTestStore({
        ...initialState,
        featureToggles: {},
      });
      await setTypeOfCare(store, /mental health/i);

      const screen = renderWithStoreAndRouter(<VAFacilityPage />, {
        store,
      });

      fireEvent.click(await screen.findByLabelText(/Fake facility name 1/i));
      fireEvent.click(screen.getByText(/Continue/));

      await waitFor(() =>
        expect(screen.history.push.firstCall.args[0]).to.equal(
          '/new-appointment/request-date',
        ),
      );
    });
  });
  describe('when using the v2 api', () => {
    describe('when there are multiple facilities to choose from', () => {
      const initialState = {
        featureToggles: {
          vaOnlineSchedulingCommunityCare: false,
          vaOnlineSchedulingDirect: true,
          vaOnlineSchedulingVAOSServiceVAAppointments: true,
          vaOnlineSchedulingFacilitiesServiceV2: true,
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
      const facilities = facilityIds.map((id, index) =>
        createMockFacilityByVersion({
          id,
          name: `Fake facility name ${index + 1}`,
          lat: Math.random() * 90,
          long: Math.random() * 180,
          address: {
            line: [],
            state: 'fake',
            postalCode: 'fake',
            city: `Fake city ${index + 1}`,
          },
        }),
      );

      beforeEach(() => mockFetch());
      it('should show clinics message when direct is supported, has past visits, no matching clinics, requests not supported', async () => {
        mockSchedulingConfigurations([
          getSchedulingConfigurationMock({
            id: '983',
            typeOfCareId: 'socialWork',
            directEnabled: true,
            patientHistoryRequired: true,
            patientHistoryDuration: 365,
          }),
          getSchedulingConfigurationMock({
            id: '984',
            typeOfCareId: 'socialWork',
            directEnabled: true,
            patientHistoryRequired: true,
            patientHistoryDuration: 365,
          }),
        ]);
        mockFacilitiesFetchByVersion({
          facilities: facilities.filter(f => f.id === '983' || f.id === '984'),
          children: true,
        });
        mockEligibilityFetchesByVersion({
          facilityId: '983',
          typeOfCareId: 'socialWork',
          directPastVisits: true,
          clinics: [
            getV2ClinicMock({
              // Changed to a invalid clinic id so eligibility check failed reasons will match
              id: '4555',
              stationId: '983',
              serviceName: 'Clinic name',
            }),
          ],
          version: 2,
        });
        const store = createTestStore(initialState);
        await setTypeOfCare(store, /social work/i);

        const screen = renderWithStoreAndRouter(<VAFacilityPage />, {
          store,
        });

        await screen.findByText(/Select a VA facility/i);

        fireEvent.click(await screen.findByLabelText(/Fake facility name 1/i));
        fireEvent.click(screen.getByText(/Continue/));
        await screen.findByText(
          /This facility doesn’t have any available clinics that support online scheduling/i,
        );
        const loadingEvent = global.window.dataLayer.find(
          ev => ev.event === 'loading-indicator-displayed',
        );

        // It should record GA event for loading modal
        expect(loadingEvent).to.exist;
        expect('loading-indicator-display-time' in loadingEvent).to.be.true;
      });
    });
  });
});
