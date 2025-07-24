import { expect } from 'chai';
import { subDays } from 'date-fns';
import MockDate from 'mockdate';
import {
  getRealFacilityId,
  getDaysRemainingToFileClaim,
  getAppointmentConflict,
} from './appointment';

describe('VAOS appointment helpers', () => {
  describe('getRealFacilityId', () => {
    it('should return the real facility id for not production environemnts', () => {
      expect(getRealFacilityId('983')).to.equal('442');
      expect(getRealFacilityId('984')).to.equal('552');
    });
  });
  describe('getDaysRemainingToFileClaim', () => {
    const testCases = [
      // first element is the number of days to subtract from today
      // second element is the expected number of days remaining
      [30, 0],
      [31, 0],
      [29, 1],
      [0, 30],
    ];
    testCases.forEach(([daysAgo, expected]) => {
      it(`should return ${expected} if the start date was ${daysAgo} days ago`, () => {
        const appointmentStart = subDays(new Date(), daysAgo).toISOString();
        expect(getDaysRemainingToFileClaim(appointmentStart)).to.equal(
          expected,
        );
      });
    });
  });
  describe('getAppointmentConflict', () => {
    before(() => {
      MockDate.set('2024-12-05T00:00:00Z');
    });
    after(() => {
      MockDate.reset();
    });
    const appointmentsByMonth = {
      '2024-12': [
        {
          start: '2024-12-06T17:00:00Z',
          startUtc: '2024-12-06T17:00:00Z',
          minutesDuration: 60,
        },
      ],
    };
    const availableSlots = [
      {
        start: '2024-12-06T16:00:00Z',
        end: '2024-12-06T17:00:00Z',
      },
      {
        start: '2024-12-06T17:00:00Z',
        end: '2024-12-06T18:00:00Z',
      },
    ];
    it('returns false when there is no conflict', () => {
      expect(
        getAppointmentConflict(
          '2024-12-06T16:00:00Z',
          appointmentsByMonth,
          availableSlots,
        ),
      ).to.be.false;
    });
    it('returns true when there is a conflict', () => {
      expect(
        getAppointmentConflict(
          '2024-12-06T17:00:00Z',
          appointmentsByMonth,
          availableSlots,
        ),
      ).to.be.true;
    });
  });
});
