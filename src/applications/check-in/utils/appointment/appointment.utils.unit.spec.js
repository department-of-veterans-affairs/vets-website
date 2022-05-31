import { expect } from 'chai';
import MockDate from 'mockdate';
import {
  appointmentWasCanceled,
  hasMoreAppointmentsToCheckInto,
  intervalUntilNextAppointmentIneligibleForCheckin,
  preCheckinAlreadyCompleted,
  sortAppointmentsByStartTime,
  removeTimeZone,
  preCheckinExpired,
} from './index';

import { get } from '../../api/local-mock-api/mocks/v2/check-in-data';
import { ELIGIBILITY } from './eligibility';

describe('check in', () => {
  afterEach(() => {
    MockDate.reset();
  });

  const { createAppointment, createMultipleAppointments } = get;

  describe('appointment navigation utils', () => {
    describe('hasMoreAppointmentsToCheckInto', () => {
      it('returns false if selected Appointment is undefined and no more eligible appointments found', () => {
        const appointments = [
          createAppointment('INELIGIBLE_TOO_EARLY'),
          createAppointment('INELIGIBLE_TOO_EARLY'),
          createAppointment('INELIGIBLE_TOO_EARLY'),
        ];

        expect(
          hasMoreAppointmentsToCheckInto(appointments, undefined),
        ).to.equal(false);
      });
      it('returns true if selected Appointment is undefined and more eligible appointments found', () => {
        const response = createMultipleAppointments();
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
        const selectedAppointment = createAppointment(
          'ELIGIBLE',
          'some-facility',
          'some-ien',
          'TEST CLINIC',
        );
        const appointments = [
          createAppointment('INELIGIBLE_TOO_EARLY'),
          createAppointment('INELIGIBLE_TOO_EARLY'),
          createAppointment('INELIGIBLE_TOO_EARLY'),
          selectedAppointment,
        ];

        expect(
          hasMoreAppointmentsToCheckInto(appointments, selectedAppointment),
        ).to.equal(false);
      });
      it('returns true if the selected appointment is found and there are more eligible appointments', () => {
        const selectedAppointment = createAppointment(
          'ELIGIBLE',
          'some-facility',
          'some-ien',
          'TEST CLINIC',
        );
        const appointments = [
          createAppointment('INELIGIBLE_TOO_EARLY'),
          createAppointment('INELIGIBLE_TOO_EARLY'),
          createAppointment(
            'ELIGIBLE',
            'some-facility',
            'some-other-ien',
            'TEST CLINIC',
          ),
          selectedAppointment,
        ];
        expect(
          hasMoreAppointmentsToCheckInto(appointments, selectedAppointment),
        ).to.equal(true);
      });
      it('returns true if the selected appointment is not found and there are more eligible appointments', () => {
        const selectedAppointment = createAppointment(
          'ELIGIBLE',
          'some-facility',
          'some-ien',
          'TEST CLINIC',
        );
        const appointments = [
          createAppointment('INELIGIBLE_TOO_EARLY'),
          createAppointment('INELIGIBLE_TOO_EARLY'),
          createAppointment(
            'ELIGIBLE',
            'some-facility',
            'some-other-ien',
            'TEST CLINIC',
          ),
        ];
        expect(
          hasMoreAppointmentsToCheckInto(appointments, selectedAppointment),
        ).to.equal(true);
      });
      it('returns false if no more eligible appointments are found', () => {
        const selectedAppointment = createAppointment(
          'ELIGIBLE',
          'some-facility',
          'some-ien',
          'TEST CLINIC',
        );
        const appointments = [
          createAppointment('INELIGIBLE_TOO_EARLY'),
          createAppointment('INELIGIBLE_TOO_EARLY'),
        ];
        expect(
          hasMoreAppointmentsToCheckInto(appointments, selectedAppointment),
        ).to.equal(false);
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
      it('returns true when any appointment has been canceled', () => {
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
      it('returns true when all appointments have been canceled', () => {
        const appointments = generateAppointments();
        appointments[0].status = 'CANCELLED BY CLINIC';
        appointments[1].status = 'CANCELLED BY PATIENT';
        appointments[0].status = 'CANCELLED BY CLINIC';
        expect(appointmentWasCanceled(appointments)).to.deep.equal(true);
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
              checkInWindowEnd: '2018-01-01T00:00:00',
              checkInWindowStart: '2018-01-01T00:00:00',
              checkedInTime: '2018-01-01T00:00:00',
              startTime: '2018-01-01T00:00:00',
            },
          ],
        };
        const updatedPayloadWithTZ = removeTimeZone(payloadWithTZ);
        const updatedPayloadWithoutTZ = removeTimeZone(payloadWithoutTZ);
        expect(updatedPayloadWithTZ.appointments[0].checkInWindowEnd).to.equal(
          '2018-01-01T00:00:00',
        );
        expect(
          updatedPayloadWithTZ.appointments[0].checkInWindowStart,
        ).to.equal('2018-01-01T00:00:00');
        expect(updatedPayloadWithTZ.appointments[0].checkedInTime).to.equal(
          '2018-01-01T00:00:00',
        );
        expect(updatedPayloadWithTZ.appointments[0].startTime).to.equal(
          '2018-01-01T00:00:00',
        );
        expect(
          updatedPayloadWithoutTZ.appointments[0].checkInWindowEnd,
        ).to.equal('2018-01-01T00:00:00');
        expect(
          updatedPayloadWithoutTZ.appointments[0].checkInWindowStart,
        ).to.equal('2018-01-01T00:00:00');
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
        const appointments = [
          createAppointment(null, null, null, null, false),
          createAppointment(null, null, null, null, false),
        ];
        expect(preCheckinExpired(appointments)).to.be.true;
      });
      it('identifies a valid pre-check-in appointment list', () => {
        const appointments = [
          createAppointment(null, null, null, null, true),
          createAppointment(null, null, null, null, true),
        ];
        expect(preCheckinExpired(appointments)).to.be.false;
      });
    });
  });
});
