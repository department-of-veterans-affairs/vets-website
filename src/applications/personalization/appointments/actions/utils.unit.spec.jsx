import { expect } from 'chai';
import { vaosV2Helpers, getStagingID, isFutureAppointment } from './utils';
import { createVaosAppointment } from '../../dashboard/mocks/appointments/vaos-v2';

describe('My VA Dashboard', () => {
  describe('appointment utils', () => {
    describe('getStagingID', () => {
      it('should return the facilityID unchanged if null or undefined', () => {
        expect(getStagingID(null)).to.be.null;
        expect(getStagingID(undefined)).to.be.undefined;
        expect(getStagingID('')).to.equal('');
      });

      it('should transform 983 prefixed IDs to 442', () => {
        expect(getStagingID('983')).to.equal('442');
        expect(getStagingID('983AB')).to.equal('442AB');
        expect(getStagingID('983123')).to.equal('442123');
      });

      it('should transform 984 prefixed IDs to 552', () => {
        expect(getStagingID('984')).to.equal('552');
        expect(getStagingID('984XY')).to.equal('552XY');
        expect(getStagingID('984456')).to.equal('552456');
      });

      it('should return facilityID unchanged if it does not start with 983 or 984', () => {
        expect(getStagingID('442')).to.equal('442');
        expect(getStagingID('552')).to.equal('552');
        expect(getStagingID('123')).to.equal('123');
        expect(getStagingID('ABC')).to.equal('ABC');
      });
    });

    describe('isFutureAppointment', () => {
      it('should return true for future appointments', () => {
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + 1); // Tomorrow

        const appointment = {
          attributes: {
            start: futureDate.toISOString(),
          },
        };

        expect(isFutureAppointment(appointment)).to.be.true;
      });

      it('should return false for past appointments', () => {
        const pastDate = new Date();
        pastDate.setDate(pastDate.getDate() - 1); // Yesterday

        const appointment = {
          attributes: {
            start: pastDate.toISOString(),
          },
        };

        expect(isFutureAppointment(appointment)).to.be.false;
      });

      it('should return false for current time appointments', () => {
        const currentDate = new Date();

        const appointment = {
          attributes: {
            start: currentDate.toISOString(),
          },
        };

        expect(isFutureAppointment(appointment)).to.be.false;
      });

      it('should handle invalid date strings', () => {
        const appointment = {
          attributes: {
            start: 'invalid-date',
          },
        };

        // parseISO with invalid date should return Invalid Date, which isFuture considers as past
        expect(isFutureAppointment(appointment)).to.be.false;
      });
    });
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
      it('should set isUpcoming flag correctly for future appointments', () => {
        const futureAppointment = createVaosAppointment();
        futureAppointment.attributes.start = new Date(
          Date.now() + 86400000,
        ).toISOString(); // Tomorrow
        const transformedAppointment = vaosV2Helpers.transformAppointment(
          futureAppointment,
        );
        expect(transformedAppointment.isUpcoming).to.be.true;
      });
      it('should set isUpcoming flag correctly for past appointments', () => {
        const pastAppointment = createVaosAppointment();
        pastAppointment.attributes.start = new Date(
          Date.now() - 86400000,
        ).toISOString(); // Yesterday
        const transformedAppointment = vaosV2Helpers.transformAppointment(
          pastAppointment,
        );
        expect(transformedAppointment.isUpcoming).to.be.false;
      });
      it('should set isVideo flag correctly for telehealth appointments', () => {
        const videoAppointment = createVaosAppointment();
        videoAppointment.attributes.kind = 'telehealth';
        const transformedAppointment = vaosV2Helpers.transformAppointment(
          videoAppointment,
        );
        expect(transformedAppointment.isVideo).to.be.true;
        expect(transformedAppointment.type).to.equal('telehealth');
      });
      it('should set isVideo flag correctly for non-telehealth appointments', () => {
        const inPersonAppointment = createVaosAppointment();
        inPersonAppointment.attributes.kind = 'clinic';
        const transformedAppointment = vaosV2Helpers.transformAppointment(
          inPersonAppointment,
        );
        expect(transformedAppointment.isVideo).to.be.false;
        expect(transformedAppointment.type).to.equal('clinic');
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
