// Node modules.
import moment from 'moment-timezone';
import { isArray, sortBy, filter, isEmpty } from 'lodash';

export const filterByOptions = [
  {
    label: 'All upcoming',
    value: 'upcoming',
  },
  {
    label: 'Specific date',
    value: 'specific-date',
  },
  {
    label: 'Custom date range',
    value: 'custom-date-range',
  },
  {
    label: 'Past events',
    value: 'past',
  },
];

export const deriveDefaultSelectedOption = () => {
  // Derive the query params on the URL.
  const queryParams = new URLSearchParams(window.location.search);

  // Derive the default selected option.
  return filterByOptions?.find(
    option =>
      queryParams.get('selectedOption')
        ? option.value === queryParams.get('selectedOption')
        : option.value === 'upcoming',
  );
};

export const deriveMostRecentDate = (
  fieldDatetimeRangeTimezone,
  now = moment().unix(), // This is done so that we can mock the current time in tests.
) => {
  // Escape early if no fieldDatetimeRangeTimezone was passed.
  if (!fieldDatetimeRangeTimezone) return fieldDatetimeRangeTimezone;

  // Return back fieldDatetimeRangeTimezone if it is already a singular most recent date.
  if (!isArray(fieldDatetimeRangeTimezone)) {
    return fieldDatetimeRangeTimezone;
  }

  // Return back fieldDatetimeRangeTimezone's first item if it only has 1 item.
  if (fieldDatetimeRangeTimezone?.length === 1) {
    return fieldDatetimeRangeTimezone[0];
  }

  // Derive date times relative to now.
  const dates = sortBy(fieldDatetimeRangeTimezone, 'endValue');
  const futureDates = filter(dates, date => date?.endValue - now > 0);

  // Return the most recent past date if there are no future dates.
  if (isEmpty(futureDates)) {
    return dates[dates?.length - 1];
  }

  // Return the most recent future date if there are future dates.
  return futureDates[0];
};

function keepUniqueEventsFromList(allEvents, event) {
  if (!allEvents) {
    return [];
  }

  if (allEvents === []) {
    return [event];
  }

  const currentEventIds = allEvents.map(ev => ev.entityId);

  if (!currentEventIds.includes(event.entityId)) {
    allEvents.push(event);
  }

  return allEvents;
}

export const removeDuplicateEvents = events =>
  events?.reduce(keepUniqueEventsFromList, []);

// This takes all repeating events and creates a separate event for
// each repeated instance. Repeating events can still be identified as such,
// and let event listings show multiple recurring events.
export const fleshOutRecurringEvents = events => {
  if (!events) {
    return [];
  }

  const allEvents = events.reduce((fullEvents, event) => {
    if (!event.fieldDatetimeRangeTimezone) {
      return fullEvents;
    }

    if (event?.fieldDatetimeRangeTimezone.length === 1) {
      fullEvents.push(event);
      return fullEvents;
    }

    const eventTimes = event?.fieldDatetimeRangeTimezone;
    // This makes each copy of a recurring event start with a different time,
    // so each time is a separate event
    event?.fieldDatetimeRangeTimezone.forEach((tz, index) => {
      const timeZonesCopy = [...eventTimes];

      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < index; i++) {
        timeZonesCopy.unshift(timeZonesCopy.pop());
      }

      fullEvents.push({ ...event, fieldDatetimeRangeTimezone: timeZonesCopy });
    });

    return fullEvents;
  }, []);

  return [...allEvents]?.sort(
    (event1, event2) =>
      event1?.fieldDatetimeRangeTimezone[0]?.value -
      event2?.fieldDatetimeRangeTimezone[0]?.value,
  );
};

export const deriveResults = (events, page, perPage) => {
  // Escape early if we do not have events, page, or perPage.
  if (isEmpty(events) || !page || !perPage) {
    return events;
  }

  // Derive the start and end indexes.
  const start = (page - 1) * perPage;
  const end = start + perPage;

  // Return the results.
  return events?.slice(start, end);
};

export const deriveResultsStartNumber = (page, perPage) => {
  // Derive the end number.
  const endNumber = page * perPage;

  // Derive the start number.
  return endNumber - (perPage - 1);
};

export const deriveResultsEndNumber = (page, perPage, totalResults) => {
  // Derive the end number.
  const endNumber = page * perPage;

  // If the end number is more than the total results, just show the total results.
  if (endNumber > totalResults) {
    return totalResults;
  }

  // Show the end number.
  return endNumber;
};

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

  // Filter the events.
  switch (filterBy) {
    // Upcoming events.
    case 'upcoming': {
      return events
        .filter(event => {
          const start = moment(
            event?.fieldDatetimeRangeTimezone[0]?.value * 1000,
          );
          const end = moment(
            event?.fieldDatetimeRangeTimezone[0]?.endValue * 1000,
          );
          return (
            moment(event?.fieldDatetimeRangeTimezone[0]?.value * 1000).isAfter(
              now.clone(),
            ) || now.clone().isBetween(start, end)
          );
        })
        .reduce(keepUniqueEventsFromList, []);
    }

    // Next week.
    case 'next-week': {
      return events
        ?.filter(event =>
          moment(event?.fieldDatetimeRangeTimezone[0]?.value * 1000).isBetween(
            now
              .clone()
              .add('7', 'days')
              .startOf('week'),
            now
              .clone()
              .add('7', 'days')
              .endOf('week'),
          ),
        )
        .reduce(keepUniqueEventsFromList, []);
    }

    // Next month.
    case 'next-month': {
      return events
        ?.filter(event =>
          moment(event?.fieldDatetimeRangeTimezone[0]?.value * 1000).isBetween(
            now
              .clone()
              .add('1', 'month')
              .startOf('month'),
            now
              .clone()
              .add('1', 'month')
              .endOf('month'),
          ),
        )
        .reduce(keepUniqueEventsFromList, []);
    }

    // Past events.
    case 'past': {
      // Sort events inversely. @WARNING that `.sort` is mutative, so we need to clone the array.
      const sortedEvents = [...events]?.sort(
        (event1, event2) =>
          event2?.fieldDatetimeRangeTimezone[0]?.value -
          event1?.fieldDatetimeRangeTimezone[0]?.value,
      );

      return sortedEvents?.filter(event =>
        moment(
          event?.fieldDatetimeRangeTimezone[0]
            ? event.fieldDatetimeRangeTimezone[0].endValue * 1000
            : event.fieldDatetimeRangeTimezone.endValue * 1000,
        ).isBefore(now.clone()),
      );
    }

    // Custom dates.
    case 'specific-date':
    case 'custom-date-range':
      // Return sorted events if the custom dates are not provided.
      if (!options?.startsAtUnix || !options?.endsAtUnix) return events;

      return events?.filter(
        event =>
          moment(event?.fieldDatetimeRangeTimezone[0]?.value).isBetween(
            options?.startsAtUnix,
            options?.endsAtUnix,
          ) ||
          moment(event?.fieldDatetimeRangeTimezone[0]?.endValue).isBetween(
            options?.startsAtUnix,
            options?.endsAtUnix,
          ),
      );

    // Default, just give back sorted events.
    default:
      return events;
  }
};

export const deriveStartsAtUnix = (
  startDateMonth,
  startDateDay,
  startDateYear,
) => {
  // Escape early if arguments are missing.
  if (!startDateMonth || !startDateDay) {
    return undefined;
  }

  // Derive the startsAt moment.
  let startsAt = moment(
    `${startDateMonth}/${startDateDay}/${startDateYear}`,
    'MM/DD/YYYY',
  );

  // If startsAt is today, then set it to now + 1 hour.
  if (startsAt.isSame(moment(), 'day')) {
    startsAt = moment().add(1, 'hour');
  }

  // If the startsAt is in the past, we need to increase it by a year (since there are only month/day fields).
  if (startsAt.isBefore(moment())) {
    // startsAt.add(1, 'year').unix();
  }

  return startsAt.unix();
};

export const deriveEndsAtUnix = (
  startsAtUnix,
  endDateMonth,
  endDateDay,
  endDateYear,
) => {
  // Escape early if arguments are missing.
  if (!startsAtUnix && (!endDateMonth || !endDateDay)) {
    return undefined;
  }

  // Set a default value for endsAt.
  let endsAt;

  // Make the endsAt the end of the day if there is a start value.
  if (startsAtUnix) {
    endsAt = moment(startsAtUnix * 1000)
      .clone()
      .endOf('day');
  }

  // If there are endsAt fields provided, use those.
  if (endDateMonth && endDateDay) {
    endsAt = moment(
      `${endDateMonth}/${endDateDay}/${endDateYear}`,
      'MM/DD/YYYY',
    ).endOf('day');
  }

  // If the endsAt is in the past, we need to increase it by a year (since there are only month/day fields).
  if (endsAt.isBefore(moment())) {
    // endsAt.add(1, 'year').unix();
  }

  // If the endsAt is before the startsAt, we need to increase it by another year (since there are only month/day fields).
  if (endsAt.isBefore(startsAtUnix * 1000)) {
    // endsAt.add(1, 'year').unix();
  }

  return endsAt.unix();
};

export const deriveEventLocations = event => {
  const locations = [];

  // Escape early if there is no event.
  if (!event) {
    return locations;
  }

  if (event?.fieldFacilityLocation?.entity?.fieldAddress) {
    const fieldFacilityEntity = event?.fieldFacilityLocation?.entity;
    const {
      addressLine1,
      addressLine2,
      locality,
      administrativeArea,
    } = fieldFacilityEntity?.fieldAddress;
    if (addressLine1) {
      locations.push(addressLine1);
    }

    if (addressLine2) {
      locations.push(addressLine2);
    }

    if (locality && administrativeArea) {
      locations.push(`${locality}, ${administrativeArea}`);
    }
  } else {
    if (event?.fieldAddress?.addressLine1) {
      locations.push(event?.fieldAddress?.addressLine1);
    }

    if (event?.fieldAddress?.addressLine2) {
      locations.push(event?.fieldAddress?.addressLine2);
    }

    if (
      event?.fieldAddress?.locality &&
      event?.fieldAddress?.administrativeArea
    ) {
      locations.push(
        `${event?.fieldAddress?.locality}, ${
          event?.fieldAddress?.administrativeArea
        }`,
      );
    }
  }

  return locations;
};

export const updateQueryParams = (queryParamsLookup = {}) => {
  // Derive the query params on the URL.
  const queryParams = new URLSearchParams(window.location.search);

  // Set/Delete query params.
  Object.entries(queryParamsLookup).forEach(([key, value]) => {
    // Set the query param.
    if (value) {
      queryParams.set(key, value);
      return;
    }

    // Remove the query param.
    queryParams.delete(key);
  });

  // Update the URL with the new query params.
  window.history.replaceState(
    {},
    '',
    `${window.location.pathname}?${queryParams}`,
  );
};

export const deriveFilteredEvents = ({
  endDateDay,
  endDateMonth,
  endDateYear,
  rawEvents,
  selectedOption,
  startDateDay,
  startDateMonth,
  startDateYear,
}) => {
  // Derive startsAtUnix.
  const startsAtUnix = deriveStartsAtUnix(
    startDateMonth,
    startDateDay,
    startDateYear,
  );

  // Derive endsAtUnix.
  const endsAtUnix = deriveEndsAtUnix(
    startsAtUnix,
    endDateMonth,
    endDateDay,
    endDateYear,
  );

  // Filter events.
  return filterEvents(rawEvents, selectedOption?.value, {
    startsAtUnix,
    endsAtUnix,
  });
};

export const getDisabledEndDateOptions = (options, limit) => {
  return options.map(option => {
    return {
      ...option,
      disabled: parseInt(option.value, 10) < limit,
    };
  });
};
