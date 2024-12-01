import { expect } from 'chai';

import { makeField } from 'platform/forms/fields';
import {
  formatPartialDate,
  formatYear,
  hasServiceBefore1978,
} from '../../utils/helpers';

const generateDataWithTourOfDuty = (
  fromYear,
  fromMonth,
  fromDay,
  to = '2020-01-01',
) => ({
  applicantServed: 'Yes',
  'view:newService': true,
  toursOfDuty: [
    {
      serviceBranch: 'Army',
      dateRange: {
        to,
        from: {
          year: makeField(fromYear),
          month: makeField(fromMonth),
          day: makeField(fromDay),
        },
      },
    },
  ],
});

describe('edu helpers:', () => {
  describe('formatPartialDate', () => {
    it('should format a full date', () => {
      const date = {
        month: makeField('5'),
        day: makeField('1'),
        year: makeField('2001'),
      };

      expect(formatPartialDate(date)).to.equal('2001-05-01');
    });
    it('should format a full date with 2 digit month and day', () => {
      const date = {
        month: makeField('12'),
        day: makeField('12'),
        year: makeField('2001'),
      };

      expect(formatPartialDate(date)).to.equal('2001-12-12');
    });
    it('should format a date with missing month', () => {
      const date = {
        month: makeField(''),
        day: makeField('12'),
        year: makeField('2001'),
      };

      expect(formatPartialDate(date)).to.equal('2001-XX-12');
    });
    it('should format a date with missing day', () => {
      const date = {
        month: makeField('12'),
        day: makeField(''),
        year: makeField('2001'),
      };

      expect(formatPartialDate(date)).to.equal('2001-12-XX');
    });
    it('should format a date with missing year', () => {
      const date = {
        month: makeField('12'),
        day: makeField('31'),
        year: makeField(''),
      };

      expect(formatPartialDate(date)).to.equal('XXXX-12-31');
    });
    it('should format a date with space in year', () => {
      const date = {
        month: makeField('12'),
        day: makeField('31'),
        year: makeField('2001 '),
      };

      expect(formatPartialDate(date)).to.equal('2001-12-31');
    });
    it('should format a date with non digit characters in year', () => {
      const date = {
        month: makeField('12'),
        day: makeField('31'),
        year: makeField('2001*'),
      };

      expect(formatPartialDate(date)).to.equal('2001-12-31');
    });
    it('should return undefined for blank date', () => {
      const date = {
        month: makeField(''),
        day: makeField(''),
        year: makeField(''),
      };

      expect(formatPartialDate(date)).to.be.undefined;
    });
    it('should return undefined for undefined date', () => {
      expect(formatPartialDate()).to.be.undefined;
    });
    it('should format a partial year', () => {
      const date = {
        month: makeField('12'),
        day: makeField('31'),
        year: makeField('96'),
      };

      expect(formatPartialDate(date)).to.equal('1996-12-31');
    });
  });

  describe('hasServiceBefore1978', () => {
    it('returns true for dates before 1978', () => {
      expect(
        hasServiceBefore1978(generateDataWithTourOfDuty('1977', '12', '31')),
      ).to.be.true;
      expect(
        hasServiceBefore1978(generateDataWithTourOfDuty('1960', '05', '15')),
      ).to.be.true;
      expect(
        hasServiceBefore1978(generateDataWithTourOfDuty('1900', '01', '01')),
      ).to.be.true;
    });

    it('returns false for dates in 1978 or later', () => {
      expect(
        hasServiceBefore1978(generateDataWithTourOfDuty('1978', '01', '01')),
      ).to.be.true;
      expect(
        hasServiceBefore1978(generateDataWithTourOfDuty('1978', '01', '02')),
      ).to.be.false;
      expect(
        hasServiceBefore1978(generateDataWithTourOfDuty('1980', '07', '20')),
      ).to.be.false;
      expect(
        hasServiceBefore1978(generateDataWithTourOfDuty('2000', '12', '31')),
      ).to.be.false;
    });
  });

  describe('formatYear', () => {
    it('returns "XXXX" for empty or null input', () => {
      expect(formatYear('')).to.equal('XXXX');
      expect(formatYear(null)).to.equal('XXXX');
      expect(formatYear(undefined)).to.equal('XXXX');
    });

    it('returns "XXXX" for invalid year input', () => {
      expect(formatYear('abcd')).to.equal('XXXX');
      expect(formatYear('----')).to.equal('XXXX');
    });

    it('returns the formatted year for valid input', () => {
      expect(formatYear('123')).to.equal('0123');
      expect(formatYear('2021')).to.equal('2021');
      expect(formatYear('1999')).to.equal('1999');
      expect(formatYear('0001')).to.equal('0001');
    });
  });
});
