import React from 'react';
import { expect } from 'chai';
import { mockFetch } from '@department-of-veterans-affairs/platform-testing/helpers';
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
        },
      ],
    },
    eligibility: {},
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
      },
    ],
  },
};

describe('VAOS Page: ProviderSelectPage', () => {
  beforeEach(() => {
    mockFetch();
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
