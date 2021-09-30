import { expect } from 'chai';
import { hasMoreAppointmentsToCheckInto } from './index';
import { createAppointment } from '../../api/local-mock-api/mocks/v2/patient.check.in.responses';

describe('check in', () => {
  describe('appointment navigation utils', () => {
    it('returns false if selected Appointment is undefined and no more eligible appointments found', () => {
      const appointments = [
        createAppointment('INELIGIBLE_TOO_EARLY'),
        createAppointment('INELIGIBLE_TOO_EARLY'),
        createAppointment('INELIGIBLE_TOO_EARLY'),
      ];

      expect(hasMoreAppointmentsToCheckInto(appointments, undefined)).to.equal(
        false,
      );
    });
    it('returns true if selected Appointment is undefined and  more eligible appointments found', () => {
      const appointments = [
        createAppointment(),
        createAppointment(),
        createAppointment(),
      ];

      expect(hasMoreAppointmentsToCheckInto(appointments, undefined)).to.equal(
        true,
      );
    });
    it('returns false if appointments is empty', () => {
      const appointments = [];

      expect(hasMoreAppointmentsToCheckInto(appointments, undefined)).to.equal(
        false,
      );
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
});
