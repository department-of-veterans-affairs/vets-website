import { expect } from 'chai';
import moment from 'moment';

import { FORMAT_YMD, FORMAT_READABLE } from '../../constants';
import {
  getDate,
  getIsoDateFromSimpleDate,
  getSimpleDateFromIso,
} from '../../utils/dates';

describe('getDate', () => {
  const dateString = '2021-02-10 00:00:00';
  const date = new Date(dateString);

  it('should return a date string from date object', () => {
    expect(getDate()).to.equal(moment().format(FORMAT_YMD));
  });
  it('should return a date string from date string & offset', () => {
    expect(getDate({ date, offset: { days: 3 } })).to.contain('2021-02-13');
  });
  it('should return a date string pattern based on date & offset', () => {
    expect(getDate({ date, offset: { years: -1 } })).to.contain('2020-02-10');
    expect(
      getDate({
        date,
        offset: { years: -1 },
        pattern: FORMAT_READABLE,
      }),
    ).to.contain('February 10, 2020');
    expect(
      getDate({ date: '2021-02-10 00:00:00', pattern: FORMAT_READABLE }),
    ).to.contain('February 10, 2021');
  });
});

describe('getIsoDateFromSimpleDate', () => {
  it('should return an ISO date string for double-digit month/day', () => {
    const result = getIsoDateFromSimpleDate({
      year: { value: '2000' },
      month: { value: '11' },
      day: { value: '21' },
    });
    expect(result).to.eq('2000-11-21');
  });
  it('should return an ISO date string with leading zero in month/day', () => {
    const result = getIsoDateFromSimpleDate({
      year: { value: '2000' },
      month: { value: '2' },
      day: { value: '2' },
    });
    expect(result).to.eq('2000-02-02');
  });
});

describe('getSimpleDateFromIso', () => {
  const getDateObj = (y = '', m = '', d = '') => ({
    year: { value: y, dirty: false },
    month: { value: m, dirty: false },
    day: { value: d, dirty: false },
  });
  it('should return date object from a valid date', () => {
    expect(getSimpleDateFromIso('2000-02-02')).to.deep.equal(
      getDateObj('2000', 2, 2),
    );
  });
  it('should return date object from a valid date with 2 digits', () => {
    expect(getSimpleDateFromIso('2000-12-21')).to.deep.equal(
      getDateObj('2000', 12, 21),
    );
  });
  it('should return an empty date object from an undefined input', () => {
    expect(getSimpleDateFromIso()).to.deep.equal(getDateObj());
  });
  it('should return an empty date object from a partial date', () => {
    expect(getSimpleDateFromIso('2000-02')).to.deep.equal(getDateObj());
  });
});
