import { expect } from 'chai';
import moment from 'moment';

import { FORMAT_YMD, FORMAT_READABLE } from '../../constants';
import { getDate } from '../../utils/dates';

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
