import { expect } from 'chai';
import { vaosV2Helpers } from './utils';
import { createVaosAppointment } from '../../dashboard/mocks/appointments/vaos-v2';

describe('My VA Dashboard', () => {
  describe('appointment utils', () => {
    describe('transformAppointment', () => {
      it('should set isVideo for telehealth appointment', () => {
        const appointment = createVaosAppointment({ kind: 'telehealth' });
        const transformedAppointment = vaosV2Helpers.transformAppointment(
          appointment,
        );
        expect(transformedAppointment.isVideo).to.be.true;
      });
      it('should set timezone for an appointment', () => {
        const appointment = createVaosAppointment();
        const transformedAppointment = vaosV2Helpers.transformAppointment(
          appointment,
        );
        expect(transformedAppointment.timeZone).to.a.string;
        expect(transformedAppointment.timeZone).to.equal('MT');
      });
      it('should set additional information for an appointment', () => {
        // TOOD: fill in
      });
      it('should set facility for an appointment', () => {
        const appointment = createVaosAppointment();
        const transformedAppointment = vaosV2Helpers.transformAppointment(
          appointment,
        );
        expect(transformedAppointment.facility).to.be.an('object');
        expect(transformedAppointment.providerName).to.be.an('string');
      });
      it('should set start for an appointment, as a date', () => {
        const appointment = createVaosAppointment();
        const transformedAppointment = vaosV2Helpers.transformAppointment(
          appointment,
        );
        expect(transformedAppointment.startsAt).to.be.a('string');
        expect(new Date(transformedAppointment.startsAt).getDay()).to.equal(
          new Date(appointment.attributes.start).getDay(),
        );
      });
    });
    describe('sortAppointments', () => {
      it('sorts appointments by startsAt time, descending order', () => {
        const appointments = [
          { id: 1, startsAt: '2020-01-03T00:00:00.000Z' },
          { id: 2, startsAt: '2020-01-01T00:00:00.000Z' },
          { id: 3, startsAt: '2020-01-02T00:00:00.000Z' },
        ];
        const sorted = vaosV2Helpers.sortAppointments(appointments);
        expect(sorted[0].id).to.equal(2);
        expect(sorted[1].id).to.equal(3);
        expect(sorted[2].id).to.equal(1);
      });
    });
  });
});
