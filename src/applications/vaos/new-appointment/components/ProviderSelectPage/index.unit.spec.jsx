import React from 'react';
import { expect } from 'chai';
import { mockFetch } from '@department-of-veterans-affairs/platform-testing/helpers';
import { waitFor } from '@testing-library/dom';
import { omit } from 'lodash';
import SelectProviderPage from './index';
import {
  createTestStore,
  renderWithStoreAndRouter,
} from '../../../tests/mocks/setup';
import {
  ELIGIBILITY_REASONS,
  TYPE_OF_CARE_IDS,
} from '../../../utils/constants';

const eligibilityOverRequestLimit = {
  '692_123': {
    direct: true,
    directReasons: [],
    request: false,
    requestReasons: ['overRequestLimit'],
  },
};

const requestDisabled = {
  '692_123': {
    direct: true,
    directReasons: [],
    request: false,
    requestReasons: [ELIGIBILITY_REASONS.notEnabled],
  },
};

const defaultState = {
  featureToggles: {
    vaOnlineSchedulingOhDirectSchedule: true,
    vaOnlineSchedulingOhRequest: true,
  },
  newAppointment: {
    pages: {},
    data: {
      vaFacility: '692',
      facilityType: 'vamc',
      typeOfCareId: TYPE_OF_CARE_IDS.FOOD_AND_NUTRITION_ID,
    },
    facilities: {
      [TYPE_OF_CARE_IDS.FOOD_AND_NUTRITION_ID]: [
        {
          vistaId: '692',
          id: '692',
          name: 'White City',
          telecom: [{ system: 'phone', value: '541-826-2111' }],
          legacyVAR: {
            settings: {
              [TYPE_OF_CARE_IDS.FOOD_AND_NUTRITION_ID]: {
                id: '692',
                name: 'Food and Nutrition',
                stopCodes: [
                  {
                    primary: '123',
                    defaultForRequests: false,
                  },
                  {
                    primary: '124',
                    defaultForRequests: false,
                  },
                ],
                direct: {
                  patientHistoryRequired: true,
                  patientHistoryDuration: 0,
                  relationshipAge: 0,
                  requireVisitWithinDays: 365,
                  canCancel: true,
                  enabled: true,
                },
                request: {
                  patientHistoryRequired: true,
                  patientHistoryDuration: 0,
                  relationshipAge: 0,
                  requireVisitWithinDays: 365,
                  canCancel: true,
                  submittedRequestLimit: 2,
                  enterpriseSubmittedRequestLimit: 2,
                  enabled: true,
                },
              },
            },
            distanceFromResidentialAddress: 322.5,
          },
        },
      ],
    },
    eligibility: {
      '692_123': {
        direct: true,
        directReasons: [],
        request: true,
        requestReasons: [],
      },
    },
    patientProviderRelationshipsStatus: 'succeeded',
    patientProviderRelationships: [
      {
        resourceType: 'PatientProviderRelationship',
        providerName: 'Doe, John D, MD',
        providerId: 'Practitioner/123456',
        serviceType: 'Routine Follow-up',
        locationName: 'Marion VA Clinic',
        clinicName: 'Zanesville Primary Care',
        vistaId: '534',
        lastSeen: '2024-11-26T00:32:34.216Z',
        hasAvailability: true,
      },
      {
        resourceType: 'PatientProviderRelationship',
        providerName: 'Doe, Mary D, MD',
        providerId: 'Practitioner/1111',
        serviceType: 'New Problem',
        locationName: 'Marion VA Clinic',
        clinicName: 'Zanesville Primary Care',
        vistaId: '534',
        lastSeen: '2024-10-15T00:32:34.216Z',
        hasAvailability: true,
      },
    ],
  },
};

describe('VAOS Page: ProviderSelectPage', () => {
  beforeEach(() => {
    mockFetch();
  });

  describe('when user is eligible to submit an appointment request', () => {
    it('should display correct call a provider text', async () => {
      const store = createTestStore(defaultState);
      const screen = renderWithStoreAndRouter(<SelectProviderPage />, {
        store,
      });

      expect(screen.getByText(/Option 2: Call the facility/i)).to.exist;
    });
  });

  /* Commenting out for now to unblock OH request test in staging */
  describe('when user is over request limit', () => {
    it('should display correct call a provider text', async () => {
      const store = createTestStore({
        ...defaultState,
        newAppointment: {
          ...defaultState.newAppointment,
          eligibility: eligibilityOverRequestLimit,
        },
      });
      const screen = renderWithStoreAndRouter(<SelectProviderPage />, {
        store,
      });
      await waitFor(() => {
        expect(screen.queryByTestId('cc-eligible-header')).to.not.exist;
      });
    });
  });

  describe('when a provider has no availability', () => {
    const store = createTestStore({
      ...defaultState,
      newAppointment: {
        ...defaultState.newAppointment,
        patientProviderRelationships: [
          {
            resourceType: 'PatientProviderRelationship',
            providerName: 'Doe, John D, MD',
            providerId: 'Practitioner/123456',
            serviceType: 'Routine Follow-up',
            locationName: 'Marion VA Clinic',
            clinicName: 'Zanesville Primary Care',
            vistaId: '534',
            lastSeen: '2024-11-26T00:32:34.216Z',
            hasAvailability: false,
          },
        ],
      },
    });

    it('should not display the schedule link', async () => {
      const screen = renderWithStoreAndRouter(<SelectProviderPage />, {
        store,
      });

      await waitFor(() => {
        expect(screen.queryByTestId('choose-date-time')).to.not.exist;
      });
    });

    it('should display additional info', async () => {
      const screen = renderWithStoreAndRouter(<SelectProviderPage />, {
        store,
      });

      await waitFor(() => {
        expect(screen.queryByTestId('no-appointments-available')).to.exist;
      });
    });
  });

  describe('when there is a single provider', () => {
    it('should display the type of care specific page header', async () => {
      const store = createTestStore({
        ...defaultState,
        newAppointment: {
          ...defaultState.newAppointment,
          patientProviderRelationships: [
            {
              resourceType: 'PatientProviderRelationship',
              providerName: 'Doe, John D, MD',
              providerId: 'Practitioner/123456',
              serviceType: 'Routine Follow-up',
              locationName: 'Marion VA Clinic',
              clinicName: 'Zanesville Primary Care',
              vistaId: '534',
              lastSeen: '2024-11-26T00:32:34.216Z',
              hasAvailability: true,
            },
          ],
        },
      });
      const screen = renderWithStoreAndRouter(<SelectProviderPage />, {
        store,
      });

      expect(screen.getByText(/Your nutrition and food provider/i)).to.exist;
    });
  });

  describe('when there are multiple providers', () => {
    it('should display the generic page header', async () => {
      const store = createTestStore(defaultState);

      const screen = renderWithStoreAndRouter(<SelectProviderPage />, {
        store,
      });

      expect(screen.getByText(/Which provider do you want to schedule with?/i))
        .to.exist;
    });
  });

  describe('when a provider has availability and is selected', () => {
    it('should update selected provider in state', async () => {
      const store = createTestStore({
        ...defaultState,
        newAppointment: {
          ...defaultState.newAppointment,
          patientProviderRelationships: [
            {
              resourceType: 'PatientProviderRelationship',
              providerName: 'Doe, John D, MD',
              providerId: 'Practitioner/123456',
              serviceType: 'Routine Follow-up',
              locationName: 'Marion VA Clinic',
              clinicName: 'Zanesville Primary Care',
              vistaId: '534',
              lastSeen: '2024-11-26T00:32:34.216Z',
              hasAvailability: true,
            },
          ],
        },
      });

      const screen = renderWithStoreAndRouter(<SelectProviderPage />, {
        store,
      });

      const chooseDateTimeLink = await screen.queryByTestId('choose-date-time');

      chooseDateTimeLink.click();

      await waitFor(() => {
        expect(store.getState().newAppointment.data.selectedProvider).to.equal(
          'Practitioner/123456',
        );
      });
    });
  });
  describe('When no providers available', () => {
    it('Should show alert-like info below h1, but without extras for ineligibility for requests', () => {
      const store = createTestStore({
        ...defaultState,
        newAppointment: {
          ...defaultState.newAppointment,
          patientProviderRelationships: [],
        },
      });
      const screen = renderWithStoreAndRouter(<SelectProviderPage />, {
        store,
      });
      expect(screen.getByTestId('page-header-provider-select')).to.have.text(
        "You can't schedule this appointment online",
      );
      // eligible for request and not over limit, so the intro does not refer user to call.
      expect(
        screen.getByTestId('no-available-provider-intro'),
      ).to.not.contain.text('You can call the facility to schedule.');

      // No extra contact link for facility, same reason as above
      expect(screen.queryByTestId('no-available-provider-extra')).to.not.exist;

      // should show options to request, because eligible
      expect(screen.queryAllByText(/Option/)).to.have.length(2);
    });
    it('Should show all alert-like information below h1, with extras', () => {
      const store = createTestStore({
        ...defaultState,
        newAppointment: {
          ...defaultState.newAppointment,
          patientProviderRelationships: [],
          eligibility: eligibilityOverRequestLimit,
        },
      });
      const screen = renderWithStoreAndRouter(<SelectProviderPage />, {
        store,
      });
      expect(screen.getByTestId('page-header-provider-select')).to.have.text(
        "You can't schedule this appointment online",
      );
      // Because ineligible due to over limit, so the intro asks the user to call.
      expect(screen.getByTestId('no-available-provider-intro')).to.contain.text(
        'You can call the facility to schedule.',
      );

      // Extra contact link for facility, same reason as above
      expect(screen.queryByTestId('no-available-provider-extra')).to.exist;

      // should NOT show options to request, because over limit
      expect(screen.queryAllByText(/Option/)).to.have.length(0);
    });
    it('Should show all alert-like information below h1, with extra test', () => {
      const store = createTestStore({
        ...defaultState,
        newAppointment: {
          ...defaultState.newAppointment,
          patientProviderRelationships: [],
          eligibility: requestDisabled,
        },
      });
      const screen = renderWithStoreAndRouter(<SelectProviderPage />, {
        store,
      });
      expect(screen.getByTestId('page-header-provider-select')).to.have.text(
        "You can't schedule this appointment online",
      );
      // Because ineligible due to over limit, so the intro asks the user to call.
      expect(screen.getByTestId('no-available-provider-intro')).to.contain.text(
        'You can call the facility to schedule.',
      );

      // Extra contact link for facility, same reason as above
      expect(screen.queryByTestId('no-available-provider-extra')).to.exist;

      // should NOT show options to request, because over limit
      expect(screen.queryAllByText(/Option/)).to.have.length(0);
    });
    it('Should show alert-like information and options if providers comes back null and eligible for requests', () => {
      const store = createTestStore({
        ...defaultState,
        newAppointment: {
          ...omit(defaultState.newAppointment, [
            'patientProviderRelationships',
          ]),
          patientProviderRelationships: null,
        },
      });
      const screen = renderWithStoreAndRouter(<SelectProviderPage />, {
        store,
      });
      expect(screen.getByTestId('page-header-provider-select')).to.have.text(
        "You can't schedule this appointment online",
      );

      expect(
        screen.getByTestId('no-available-provider-intro'),
      ).not.to.contain.text('You can call the facility to schedule.');

      expect(screen.queryAllByText(/Option/)).to.have.length(2);
    });
  });
});
