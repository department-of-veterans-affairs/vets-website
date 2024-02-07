import { expect } from 'chai';

import { formatDatetime, formatElapsedHours, parseDate } from '../utils/date';

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
    expect(result).to.equal('January 1, 2024 at 3:17 p.m. ET');
  });

  it('formats 12:00 PM as noon', () => {
    const dateString = '2024-11-11T12:00-05:00';
    const d = new Date(dateString);

    const result = formatDatetime(d);

    // Test must run in context of expected timezone
    expect(result).to.equal('November 11, 2024 at noon ET');
  });

  it('formats 12:00 AM as midnight', () => {
    const dateString = '2024-11-12T00:00:00-05:00';
    const d = new Date(dateString);

    const result = formatDatetime(d);

    // Test must run in context of expected timezone
    expect(result).to.equal('November 12, 2024 at midnight ET');
  });

  it('handles datetimes in daylight savings appropriately', () => {
    // DST in 2024 is March 10, 2024 - November 03, 2024
    // Use April 1, 2024, 10am to be in DST
    const dateString = '2024-04-01T10:00:00-04:00';
    const d = new Date(dateString);

    const result = formatDatetime(d);

    // Test must run in context of expected timezone
    expect(result).to.equal('April 1, 2024 at 10:00 a.m. ET');
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
});
