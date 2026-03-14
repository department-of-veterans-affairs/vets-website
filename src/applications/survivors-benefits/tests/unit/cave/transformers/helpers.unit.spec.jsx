import { expect } from 'chai';
import {
  EMPTY_VALUE,
  sanitize,
  formatIsoDate,
  maskSsn,
} from '../../../../cave/transformers/helpers';

describe('cave/transformers/helpers', () => {
  describe('EMPTY_VALUE', () => {
    it('is an em dash', () => {
      expect(EMPTY_VALUE).to.equal('—');
    });
  });

  describe('sanitize', () => {
    it('returns EMPTY_VALUE for null', () => {
      expect(sanitize(null)).to.equal(EMPTY_VALUE);
    });

    it('returns EMPTY_VALUE for undefined', () => {
      expect(sanitize(undefined)).to.equal(EMPTY_VALUE);
    });

    it('returns EMPTY_VALUE for empty string', () => {
      expect(sanitize('')).to.equal(EMPTY_VALUE);
    });

    it('returns EMPTY_VALUE for whitespace-only string', () => {
      expect(sanitize('   ')).to.equal(EMPTY_VALUE);
    });

    it('returns the value as-is for a normal string', () => {
      expect(sanitize('Army')).to.equal('Army');
    });

    it('returns numeric 0 as-is', () => {
      expect(sanitize(0)).to.equal(0);
    });

    it('returns a string with leading/trailing spaces as-is (only trims for blank check)', () => {
      expect(sanitize(' foo ')).to.equal(' foo ');
    });
  });

  describe('formatIsoDate', () => {
    it('returns EMPTY_VALUE for null', () => {
      expect(formatIsoDate(null)).to.equal(EMPTY_VALUE);
    });

    it('returns EMPTY_VALUE for undefined', () => {
      expect(formatIsoDate(undefined)).to.equal(EMPTY_VALUE);
    });

    it('returns EMPTY_VALUE for empty string', () => {
      expect(formatIsoDate('')).to.equal(EMPTY_VALUE);
    });

    it('returns EMPTY_VALUE for non-string', () => {
      expect(formatIsoDate(20200115)).to.equal(EMPTY_VALUE);
    });

    it('formats a valid ISO date', () => {
      expect(formatIsoDate('1980-03-15')).to.equal('March 15, 1980');
    });

    it('formats January correctly', () => {
      expect(formatIsoDate('2000-01-01')).to.equal('January 1, 2000');
    });

    it('formats December correctly', () => {
      expect(formatIsoDate('1999-12-31')).to.equal('December 31, 1999');
    });

    it('returns sanitized value for month out of range', () => {
      expect(formatIsoDate('2020-13-01')).to.equal('2020-13-01');
    });

    it('returns sanitized value for month = 0', () => {
      expect(formatIsoDate('2020-00-01')).to.equal('2020-00-01');
    });

    it('returns sanitized value for day out of range', () => {
      expect(formatIsoDate('2020-01-32')).to.equal('2020-01-32');
    });

    it('returns sanitized value for day = 0', () => {
      expect(formatIsoDate('2020-01-00')).to.equal('2020-01-00');
    });
  });

  describe('maskSsn', () => {
    it('returns EMPTY_VALUE for null', () => {
      expect(maskSsn(null)).to.equal(EMPTY_VALUE);
    });

    it('returns EMPTY_VALUE for undefined', () => {
      expect(maskSsn(undefined)).to.equal(EMPTY_VALUE);
    });

    it('returns EMPTY_VALUE for empty string', () => {
      expect(maskSsn('')).to.equal(EMPTY_VALUE);
    });

    it('returns EMPTY_VALUE for non-string', () => {
      expect(maskSsn(123456789)).to.equal(EMPTY_VALUE);
    });

    it('masks all but last 4 digits of a 9-digit SSN', () => {
      expect(maskSsn('123456789')).to.equal('*****6789');
    });

    it('does not mask a formatted SSN with dashes (lookahead needs 4 consecutive digits)', () => {
      // The regex /\d(?=\d{4})/ requires 4 *consecutive* digits after the match.
      // Dashes break the consecutive run, so no digits are masked.
      expect(maskSsn('123-45-6789')).to.equal('123-45-6789');
    });

    it('preserves non-digit characters', () => {
      expect(maskSsn('XXX-XX-6789')).to.equal('XXX-XX-6789');
    });
  });
});
