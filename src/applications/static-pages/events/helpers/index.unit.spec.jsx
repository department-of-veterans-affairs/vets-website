import moment from 'moment-timezone';
import { expect } from 'chai';
import {
  addUniqueEventsToList,
  deriveDefaultSelectedOption,
  deriveEndsAtUnix,
  deriveEventLocations,
  deriveMostRecentDate,
  deriveResults,
  deriveResultsEndNumber,
  deriveResultsStartNumber,
  deriveStartsAtUnix,
  filterByOptions,
  filterEvents,
  fleshOutRecurringEvents,
  removeDuplicateEvents,
} from '.';
import { createEvent } from './event-generator';

describe('deriveDefaultSelectedOption', () => {
  const oldLocation = global.window.location;

  afterEach(() => {
    global.window.location = oldLocation;
  });

  it('should take the queryParams from the window if they exist and return the correct filter', () => {
    global.window.location = { search: '?selectedOption=specific-date' };

    expect(deriveDefaultSelectedOption()).to.deep.eq(filterByOptions[1]);
  });

  it('should take the queryParams from the window if they exist and return the correct filter', () => {
    global.window.location = { search: '' };

    expect(deriveDefaultSelectedOption()).to.deep.eq(filterByOptions[0]);
  });
});

describe('deriveMostRecentDate', () => {
  it('returns the argument fieldDatetimeRangeTimezone when it is falsey', () => {
    const fieldDatetimeRangeTimezone = undefined;

    expect(deriveMostRecentDate(fieldDatetimeRangeTimezone)).to.eq(
      fieldDatetimeRangeTimezone,
    );
  });

  it('returns the most recent date when fieldDatetimeRangeTimezone is an object', () => {
    const fieldDatetimeRangeTimezone = {
      value: 1642014000,
      endValue: 1642017600,
    };

    expect(deriveMostRecentDate(fieldDatetimeRangeTimezone)).to.deep.eq(
      fieldDatetimeRangeTimezone,
    );
  });

  it('returns the most recent date when fieldDatetimeRangeTimezone is an array of 1', () => {
    const fieldDatetimeRangeTimezone = [
      { value: 1642014000, endValue: 1642017600 },
    ];

    expect(deriveMostRecentDate(fieldDatetimeRangeTimezone)).to.deep.eq(
      fieldDatetimeRangeTimezone[0],
    );
  });

  it('returns the most recent date when fieldDatetimeRangeTimezone is an array of 2 or more + there are only past dates', () => {
    const now = 1642030600;
    const fieldDatetimeRangeTimezone = [
      { value: 1642014000, endValue: 1642017600 },
      { value: 1642017000, endValue: 1642020600 },
      { value: 1642025600, endValue: 1642029600 },
    ];

    expect(deriveMostRecentDate(fieldDatetimeRangeTimezone, now)).to.deep.eq({
      value: 1642025600,
      endValue: 1642029600,
    });
  });

  it('returns the most recent date when fieldDatetimeRangeTimezone is an array of 2 or more + there are past and future dates', () => {
    const now = 1642019600;
    const fieldDatetimeRangeTimezone = [
      { value: 1642014000, endValue: 1642017600 },
      { value: 1642017000, endValue: 1642020600 },
      { value: 1642025600, endValue: 1642029600 },
    ];

    expect(deriveMostRecentDate(fieldDatetimeRangeTimezone, now)).to.deep.eq({
      value: 1642017000,
      endValue: 1642020600,
    });
  });

  it('returns the most recent date when fieldDatetimeRangeTimezone is an array of 2 or more + there are only future dates', () => {
    const now = 1642014000;
    const fieldDatetimeRangeTimezone = [
      { value: 1642014000, endValue: 1642017600 },
      { value: 1642017000, endValue: 1642020600 },
      { value: 1642025600, endValue: 1642029600 },
    ];

    expect(deriveMostRecentDate(fieldDatetimeRangeTimezone, now)).to.deep.eq({
      value: 1642014000,
      endValue: 1642017600,
    });
  });
});

describe('addUniqueEventsToList', () => {
  it('should return an empty array when all events are not given', () => {
    expect(addUniqueEventsToList(null, { test: 'test' })).to.deep.eq([]);
  });

  it('should return an array with a single event when all events is empty', () => {
    const event = {
      id: 'upcoming',
      entityId: 5,
      entityUrl: { path: '/active-event' },
      fieldDescription: 'Active Event description',
      title: 'Active Event',
      fieldDatetimeRangeTimezone: [
        {
          value: 1609480800,
          endValue: 1609491600,
          timezone: 'America/New_York',
        },
      ],
      fieldLocationHumanreadable: '1234 Active Event street',
    };

    expect(addUniqueEventsToList([], event)).to.deep.eq([event]);
  });

  it('should add an event to the list if it is unique', () => {
    const event = {
      entityId: 8,
    };

    const allEvents = [{ entityId: 7 }, { entityId: 10 }];

    expect(addUniqueEventsToList(allEvents, event)).to.deep.eq([
      { entityId: 7 },
      { entityId: 10 },
      { entityId: 8 },
    ]);
  });

  it('should return the original all events list if not given a unique event', () => {
    const event = {
      entityId: 10,
    };

    const allEvents = [{ entityId: 7 }, { entityId: 10 }];

    expect(addUniqueEventsToList(allEvents, event)).to.deep.eq(allEvents);
  });
});

describe('removeDuplicateEvents', () => {
  it('should remove duplicate events from the list given', () => {
    const allEvents = [
      { entityId: 1 },
      { entityId: 4 },
      { entityId: 7 },
      { entityId: 7 },
      { entityId: 10 },
      { entityId: 10 },
      { entityId: 8 },
    ];

    expect(removeDuplicateEvents(allEvents)).to.deep.eq([
      { entityId: 1 },
      { entityId: 4 },
      { entityId: 7 },
      { entityId: 10 },
      { entityId: 8 },
    ]);
  });
});

describe('fleshOutRecurringEvents', () => {
  it('should create recurring events correctly', () => {
    const recurringEvents = [
      {
        fieldDatetimeRangeTimezone: [{ value: 1 }, { value: 2 }],
      },
      {
        fieldDatetimeRangeTimezone: [{ value: 3 }, { value: 4 }],
      },
    ];

    expect(fleshOutRecurringEvents(recurringEvents)).to.deep.eq([
      {
        fieldDatetimeRangeTimezone: [{ value: 1 }, { value: 2 }],
      },
      {
        fieldDatetimeRangeTimezone: [{ value: 2 }, { value: 1 }],
      },
      {
        fieldDatetimeRangeTimezone: [{ value: 3 }, { value: 4 }],
      },
      {
        fieldDatetimeRangeTimezone: [{ value: 4 }, { value: 3 }],
      },
    ]);
  });

  it('should return an empty array if no events are given', () => {
    expect(fleshOutRecurringEvents([])).to.deep.eq([]);
  });

  it('should return an empty array if no date ranges', () => {
    const recurringEvents = [{ test: 'test' }, { test: 'test1' }];

    expect(fleshOutRecurringEvents(recurringEvents)).to.deep.eq([]);
  });

  it('should return the one event if there is only one occurrence', () => {
    const recurringEvents = [{ fieldDatetimeRangeTimezone: [{ value: 1234 }] }];

    expect(fleshOutRecurringEvents(recurringEvents)).to.deep.eq(
      recurringEvents,
    );
  });
});

describe('deriveResults', () => {
  it('should return if the correct arguments are not provided', () => {
    expect(deriveResults([], 1, 10)).to.deep.equal([]);
  });

  it('should return if the correct arguments are not provided', () => {
    expect(deriveResults([{ test: 'test' }], undefined, 10)).to.deep.equal([
      { test: 'test' },
    ]);
  });

  it('should return if the correct arguments are not provided', () => {
    expect(deriveResults([{ test: 'test' }], 1, undefined)).to.deep.equal([
      { test: 'test' },
    ]);
  });

  it('should return the list of events for the desired page', () => {
    const events = [
      { event: 'test-event-1' },
      { event: 'test-event-2' },
      { event: 'test-event-3' },
      { event: 'test-event-4' },
      { event: 'test-event-5' },
      { event: 'test-event-6' },
    ];

    expect(deriveResults(events, 1, 3)).to.deep.eq([
      { event: 'test-event-1' },
      { event: 'test-event-2' },
      { event: 'test-event-3' },
    ]);
  });

  it('should return early if no events were given', () => {
    expect(deriveResults([], 1, 3)).to.deep.eq([]);
  });

  it('should return early if an invalid page was given', () => {
    expect(deriveResults([], 0, 3)).to.deep.eq([]);
  });

  it('should return early if an invalid perPage was given', () => {
    expect(deriveResults([], null, 0)).to.deep.eq([]);
  });
});

describe('deriveResultsStartNumber', () => {
  it('should return the correct start number', () => {
    expect(deriveResultsStartNumber(1, 3)).to.eq(1);
  });

  it('should return the correct start number', () => {
    expect(deriveResultsStartNumber(3, 10)).to.eq(21);
  });
});

describe('deriveResultsEndNumber', () => {
  it('should return the correct number', () => {
    expect(deriveResultsEndNumber(3, 15, 100)).to.eq(45);
  });

  it('should return the correct number', () => {
    expect(deriveResultsEndNumber(3, 15, 40)).to.eq(40);
  });
});

describe('deriveEndsAtUnix', () => {
  it('returns what we expect with no arguments', () => {
    expect(deriveEndsAtUnix()).to.equal(undefined);
  });

  it('returns what we expact with one argument', () => {
    expect(deriveEndsAtUnix(null, '05')).to.equal(undefined);
  });
});

describe('deriveStartsAtUnix', () => {
  it('returns what we expect with no arguments', () => {
    expect(deriveStartsAtUnix()).to.equal(undefined);
  });

  it('returns what we expect with one argument', () => {
    expect(deriveStartsAtUnix('05')).to.equal(undefined);
  });
});

describe('filterEvents', () => {
  // '2021-01-01T07:00:00.000Z'
  const now = moment(1609484400 * 1000);

  const upcomingEvent = createEvent(
    now
      .clone()
      .add(1, 'hours')
      .unix(),
    now
      .clone()
      .add(1, 'seconds')
      .add(2, 'hours')
      .unix(),
    'Upcoming Event',
    { id: 'upcoming' },
  );

  const nextMonthEvent = createEvent(
    now
      .clone()
      .add(1, 'month')
      .startOf('month')
      .add(1, 'hours')
      .unix(),
    now
      .clone()
      .add(1, 'month')
      .startOf('month')
      .add(2, 'hours')
      .unix(),
    'Next Month Event',
    { id: 'next-month' },
  );

  const nextWeekEvent = createEvent(
    now
      .clone()
      .add(7, 'days')
      .startOf('week')
      .add(1, 'hours')
      .unix(),
    now
      .clone()
      .add(7, 'days')
      .startOf('week')
      .add(2, 'hours')
      .unix(),
    'Next Week Event',
    { id: 'next-week' },
  );

  const pastEvent = createEvent(
    now
      .clone()
      .subtract(2, 'days')
      .unix(),
    now
      .clone()
      .subtract(2, 'days')
      .add(1, 'hours')
      .unix(),
    'Past Event',
    { id: 'past' },
  );

  const activeEvent = createEvent(
    now
      .clone()
      .subtract(1, 'hour')
      .unix(),
    now
      .clone()
      .add(2, 'hour')
      .unix(),
    'Active Event',
  );

  const events = [
    upcomingEvent,
    nextWeekEvent,
    nextMonthEvent,
    pastEvent,
    activeEvent,
  ];

  it('returns what we expect with no arguments', () => {
    expect(
      filterEvents(undefined, undefined, undefined, now.clone()),
    ).to.deep.equal([]);
  });

  it('returns what we expect with no filterBy', () => {
    expect(
      filterEvents(events, undefined, undefined, now.clone()),
    ).to.deep.equal(events);
  });

  it('returns what we expect for upcoming', () => {
    expect(
      filterEvents(events, 'upcoming', undefined, now.clone()),
    ).to.deep.equal([
      upcomingEvent,
      nextWeekEvent,
      nextMonthEvent,
      activeEvent,
    ]);
  });

  it('returns what we expect for next-week', () => {
    expect(
      filterEvents(events, 'next-week', undefined, now.clone()),
    ).to.deep.equal([nextWeekEvent]);
  });

  it('returns what we expect for next-month', () => {
    const filteredEvents = filterEvents(
      events,
      'next-month',
      undefined,
      now.clone(),
    );

    // next-month results can also include next-week results, depending on
    // timing of the test run. If there are 2 results, assert that both events
    // are present, otherwise, assert that only next-month exits.
    if (filteredEvents.length === 2) {
      const titles = [];
      filteredEvents.forEach(event => {
        titles.push(event.title);
      });
      expect(filteredEvents).to.have.length(2);
      expect(titles).to.have.members(['Next Week Event', 'Next Month Event']);
    } else {
      expect(filteredEvents).to.deep.equal([nextMonthEvent]);
    }
  });

  it('returns what we expect for past', () => {
    expect(filterEvents(events, 'past', undefined, now.clone())).to.deep.equal([
      pastEvent,
    ]);
  });

  it('returns what we expect for custom-date-range', () => {
    expect(
      filterEvents(
        events,
        'custom-date-range',
        {
          startsAtUnix: now
            .clone()
            .add(1, 'weeks')
            .startOf('week')
            .subtract(1, 'days')
            .unix(),
          endsAtUnix: now
            .clone()
            .add(1, 'weeks')
            .startOf('week')
            .add(1, 'days')
            .unix(),
        },
        now.clone(),
      ),
    ).to.deep.equal([nextWeekEvent]);

    expect(
      filterEvents(events, 'custom-date-range', {}, now.clone()),
    ).to.deep.equal(events);
  });

  it('returns what we expect for specific-date', () => {
    expect(
      filterEvents(
        events,
        'specific-date',
        {
          startsAtUnix: now
            .clone()
            .add(1, 'weeks')
            .startOf('week')
            .subtract(1, 'days')
            .unix(),
          endsAtUnix: now
            .clone()
            .add(1, 'weeks')
            .startOf('week')
            .add(1, 'days')
            .unix(),
        },
        now.clone(),
      ),
    ).to.deep.equal([nextWeekEvent]);
  });
});

describe('deriveEventLocations', () => {
  it('returns an array with no arguments passed to it', () => {
    expect(deriveEventLocations()).to.deep.equal([]);
  });

  it('handles when a field facility location is provided', () => {
    expect(
      deriveEventLocations({
        fieldFacilityLocation: {
          entity: {
            fieldAddress: {
              addressLine1: 'foo',
              addressLine2: 'bar',
              locality: 'red',
              administrativeArea: 'green',
            },
          },
        },
      }),
    ).to.deep.equal(['foo', 'bar', 'red, green']);
  });

  it('handles when a field facility location is not provided', () => {
    expect(
      deriveEventLocations({
        fieldAddress: {
          addressLine1: 'foo',
          addressLine2: 'bar',
          locality: 'red',
          administrativeArea: 'green',
        },
      }),
    ).to.deep.equal(['foo', 'bar', 'red, green']);
  });
});
