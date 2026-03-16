import { expect } from 'chai';
import React from 'react';

import { mockFetch } from '@department-of-veterans-affairs/platform-testing/helpers';
import { fireEvent, waitFor } from '@testing-library/dom';
import MockClinicResponse from '../../../tests/fixtures/MockClinicResponse';
import MockFacilityResponse from '../../../tests/fixtures/MockFacilityResponse';
import MockSchedulingConfigurationResponse, {
  MockServiceConfiguration,
} from '../../../tests/fixtures/MockSchedulingConfigurationResponse';
import {
  mockEligibilityFetches,
  mockEligibilityRequestApi,
  mockFacilitiesApi,
  mockSchedulingConfigurationsApi,
} from '../../../tests/mocks/mockApis';
import {
  createTestStore,
  renderWithStoreAndRouter,
  setTypeOfCare,
  setTypeOfMentalHealth,
} from '../../../tests/mocks/setup';
import VAFacilityPage from './VAFacilityPageV2';

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
    const ids = ['983'];

    beforeEach(() => {
      mockFetch();

      mockFacilitiesApi({
        ids,
        response: [
          new MockFacilityResponse({
            id: '983',
            name: 'San Diego VA Medical Center',
            isParent: true,
          }),
        ],
      });
    });

    it('should show no clinics message when direct is supported, no clinics available, requests not supported', async () => {
      // Arrange
      mockSchedulingConfigurationsApi({
        response: [
          new MockSchedulingConfigurationResponse({
            facilityId: '983',
            services: [
              new MockServiceConfiguration({
                typeOfCareId: 'primaryCare',
              }),
            ],
          }),
        ],
      });
      mockEligibilityFetches({
        facilityId: '983',
        typeOfCareId: 'amputation',
      });

      const store = createTestStore(initialState);
      await setTypeOfCare(store, /amputation care/i);

      // Act
      const screen = renderWithStoreAndRouter(<VAFacilityPage />, {
        store,
      });

      // Assert
      await waitFor(() => {
        screen.queryByText(/None of your VA facilities/i);
      });

      expect(await screen.queryByText(/Continue/)).not.to.exist;
    });

    it('should show past visits message when not eligible for direct, requests are supported, no past visit, vaOnlineSchedulingAddSubstanceUseDisorder=false', async () => {
      // Arrange
      const defaultState = {
        ...initialState,
        featureToggles: {
          ...initialState.featureToggles,
          vaOnlineSchedulingAddSubstanceUseDisorder: false,
        },
      };
      mockSchedulingConfigurationsApi({
        response: [
          new MockSchedulingConfigurationResponse({
            facilityId: '983',
            services: [
              new MockServiceConfiguration({
                typeOfCareId: 'outpatientMentalHealth',
                bookedAppointments: false,
                apptRequests: true,
              }),
            ],
          }),
        ],
      });
      mockEligibilityFetches({
        facilityId: '983',
        typeOfCareId: 'outpatientMentalHealth',
        hasDirectDisabledError: true,
        hasRequestPatientHistoryInsufficientError: true,
      });

      const store = createTestStore(defaultState);
      await setTypeOfCare(store, /mental health/i);

      // Act
      const screen = renderWithStoreAndRouter(<VAFacilityPage />, {
        store,
      });

      // Assert
      await waitFor(() => {
        screen.queryByText(/San Diego VA Medical Center/i);
      });
      await screen.findByText(
        /You haven’t had a recent appointment at this facility/i,
      );
    });

    it('should show past visits message when not eligible for direct, requests are supported, no past visit, vaOnlineSchedulingAddSubstanceUseDisorder=true', async () => {
      // Arrange
      const defaultState = {
        ...initialState,
        featureToggles: {
          ...initialState.featureToggles,
          vaOnlineSchedulingAddSubstanceUseDisorder: true,
        },
      };
      mockSchedulingConfigurationsApi({
        response: [
          new MockSchedulingConfigurationResponse({
            facilityId: '983',
            services: [
              new MockServiceConfiguration({
                typeOfCareId: 'outpatientMentalHealth',
                bookedAppointments: false,
                apptRequests: true,
              }),
            ],
          }),
        ],
      });
      mockEligibilityFetches({
        facilityId: '983',
        typeOfCareId: 'outpatientMentalHealth',
        hasDirectDisabledError: true,
        hasRequestPatientHistoryInsufficientError: true,
      });

      const store = createTestStore(defaultState);
      await setTypeOfCare(store, /mental health/i);
      await setTypeOfMentalHealth(
        store,
        /Mental health care with a specialist/,
      );

      // Act
      const screen = renderWithStoreAndRouter(<VAFacilityPage />, {
        store,
      });

      // Assert
      await waitFor(() => {
        screen.queryByText(/San Diego VA Medical Center/i);
      });
      await screen.findByText(
        /You haven’t had a recent appointment at this facility/i,
      );
    });

    it('should show request limits message when not eligible for direct, requests are supported, over request limit', async () => {
      // Arrange
      mockSchedulingConfigurationsApi({
        response: [
          new MockSchedulingConfigurationResponse({
            facilityId: '983',
            services: [
              new MockServiceConfiguration({
                typeOfCareId: 'primaryCare',
                bookedAppointments: false,
                apptRequests: true,
              }),
            ],
          }),
        ],
      });
      mockEligibilityFetches({
        facilityId: '983',
        typeOfCareId: 'primaryCare',
        clinics: [
          new MockClinicResponse({
            id: '308',
            locationId: '983',
            name: 'Green team clinic',
          }),
        ],
        hasDirectDisabledError: true,
        hasFacilityRequestLimitExceeded: true,
      });

      const store = createTestStore(initialState);
      await setTypeOfCare(store, /primary care/i);

      // Act
      const screen = renderWithStoreAndRouter(<VAFacilityPage />, {
        store,
      });

      // Assert
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
      // Arrange
      const store = createTestStore(initialState);
      await setTypeOfCare(store, /primary care/i);

      mockSchedulingConfigurationsApi({
        response: [
          new MockSchedulingConfigurationResponse({
            facilityId: '983',
            services: [
              new MockServiceConfiguration({
                typeOfCareId: 'outpatientMentalHealth',
              }),
            ],
          }),
        ],
        responseCode: 500,
      });

      // Act
      const screen = renderWithStoreAndRouter(<VAFacilityPage />, {
        store,
      });

      // Assert
      expect(
        await screen.findByText(/We can’t schedule your appointment right now/),
      ).to.exist;

      // expect(await screen.findByText(/Continue/)).to.have.attribute('disabled');
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

    const facilityIds = ['983', '984'];
    const facilities = facilityIds.map(
      (id, index) =>
        new MockFacilityResponse({
          id,
          name: `Fake facility name ${index + 1}`,
        }),
    );

    beforeEach(() => {
      mockFetch();

      mockFacilitiesApi({
        response: facilities,
        children: true,
      });
    });

    it('should show clinics message when direct is supported, has past visits, no matching clinics, requests not supported', async () => {
      // Arrange
      mockSchedulingConfigurationsApi({
        response: [
          new MockSchedulingConfigurationResponse({
            facilityId: '983',
            services: [
              new MockServiceConfiguration({
                typeOfCareId: 'socialWork',
                bookedAppointments: true,
                apptRequests: false,
              }),
            ],
          }),
          new MockSchedulingConfigurationResponse({
            facilityId: '984',
            services: [
              new MockServiceConfiguration({
                typeOfCareId: 'socialWork',
                bookedAppointments: true,
                apptRequests: false,
              }),
            ],
          }),
        ],
      });
      mockEligibilityFetches({
        facilityId: '983',
        typeOfCareId: 'socialWork',
        clinics: [
          new MockClinicResponse({
            id: '455',
            locationId: '983',
            name: 'Clinic name',
          }),
        ],
        hasDirectPatientHistoryInsufficientError: true,
        requestDisabled: true,
      });
      const store = createTestStore(initialState);
      await setTypeOfCare(store, /social work/i);

      // Act
      const screen = renderWithStoreAndRouter(<VAFacilityPage />, {
        store,
      });

      // Assert
      await screen.findAllByText(
        /These are the facilities you’re registered at that offer/i,
      );

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
      // Arrange
      mockSchedulingConfigurationsApi({
        response: [
          new MockSchedulingConfigurationResponse({
            facilityId: '983',
            services: [
              new MockServiceConfiguration({
                typeOfCareId: 'amputation',
                bookedAppointments: true,
                apptRequests: false,
              }),
            ],
          }),
          new MockSchedulingConfigurationResponse({
            facilityId: '984',
            services: [
              new MockServiceConfiguration({
                typeOfCareId: 'amputation',
                bookedAppointments: true,
                apptRequests: true,
              }),
            ],
          }),
        ],
      });
      mockEligibilityFetches({
        facilityId: '983',
        typeOfCareId: 'amputation',
        clinics: [
          new MockClinicResponse({
            id: '455',
            locationId: '983',
            name: 'Clinic name',
          }),
        ],
        hasRequestDisabledError: true,
        hasDirectPatientHistoryInsufficientError: true,
      });

      const store = createTestStore(initialState);
      await setTypeOfCare(store, /amputation care/i);

      // Act
      const screen = renderWithStoreAndRouter(<VAFacilityPage />, {
        store,
      });

      // Assert
      await screen.findAllByText(
        /These are the facilities you’re registered at that offer/i,
      );

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
      // Arrange
      mockSchedulingConfigurationsApi({
        response: [
          new MockSchedulingConfigurationResponse({
            facilityId: '983',
            services: [
              new MockServiceConfiguration({
                typeOfCareId: 'amputation',
                bookedAppointments: true,
                apptRequests: true,
              }),
            ],
          }),
          new MockSchedulingConfigurationResponse({
            facilityId: '984',
            services: [
              new MockServiceConfiguration({
                typeOfCareId: 'amputation',
                bookedAppointments: true,
                apptRequests: true,
              }),
            ],
          }),
        ],
      });
      mockEligibilityFetches({
        facilityId: '983',
        typeOfCareId: 'amputation',
        clinics: [
          // new MockClinicResponse({
          //   id: '455',
          //   locationId: '983',
          //   name: 'Clinic name',
          // }),
        ],
        hasRequestDisabledError: true,
      });

      const store = createTestStore(initialState);
      await setTypeOfCare(store, /amputation care/i);

      // Act
      const screen = renderWithStoreAndRouter(<VAFacilityPage />, {
        store,
      });

      // Assert
      await screen.findAllByText(
        /These are the facilities you’re registered at that offer/i,
      );

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
      // Arrange
      mockSchedulingConfigurationsApi({
        response: [
          new MockSchedulingConfigurationResponse({
            facilityId: '983',
            services: [
              new MockServiceConfiguration({
                typeOfCareId: 'primaryCare',
                bookedAppointments: true,
                apptRequests: false,
              }),
            ],
          }),
          new MockSchedulingConfigurationResponse({
            facilityId: '984',
            services: [
              new MockServiceConfiguration({
                typeOfCareId: 'primaryCare',
                bookedAppointments: true,
                apptRequests: false,
              }),
            ],
          }),
        ],
      });
      mockEligibilityFetches({
        facilityId: '983',
        typeOfCareId: 'primaryCare',
        hasDirectPatientHistoryInsufficientError: true,
        clinics: [
          new MockClinicResponse({
            id: '455',
            locationId: 'no_match',
            name: 'Clinic name',
          }),
        ],
        hasRequestDisabledError: true,
      });

      const store = createTestStore(initialState);
      await setTypeOfCare(store, /primary care/i);

      // Act
      const screen = renderWithStoreAndRouter(<VAFacilityPage />, {
        store,
      });

      // Assert
      await screen.findAllByText(
        /These are the facilities you’re registered at that offer/i,
      );

      fireEvent.click(await screen.findByLabelText(/Fake facility name 1/i));
      fireEvent.click(screen.getByText(/Continue/));
      await waitFor(() => {
        expect(screen.history.push.lastCall.args[0]).to.equal(
          '/schedule/clinic',
        );
      });
    });

    it('should show eligibility modal again when user closes it out and hits continue with the same facility', async () => {
      // Arrange
      mockSchedulingConfigurationsApi({
        response: [
          new MockSchedulingConfigurationResponse({
            facilityId: '983',
            services: [
              new MockServiceConfiguration({
                typeOfCareId: 'primaryCare',
                bookedAppointments: true,
              }),
            ],
          }),
          new MockSchedulingConfigurationResponse({
            facilityId: '984',
            services: [
              new MockServiceConfiguration({
                typeOfCareId: 'primaryCare',
                bookedAppointments: true,
              }),
            ],
          }),
        ],
      });
      mockEligibilityFetches({
        facilityId: '983',
        typeOfCareId: 'primaryCare',
        hasDirectPatientHistoryInsufficientError: true,
        clinics: [],
      });

      const store = createTestStore(initialState);
      await setTypeOfCare(store, /primary care/i);

      // Act
      const screen = renderWithStoreAndRouter(<VAFacilityPage />, {
        store,
      });

      // Assert
      await screen.findAllByText(
        /These are the facilities you’re registered at that offer/i,
      );

      fireEvent.click(await screen.findByLabelText(/Fake facility name 2/i));
      fireEvent.click(screen.getByText(/Continue/));
      await screen.findByTestId('eligibilityModal');
      expect(screen.baseElement).not.to.contain.text(
        /We couldn’t find a clinic for this type of care/i,
      );
      fireEvent.click(await screen.findByText(/Continue/));
      await screen.findByTestId('eligibilityModal');
    });

    it('should show error message when eligibility calls fail', async () => {
      // Arrange
      mockSchedulingConfigurationsApi({
        response: [
          new MockSchedulingConfigurationResponse({
            facilityId: '983',
            services: [
              new MockServiceConfiguration({
                typeOfCareId: 'primaryCare',
                bookedAppointments: false,
                apptRequests: true,
              }),
            ],
          }),
          new MockSchedulingConfigurationResponse({
            facilityId: '984',
            services: [
              new MockServiceConfiguration({
                typeOfCareId: 'primaryCare',
                bookedAppointments: false,
                apptRequests: true,
              }),
            ],
          }),
        ],
      });
      // Fail eligibility calls
      mockEligibilityRequestApi({
        facilityId: '983',
        typeOfCareId: 'primaryCare',
        responseCode: 404,
      });

      const store = createTestStore(initialState);
      await setTypeOfCare(store, /primary care/i);

      // Act
      const screen = renderWithStoreAndRouter(<VAFacilityPage />, {
        store,
      });

      // Assert
      fireEvent.click(await screen.findByLabelText(/Fake facility name 1/i));
      fireEvent.click(screen.getByText(/Continue/));
      expect(
        await screen.findByText(
          /We.re sorry. There.s a problem with our system. Try again later./i,
        ),
      ).to.exist;
    });

    it('should show request limit message when current appt is over the request limit', async () => {
      // Arrange
      // Given the user is requesting an appointment
      mockSchedulingConfigurationsApi({
        response: [
          new MockSchedulingConfigurationResponse({
            facilityId: '983',
            services: [
              new MockServiceConfiguration({
                typeOfCareId: 'primaryCare',
                bookedAppointments: false,
                apptRequests: true,
              }),
            ],
          }),
          new MockSchedulingConfigurationResponse({
            facilityId: '984',
            services: [
              new MockServiceConfiguration({
                typeOfCareId: 'primaryCare',
                bookedAppointments: false,
                apptRequests: true,
              }),
            ],
          }),
        ],
      });
      mockEligibilityFetches({
        facilityId: '983',
        typeOfCareId: 'primaryCare',
        clinics: [
          new MockClinicResponse({
            id: '455',
            locationId: '983',
            name: 'Clinic name',
          }),
        ],
        hasFacilityRequestLimitExceeded: true,
        hasDirectDisabledError: true,
      });

      const store = createTestStore(initialState);
      await setTypeOfCare(store, /primary care/i);

      // Act
      // And the facitility page is presented
      const screen = renderWithStoreAndRouter(<VAFacilityPage />, {
        store,
      });

      // Assert
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

    describe('when vaOnlineSchedulingAddSubstanceUseDisorder=false', () => {
      const defaultState = {
        featureToggles: {
          ...initialState.featureToggles,
          vaOnlineSchedulingAddSubstanceUseDisorder: true,
        },
        user: {
          ...initialState.user,
        },
      };

      it('should continue when mental health, direct is supported, clinics available, no matching clinics, requests not supported', async () => {
        // Arrange
        mockSchedulingConfigurationsApi({
          response: [
            new MockSchedulingConfigurationResponse({
              facilityId: '983',
              services: [
                new MockServiceConfiguration({
                  typeOfCareId: 'outpatientMentalHealth',
                  bookedAppointments: true,
                  apptRequests: false,
                }),
              ],
            }),
            new MockSchedulingConfigurationResponse({
              facilityId: '984',
              services: [
                new MockServiceConfiguration({
                  typeOfCareId: 'outpatientMentalHealth',
                  bookedAppointments: true,
                  apptRequests: false,
                }),
              ],
            }),
          ],
        });
        mockEligibilityFetches({
          facilityId: '983',
          typeOfCareId: 'outpatientMentalHealth',
          clinics: [
            new MockClinicResponse({
              id: '455',
              locationId: 'no_match',
              name: 'Clinic name',
            }),
          ],
          hasRequestDisabledError: true,
        });

        const store = createTestStore(defaultState);
        await setTypeOfCare(store, /mental health/i);

        // Act
        const screen = renderWithStoreAndRouter(<VAFacilityPage />, {
          store,
        });

        // Assert
        await screen.findAllByText(
          /These are the facilities you’re registered at that offer/i,
        );

        fireEvent.click(await screen.findByLabelText(/Fake facility name 1/i));
        fireEvent.click(screen.getByText(/Continue/));
        await waitFor(() => {
          expect(screen.history.push.lastCall.args[0]).to.equal(
            '/schedule/clinic',
          );
        });
      });

      it('should show past visits message when not eligible for direct, requests are supported, no past visit', async () => {
        // Arrange
        mockSchedulingConfigurationsApi({
          response: [
            new MockSchedulingConfigurationResponse({
              facilityId: '983',
              services: [
                new MockServiceConfiguration({
                  typeOfCareId: 'outpatientMentalHealth',
                  bookedAppointments: true,
                  apptRequests: true,
                }),
              ],
            }),
            new MockSchedulingConfigurationResponse({
              facilityId: '984',
              services: [
                new MockServiceConfiguration({
                  typeOfCareId: 'outpatientMentalHealth',
                  bookedAppointments: true,
                  apptRequests: false,
                }),
              ],
            }),
          ],
        });
        mockEligibilityFetches({
          facilityId: '983',
          typeOfCareId: 'outpatientMentalHealth',
          clinics: [
            new MockClinicResponse({
              id: '455',
              locationId: '983',
              name: 'Clinic name',
            }),
          ],
          hasRequestPatientHistoryInsufficientError: true,
          hasDirectPatientHistoryInsufficientError: true,
        });

        const store = createTestStore(defaultState);
        await setTypeOfCare(store, /mental health/i);

        // Act
        const screen = renderWithStoreAndRouter(<VAFacilityPage />, {
          store,
        });

        // Assert
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
        // Arrange
        mockSchedulingConfigurationsApi({
          response: [
            new MockSchedulingConfigurationResponse({
              facilityId: '983',
              services: [
                new MockServiceConfiguration({
                  typeOfCareId: 'outpatientMentalHealth',
                  bookedAppointments: true,
                  apptRequests: true,
                }),
              ],
            }),
            new MockSchedulingConfigurationResponse({
              facilityId: '984',
              services: [
                new MockServiceConfiguration({
                  typeOfCareId: 'outpatientMentalHealth',
                  bookedAppointments: true,
                  apptRequests: true,
                }),
              ],
            }),
          ],
        });
        mockEligibilityFetches({
          facilityId: '983',
          typeOfCareId: 'outpatientMentalHealth',
          clinics: [
            new MockClinicResponse({
              id: '455',
              locationId: '983',
              name: 'Clinic name',
            }),
          ],
        });

        const store = createTestStore({
          ...defaultState,
          featureToggles: {
            vaOnlineSchedulingDirect: false,
          },
        });
        await setTypeOfCare(store, /mental health/i);

        // Act
        const screen = renderWithStoreAndRouter(<VAFacilityPage />, {
          store,
        });

        // Assert
        fireEvent.click(await screen.findByLabelText(/Fake facility name 1/i));
        fireEvent.click(screen.getByText(/Continue/));

        await waitFor(() =>
          expect(screen.history.push.firstCall.args[0]).to.equal('va-request/'),
        );
      });
    });

    describe('when vaOnlineSchedulingAddSubstanceUseDisorder=true', () => {
      const defaultState = {
        ...initialState,
        featureToggles: {
          ...initialState.featureToggles,
          vaOnlineSchedulingAddSubstanceUseDisorder: true,
        },
      };

      it('should not continue when mental health, direct is supported, clinics available, no matching clinics, requests not supported', async () => {
        // Arrange
        mockSchedulingConfigurationsApi({
          response: [
            new MockSchedulingConfigurationResponse({
              facilityId: '983',
              services: [
                new MockServiceConfiguration({
                  typeOfCareId: 'outpatientMentalHealth',
                  bookedAppointments: true,
                  apptRequests: false,
                }),
              ],
            }),
            new MockSchedulingConfigurationResponse({
              facilityId: '984',
              services: [
                new MockServiceConfiguration({
                  typeOfCareId: 'outpatientMentalHealth',
                  bookedAppointments: true,
                  apptRequests: false,
                }),
              ],
            }),
          ],
        });
        mockEligibilityFetches({
          facilityId: '983',
          typeOfCareId: 'outpatientMentalHealth',
          hasDirectPatientHistoryInsufficientError: true,
          clinics: [
            new MockClinicResponse({
              id: '455',
              locationId: '983',
              name: 'Clinic name',
            }),
          ],
          hasRequestDisabledError: true,
        });

        const store = createTestStore(defaultState);
        await setTypeOfCare(store, /mental health/i);
        await setTypeOfMentalHealth(
          store,
          /Mental health care with a specialist/,
        );

        // Act
        const screen = renderWithStoreAndRouter(<VAFacilityPage />, {
          store,
        });

        // Assert
        await screen.findAllByText(
          /These are the facilities you’re registered at that offer/i,
        );

        fireEvent.click(await screen.findByLabelText(/Fake facility name 1/i));
        fireEvent.click(screen.getByText(/Continue/));
        await waitFor(() => {
          expect(screen.history.push.lastCall.args[0]).not.to.equal(
            '/schedule/clinic',
          );
        });
      });

      it('should show past visits message when not eligible for direct, requests are supported, no past visit', async () => {
        // Arrange
        mockSchedulingConfigurationsApi({
          response: [
            new MockSchedulingConfigurationResponse({
              facilityId: '983',
              services: [
                new MockServiceConfiguration({
                  typeOfCareId: 'outpatientMentalHealth',
                  bookedAppointments: false,
                  apptRequests: true,
                }),
              ],
            }),
            new MockSchedulingConfigurationResponse({
              facilityId: '984',
              services: [
                new MockServiceConfiguration({
                  typeOfCareId: 'outpatientMentalHealth',
                  bookedAppointments: false,
                  apptRequests: true,
                }),
              ],
            }),
          ],
        });
        mockEligibilityFetches({
          facilityId: '983',
          typeOfCareId: 'outpatientMentalHealth',
          clinics: [
            new MockClinicResponse({
              id: '455',
              locationId: '983',
              name: 'Clinic name',
            }),
          ],
          hasDirectDisabledError: true,
          hasRequestPatientHistoryInsufficientError: true,
        });
        mockEligibilityFetches({
          facilityId: '984',
          typeOfCareId: 'outpatientMentalHealth',
          clinics: [
            new MockClinicResponse({
              id: '455',
              locationId: '983',
              name: 'Clinic name',
            }),
          ],
          hasRequestPatientHistoryInsufficientError: true,
        });

        const store = createTestStore(defaultState);
        await setTypeOfCare(store, /mental health/i);
        await setTypeOfMentalHealth(
          store,
          /Mental health care with a specialist/,
        );

        // Act
        const screen = renderWithStoreAndRouter(<VAFacilityPage />, {
          store,
        });

        // Assert
        fireEvent.click(await screen.findByLabelText(/Fake facility name 1/i));
        fireEvent.click(screen.getByText(/Continue/));
        await waitFor(() => {
          expect(screen.container.querySelector('va-loading-indicator')).not.to
            .exist;
        });

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
        // Arrange
        mockSchedulingConfigurationsApi({
          response: [
            new MockSchedulingConfigurationResponse({
              facilityId: '983',
              services: [
                new MockServiceConfiguration({
                  typeOfCareId: 'outpatientMentalHealth',
                  bookedAppointments: true,
                  apptRequests: true,
                }),
              ],
            }),
            new MockSchedulingConfigurationResponse({
              facilityId: '984',
              services: [
                new MockServiceConfiguration({
                  typeOfCareId: 'outpatientMentalHealth',
                  bookedAppointments: true,
                  apptRequests: true,
                }),
              ],
            }),
          ],
        });
        mockEligibilityFetches({
          facilityId: '983',
          typeOfCareId: 'outpatientMentalHealth',
          clinics: [
            new MockClinicResponse({
              id: '455',
              locationId: '983',
              name: 'Clinic name',
            }),
          ],
        });

        const store = createTestStore({
          ...defaultState,
          featureToggles: {
            vaOnlineSchedulingDirect: false,
          },
        });
        await setTypeOfCare(store, /mental health/i);
        await setTypeOfMentalHealth(
          store,
          /Mental health care with a specialist/,
        );

        // Act
        const screen = renderWithStoreAndRouter(<VAFacilityPage />, {
          store,
        });

        // Assert
        fireEvent.click(await screen.findByLabelText(/Fake facility name 1/i));
        fireEvent.click(screen.getByText(/Continue/));

        await waitFor(() =>
          expect(screen.history.push.firstCall.args[0]).to.equal('va-request/'),
        );
      });
    });
  });
});
