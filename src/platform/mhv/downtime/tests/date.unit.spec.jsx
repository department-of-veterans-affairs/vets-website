import { expect } from 'chai';
// NOTE: moment is deprecated, should only be used for testing compatibility with older code
import moment from 'moment';

import {
  coerceToDate,
  formatDatetime,
  formatElapsedHours,
  parseDate,
} from '../utils/date';

describe('coerceToDate', () => {
  it('returns a Date instance when passed a moment object', () => {
    const m = moment('2024-02-14 09:30');
    const d = coerceToDate(m);
    expect(d).to.be.an.instanceOf(Date);
  });

  it('returns a date instance when passed a date instance', () => {
    const d1 = new Date();
    const d2 = coerceToDate(d1);
    expect(d2).to.equal(d1);
  });

  it('returns null when passed something that is not a date or moment object', () => {
    const x = '';
    const y = undefined;
    const z = {};
    // F is for Fake
    const f = { toDate: () => 'Tricked you!' };

    expect(coerceToDate(x)).to.be.null;
    expect(coerceToDate(y)).to.be.null;
    expect(coerceToDate(z)).to.be.null;
    expect(coerceToDate(f)).to.be.null;
  });
});

describe('parseDate', () => {
  it('parses an ISO 8601 date string', () => {
    const dateString = '2024-01-29T15:17:05-05:00';

    const result = parseDate(dateString);

    expect(result).to.respondTo('toISOString');

    expect(result.toISOString()).to.eql('2024-01-29T20:17:05.000Z');
  });

  it('returns null for invalid inputs', () => {
    expect(parseDate('foobar')).to.be.null;
    expect(parseDate(null)).to.be.null;
    expect(parseDate('Tomorrow')).to.be.null;
  });
});

describe('formatDatetime', () => {
  // Use times when UTC offset is -05:00, aka not daylight savings time
  it('formats a datetime string with long month name, full year and timezone abbreviation', () => {
    const dateString = '2024-01-01T15:17:05-05:00';
    const d = new Date(dateString);

    const result = formatDatetime(d);

    // Test must run in context of expected timezone
    expect(result).to.match(
      /January 1, 2024 at \d:\d{2} (a|p)\.m\. [A-Z]{1,2}T/,
    );
  });
});

describe('formatElapsedHours', () => {
  it('shows 1 hour when time difference is less than an hour and a half', () => {
    const startDate = new Date(2024, 2, 14, 14);
    const endDate = new Date(2024, 2, 14, 15, 15);

    const result = formatElapsedHours(startDate, endDate);

    expect(result).to.equal('1 hour');
  });

  it('shows a plural hours when time difference is greater than an hour and a half', () => {
    const startDate = new Date(2024, 2, 14, 14);
    const endDate = new Date(2024, 2, 14, 18, 30);

    const result = formatElapsedHours(startDate, endDate);

    expect(result).to.equal('5 hours');
  });

  it('returns null when start or end time is not or cannot be coerced to a date', () => {
    expect(formatElapsedHours('foo', new Date())).to.be.null;

    expect(formatElapsedHours(new Date(), { toDate: () => "It's a trap!" })).to
      .be.null;

    expect(formatElapsedHours(undefined, null)).to.be.null;
  });
});
