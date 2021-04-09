import { expect } from 'chai';
import { format } from 'date-fns';

import { FORMAT_YMD, FORMAT_READABLE } from '../../constants';
import { getDate } from '../../utils/dates';

describe('getDate', () => {
  it('should return a date string based on starting date & offset', () => {
    expect(getDate()).to.equal(format(new Date(), FORMAT_YMD));
    expect(
      getDate({ startDate: new Date('2021-02-10'), offset: { years: -1 } }),
    ).to.contain('2020-02'); // not checking for 10th, because of DST

    const fullDate = getDate({
      startDate: new Date('2021-02-10'),
      offset: { years: -1 },
      pattern: FORMAT_READABLE,
    });
    expect(fullDate).to.contains('February');
    expect(fullDate).to.contains('2020');
  });
});
