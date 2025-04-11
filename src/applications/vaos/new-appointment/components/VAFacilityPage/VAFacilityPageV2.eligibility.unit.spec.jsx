import React from 'react';
import { expect } from 'chai';

import {
  mockFetch,
  setFetchJSONFailure,
} from '@department-of-veterans-affairs/platform-testing/helpers';
import { fireEvent, waitFor } from '@testing-library/dom';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import VAFacilityPage from './VAFacilityPageV2';
import {
  createTestStore,
  setTypeOfCare,
  renderWithStoreAndRouter,
} from '../../../tests/mocks/setup';
import {
  getSchedulingConfigurationMock,
  getV2ClinicMock,
} from '../../../tests/mocks/mock';
import {
  mockSchedulingConfigurations,
  mockVAOSParentSites,
} from '../../../tests/mocks/helpers';
import {
  mockEligibilityFetches,
  mockFacilitiesFetch,
} from '../../../tests/mocks/fetch';
import {
  createMockClinic,
  createMockFacility,
} from '../../../tests/mocks/data';

describe('VAOS Page: VAFacilityPage eligibility check', () => {
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

      mockVAOSParentSites(
        siteIds,
        [
          createMockFacility({
            id: '983',
            name: 'San Diego VA Medical Center',
            isParent: true,
          }),
        ],
        true,
      );
      mockFacilitiesFetch({
        facilities: [
          createMockFacility({
            id: '442',
            name: 'San Diego VA Medical Center',
            address: {
              line: ['2360 East Pershing Boulevard'],
              city: 'San Diego',
              state: 'CA',
              postalCode: '92128',
            },
            phone: '858-779-0338',
          }),
        ],
      });
    });

    it('should show no clinics message when direct is supported, no clinics available, requests not supported', async () => {
      mockSchedulingConfigurations([
        getSchedulingConfigurationMock({
          id: '983',
          typeOfCareId: 'primaryCare',
          directEnabled: true,
          requestEnabled: false,
        }),
      ]);
      mockEligibilityFetches({
        facilityId: '983',
        typeOfCareId: 'amputation',
      });

      const store = createTestStore(initialState);
      await setTypeOfCare(store, /amputation care/i);

      const screen = renderWithStoreAndRouter(<VAFacilityPage />, {
        store,
      });

      await waitFor(() => {
        screen.queryByText(/None of your VA facilities/i);
      });

      expect(await screen.queryByText(/Continue/)).not.to.exist;
    });

    it('should show past visits message when not eligible for direct, requests are supported, no past visit', async () => {
      mockSchedulingConfigurations([
        getSchedulingConfigurationMock({
          id: '983',
          typeOfCareId: 'outpatientMentalHealth',
          directEnabled: false,
          requestEnabled: true,
          patientHistoryRequired: 'Yes',
        }),
      ]);
      mockEligibilityFetches({
        facilityId: '983',
        typeOfCareId: 'outpatientMentalHealth',
        clinics: [
          createMockClinic({
            id: '308',
            stationId: '983',
            friendlyName: 'Green team clinic',
          }),
          createMockClinic({
            id: '309',
            stationId: '983',
            friendlyName: 'Red team clinic',
          }),
        ],
        requestPastVisits: false,
      });

      const store = createTestStore(initialState);
      await setTypeOfCare(store, /mental health/i);

      const screen = renderWithStoreAndRouter(<VAFacilityPage />, {
        store,
      });

      await waitFor(() => {
        screen.queryByText(/San Diego VA Medical Center/i);
      });
      await screen.findByText(
        /You haven’t had a recent appointment at this facility/i,
      );
    });

    it('should show request limits message when not eligible for direct, requests are supported, over request limit', async () => {
      mockSchedulingConfigurations([
        getSchedulingConfigurationMock({
          id: '983',
          typeOfCareId: 'primaryCare',
          directEnabled: false,
          requestEnabled: true,
        }),
      ]);
      mockEligibilityFetches({
        facilityId: '983',
        typeOfCareId: 'primaryCare',
        clinics: [
          createMockClinic({
            id: '308',
            stationId: '983',
            friendlyName: 'Green team clinic',
          }),
        ],
        limit: false,
      });

      const store = createTestStore(initialState);
      await setTypeOfCare(store, /primary care/i);

      const screen = renderWithStoreAndRouter(<VAFacilityPage />, {
        store,
      });

      await waitFor(() => {
        screen.queryByText(/San Diego VA Medical Center/i);
      });
      expect(
        await screen.findByText(
          /You.ll need to call to schedule at this facility/,
        ),
      ).to.exist;

      expect(await screen.queryByText(/Continue/)).not.to.exist;
    });

    it('should show error message when checks fail', async () => {
      const store = createTestStore(initialState);
      await setTypeOfCare(store, /primary care/i);

      const screen = renderWithStoreAndRouter(<VAFacilityPage />, {
        store,
      });

      expect(
        await screen.findByText(
          /You can.t schedule an appointment online right now/,
        ),
      ).to.exist;

      // expect(await screen.findByText(/Continue/)).to.have.attribute('disabled');
    });
  });

  describe('when there are multiple facilities to choose from', () => {
    const initialState = {
      featureToggles: {
        vaOnlineSchedulingCommunityCare: false,
        vaOnlineSchedulingDirect: true,
        vaOnlineSchedulingVAOSServiceVAAppointments: true,
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

    const facilityIds = ['983', '984'];
    const facilities = facilityIds.map((id, index) =>
      createMockFacility({
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

    beforeEach(() => {
      mockFetch();

      mockFacilitiesFetch({
        facilities,
        children: true,
      });
    });

    it('should show clinics message when direct is supported, has past visits, no matching clinics, requests not supported', async () => {
      mockSchedulingConfigurations([
        getSchedulingConfigurationMock({
          id: '983',
          typeOfCareId: 'socialWork',
          directEnabled: true,
          requestEnabled: false,
          patientHistoryRequired: true,
          patientHistoryDuration: 365,
        }),
        getSchedulingConfigurationMock({
          id: '984',
          typeOfCareId: 'socialWork',
          directEnabled: true,
          requestEnabled: false,
          patientHistoryRequired: true,
          patientHistoryDuration: 365,
        }),
      ]);
      mockEligibilityFetches({
        facilityId: '983',
        typeOfCareId: 'socialWork',
        directPastVisits: true,
        clinics: [
          getV2ClinicMock({
            id: '455',
            stationId: '983',
            serviceName: 'Clinic name',
          }),
        ],
      });
      const store = createTestStore(initialState);
      await setTypeOfCare(store, /social work/i);

      const screen = renderWithStoreAndRouter(<VAFacilityPage />, {
        store,
      });

      await screen.findAllByText(/Select a VA facility/i);

      fireEvent.click(await screen.findByLabelText(/Fake facility name 1/i));
      fireEvent.click(screen.getByText(/Continue/));
      await waitFor(() => {
        screen.findByText(
          /This facility doesn’t have any available clinics that support online scheduling/i,
        );
      });

      let loadingEvent;
      await waitFor(() => {
        loadingEvent = global.window.dataLayer.find(
          ev => ev.event === 'loading-indicator-displayed',
        );
        expect(loadingEvent).to.exist;
      });

      // It should record GA event for loading modal
      expect('loading-indicator-display-time' in loadingEvent).to.be.true;
    });

    it('should show past visits message when direct is supported, no past visits, requests not supported', async () => {
      mockSchedulingConfigurations([
        getSchedulingConfigurationMock({
          id: '983',
          typeOfCareId: 'amputation',
          directEnabled: true,
          requestEnabled: false,
        }),
        getSchedulingConfigurationMock({
          id: '984',
          typeOfCareId: 'amputation',
          directEnabled: true,
          requestEnabled: false,
        }),
      ]);
      mockEligibilityFetches({
        facilityId: '983',
        typeOfCareId: 'amputation',
        clinics: [
          getV2ClinicMock({
            id: '455',
            stationId: '983',
            serviceName: 'Clinic name',
          }),
        ],
        limit: true,
        requestPastVisits: true,
        directPastVisits: false,
      });

      const store = createTestStore(initialState);
      await setTypeOfCare(store, /amputation care/i);

      const screen = renderWithStoreAndRouter(<VAFacilityPage />, {
        store,
      });

      await screen.findAllByText(/Select a VA facility/i);

      fireEvent.click(await screen.findByLabelText(/Fake facility name 1/i));
      fireEvent.click(screen.getByText(/Continue/));
      await screen.findByTestId('eligibilityModal');

      expect(
        await screen.findByText(
          /You haven’t had a recent appointment at this facility/i,
        ),
      ).to.be.ok;

      const loadingEvent = global.window.dataLayer.find(
        ev => ev.event === 'loading-indicator-displayed',
      );

      // It should record GA event for loading modal
      expect(loadingEvent).to.exist;
      expect('loading-indicator-display-time' in loadingEvent).to.be.true;
    });

    it('should show no clinics message when direct is supported, no available clinics, requests not supported', async () => {
      mockSchedulingConfigurations([
        getSchedulingConfigurationMock({
          id: '983',
          typeOfCareId: 'amputation',
          directEnabled: true,
        }),
        getSchedulingConfigurationMock({
          id: '984',
          typeOfCareId: 'amputation',
          directEnabled: true,
        }),
      ]);
      mockEligibilityFetches({
        facilityId: '983',
        typeOfCareId: 'amputation',
        directPastVisits: true,
        clinics: [
          getV2ClinicMock({
            id: '455',
            stationId: '983',
            serviceName: 'Clinic name',
          }),
        ],
      });

      const store = createTestStore(initialState);
      await setTypeOfCare(store, /amputation care/i);

      const screen = renderWithStoreAndRouter(<VAFacilityPage />, {
        store,
      });

      await screen.findAllByText(/Select a VA facility/i);

      fireEvent.click(await screen.findByLabelText(/Fake facility name 1/i));
      fireEvent.click(screen.getByText(/Continue/));
      await screen.findByTestId('eligibilityModal');
      const loadingEvent = global.window.dataLayer.find(
        ev => ev.event === 'loading-indicator-displayed',
      );

      // It should record GA event for loading modal
      expect(loadingEvent).to.exist;
      expect('loading-indicator-display-time' in loadingEvent).to.be.true;
      expect(
        await screen.findByText(
          /We couldn.t find any open appointment times for online scheduling/i,
        ),
      ).to.be.ok;
    });

    it('should continue when primary care, direct is supported, clinics available, no matching clinics, requests not supported', async () => {
      mockSchedulingConfigurations([
        getSchedulingConfigurationMock({
          id: '983',
          typeOfCareId: 'primaryCare',
          directEnabled: true,
        }),
        getSchedulingConfigurationMock({
          id: '984',
          typeOfCareId: 'primaryCare',
          directEnabled: true,
        }),
      ]);
      mockEligibilityFetches({
        facilityId: '983',
        typeOfCareId: 'primaryCare',
        directPastVisits: true,
        clinics: [
          getV2ClinicMock({
            id: '455',
            stationId: '983',
            serviceName: 'Clinic name',
          }),
        ],
      });

      const store = createTestStore(initialState);
      await setTypeOfCare(store, /primary care/i);

      const screen = renderWithStoreAndRouter(<VAFacilityPage />, {
        store,
      });

      await screen.findAllByText(/Select a VA facility/i);

      fireEvent.click(await screen.findByLabelText(/Fake facility name 1/i));
      fireEvent.click(screen.getByText(/Continue/));
      await waitFor(() => {
        expect(screen.history.push.lastCall.args[0]).to.equal(
          '/new-appointment/clinics',
        );
      });
    });

    it('should continue when mental health, direct is supported, clinics available, no matching clinics, requests not supported', async () => {
      mockSchedulingConfigurations([
        getSchedulingConfigurationMock({
          id: '983',
          typeOfCareId: 'outpatientMentalHealth',
          directEnabled: true,
        }),
        getSchedulingConfigurationMock({
          id: '984',
          typeOfCareId: 'outpatientMentalHealth',
          directEnabled: true,
        }),
      ]);
      mockEligibilityFetches({
        facilityId: '983',
        typeOfCareId: 'outpatientMentalHealth',
        directPastVisits: true,
        clinics: [
          getV2ClinicMock({
            id: '455',
            stationId: '983',
            serviceName: 'Clinic name',
          }),
        ],
      });

      const store = createTestStore(initialState);
      await setTypeOfCare(store, /mental health/i);

      const screen = renderWithStoreAndRouter(<VAFacilityPage />, {
        store,
      });

      await screen.findAllByText(/Select a VA facility/i);

      fireEvent.click(await screen.findByLabelText(/Fake facility name 1/i));
      fireEvent.click(screen.getByText(/Continue/));
      await waitFor(() => {
        expect(screen.history.push.lastCall.args[0]).to.equal(
          '/new-appointment/clinics',
        );
      });
    });

    it('should show eligibility modal again when user closes it out and hits continue with the same facility', async () => {
      mockSchedulingConfigurations([
        getSchedulingConfigurationMock({
          id: '983',
          typeOfCareId: 'primaryCare',
          directEnabled: true,
        }),
        getSchedulingConfigurationMock({
          id: '984',
          typeOfCareId: 'primaryCare',
          directEnabled: true,
        }),
      ]);
      mockEligibilityFetches({
        facilityId: '983',
        typeOfCareId: 'primaryCare',
        directPastVisits: false,
        clinics: [],
      });

      const store = createTestStore(initialState);
      await setTypeOfCare(store, /primary care/i);

      const screen = renderWithStoreAndRouter(<VAFacilityPage />, {
        store,
      });

      await screen.findAllByText(/Select a VA facility/i);

      fireEvent.click(await screen.findByLabelText(/Fake facility name 1/i));
      fireEvent.click(screen.getByText(/Continue/));
      await screen.findByTestId('eligibilityModal');
      expect(screen.baseElement).not.to.contain.text(
        /We couldn’t find a clinic for this type of care/i,
      );
      fireEvent.click(await screen.findByText(/Continue/));
      await screen.findByTestId('eligibilityModal');
    });

    it('should show error message when eligibility calls fail', async () => {
      mockSchedulingConfigurations([
        getSchedulingConfigurationMock({
          id: '983',
          typeOfCareId: 'primaryCare',
          directEnabled: false,
          requestEnabled: true,
        }),
        getSchedulingConfigurationMock({
          id: '984',
          typeOfCareId: 'primaryCare',
          directEnabled: false,
          requestEnabled: true,
        }),
      ]);
      // Fail eligibility calls
      setFetchJSONFailure(
        global.fetch.withArgs(
          `${environment.API_URL}/vaos/v2/eligibility?facility_id=983&clinical_service_id=primaryCare&type=request`,
          {
            errors: [],
          },
        ),
      );

      const store = createTestStore(initialState);
      await setTypeOfCare(store, /primary care/i);

      const screen = renderWithStoreAndRouter(<VAFacilityPage />, {
        store,
      });

      fireEvent.click(await screen.findByLabelText(/Fake facility name 1/i));
      fireEvent.click(screen.getByText(/Continue/));
      expect(
        await screen.findByText(
          /We.re sorry. There.s a problem with our system. Try again later./i,
        ),
      ).to.exist;
    });

    it('should show request limit message when current appt is over the request limit', async () => {
      // Given the user is requesting an appointment
      mockSchedulingConfigurations([
        getSchedulingConfigurationMock({
          id: '983',
          typeOfCareId: 'primaryCare',
          directEnabled: false,
          requestEnabled: true,
        }),
        getSchedulingConfigurationMock({
          id: '984',
          typeOfCareId: 'primaryCare',
          directEnabled: false,
          requestEnabled: true,
        }),
      ]);
      mockEligibilityFetches({
        facilityId: '983',
        typeOfCareId: 'primaryCare',
        clinics: [
          getV2ClinicMock({
            id: '455',
            stationId: '983',
            serviceName: 'Clinic name',
          }),
        ],
        limit: false,
        requestPastVisits: true,
        directPastVisits: true,
      });

      const store = createTestStore(initialState);
      await setTypeOfCare(store, /primary care/i);

      // And the facitility page is presented
      const screen = renderWithStoreAndRouter(<VAFacilityPage />, {
        store,
      });

      await expect(screen.findByLabelText(/Fake facility name 1/i)).to.exist;
      // When the user selects the facility
      fireEvent.click(await screen.findByLabelText(/Fake facility name 1/i));
      fireEvent.click(screen.getByText(/Continue/));

      // Then they are presented with the message that they are over the request limit
      await screen.findByTestId('eligibilityModal');

      expect(
        screen.getByText(/You’ll need to call to schedule at this facility/i),
      ).to.exist;
    });

    it('should show past visits message when not eligible for direct, requests are supported, no past visit', async () => {
      mockSchedulingConfigurations([
        getSchedulingConfigurationMock({
          id: '983',
          typeOfCareId: 'outpatientMentalHealth',
          directEnabled: false,
          requestEnabled: true,
          patientHistoryDuration: 1095,
        }),
        getSchedulingConfigurationMock({
          id: '984',
          typeOfCareId: 'outpatientMentalHealth',
          directEnabled: false,
          requestEnabled: true,
        }),
      ]);
      mockEligibilityFetches({
        facilityId: '983',
        typeOfCareId: 'outpatientMentalHealth',
        clinics: [
          getV2ClinicMock({
            id: '455',
            stationId: '983',
            serviceName: 'Clinic name',
          }),
        ],
        limit: true,
        requestPastVisits: false,
        directPastVisits: true,
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
      fireEvent.click(screen.getByRole('button', { name: /Continue/i }));

      await waitFor(
        () =>
          expect(
            screen.queryByText(
              /You haven’t had a recent appointment at this facility/i,
            ),
          ).to.exist,
      );
    });

    it('should continue to requests if direct is supported but disabled by feature toggle', async () => {
      mockSchedulingConfigurations([
        getSchedulingConfigurationMock({
          id: '983',
          typeOfCareId: 'outpatientMentalHealth',
          directEnabled: true,
          requestEnabled: true,
        }),
        getSchedulingConfigurationMock({
          id: '984',
          typeOfCareId: 'outpatientMentalHealth',
          directEnabled: true,
          requestEnabled: true,
        }),
      ]);
      mockEligibilityFetches({
        facilityId: '983',
        typeOfCareId: 'outpatientMentalHealth',
        clinics: [
          getV2ClinicMock({
            id: '455',
            stationId: '983',
            serviceName: 'Clinic name',
          }),
        ],
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
});
