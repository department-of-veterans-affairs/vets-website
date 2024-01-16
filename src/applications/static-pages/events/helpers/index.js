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
  const queryParams = new URLSearchParams(window.location.search);

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
  if (!fieldDatetimeRangeTimezone) return fieldDatetimeRangeTimezone;

  if (!isArray(fieldDatetimeRangeTimezone)) {
    return fieldDatetimeRangeTimezone;
  }

  if (fieldDatetimeRangeTimezone?.length === 1) {
    return fieldDatetimeRangeTimezone[0];
  }

  const dates = sortBy(fieldDatetimeRangeTimezone, 'endValue');
  const futureDates = filter(dates, date => date?.endValue - now > 0);

  if (isEmpty(futureDates)) {
    return dates[dates?.length - 1];
  }

  return futureDates[0];
};

export const addUniqueEventsToList = (allEvents, event) => {
  if (!Array.isArray(allEvents)) {
    return [];
  }

  if (allEvents?.length === 0) {
    return [event];
  }

  const currentEventIds = allEvents.map(ev => ev.entityId);

  if (!currentEventIds.includes(event.entityId)) {
    allEvents.push(event);
  }

  return allEvents;
};

export const removeDuplicateEvents = events =>
  events?.reduce(addUniqueEventsToList, []);

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
  if (isEmpty(events) || !page || !perPage) {
    return events;
  }

  const start = (page - 1) * perPage;
  const end = start + perPage;

  return events?.slice(start, end);
};

export const deriveResultsStartNumber = (page, perPage) => {
  const endNumber = page * perPage;

  return endNumber - (perPage - 1);
};

export const deriveResultsEndNumber = (page, perPage, totalResults) => {
  const endNumber = page * perPage;

  if (endNumber > totalResults) {
    return totalResults;
  }

  return endNumber;
};

export const filterEvents = (
  events,
  filterBy,
  options = {},
  now = moment(),
) => {
  if (isEmpty(events)) {
    return [];
  }

  switch (filterBy) {
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
        .reduce(addUniqueEventsToList, []);
    }
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
        .reduce(addUniqueEventsToList, []);
    }
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
        .reduce(addUniqueEventsToList, []);
    }
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
    case 'specific-date':
    case 'custom-date-range':
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
    default:
      return events;
  }
};

export const deriveStartsAtUnix = (
  startDateMonth,
  startDateDay,
  startDateYear,
) => {
  if (!startDateMonth || !startDateDay) {
    return undefined;
  }

  let startsAt = moment(
    `${startDateMonth}/${startDateDay}/${startDateYear}`,
    'MM/DD/YYYY',
  );

  if (startsAt.isSame(moment(), 'day')) {
    startsAt = moment().add(1, 'hour');
  }

  return startsAt.unix();
};

export const deriveEndsAtUnix = (
  startsAtUnix,
  endDateMonth,
  endDateDay,
  endDateYear,
) => {
  if (!startsAtUnix && (!endDateMonth || !endDateDay)) {
    return undefined;
  }

  let endsAt;

  if (startsAtUnix) {
    endsAt = moment(startsAtUnix * 1000)
      .clone()
      .endOf('day');
  }

  if (endDateMonth && endDateDay) {
    endsAt = moment(
      `${endDateMonth}/${endDateDay}/${endDateYear}`,
      'MM/DD/YYYY',
    ).endOf('day');
  }

  return endsAt.unix();
};

export const deriveEventLocations = event => {
  const locations = [];

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
  const queryParams = new URLSearchParams(window.location.search);

  Object.entries(queryParamsLookup).forEach(([key, value]) => {
    if (value) {
      queryParams.set(key, value);
      return;
    }

    queryParams.delete(key);
  });

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
  const startsAtUnix = deriveStartsAtUnix(
    startDateMonth,
    startDateDay,
    startDateYear,
  );

  const endsAtUnix = deriveEndsAtUnix(
    startsAtUnix,
    endDateMonth,
    endDateDay,
    endDateYear,
  );

  return filterEvents(rawEvents, selectedOption?.value, {
    startsAtUnix,
    endsAtUnix,
  });
};
