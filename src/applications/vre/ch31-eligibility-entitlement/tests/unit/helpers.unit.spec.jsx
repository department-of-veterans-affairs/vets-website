import { expect } from 'chai';
import {
  formatDate,
  getStatus,
  extractMessages,
  pickStatusStyle,
} from '../../helpers';

describe('helpers', () => {
  describe('formatDate', () => {
    it('should format ISO date string with Z suffix', () => {
      const result = formatDate('1901-09-11Z');
      expect(result).to.equal('September 11, 1901');
    });

    it('should format ISO date string without Z suffix', () => {
      const result = formatDate('1941-12-05');
      expect(result).to.equal('December 5, 1941');
    });

    it('should handle various date formats with Z', () => {
      const testCases = [
        { input: '2025-08-04Z', expected: 'August 4, 2025' },
        { input: '2023-04-01Z', expected: 'April 1, 2023' },
        { input: '2025-02-07Z', expected: 'February 7, 2025' },
        { input: '2000-01-01Z', expected: 'January 1, 2000' },
        { input: '1999-12-31Z', expected: 'December 31, 1999' },
      ];

      testCases.forEach(({ input, expected }) => {
        expect(formatDate(input)).to.equal(expected);
      });
    });

    it('should return empty string for falsy inputs', () => {
      const falsyInputs = [null, undefined, '', false, 0, NaN];

      falsyInputs.forEach(input => {
        expect(formatDate(input)).to.equal('N/A');
      });
    });
  });
  describe('extractMessages', () => {
    it('returns code when present (priority: code > title > detail)', () => {
      const resp = {
        errors: [
          {
            code: 'RES_CH31_ELIGIBILITY_503',
            title: 'Service Unavailable',
            detail: 'Down',
          },
        ],
      };
      expect(extractMessages(resp)).to.deep.equal(['RES_CH31_ELIGIBILITY_503']);
    });

    it('falls back to title when code is missing', () => {
      const resp = { errors: [{ title: 'Bad Request', detail: 'Invalid' }] };
      expect(extractMessages(resp)).to.deep.equal(['Bad Request']);
    });

    it('falls back to detail when only detail is present', () => {
      const resp = { errors: [{ detail: 'Not Authorized' }] };
      expect(extractMessages(resp)).to.deep.equal(['Not Authorized']);
    });

    it('maps multiple errors using the same priority logic', () => {
      const resp = {
        errors: [
          {
            code: 'RES_CH31_ELIGIBILITY_400',
            title: 'Bad Request',
            detail: 'x',
          },
          { title: 'Forbidden', detail: 'Not Authorized' },
          { detail: 'Service Unavailable' },
        ],
      };
      expect(extractMessages(resp)).to.deep.equal([
        'RES_CH31_ELIGIBILITY_400',
        'Forbidden',
        'Service Unavailable',
      ]);
    });

    it('returns ["Unknown error"] when errors array is empty', () => {
      const resp = { errors: [] };
      expect(extractMessages(resp)).to.deep.equal(['Unknown error']);
    });

    it('returns ["Unknown error"] when errors is not an array', () => {
      const resp = { errors: {} };
      expect(extractMessages(resp)).to.deep.equal(['Unknown error']);
    });

    it('returns ["Unknown error"] when resp is null/undefined', () => {
      expect(extractMessages(null)).to.deep.equal(['Unknown error']);
      expect(extractMessages(undefined)).to.deep.equal(['Unknown error']);
    });
  });

  describe('getStatus', () => {
    it('coerces numeric string status to number', () => {
      const resp = { errors: [{ status: '503' }] };
      expect(getStatus(resp)).to.equal(503);
    });

    it('returns number when status is numeric', () => {
      const resp = { errors: [{ status: 400 }] };
      expect(getStatus(resp)).to.equal(400);
    });

    it('returns null when status is non-numeric', () => {
      const resp = { errors: [{ status: 'abc' }] };
      expect(getStatus(resp)).to.equal(null);
    });

    it('returns null when errors array is empty', () => {
      const resp = { errors: [] };
      expect(getStatus(resp)).to.equal(null);
    });

    it('returns null when errors is not an array', () => {
      const resp = { errors: {} };
      expect(getStatus(resp)).to.equal(null);
    });

    it('returns null when resp is null/undefined', () => {
      expect(getStatus(null)).to.equal(null);
      expect(getStatus(undefined)).to.equal(null);
    });
  });
  describe('pickStatusStyle', () => {
    it('returns check/green for "Eligible"', () => {
      expect(pickStatusStyle('Eligible')).to.deep.equal({
        icon: 'check',
        cls: 'vads-u-color--green',
      });
    });

    it('is case-insensitive and trims whitespace', () => {
      expect(pickStatusStyle('  eLiGiBlE  ')).to.deep.equal({
        icon: 'check',
        cls: 'vads-u-color--green',
      });
    });

    it('returns close/secondary-dark for "Ineligible"', () => {
      expect(pickStatusStyle('Ineligible')).to.deep.equal({
        icon: 'close',
        cls: 'vads-u-color--secondary-dark',
      });
    });

    it('treats unknown or falsy values as ineligible (fallback)', () => {
      for (const v of [undefined, null, '', '  ', 'unknown', 0]) {
        expect(pickStatusStyle(v)).to.deep.equal({
          icon: 'close',
          cls: 'vads-u-color--secondary-dark',
        });
      }
    });
  });
});
