import { expect } from 'chai';
import moment from '../../../lib/moment-tz';

import {
  getCancelInfo,
  selectLocalExpressCareWindowString,
  selectNextAvailableExpressCareWindowString,
} from '../../../appointment-list/redux/selectors';

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

  describe('selectLocalExpressCareWindowString', () => {
    it('should return currently active hours', () => {
      const today = moment();
      const startTime = today
        .clone()
        .subtract('2', 'minutes')
        .tz('America/Denver');
      const endTime = today
        .clone()
        .add('1', 'minutes')
        .tz('America/Denver');
      const state = {
        appointments: {
          expressCareFacilities: [
            {
              facilityId: '983',
              days: [
                {
                  day: today
                    .clone()
                    .tz('America/Denver')
                    .format('dddd')
                    .toUpperCase(),
                  canSchedule: true,
                  startTime: startTime.format('HH:mm'),
                  endTime: endTime.format('HH:mm'),
                },
              ],
            },
          ],
        },
      };

      expect(selectLocalExpressCareWindowString(state, today)).to.equal(
        `${startTime.format('h:mm a')} to ${endTime.format('h:mm a')} MT`,
      );
    });

    it('should be empty when not active', () => {
      const today = moment();
      const startTime = today
        .clone()
        .subtract('2', 'minutes')
        .tz('America/Denver');
      const endTime = today
        .clone()
        .subtract('1', 'minutes')
        .tz('America/Denver');
      const state = {
        appointments: {
          expressCareFacilities: [
            {
              facilityId: '983',
              days: [
                {
                  day: today.format('dddd').toUpperCase(),
                  canSchedule: true,
                  startTime: startTime.format('HH:mm'),
                  endTime: endTime.format('HH:mm'),
                },
              ],
            },
          ],
        },
      };

      expect(selectLocalExpressCareWindowString(state, today)).not.to.exist;
    });
  });

  describe('selectNextAvailableExpressCareWindowString', () => {
    it('should return today’s schedule if current time is before window start', () => {
      const today = moment();
      const startTime = today
        .clone()
        .add('1', 'minutes')
        .tz('America/Denver');
      const endTime = today
        .clone()
        .add('2', 'minutes')
        .tz('America/Denver');
      const state = {
        appointments: {
          expressCareFacilities: [
            {
              facilityId: '983',
              days: [
                {
                  day: today
                    .clone()
                    .tz('America/Denver')
                    .format('dddd')
                    .toUpperCase(),
                  canSchedule: true,
                  startTime: startTime.format('HH:mm'),
                  endTime: endTime.format('HH:mm'),
                },
              ],
            },
          ],
        },
      };

      expect(selectNextAvailableExpressCareWindowString(state, today)).to.equal(
        `today from ${startTime.format('h:mm a')} to ${endTime.format(
          'h:mm a',
        )} MT`,
      );
    });

    it('should return today’s schedule and designate next week if current time is after window start and today is the only schedulable day', () => {
      const today = moment();
      const startTime = today
        .clone()
        .add(-2, 'minutes')
        .tz('America/Denver');
      const endTime = today
        .clone()
        .add(-1, 'minutes')
        .tz('America/Denver');
      const state = {
        appointments: {
          expressCareFacilities: [
            {
              facilityId: '983',
              days: [
                {
                  day: today
                    .clone()
                    .tz('America/Denver')
                    .format('dddd')
                    .toUpperCase(),
                  canSchedule: true,
                  startTime: startTime.format('HH:mm'),
                  endTime: endTime.format('HH:mm'),
                },
              ],
            },
          ],
        },
      };

      expect(selectNextAvailableExpressCareWindowString(state, today)).to.equal(
        `next ${today
          .clone()
          .tz('America/Denver')
          .format('dddd')} from ${startTime.format(
          'h:mm a',
        )} to ${endTime.format('h:mm a')} MT`,
      );
    });
  });
});
