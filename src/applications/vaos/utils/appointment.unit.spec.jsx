import { expect } from 'chai';
import { subDays } from 'date-fns';
import MockDate from 'mockdate';
import { getRealFacilityId, getDaysRemainingToFileClaim } from './appointment';
import { getTestDate } from '../tests/mocks/setup';

describe('VAOS appointment helpers', () => {
  beforeEach(() => {
    MockDate.set(getTestDate());
  });

  afterEach(() => {
    MockDate.reset();
  });

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
        const today = new Date();
        today.setHours(12, 0, 0, 0); // Set to noon to avoid time-of-day issues
        const appointmentStart = subDays(today, daysAgo);
        expect(getDaysRemainingToFileClaim(appointmentStart)).to.equal(
          expected,
        );
      });
    });
  });
});
