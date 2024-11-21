import { expect } from 'chai';
import { subDays } from 'date-fns';
import { getRealFacilityId, getDaysRemainingToFileClaim } from './appointment';

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
});
