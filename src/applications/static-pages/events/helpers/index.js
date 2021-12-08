// Node modules.
import moment from 'moment';
import { orderBy, isEmpty } from 'lodash';

const nextWeekDay = moment()
  .add('7', 'days')
  .startOf('week')
  .format('MMM D');
const nextMonthDay = moment()
  .add('1', 'month')
  .startOf('month')
  .format('MMM D');

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

export const filterEvents = (events, filterBy, options = {}) => {
  // Escape early if there are no events.
  if (isEmpty(events)) {
    return [];
  }

  const sortedEvents = orderBy(
    events,
    ['fieldDatetimeRangeTimezone', 'value'],
    ['asc'],
  );

  // Give back the raw events if the filterBy is not provided.
  if (!filterBy) {
    return sortedEvents;
  }

  // Filter the events.
  switch (filterBy) {
    // Upcoming events.
    case 'upcoming':
      return sortedEvents?.filter(event =>
        moment(event?.fieldDatetimeRangeTimezone?.value * 1000).isAfter(),
      );

    // Next week.
    case 'next-week':
      return sortedEvents?.filter(event =>
        moment(event?.fieldDatetimeRangeTimezone?.value * 1000).isAfter(
          moment()
            .add('7', 'days')
            .startOf('week'),
        ),
      );

    // Next month.
    case 'next-month':
      return sortedEvents?.filter(event =>
        moment(event?.fieldDatetimeRangeTimezone?.value * 1000).isAfter(
          moment()
            .add('1', 'month')
            .startOf('month'),
        ),
      );

    // Past events.
    case 'past':
      return sortedEvents?.filter(event =>
        moment(event?.fieldDatetimeRangeTimezone?.value * 1000).isBefore(),
      );

    // Custom dates.
    case 'specific-date':
    case 'custom-date-range':
      // Return sorted events if the custom dates are not provided.
      if (!options?.startDate || !options?.endDate) return sortedEvents;

      return sortedEvents?.filter(event =>
        moment(event?.fieldDatetimeRangeTimezone?.value * 1000).isBetween(
          options?.startAt,
          options?.endAt,
        ),
      );

    // Default, just give back raw events.
    default:
      return sortedEvents;
  }
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
