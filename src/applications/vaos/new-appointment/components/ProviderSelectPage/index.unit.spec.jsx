import React from 'react';
import { expect } from 'chai';
import { mockFetch } from '@department-of-veterans-affairs/platform-testing/helpers';
import { waitFor } from '@testing-library/dom';
import SelectProviderPage from './index';
import {
  createTestStore,
  renderWithStoreAndRouter,
} from '../../../tests/mocks/setup';

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
      typeOfCareId: '123',
    },
    facilities: {
      '123': [
        {
          vistaId: '692',
          legacyVAR: {
            settings: {
              '123': {
                id: '123',
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

      expect(screen.getByText(/Option 1: Call the facility/i)).to.exist;
    });
  });

  describe('when user is over request limit', () => {
    it('should display correct call a provider text', async () => {
      const store = createTestStore({
        ...defaultState,
        newAppointment: {
          ...defaultState.newAppointment,
          eligibility: {
            '692_123': {
              direct: true,
              directReasons: [],
              request: false,
              requestReasons: ['overRequestLimit'],
            },
          },
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
});
