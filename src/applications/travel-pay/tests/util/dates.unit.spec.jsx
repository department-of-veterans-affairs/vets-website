import MockDate from 'mockdate';
import { expect } from 'chai';

import {
  getDateFilters,
  formatDateTime,
  stripTZOffset,
  formatDate,
} from '../../util/dates';

function formatDateRange(dateRange) {
  const [startDay, startTime] = formatDateTime(dateRange.start);
  const [endDay, endTime] = formatDateTime(dateRange.end);

  return `${startDay} ${startTime} - ${endDay} ${endTime}`;
}

function formatDateRanges(dates) {
  const formattedDateRanges = [];
  dates.forEach(dateRange => {
    formattedDateRanges.push(formatDateRange(dateRange));
  });
  return formattedDateRanges;
}

// TODO: fix
describe('getDateFilters', () => {
  afterEach(() => {
    MockDate.reset();
  });

  it('Correctly generates date ranges based off of an arbitrary date', () => {
    MockDate.set('2024-06-25');

    const dateRanges = getDateFilters();
    expect(dateRanges.length).to.eq(7);

    // First complete quarter should be Q1 2024
    // and go backwards sequentially from there
    const [
      formattedLastThreeMonths,
      formattedQuarterRangeOne,
      formattedQuarterRangeTwo,
      formattedQuarterRangeThree,
      formattedQuarterRangeFour,
      formattedQuarterRangeFive,
      formattedQuarterRangeSix,
    ] = formatDateRanges(dateRanges);

    expect(formattedLastThreeMonths).to.eq(
      'Monday, March 25, 2024 12:00 AM - Tuesday, June 25, 2024 11:59 PM',
    );
    expect(formattedQuarterRangeOne).to.eq(
      'Monday, January 1, 2024 12:00 AM - Sunday, March 31, 2024 11:59 PM',
    );
    expect(formattedQuarterRangeTwo).to.eq(
      'Sunday, October 1, 2023 12:00 AM - Sunday, December 31, 2023 11:59 PM',
    );
    expect(formattedQuarterRangeThree).to.eq(
      'Saturday, July 1, 2023 12:00 AM - Saturday, September 30, 2023 11:59 PM',
    );

    expect(formattedQuarterRangeFour).to.eq(
      'Saturday, April 1, 2023 12:00 AM - Friday, June 30, 2023 11:59 PM',
    );
    expect(formattedQuarterRangeFive).to.eq(
      'Sunday, January 1, 2023 12:00 AM - Friday, March 31, 2023 11:59 PM',
    );
    expect(formattedQuarterRangeSix).to.eq(
      'Saturday, October 1, 2022 12:00 AM - Saturday, December 31, 2022 11:59 PM',
    );
  });

  it('Handles the start of a new quarter correctly', () => {
    MockDate.set('2022-04-01');

    const dateRanges = getDateFilters();
    expect(dateRanges.length).to.eq(7);

    // First complete quarter should be Q1 2022
    // and go backwards sequentially from there
    const [
      formattedLastThreeMonths,
      formattedQuarterRangeOne,
      formattedQuarterRangeTwo,
      formattedQuarterRangeThree,
      formattedQuarterRangeFour,
      formattedQuarterRangeFive,
      formattedQuarterRangeSix,
    ] = formatDateRanges(dateRanges);

    expect(formattedLastThreeMonths).to.eq(
      'Saturday, January 1, 2022 12:00 AM - Friday, April 1, 2022 11:59 PM',
    );
    expect(formattedQuarterRangeOne).to.eq(
      'Saturday, January 1, 2022 12:00 AM - Thursday, March 31, 2022 11:59 PM',
    );
    expect(formattedQuarterRangeTwo).to.eq(
      'Friday, October 1, 2021 12:00 AM - Friday, December 31, 2021 11:59 PM',
    );
    expect(formattedQuarterRangeThree).to.eq(
      'Thursday, July 1, 2021 12:00 AM - Thursday, September 30, 2021 11:59 PM',
    );
    expect(formattedQuarterRangeFour).to.eq(
      'Thursday, April 1, 2021 12:00 AM - Wednesday, June 30, 2021 11:59 PM',
    );
    expect(formattedQuarterRangeFive).to.eq(
      'Friday, January 1, 2021 12:00 AM - Wednesday, March 31, 2021 11:59 PM',
    );
    expect(formattedQuarterRangeSix).to.eq(
      'Thursday, October 1, 2020 12:00 AM - Thursday, December 31, 2020 11:59 PM',
    );
  });

  it('Handles the end of a quarter correctly', () => {
    MockDate.set('2022-06-30');
    const dateRanges = getDateFilters();

    // First complete quarter should be Q1 2022
    // and go backwards sequentially from there
    const [
      formattedLastThreeMonths,
      formattedQuarterRangeOne,
      formattedQuarterRangeTwo,
      formattedQuarterRangeThree,
      formattedQuarterRangeFour,
      formattedQuarterRangeFive,
      formattedQuarterRangeSix,
    ] = formatDateRanges(dateRanges);

    expect(dateRanges.length).to.eq(7);
    expect(formattedLastThreeMonths).to.eq(
      'Wednesday, March 30, 2022 12:00 AM - Thursday, June 30, 2022 11:59 PM',
    );
    expect(formattedQuarterRangeOne).to.eq(
      'Saturday, January 1, 2022 12:00 AM - Thursday, March 31, 2022 11:59 PM',
    );
    expect(formattedQuarterRangeTwo).to.eq(
      'Friday, October 1, 2021 12:00 AM - Friday, December 31, 2021 11:59 PM',
    );
    expect(formattedQuarterRangeThree).to.eq(
      'Thursday, July 1, 2021 12:00 AM - Thursday, September 30, 2021 11:59 PM',
    );
    expect(formattedQuarterRangeFour).to.eq(
      'Thursday, April 1, 2021 12:00 AM - Wednesday, June 30, 2021 11:59 PM',
    );
    expect(formattedQuarterRangeFive).to.eq(
      'Friday, January 1, 2021 12:00 AM - Wednesday, March 31, 2021 11:59 PM',
    );
    expect(formattedQuarterRangeSix).to.eq(
      'Thursday, October 1, 2020 12:00 AM - Thursday, December 31, 2020 11:59 PM',
    );
  });

  it('Handles the start of a new year correctly', () => {
    MockDate.set('2023-01-01');
    const dateRanges = getDateFilters();

    // First complete quarter should be Q4 2022
    // and go backwards sequentially from there
    const [
      formattedLastThreeMonths,
      formattedQuarterRangeOne,
      formattedQuarterRangeTwo,
      formattedQuarterRangeThree,
      formattedQuarterRangeFour,
      formattedQuarterRangeFive,
      formattedQuarterRangeSix,
    ] = formatDateRanges(dateRanges);

    expect(dateRanges.length).to.eq(7);
    expect(formattedLastThreeMonths).to.eq(
      'Saturday, October 1, 2022 12:00 AM - Sunday, January 1, 2023 11:59 PM',
    );
    expect(formattedQuarterRangeOne).to.eq(
      'Saturday, October 1, 2022 12:00 AM - Saturday, December 31, 2022 11:59 PM',
    );
    expect(formattedQuarterRangeTwo).to.eq(
      'Friday, July 1, 2022 12:00 AM - Friday, September 30, 2022 11:59 PM',
    );
    expect(formattedQuarterRangeThree).to.eq(
      'Friday, April 1, 2022 12:00 AM - Thursday, June 30, 2022 11:59 PM',
    );
    expect(formattedQuarterRangeFour).to.eq(
      'Saturday, January 1, 2022 12:00 AM - Thursday, March 31, 2022 11:59 PM',
    );
    expect(formattedQuarterRangeFive).to.eq(
      'Friday, October 1, 2021 12:00 AM - Friday, December 31, 2021 11:59 PM',
    );
    expect(formattedQuarterRangeSix).to.eq(
      'Thursday, July 1, 2021 12:00 AM - Thursday, September 30, 2021 11:59 PM',
    );
  });

  it('Handles the end of a year correctly', () => {
    MockDate.set('2023-12-31');
    const dateRanges = getDateFilters();

    // First complete quarter should be Q3 2023
    // and go backwards sequentially from there
    const [
      formattedLastThreeMonths,
      formattedQuarterRangeOne,
      formattedQuarterRangeTwo,
      formattedQuarterRangeThree,
      formattedQuarterRangeFour,
      formattedQuarterRangeFive,
      formattedQuarterRangeSix,
    ] = formatDateRanges(dateRanges);

    expect(formattedLastThreeMonths).to.eq(
      'Saturday, September 30, 2023 12:00 AM - Sunday, December 31, 2023 11:59 PM',
    );
    expect(formattedQuarterRangeOne).to.eq(
      'Saturday, July 1, 2023 12:00 AM - Saturday, September 30, 2023 11:59 PM',
    );
    expect(formattedQuarterRangeTwo).to.eq(
      'Saturday, April 1, 2023 12:00 AM - Friday, June 30, 2023 11:59 PM',
    );
    expect(formattedQuarterRangeThree).to.eq(
      'Sunday, January 1, 2023 12:00 AM - Friday, March 31, 2023 11:59 PM',
    );
    expect(formattedQuarterRangeFour).to.eq(
      'Saturday, October 1, 2022 12:00 AM - Saturday, December 31, 2022 11:59 PM',
    );
    expect(formattedQuarterRangeFive).to.eq(
      'Friday, July 1, 2022 12:00 AM - Friday, September 30, 2022 11:59 PM',
    );
    expect(formattedQuarterRangeSix).to.eq(
      'Friday, April 1, 2022 12:00 AM - Thursday, June 30, 2022 11:59 PM',
    );

    expect(dateRanges.length).to.eq(7);
  });
});

describe('formatDateTime', () => {
  it('should format datetime', () => {
    // Get original TZ
    const originalTZ = process.env.TZ;
    // Update the TZ for this one test
    process.env = Object.assign(process.env, { TZ: 'America/Los_Angeles' });
    expect(formatDateTime('2024-06-25T14:00:00Z')).to.deep.equal([
      'Tuesday, June 25, 2024',
      '7:00 AM',
    ]);
    // Set it back to the original
    process.env = Object.assign(process.env, { TZ: originalTZ });
  });

  it('should format datetime without UTC indicator', () => {
    expect(formatDateTime('2024-06-25T14:00:00Z', true)).to.deep.equal([
      'Tuesday, June 25, 2024',
      '2:00 PM',
    ]);

    expect(formatDateTime('2024-06-25T08:00:00.000+02:00', true)).to.deep.equal(
      ['Tuesday, June 25, 2024', '8:00 AM'],
    );
  });
});

describe('stripTZOffset', () => {
  it('should remove TZ offset', () => {
    expect(stripTZOffset('2024-06-25T08:00:00.000-08:00')).to.deep.equal(
      '2024-06-25T08:00:00',
    );
    expect(stripTZOffset('2024-06-25T08:00:00.000+02:00')).to.deep.equal(
      '2024-06-25T08:00:00',
    );
  });
});

describe('formatDate', () => {
  it('formats UTC datetime', () => {
    expect(formatDate('2025-10-13T13:54:26Z')).to.equal('October 13, 2025');
  });

  it('formats local datetime without Z', () => {
    expect(formatDate('2025-09-01T00:00:00')).to.equal('September 1, 2025');
  });

  it('handles invalid dates', () => {
    expect(formatDate('invalid-date')).to.equal('Invalid Date');
  });

  it('handles empty input', () => {
    expect(formatDate('')).to.equal('Invalid Date');
  });
});
