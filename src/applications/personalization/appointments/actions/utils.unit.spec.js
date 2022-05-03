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
      it('should set timezone for an appointment', () => {});
      it('should set additional information for an appointment', () => {});
      it('should set facility for an appointment', () => {});
      it('should set start for an appointment, as a date', () => {});
    });
    describe('sortAppointments', () => {
      it('sorts appointments by startAt time, descending order', () => {
        const appointments = [
          { id: 1, startAt: new Date('2020-01-03T00:00:00.000Z') },
          { id: 2, startAt: new Date('2020-01-01T00:00:00.000Z') },
          { id: 3, startAt: new Date('2020-01-02T00:00:00.000Z') },
        ];
        const sorted = vaosV2Helpers.sortAppointments(appointments);
        expect(sorted[0].id).to.equal(2);
        expect(sorted[1].id).to.equal(3);
        expect(sorted[2].id).to.equal(1);
      });
    });
  });
});
