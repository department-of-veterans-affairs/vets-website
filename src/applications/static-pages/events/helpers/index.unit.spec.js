// Node modules.
import moment from 'moment-timezone';
import { expect } from 'chai';
// Relative imports.
import {
  dayOptions,
  defaultSelectedOption,
  deriveEndsAtUnix,
  deriveStartsAtUnix,
  filterByOptions,
  filterEvents,
  hideLegacyEvents,
  monthOptions,
  showLegacyEvents,
} from '.';

describe('dayOptions', () => {
  it('returns what we expect', () => {
    expect(dayOptions).to.have.lengthOf(32);
  });
});

describe('defaultSelectedOption', () => {
  it('returns what we expect with no arguments', () => {
    expect(defaultSelectedOption).to.deep.equal({
      label: 'All upcoming',
      value: 'upcoming',
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
      'next-week',
      'next-month',
      'past',
      'specific-date',
      'custom-date-range',
    ]);
  });
});

describe('filterEvents', () => {
  // '2021-01-01T07:00:00.000Z'
  const now = moment(1609484400 * 1000);

  const upcomingEvent = {
    id: 'upcoming',
    fieldDatetimeRangeTimezone: {
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
  };

  const nextWeekEvent = {
    id: 'next-week',
    fieldDatetimeRangeTimezone: {
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
  };

  const nextMonthEvent = {
    id: 'next-month',
    fieldDatetimeRangeTimezone: {
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
  };

  const pastEvent = {
    id: 'past',
    fieldDatetimeRangeTimezone: {
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

describe('hideLegacyEvents', () => {
  it('returns what we expect with no arguments', () => {
    expect(hideLegacyEvents()).to.equal(undefined);
  });
});

describe('monthOptions', () => {
  it('returns what we expect', () => {
    expect(monthOptions).to.have.lengthOf(13);
  });
});

describe('showLegacyEvents', () => {
  it('returns what we expect with no arguments', () => {
    expect(showLegacyEvents()).to.equal(undefined);
  });
});
