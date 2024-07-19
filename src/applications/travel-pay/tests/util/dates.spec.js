import MockDate from 'mockdate';
import { expect } from 'chai';
import { getDateFilters, formatDateTime } from '../../util/dates';

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

describe('getDateFilters', () => {
  afterEach(() => {
    MockDate.reset();
  });

  it('Correctly generates date ranges based off of an arbitrary date', () => {
    MockDate.set('2024-06-25');

    const dateRanges = getDateFilters();
    expect(dateRanges.length).to.eq(6);

    // First complete quarter should be Q1 2024
    // and go backwards sequentially from there
    const [
      formattedLastThreeMonths,
      formattedQuarterRangeOne,
      formattedQuarterRangeTwo,
      formattedQuarterRangeThree,
      formattedYearRangeOne,
      formattedYearRangeTwo,
    ] = formatDateRanges(dateRanges);

    expect(formattedLastThreeMonths).to.eq(
      'Monday, March 25, 2024 12:00 AM - Tuesday, June 25, 2024 12:00 AM',
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
    expect(formattedYearRangeOne).to.eq(
      'Monday, January 1, 2024 12:00 AM - Tuesday, December 31, 2024 11:59 PM',
    );
    expect(formattedYearRangeTwo).to.eq(
      'Sunday, January 1, 2023 12:00 AM - Sunday, December 31, 2023 11:59 PM',
    );
  });

  it('Handles the start of a new quarter correctly', () => {
    MockDate.set('2022-04-01');

    const dateRanges = getDateFilters();
    expect(dateRanges.length).to.eq(6);

    // First complete quarter should be Q1 2022
    // and go backwards sequentially from there
    const [
      formattedLastThreeMonths,
      formattedQuarterRangeOne,
      formattedQuarterRangeTwo,
      formattedQuarterRangeThree,
      formattedYearRangeOne,
      formattedYearRangeTwo,
    ] = formatDateRanges(dateRanges);

    expect(formattedLastThreeMonths).to.eq(
      'Saturday, January 1, 2022 12:00 AM - Friday, April 1, 2022 12:00 AM',
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
    expect(formattedYearRangeOne).to.eq(
      'Saturday, January 1, 2022 12:00 AM - Saturday, December 31, 2022 11:59 PM',
    );
    expect(formattedYearRangeTwo).to.eq(
      'Friday, January 1, 2021 12:00 AM - Friday, December 31, 2021 11:59 PM',
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
      formattedYearRangeOne,
      formattedYearRangeTwo,
    ] = formatDateRanges(dateRanges);

    expect(dateRanges.length).to.eq(6);
    expect(formattedLastThreeMonths).to.eq(
      'Wednesday, March 30, 2022 12:00 AM - Thursday, June 30, 2022 12:00 AM',
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
    expect(formattedYearRangeOne).to.eq(
      'Saturday, January 1, 2022 12:00 AM - Saturday, December 31, 2022 11:59 PM',
    );
    expect(formattedYearRangeTwo).to.eq(
      'Friday, January 1, 2021 12:00 AM - Friday, December 31, 2021 11:59 PM',
    );
  });

  it('Handles the start of a new year correctly', () => {
    MockDate.set('2023-01-01');
    const dateRanges = getDateFilters();

    // First complete quarter should be Q1 2022
    // and go backwards sequentially from there
    const [
      formattedLastThreeMonths,
      formattedQuarterRangeOne,
      formattedQuarterRangeTwo,
      formattedQuarterRangeThree,
      formattedYearRangeOne,
      formattedYearRangeTwo,
    ] = formatDateRanges(dateRanges);

    expect(dateRanges.length).to.eq(6);
    expect(formattedLastThreeMonths).to.eq(
      'Saturday, October 1, 2022 12:00 AM - Sunday, January 1, 2023 12:00 AM',
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
    expect(formattedYearRangeOne).to.eq(
      'Sunday, January 1, 2023 12:00 AM - Sunday, December 31, 2023 11:59 PM',
    );
    expect(formattedYearRangeTwo).to.eq(
      'Saturday, January 1, 2022 12:00 AM - Saturday, December 31, 2022 11:59 PM',
    );
  });

  it('Handles the end of a year correctly', () => {
    MockDate.set('2023-12-31');
    const dateRanges = getDateFilters();

    // First complete quarter should be Q1 2022
    // and go backwards sequentially from there
    const [
      formattedLastThreeMonths,
      formattedQuarterRangeOne,
      formattedQuarterRangeTwo,
      formattedQuarterRangeThree,
      formattedYearRangeOne,
      formattedYearRangeTwo,
    ] = formatDateRanges(dateRanges);

    expect(formattedLastThreeMonths).to.eq(
      'Saturday, September 30, 2023 12:00 AM - Sunday, December 31, 2023 12:00 AM',
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
    expect(formattedYearRangeOne).to.eq(
      'Sunday, January 1, 2023 12:00 AM - Sunday, December 31, 2023 11:59 PM',
    );
    expect(formattedYearRangeTwo).to.eq(
      'Saturday, January 1, 2022 12:00 AM - Saturday, December 31, 2022 11:59 PM',
    );

    expect(dateRanges.length).to.eq(6);
  });
});
