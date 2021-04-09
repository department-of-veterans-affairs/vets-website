import { expect } from 'chai';
import { format } from 'date-fns';

import { FORMAT_YMD, FORMAT_READABLE } from '../../constants';
import { getDate } from '../../utils/dates';

describe('getDate', () => {
  it('should return a date string based on starting date & offset', () => {
    expect(getDate()).to.equal(format(new Date(), FORMAT_YMD));

    const startDate = new Date('2021-02-10 00:00:00');
    expect(getDate({ startDate, offset: { years: -1 } })).to.contain(
      '2020-02-10',
    );
    expect(
      getDate({
        startDate,
        offset: { years: -1 },
        pattern: FORMAT_READABLE,
      }),
    ).to.contains('February 10, 2020');
  });
});
