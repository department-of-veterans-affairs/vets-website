import {
  isAfter,
  isWithinInterval,
  addDays,
  addMonths,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  fromUnixTime,
  parse,
  isSameDay,
  addHours,
  endOfDay,
  getUnixTime,
} from 'date-fns';

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
  now = getUnixTime(new Date()), // This is done so that we can mock the current time in tests.
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
  if (!events) return [];

  const now = getUnixTime(new Date());

  const allEvents = events.reduce((fullEvents, event) => {
    const eventTimes = event?.fieldDatetimeRangeTimezone;
    if (!eventTimes) return fullEvents;

    // Filter to only future times before creating events
    const futureTimes = eventTimes.filter(time => time.value > now);
    if (futureTimes.length === 0) return fullEvents;

    // Create events only for future occurrences
    futureTimes.forEach((_, index) => {
      const timeZonesCopy = [...futureTimes];
      for (let i = 0; i < index; i++) {
        timeZonesCopy.unshift(timeZonesCopy.pop());
      }
      fullEvents.push({ ...event, fieldDatetimeRangeTimezone: timeZonesCopy });
    });

    return fullEvents;
  }, []);

  return [...allEvents].sort(
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
  now = new Date(),
) => {
  if (isEmpty(events)) {
    return [];
  }

  switch (filterBy) {
    case 'upcoming': {
      return events
        .filter(event => {
          const start = fromUnixTime(
            event?.fieldDatetimeRangeTimezone[0]?.value,
          );
          const end = fromUnixTime(
            event?.fieldDatetimeRangeTimezone[0]?.endValue,
          );
          return isAfter(start, now) || isWithinInterval(now, { start, end });
        })
        .reduce(addUniqueEventsToList, []);
    }

    case 'next-week': {
      const nextWeekStart = startOfWeek(addDays(now, 7));
      const nextWeekEnd = endOfWeek(addDays(now, 7));
      return events
        ?.filter(event => {
          const start = fromUnixTime(
            event?.fieldDatetimeRangeTimezone[0]?.value,
          );
          return isWithinInterval(start, {
            start: nextWeekStart,
            end: nextWeekEnd,
          });
        })
        .reduce(addUniqueEventsToList, []);
    }

    case 'next-month': {
      const nextMonthStart = startOfMonth(addMonths(now, 1));
      const nextMonthEnd = endOfMonth(addMonths(now, 1));
      return events
        ?.filter(event => {
          const start = fromUnixTime(
            event?.fieldDatetimeRangeTimezone[0]?.value,
          );
          return isWithinInterval(start, {
            start: nextMonthStart,
            end: nextMonthEnd,
          });
        })
        .reduce(addUniqueEventsToList, []);
    }

    case 'specific-date':
    case 'custom-date-range': {
      if (!options?.startsAtUnix || !options?.endsAtUnix) return events;

      return events?.filter(event => {
        const start = fromUnixTime(event?.fieldDatetimeRangeTimezone[0]?.value);
        const end = fromUnixTime(
          event?.fieldDatetimeRangeTimezone[0]?.endValue,
        );
        return (
          isWithinInterval(start, {
            start: fromUnixTime(options.startsAtUnix),
            end: fromUnixTime(options.endsAtUnix),
          }) ||
          isWithinInterval(end, {
            start: fromUnixTime(options.startsAtUnix),
            end: fromUnixTime(options.endsAtUnix),
          })
        );
      });
    }

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

  let startsAt = parse(
    `${startDateMonth}/${startDateDay}/${startDateYear}`,
    'MM/dd/yyyy',
    new Date(),
  );

  if (isSameDay(startsAt, new Date())) {
    startsAt = addHours(new Date(), 1);
  }

  return getUnixTime(startsAt);
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
    endsAt = endOfDay(new Date(startsAtUnix * 1000));
  }

  if (endDateMonth && endDateDay) {
    endsAt = endOfDay(
      parse(
        `${endDateMonth}/${endDateDay}/${endDateYear}`,
        'MM/dd/yyyy',
        new Date(),
      ),
    );
  }

  return getUnixTime(endsAt);
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
