import { expect } from 'chai';
import { render } from '@testing-library/react';
import MockDate from 'mockdate';
import {
  appointmentWasCanceled,
  allAppointmentsCanceled,
  hasMoreAppointmentsToCheckInto,
  intervalUntilNextAppointmentIneligibleForCheckin,
  preCheckinAlreadyCompleted,
  sortAppointmentsByStartTime,
  organizeAppointmentsByYearMonthDay,
  removeTimeZone,
  preCheckinExpired,
  locationShouldBeDisplayed,
  hasPhoneAppointments,
  appointmentIcon,
  clinicName,
  getAppointmentId,
  findAppointment,
  utcToFacilityTimeZone,
  getApptLabel,
  findUpcomingAppointment,
  hasMultipleFacilities,
  convertAppointments,
} from './index';

import { get } from '../../api/local-mock-api/mocks/v2/shared';
import { ELIGIBILITY } from './eligibility';

const convertedAppointment = {
  id: '000000',
  facility: 'LOMA LINDA VA CLINIC',
  clinicPhoneNumber: null,
  clinicFriendlyName: 'TEST CLINIC',
  clinicName: 'TEST CLINIC',
  clinicStopCodeName: null,
  clinicLocation: 'SECOND FLOOR ROOM 2',
  doctorName: null,
  appointmentIen: null,
  startTime: '2023-09-26T14:00:00',
  stationNo: '983',
  eligibility: null,
  kind: 'clinic',
  clinicIen: null,
  checkInWindowStart: null,
  checkInWindowEnd: null,
  checkInSteps: null,
  checkedInTime: null,
  status: 'booked',
  facilityAddress: null,
};

describe('check in', () => {
  afterEach(() => {
    MockDate.reset();
  });

  const { createAppointment, createAppointments, createUpcomingAppointment } =
    get;

  describe('appointment navigation utils', () => {
    describe('hasMoreAppointmentsToCheckInto', () => {
      it('returns false if selected Appointment is undefined and no more eligible appointments found', () => {
        const appointments = [
          createAppointment({ eligibility: 'INELIGIBLE_TOO_EARLY' }),
          createAppointment({ eligibility: 'INELIGIBLE_TOO_EARLY' }),
          createAppointment({ eligibility: 'INELIGIBLE_TOO_EARLY' }),
        ];

        expect(
          hasMoreAppointmentsToCheckInto(appointments, undefined),
        ).to.equal(false);
      });
      it('returns true if selected Appointment is undefined and more eligible appointments found', () => {
        const response = createAppointments();
        const { appointments } = response.payload;

        expect(
          hasMoreAppointmentsToCheckInto(appointments, undefined),
        ).to.equal(true);
      });
      it('returns false if appointments is empty', () => {
        const appointments = [];

        expect(
          hasMoreAppointmentsToCheckInto(appointments, undefined),
        ).to.equal(false);
      });
      it('returns false if the selected appointment is found and is the only eligible appointment', () => {
        const selectedAppointment = createAppointment({
          eligibility: 'ELIGIBLE',
          facility: 'some-facility',
          appointmentIen: 'some-ien',
          clinicFriendlyName: 'TEST CLINIC',
        });
        const appointments = [
          createAppointment({ eligibility: 'INELIGIBLE_TOO_EARLY' }),
          createAppointment({ eligibility: 'INELIGIBLE_TOO_EARLY' }),
          createAppointment({ eligibility: 'INELIGIBLE_TOO_EARLY' }),
          selectedAppointment,
        ];

        expect(
          hasMoreAppointmentsToCheckInto(appointments, selectedAppointment),
        ).to.equal(false);
      });
      it('returns true if the selected appointment is found and there are more eligible appointments', () => {
        const selectedAppointment = createAppointment({
          eligibility: 'ELIGIBLE',
          appointmentIen: 'some-ien',
          clinicFriendlyName: 'TEST CLINIC',
        });
        const appointments = [
          createAppointment({ eligibility: 'INELIGIBLE_TOO_EARLY' }),
          createAppointment({ eligibility: 'INELIGIBLE_TOO_EARLY' }),
          createAppointment({
            eligibility: 'ELIGIBLE',
            appointmentIen: 'some-other-ien',
            clinicFriendlyName: 'TEST CLINIC',
          }),
          selectedAppointment,
        ];
        expect(
          hasMoreAppointmentsToCheckInto(appointments, selectedAppointment),
        ).to.equal(true);
      });
      it('returns true if the selected appointment is not found and there are more eligible appointments', () => {
        const selectedAppointment = createAppointment({
          eligibility: 'ELIGIBLE',
          appointmentIen: 'some-ien',
          clinicFriendlyName: 'TEST CLINIC',
        });
        const appointments = [
          createAppointment({ eligibility: 'INELIGIBLE_TOO_EARLY' }),
          createAppointment({ eligibility: 'INELIGIBLE_TOO_EARLY' }),
          createAppointment({
            eligibility: 'ELIGIBLE',
            appointmentIen: 'some-other-ien',
            clinicFriendlyName: 'TEST CLINIC',
          }),
        ];
        expect(
          hasMoreAppointmentsToCheckInto(appointments, selectedAppointment),
        ).to.equal(true);
      });
      it('returns false if no more eligible appointments are found', () => {
        const selectedAppointment = createAppointment({
          eligibility: 'ELIGIBLE',
          appointmentIen: 'some-other-ien',
          clinicFriendlyName: 'TEST CLINIC',
        });
        const appointments = [
          createAppointment({ eligibility: 'INELIGIBLE_TOO_EARLY' }),
          createAppointment({ eligibility: 'INELIGIBLE_TOO_EARLY' }),
        ];
        expect(
          hasMoreAppointmentsToCheckInto(appointments, selectedAppointment),
        ).to.equal(false);
      });
    });
    describe('allAppointmentsCanceled', () => {
      const generateAppointments = () => {
        const earliest = createAppointment();
        earliest.startTime = '2018-01-01T00:00:00.000Z';
        const midday = createAppointment();
        midday.startTime = '2018-01-01T12:00:00.000Z';
        const latest = createAppointment();
        latest.startTime = '2018-01-01T23:59:59.000Z';

        return [latest, earliest, midday];
      };

      it('returns false when no appointment was canceled', () => {
        const appointments = generateAppointments();
        expect(allAppointmentsCanceled(appointments)).to.deep.equal(false);
      });
      it('returns false when appointments are not set', () => {
        expect(allAppointmentsCanceled(null)).to.deep.equal(false);
      });
      it('returns false when there are no appointments', () => {
        expect(allAppointmentsCanceled([])).to.deep.equal(false);
      });
      it('returns false when some appointments have been canceled', () => {
        const appointments = generateAppointments();
        appointments[0].status = 'CANCELLED BY CLINIC';
        expect(allAppointmentsCanceled(appointments)).to.deep.equal(false);
      });
      it('returns false when status is undefined', () => {
        const appointments = generateAppointments();
        appointments.forEach((appt, idx) => {
          delete appointments[idx].status;
        });
        expect(allAppointmentsCanceled(appointments)).to.deep.equal(false);
      });
      it('returns true when all appointments have been canceled', () => {
        const appointments = generateAppointments();
        appointments.forEach((appointment, index) => {
          appointments[index].status = 'CANCELLED BY CLINIC';
        });
        expect(allAppointmentsCanceled(appointments)).to.deep.equal(true);
      });
    });
    describe('appointmentWasCanceled', () => {
      const generateAppointments = () => {
        const earliest = createAppointment();
        earliest.startTime = '2018-01-01T00:00:00.000Z';
        const midday = createAppointment();
        midday.startTime = '2018-01-01T12:00:00.000Z';
        const latest = createAppointment();
        latest.startTime = '2018-01-01T23:59:59.000Z';

        return [latest, earliest, midday];
      };

      it('returns false when no appointment was canceled', () => {
        const appointments = generateAppointments();
        expect(appointmentWasCanceled(appointments)).to.deep.equal(false);
      });
      it('returns false when appointments are not set', () => {
        expect(appointmentWasCanceled(null)).to.deep.equal(false);
      });
      it('returns false when there are no appointments', () => {
        expect(appointmentWasCanceled([])).to.deep.equal(false);
      });
      it('returns true when some appointments have been canceled', () => {
        const appointments = generateAppointments();
        appointments[0].status = 'CANCELLED BY CLINIC';
        expect(appointmentWasCanceled(appointments)).to.deep.equal(true);
      });
      it('returns false when status is undefined', () => {
        const appointments = generateAppointments();
        appointments.forEach((appt, idx) => {
          delete appointments[idx].status;
        });
        expect(appointmentWasCanceled(appointments)).to.deep.equal(false);
      });
      it('returns false when all appointments have been canceled', () => {
        const appointments = generateAppointments();
        appointments.forEach((appointment, index) => {
          appointments[index].status = 'CANCELLED BY CLINIC';
        });
        expect(appointmentWasCanceled(appointments)).to.deep.equal(false);
      });
    });
    describe('intervalUntilNextAppointmentIneligibleForCheckin', () => {
      const generateAppointments = () => {
        const earliest = createAppointment();
        earliest.startTime = '2018-01-01T11:00';
        earliest.checkInWindowEnd = '2018-01-01T11:15-04:00';
        const midday = createAppointment();
        midday.startTime = '2018-01-01T12:30:00';
        midday.checkInWindowEnd = '2018-01-01T12:45:00-04:00';
        const latest = createAppointment();
        latest.startTime = '2018-01-01T13:00';
        latest.checkInWindowEnd = '2018-01-01T13:15:00-04:00';

        return [midday, earliest, latest];
      };

      it('returns 0 when no appointments are eligible', () => {
        const appointments = generateAppointments();
        appointments[0].eligibility = ELIGIBILITY.INELIGIBLE_ALREADY_CHECKED_IN;
        appointments[1].eligibility = ELIGIBILITY.INELIGIBLE_ALREADY_CHECKED_IN;
        appointments[2].eligibility = ELIGIBILITY.INELIGIBLE_ALREADY_CHECKED_IN;
        expect(
          intervalUntilNextAppointmentIneligibleForCheckin(appointments),
        ).to.deep.equal(0);
      });
      it('returns interval to next appointment', () => {
        const appointments = generateAppointments();
        MockDate.set('2018-01-01T12:44:00-04:00');
        expect(
          intervalUntilNextAppointmentIneligibleForCheckin(appointments),
        ).to.deep.equal(60000);
      });
    });
    describe('preCheckinAlreadyCompleted', () => {
      const generateAppointments = () => {
        const checkInSteps = [
          {
            status: 'PRE-CHECK-IN STARTED',
            dateTime: '2017-12-31T00:00:00.000',
            ien: 1,
          },
          {
            status: 'PRE-CHECK-IN COMPLETE',
            dateTime: '2017-12-31T00:05:00.000',
            ien: 2,
          },
        ];

        const earliest = createAppointment();
        earliest.startTime = '2018-01-01T00:00:00.000Z';
        earliest.checkInSteps = checkInSteps;
        const midday = createAppointment();
        midday.startTime = '2018-01-01T12:00:00.000Z';
        midday.checkInSteps = checkInSteps;
        const latest = createAppointment();
        latest.startTime = '2018-01-01T23:59:59.000Z';
        latest.checkInSteps = checkInSteps;

        return [latest, earliest, midday];
      };

      it('returns true when pre-check-in is completed for all appointments', () => {
        const appointments = generateAppointments();
        expect(preCheckinAlreadyCompleted(appointments)).to.deep.equal(true);
      });
      it('returns false when appointments are not set', () => {
        expect(preCheckinAlreadyCompleted(null)).to.deep.equal(false);
      });
      it('returns false when there are no appointments', () => {
        expect(preCheckinAlreadyCompleted([])).to.deep.equal(false);
      });
      it('returns false when any appointment has not completed pre-checkin', () => {
        const appointments = generateAppointments();
        appointments[0].checkInSteps = [];
        expect(preCheckinAlreadyCompleted(appointments)).to.deep.equal(false);
      });
      it('returns false when checkInSteps are undefined', () => {
        const appointments = generateAppointments();
        appointments.forEach((appt, idx) => {
          delete appointments[idx].checkInSteps;
        });
        expect(preCheckinAlreadyCompleted(appointments)).to.deep.equal(false);
      });
    });
    describe('locationShouldBeDisplayed', () => {
      it('returns true for in-person appointments with content in the location field', () => {
        const appointment = createAppointment();
        expect(locationShouldBeDisplayed(appointment)).to.deep.equal(true);
      });
      it('returns false for in-person appointments without content in the location field', () => {
        const appointment = createAppointment();
        appointment.clinicLocation = '';
        expect(locationShouldBeDisplayed(appointment)).to.deep.equal(false);
      });
      it('returns false for in-person appointments without the location field', () => {
        const appointment = createAppointment();
        delete appointment.clinicLocation;
        expect(locationShouldBeDisplayed(appointment)).to.deep.equal(false);
      });
      it('returns false for phone appointments with the location field', () => {
        const appointment = createAppointment();
        appointment.kind = 'phone';
        expect(locationShouldBeDisplayed(appointment)).to.deep.equal(false);
      });
      it('returns false for phone appointments without content in the location field', () => {
        const appointment = createAppointment();
        appointment.kind = 'phone';
        appointment.clinicLocation = '';
        expect(locationShouldBeDisplayed(appointment)).to.deep.equal(false);
      });
      it('returns false for phone appointments without the location field', () => {
        const appointment = createAppointment();
        appointment.kind = 'phone';
        delete appointment.clinicLocation;
        expect(locationShouldBeDisplayed(appointment)).to.deep.equal(false);
      });
    });
    describe('sortAppointmentsByStartTime', () => {
      it('returns empty array when appointments is undefined', () => {
        expect(sortAppointmentsByStartTime(undefined)).to.deep.equal([]);
      });
      it('returns empty array when appointments is empty', () => {
        expect(sortAppointmentsByStartTime([])).to.deep.equal([]);
      });
      it('returns sorted array when appointments is not empty', () => {
        const earliest = createAppointment();
        earliest.startTime = '2018-01-01T00:00:00.000Z';
        const midday = createAppointment();
        midday.startTime = '2018-01-01T12:00:00.000Z';
        const latest = createAppointment();
        latest.startTime = '2018-01-01T23:59:59.000Z';

        const appointments = [latest, earliest, midday];
        const sortedAppointments = [earliest, midday, latest];
        expect(sortAppointmentsByStartTime(appointments)).to.deep.equal(
          sortedAppointments,
        );
      });
    });
    describe('organizeAppointmentsByYearMonthDay', () => {
      it('returns an empty object when appointments is undefined', () => {
        expect(organizeAppointmentsByYearMonthDay(undefined)).to.deep.equal([]);
      });
      it('returns an empty object when appointments is empty', () => {
        expect(organizeAppointmentsByYearMonthDay(undefined)).to.deep.equal([]);
      });
      it('returns the expected object organized by month and day and sorted by acending time', () => {
        const first = createAppointment();
        first.startTime = '2023-01-01T08:00:00.000Z';
        const second = createAppointment();
        second.startTime = '2023-01-02T08:00:00.000Z';
        const third = createAppointment();
        third.startTime = '2023-01-02T08:01:30.000Z';
        const fourth = createAppointment();
        fourth.startTime = '2023-01-02T08:02:30.000Z';
        const fifth = createAppointment();
        fifth.startTime = '2023-02-03T08:02:30.000Z';
        const sixth = createAppointment();
        sixth.startTime = '2024-02-03T08:02:30.000Z';

        const appointments = [sixth, fifth, third, fourth, second, first];

        const sortedAppointments = [
          {
            monthYearKey: '2023-1',
            days: [
              {
                dayKey: '0-1',
                appointments: [first],
                firstAppointmentStartTime: '2023-01-01T08:00:00.000Z',
              },
              {
                dayKey: '1-2',
                appointments: [second, third, fourth],
                firstAppointmentStartTime: '2023-01-02T08:00:00.000Z',
              },
            ],
            firstAppointmentStartTime: '2023-01-01T08:00:00.000Z',
          },
          {
            monthYearKey: '2023-2',
            days: [
              {
                dayKey: '5-3',
                appointments: [fifth],
                firstAppointmentStartTime: '2023-02-03T08:02:30.000Z',
              },
            ],
            firstAppointmentStartTime: '2023-02-03T08:02:30.000Z',
          },
          {
            monthYearKey: '2024-2',
            days: [
              {
                dayKey: '6-3',
                appointments: [sixth],
                firstAppointmentStartTime: '2024-02-03T08:02:30.000Z',
              },
            ],
            firstAppointmentStartTime: '2024-02-03T08:02:30.000Z',
          },
        ];
        expect(organizeAppointmentsByYearMonthDay(appointments)).to.deep.equal(
          sortedAppointments,
        );
      });
    });
    describe('removeTimeZone', () => {
      it('removes timezone from date strings', () => {
        const payloadWithTZ = {
          appointments: [
            {
              checkInWindowEnd: '2018-01-01T00:00:00.070Z',
              checkInWindowStart: '2018-01-01T00:00:00.070Z',
              checkedInTime: '2018-01-01T00:00:00.070Z',
              startTime: '2018-01-01T00:00:00.070Z',
            },
          ],
        };
        const payloadWithoutTZ = {
          appointments: [
            {
              checkInWindowEnd: '2018-01-01T00:00:00.070Z',
              checkInWindowStart: '2018-01-01T00:00:00.070Z',
              checkedInTime: '2018-01-01T00:00:00',
              startTime: '2018-01-01T00:00:00',
            },
          ],
        };
        const updatedPayloadWithTZ = removeTimeZone(payloadWithTZ);
        const updatedPayloadWithoutTZ = removeTimeZone(payloadWithoutTZ);
        expect(updatedPayloadWithTZ.appointments[0].checkInWindowEnd).to.equal(
          '2018-01-01T00:00:00.070Z',
        );
        expect(
          updatedPayloadWithTZ.appointments[0].checkInWindowStart,
        ).to.equal('2018-01-01T00:00:00.070Z');
        expect(updatedPayloadWithTZ.appointments[0].checkedInTime).to.equal(
          '2018-01-01T00:00:00',
        );
        expect(updatedPayloadWithTZ.appointments[0].startTime).to.equal(
          '2018-01-01T00:00:00',
        );
        expect(
          updatedPayloadWithoutTZ.appointments[0].checkInWindowEnd,
        ).to.equal('2018-01-01T00:00:00.070Z');
        expect(
          updatedPayloadWithoutTZ.appointments[0].checkInWindowStart,
        ).to.equal('2018-01-01T00:00:00.070Z');
        expect(updatedPayloadWithoutTZ.appointments[0].checkedInTime).to.equal(
          '2018-01-01T00:00:00',
        );
        expect(updatedPayloadWithoutTZ.appointments[0].startTime).to.equal(
          '2018-01-01T00:00:00',
        );
      });
    });
    describe('preCheckinExpired', () => {
      it('identifies an expired pre-check-in appointment list', () => {
        // Set a fixed time at noon to avoid flakiness near midnight UTC
        const today = new Date();
        today.setUTCHours(12, 0, 0, 0);
        MockDate.set(today);
        const appointments = [
          createAppointment({ preCheckInValid: false }),
          createAppointment({ preCheckInValid: false }),
        ];
        expect(preCheckinExpired(appointments)).to.be.true;
        MockDate.reset();
      });
      it('identifies a valid pre-check-in appointment list', () => {
        // Set a fixed time at noon to avoid flakiness near midnight UTC
        const today = new Date();
        today.setUTCHours(12, 0, 0, 0);
        MockDate.set(today);
        const appointments = [
          createAppointment({ preCheckInValid: true }),
          createAppointment({ preCheckInValid: true }),
        ];
        expect(preCheckinExpired(appointments)).to.be.false;
        MockDate.reset();
      });
    });
    describe('hasPhoneAppointments', () => {
      it('finds phone appointment', () => {
        const appointments = [createAppointment({ kind: 'phone' })];
        expect(hasPhoneAppointments(appointments)).to.be.true;
      });
      it("doesn't find phone appointment", () => {
        const appointments = [createAppointment()];
        expect(hasPhoneAppointments(appointments)).to.be.false;
      });
    });
    describe('appointmentIcon', () => {
      it('finds phone appointment', () => {
        const appointment = createAppointment({ kind: 'phone' });
        const icon = render(appointmentIcon(appointment));

        expect(icon.getByTestId('appointment-icon')).to.exist;
      });
    });
    describe('clinicName', () => {
      it('returns clinic friendly name', () => {
        const appointment = createAppointment({
          clinicFriendlyName: 'test clinic',
        });
        expect(clinicName(appointment)).to.equal('test clinic');
      });
      it('returns the fallback if friendly name missing', () => {
        const appointment = createAppointment({ clinicFriendlyName: '' });
        expect(clinicName(appointment)).to.equal('LOM ACC CLINIC TEST');
      });
    });
    describe('getAppointmentId for vista appointments', () => {
      it('returns unique appointment ID of ien and station', () => {
        const appointment = createAppointment({
          appointmentIen: 24354,
          stationNo: '4343',
        });
        expect(getAppointmentId(appointment)).to.equal('24354-4343');
      });
    });
    describe('getAppointmentId for VAOS appointments', () => {
      it('returns unique appointment ID of id and station', () => {
        const appointment = {
          id: 123456,
          stationNo: '4343',
        };
        expect(getAppointmentId(appointment)).to.equal('123456-4343');
      });
    });
    describe('findAppointment', () => {
      it('finds the appointment in array based on ID', () => {
        const appointments = [
          {
            appointmentIen: 24354,
            stationNo: '4343',
          },
          {
            appointmentIen: '2222',
            stationNo: '7780',
          },
        ];
        const appointmentId = '2222-7780';
        expect(findAppointment(appointmentId, appointments)).to.deep.equal(
          appointments[1],
        );
      });
    });
    describe('findUpcomingAppointment', () => {
      const appointments = [
        {
          id: '000001',
          stationNo: '983',
        },
        {
          id: '000002',
          stationNo: '982',
        },
      ];
      const appointmentId = '000002-982';
      expect(
        findUpcomingAppointment(appointmentId, appointments),
      ).to.deep.equal(appointments[1]);
    });
    describe('hasMultipleFacilities', () => {
      it('returns true if more than one unique stationNo values', () => {
        const appointments = [
          {
            stationNo: '4343',
          },
          {
            stationNo: '7780',
          },
        ];
        expect(hasMultipleFacilities(appointments)).to.be.true;
      });
      it('returns false if one unique stationNo value', () => {
        const appointments = [
          {
            stationNo: '7780',
          },
          {
            stationNo: '7780',
          },
        ];
        expect(hasMultipleFacilities(appointments)).to.be.false;
      });
    });
    describe('utcToFacilityTimeZone', () => {
      it('returns the timezone adjusted ISO srting', () => {
        const time = '2020-01-24T00:20:00.000+00:00';
        const timezone = 'America/Los_Angeles';
        expect(utcToFacilityTimeZone(time, timezone)).to.equal(
          '2020-01-23T16:20:00.000-08:00',
        );
      });
    });
    describe('getApptLabel', () => {
      it('returns the label for a travel only appointment with clinic name', () => {
        const appointment = {
          startTime: '2020-01-24T00:20:00.000+00:00',
          timezone: 'America/Los_Angeles',
          clinicFriendlyName: 'test',
        };
        expect(getApptLabel(appointment)).to.equal('4:20 p.m. test');
      });
      it('returns the label for a travel only appointment falling back to type of care', () => {
        const appointment = {
          startTime: '2020-01-24T00:20:00.000+00:00',
          timezone: 'America/Los_Angeles',
          clinicStopCodeName: 'test type',
        };
        expect(getApptLabel(appointment)).to.equal('4:20 p.m. test type');
      });
      it('returns the label for a travel only appointment defaulting to just time if no clinic or type of care', () => {
        const appointment = {
          startTime: '2020-01-24T00:20:00.000+00:00',
          timezone: 'America/Los_Angeles',
        };
        expect(getApptLabel(appointment)).to.equal('4:20 p.m.');
      });
    });
    describe('convertAppointments', () => {
      it('returns the correct structure', () => {
        const appointments = [
          createUpcomingAppointment({}),
          createUpcomingAppointment({}),
        ];
        expect(convertAppointments(appointments)).to.deep.equal([
          convertedAppointment,
          convertedAppointment,
        ]);
      });
    });
  });
});
