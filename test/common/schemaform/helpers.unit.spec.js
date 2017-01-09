import { expect } from 'chai';

import { parseISODate, formatISOPartialDate } from '../../../src/js/common/schemaform/helpers';

describe('Schemaform: helpers', () => {
  describe('parseISODate', () => {
    it('should parse an ISO date', () => {
      expect(parseISODate('2001-02-03')).to.eql({ month: 2, day: 3, year: '2001' });
    });
    it('should parse a partial ISO date', () => {
      expect(parseISODate('XXXX-02-03')).to.eql({ month: 2, day: 3, year: '' });
      expect(parseISODate('2003-XX-03')).to.eql({ month: '', day: 3, year: '2003' });
    });
  });
  describe('formatISOPartialDate', () => {
    it('should format a regular date', () => {
      const date = {
        month: '3',
        day: '29',
        year: '2005'
      };
      expect(formatISOPartialDate(date)).to.equal('2005-03-29');
    });
    it('should format a partial date', () => {
      const date = {
        month: '2',
        day: '',
        year: '2005'
      };
      expect(formatISOPartialDate(date)).to.equal('2005-02-XX');
    });
    it('should format an empty date as undefined', () => {
      const date = {
        month: '',
        day: '',
        year: ''
      };
      expect(formatISOPartialDate(date)).to.be.undefined;
    });
  });
});
