import { expect } from 'chai';

import { getCancelInfo } from '../../../appointment-list/redux/selectors';

import { APPOINTMENT_TYPES } from '../../../utils/constants';

describe('VAOS selectors', () => {
  describe('getCancelInfo', () => {
    it('should fetch facility in info', () => {
      const state = {
        featureToggles: {
          // eslint-disable-next-line camelcase
          show_new_schedule_view_appointments_page: true,
        },
        user: {
          profile: {
            facilities: [
              {
                facilityId: '123',
                isCerner: true,
                usesCernerAppointments: true,
              },
            ],
            isCernerPatient: true,
          },
        },
        appointments: {
          appointmentToCancel: {
            facility: {
              facilityCode: '123',
            },
            vaos: {},
            location: {
              vistaId: '123',
            },
          },
          facilityData: {
            var123: {},
          },
        },
      };

      const cancelInfo = getCancelInfo(state);

      expect(cancelInfo.facility).to.equal(
        state.appointments.facilityData['123'],
      );
    });
    it('should fetch facility from clinic map', () => {
      const state = {
        featureToggles: {
          // eslint-disable-next-line camelcase
          show_new_schedule_view_appointments_page: true,
        },
        user: {
          profile: {
            facilities: [
              {
                facilityId: '123',
                isCerner: true,
                usesCernerAppointments: true,
              },
            ],
            isCernerPatient: true,
          },
        },
        appointments: {
          appointmentToCancel: {
            status: 'booked',
            vaos: {
              appointmentType: APPOINTMENT_TYPES.vaAppointment,
            },
            participant: [
              {
                actor: {
                  reference: 'HealthcareService/123_456',
                  display: 'Test',
                },
              },
              {
                actor: {
                  reference: 'Location/123',
                  display: 'Facility name',
                },
              },
            ],
            location: {
              stationId: '123',
            },
          },
          facilityData: {
            var123: {},
          },
        },
      };

      const cancelInfo = getCancelInfo(state);

      expect(cancelInfo.facility).to.equal(
        state.appointments.facilityData['123'],
      );
    });
    it('should fetch facility from video appointment', () => {
      const state = {
        featureToggles: {
          // eslint-disable-next-line camelcase
          show_new_schedule_view_appointments_page: true,
        },
        user: {
          profile: {
            facilities: [
              {
                facilityId: '123',
                isCerner: true,
                usesCernerAppointments: true,
              },
            ],
            isCernerPatient: true,
          },
        },
        appointments: {
          appointmentToCancel: {
            status: 'booked',
            legacyVAR: { apiData: { facilityId: '123' } },
            vaos: {
              appointmentType: APPOINTMENT_TYPES.vaAppointment,
            },
            contained: [
              {
                resourceType: 'HealthcareService',
                characteristic: [
                  {
                    coding: [{ system: 'VVS' }],
                  },
                ],
                providedBy: {
                  reference: 'Organization/123',
                },
              },
            ],
            location: {
              stationId: '123',
            },
          },
          facilityData: {
            var123: {},
          },
        },
      };

      const cancelInfo = getCancelInfo(state);

      expect(cancelInfo.facility).to.equal(
        state.appointments.facilityData['123'],
      );
    });
  });
});
