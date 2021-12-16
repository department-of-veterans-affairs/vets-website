// Node modules.
import moment from 'moment-timezone';
import { orderBy, isEmpty } from 'lodash';

const nextWeekDay = moment()
  .add('7', 'days')
  .startOf('week')
  .format('MMM D');
const nextMonthDay = moment()
  .add('1', 'month')
  .startOf('month')
  .format('MMM D');

export const monthOptions = [
  { value: '', label: 'Month' },
  { value: '01', label: 'January' },
  { value: '02', label: 'February' },
  { value: '03', label: 'March' },
  { value: '04', label: 'April' },
  { value: '05', label: 'May' },
  { value: '06', label: 'June' },
  { value: '07', label: 'July' },
  { value: '08', label: 'August' },
  { value: '09', label: 'September' },
  { value: '10', label: 'October' },
  { value: '11', label: 'November' },
  { value: '12', label: 'December' },
];

export const dayOptions = [
  { value: '', label: 'Day' },
  { value: '01', label: '1' },
  { value: '02', label: '2' },
  { value: '03', label: '3' },
  { value: '04', label: '4' },
  { value: '05', label: '5' },
  { value: '06', label: '6' },
  { value: '07', label: '7' },
  { value: '08', label: '8' },
  { value: '09', label: '9' },
  { value: '10', label: '10' },
  { value: '11', label: '11' },
  { value: '12', label: '12' },
  { value: '13', label: '13' },
  { value: '14', label: '14' },
  { value: '15', label: '15' },
  { value: '16', label: '16' },
  { value: '17', label: '17' },
  { value: '18', label: '18' },
  { value: '19', label: '19' },
  { value: '20', label: '20' },
  { value: '21', label: '21' },
  { value: '22', label: '22' },
  { value: '23', label: '23' },
  { value: '24', label: '24' },
  { value: '25', label: '25' },
  { value: '26', label: '26' },
  { value: '27', label: '27' },
  { value: '28', label: '28' },
  { value: '29', label: '29' },
  { value: '30', label: '30' },
  { value: '31', label: '31' },
];

export const filterByOptions = [
  {
    label: 'All upcoming',
    value: 'upcoming',
  },
  {
    label: `Next Week (Starting ${nextWeekDay})`,
    value: 'next-week',
  },
  {
    label: `Next Month (Starting ${nextMonthDay})`,
    value: 'next-month',
  },
  {
    label: 'Past events',
    value: 'past',
  },
  {
    label: 'Specific date',
    value: 'specific-date',
  },
  {
    label: 'Custom date range',
    value: 'custom-date-range',
  },
];

export const defaultSelectedOption = filterByOptions?.find(
  option => option.value === 'upcoming',
);

export const filterEvents = (
  events,
  filterBy,
  options = {},
  now = moment(),
) => {
  // Escape early if there are no events.
  if (isEmpty(events)) {
    return [];
  }

  // Format event timestamps to unix and sort events by startsAt.
  const sortedEvents = orderBy(
    events,
    ['fieldDatetimeRangeTimezone', 'value'],
    ['asc'],
  );

  // Filter the events.
  switch (filterBy) {
    // Upcoming events.
    case 'upcoming':
      return sortedEvents?.filter(event =>
        moment(event?.fieldDatetimeRangeTimezone?.value * 1000).isAfter(
          now.clone(),
        ),
      );

    // Next week.
    case 'next-week':
      return sortedEvents?.filter(event =>
        moment(event?.fieldDatetimeRangeTimezone?.value * 1000).isBetween(
          now
            .clone()
            .add('7', 'days')
            .startOf('week'),
          now
            .clone()
            .add('7', 'days')
            .endOf('week'),
        ),
      );

    // Next month.
    case 'next-month':
      return sortedEvents?.filter(event =>
        moment(event?.fieldDatetimeRangeTimezone?.value * 1000).isBetween(
          now
            .clone()
            .add('1', 'month')
            .startOf('month'),
          now
            .clone()
            .add('1', 'month')
            .endOf('month'),
        ),
      );

    // Past events.
    case 'past':
      return sortedEvents?.filter(event =>
        moment(event?.fieldDatetimeRangeTimezone?.endValue * 1000).isBefore(
          now.clone(),
        ),
      );

    // Custom dates.
    case 'specific-date':
    case 'custom-date-range':
      // Return sorted events if the custom dates are not provided.
      if (!options?.startsAtUnix || !options?.endsAtUnix) return sortedEvents;

      return sortedEvents?.filter(
        event =>
          moment(event?.fieldDatetimeRangeTimezone?.value * 1000).isBetween(
            options?.startsAtUnix * 1000,
            options?.endsAtUnix * 1000,
          ) ||
          moment(event?.fieldDatetimeRangeTimezone?.endValue * 1000).isBetween(
            options?.startsAtUnix * 1000,
            options?.endsAtUnix * 1000,
          ),
      );

    // Default, just give back sorted events.
    default:
      return sortedEvents;
  }
};

export const deriveStartsAtUnix = (startDateMonth, startDateDay) => {
  // Escape early if arguments are missing.
  if (!startDateMonth || !startDateDay) {
    return undefined;
  }

  // Derive the startsAt moment.
  const startsAt = moment(`${startDateMonth}/${startDateDay}`, 'MM/DD').startOf(
    'day',
  );

  // If the startsAt is in the past, we need to increase it by a year (since there are only month/day fields).
  if (startsAt.isBefore(moment())) {
    startsAt.add(1, 'year').unix();
  }

  return startsAt.unix();
};

export const deriveEndsAtUnix = (startsAtUnix, endDateMonth, endDateDay) => {
  // Escape early if arguments are missing.
  if (!startsAtUnix && (!endDateMonth || !endDateDay)) {
    return undefined;
  }

  // Set a default value for endsAt.
  let endsAt = undefined;

  // Make the endsAt the end of the day if there is a start value.
  if (startsAtUnix) {
    endsAt = moment(startsAtUnix * 1000)
      .clone()
      .endOf('day');
  }

  // If there are endsAt fields provided, use those.
  if (endDateMonth && endDateDay) {
    endsAt = moment(`${endDateMonth}/${endDateDay}`, 'MM/DD').endOf('day');
  }

  // If the endsAt is in the past, we need to increase it by a year (since there are only month/day fields).
  if (endsAt.isBefore(moment())) {
    endsAt.add(1, 'year').unix();
  }

  // If the endsAt is before the startsAt, we need to increase it by another year (since there are only month/day fields).
  if (endsAt.isBefore(startsAtUnix * 1000)) {
    endsAt.add(1, 'year').unix();
  }

  return endsAt.unix();
};

export const hideLegacyEvents = () => {
  // Derive the legacy events page.
  const legacyEvents = document.querySelector(
    'div[data-template="event_listing.drupal.liquid"]',
  );

  // Escape early if the legacy events page doesn't exist.
  if (!legacyEvents) {
    return;
  }

  // Add `vads-u-display--none` to the legacy events page if it doesn't already have it.
  if (!legacyEvents.classList.contains('vads-u-display--none')) {
    legacyEvents.classList.add('vads-u-display--none');
  }
};

export const showLegacyEvents = () => {
  // Derive the legacy events page.
  const legacyEvents = document.querySelector(
    'div[data-template="event_listing.drupal.liquid"]',
  );

  // Escape early if the legacy events page doesn't exist.
  if (!legacyEvents) {
    return;
  }

  // Add `vads-u-display--none` to the legacy events page if it doesn't already have it.
  if (legacyEvents.classList.contains('vads-u-display--none')) {
    legacyEvents.classList.remove('vads-u-display--none');
  }
};
