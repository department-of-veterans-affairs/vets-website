// Node modules.
import moment from 'moment-timezone';
import { expect } from 'chai';
// Relative imports.
import {
  deriveEndsAtUnix,
  deriveEventLocations,
  deriveMostRecentDate,
  deriveStartsAtUnix,
  filterByOptions,
  filterEvents,
} from '.';

describe('deriveMostRecentDate', () => {
  it('returns the argument fieldDatetimeRangeTimezone when it is falsey', () => {
    // Setup.
    const fieldDatetimeRangeTimezone = undefined;

    // Assertions.
    expect(deriveMostRecentDate(fieldDatetimeRangeTimezone)).to.eq(
      fieldDatetimeRangeTimezone,
    );
  });

  it('returns the most recent date when fieldDatetimeRangeTimezone is an object', () => {
    // Setup.
    const fieldDatetimeRangeTimezone = {
      value: 1642014000,
      endValue: 1642017600,
    };

    // Assertions.
    expect(deriveMostRecentDate(fieldDatetimeRangeTimezone)).to.deep.eq(
      fieldDatetimeRangeTimezone,
    );
  });

  it('returns the most recent date when fieldDatetimeRangeTimezone is an array of 1', () => {
    // Setup.
    const fieldDatetimeRangeTimezone = [
      { value: 1642014000, endValue: 1642017600 },
    ];

    // Assertions.
    expect(deriveMostRecentDate(fieldDatetimeRangeTimezone)).to.deep.eq(
      fieldDatetimeRangeTimezone[0],
    );
  });

  it('returns the most recent date when fieldDatetimeRangeTimezone is an array of 2 or more + there are only past dates', () => {
    // Setup.
    const now = 1642030600;
    const fieldDatetimeRangeTimezone = [
      { value: 1642014000, endValue: 1642017600 },
      { value: 1642017000, endValue: 1642020600 },
      { value: 1642025600, endValue: 1642029600 },
    ];

    // Assertions.
    expect(deriveMostRecentDate(fieldDatetimeRangeTimezone, now)).to.deep.eq({
      value: 1642025600,
      endValue: 1642029600,
    });
  });

  it('returns the most recent date when fieldDatetimeRangeTimezone is an array of 2 or more + there are past and future dates', () => {
    // Setup.
    const now = 1642019600;
    const fieldDatetimeRangeTimezone = [
      { value: 1642014000, endValue: 1642017600 },
      { value: 1642017000, endValue: 1642020600 },
      { value: 1642025600, endValue: 1642029600 },
    ];

    // Assertions.
    expect(deriveMostRecentDate(fieldDatetimeRangeTimezone, now)).to.deep.eq({
      value: 1642017000,
      endValue: 1642020600,
    });
  });

  it('returns the most recent date when fieldDatetimeRangeTimezone is an array of 2 or more + there are only future dates', () => {
    // Setup.
    const now = 1642014000;
    const fieldDatetimeRangeTimezone = [
      { value: 1642014000, endValue: 1642017600 },
      { value: 1642017000, endValue: 1642020600 },
      { value: 1642025600, endValue: 1642029600 },
    ];

    // Assertions.
    expect(deriveMostRecentDate(fieldDatetimeRangeTimezone, now)).to.deep.eq({
      value: 1642014000,
      endValue: 1642017600,
    });
  });
});

describe('deriveEndsAtUnix', () => {
  it('returns what we expect with no arguments', () => {
    expect(deriveEndsAtUnix()).to.equal(undefined);
  });
});

describe('deriveStartsAtUnix', () => {
  it('returns what we expect with no arguments', () => {
    expect(deriveStartsAtUnix()).to.equal(undefined);
  });
});

describe('filterByOptions', () => {
  it('returns what we expect with no arguments', () => {
    expect(filterByOptions.map(option => option.value)).to.deep.equal([
      'upcoming',
      'specific-date',
      'custom-date-range',
      'past',
    ]);
  });
});

describe('filterEvents', () => {
  // '2021-01-01T07:00:00.000Z'
  const now = moment(1609484400 * 1000);

  const upcomingEvent = {
    id: 'upcoming',
    fieldDatetimeRangeTimezone: [
      {
        endValue: now
          .clone()
          .add(1, 'seconds')
          .add(2, 'hours')
          .unix(),
        value: now
          .clone()
          .add(1, 'hours')
          .unix(),
        timezone: 'America/New_York',
      },
    ],
  };

  const nextWeekEvent = {
    id: 'next-week',
    fieldDatetimeRangeTimezone: [
      {
        endValue: now
          .clone()
          .add(7, 'days')
          .startOf('week')
          .add(2, 'hours')
          .unix(),
        value: now
          .clone()
          .add(7, 'days')
          .startOf('week')
          .add(1, 'hours')
          .unix(),
        timezone: 'America/New_York',
      },
    ],
  };

  const nextMonthEvent = {
    id: 'next-month',
    fieldDatetimeRangeTimezone: [
      {
        endValue: now
          .clone()
          .add(1, 'month')
          .startOf('month')
          .add(2, 'hours')
          .unix(),
        value: now
          .clone()
          .add(1, 'month')
          .startOf('month')
          .add(1, 'hours')
          .unix(),
        timezone: 'America/New_York',
      },
    ],
  };

  const pastEvent = {
    id: 'past',
    fieldDatetimeRangeTimezone: [
      {
        endValue: now
          .clone()
          .subtract(2, 'days')
          .add(1, 'hours')
          .unix(),
        value: now
          .clone()
          .subtract(2, 'days')
          .unix(),
        timezone: 'America/New_York',
      },
    ],
  };

  const events = [upcomingEvent, nextWeekEvent, nextMonthEvent, pastEvent];

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
    ).to.deep.equal([upcomingEvent, nextWeekEvent, nextMonthEvent]);
  });

  it('returns what we expect for next-week', () => {
    expect(
      filterEvents(events, 'next-week', undefined, now.clone()),
    ).to.deep.equal([nextWeekEvent]);
  });

  it('returns what we expect for next-month', () => {
    expect(
      filterEvents(events, 'next-month', undefined, now.clone()),
    ).to.deep.equal([nextMonthEvent]);
  });

  it('returns what we expect for past', () => {
    expect(filterEvents(events, 'past', undefined, now.clone())).to.deep.equal([
      pastEvent,
    ]);
  });

  it('returns what we expect for specific-date and custom-date-range', () => {
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

  it('handles when fieldLocationHumanreadable is truthy', () => {
    expect(
      deriveEventLocations({ fieldLocationHumanreadable: 'foo' }),
    ).to.deep.equal(['foo']);
  });

  it('handles when fieldAddress?.addressLine1 is truthy', () => {
    expect(
      deriveEventLocations({ fieldAddress: { addressLine1: 'foo' } }),
    ).to.deep.equal(['foo']);
  });

  it('handles when fieldAddress?.addressLine2 is truthy', () => {
    expect(
      deriveEventLocations({ fieldAddress: { addressLine2: 'foo' } }),
    ).to.deep.equal(['foo']);
  });

  it('handles when fieldAddress?.locality is truthy', () => {
    expect(
      deriveEventLocations({
        fieldAddress: { locality: 'foo', administrativeArea: 'bar' },
      }),
    ).to.deep.equal(['foo, bar']);
  });
});
