// This script exists to facilitate automatically creating events for use in
// testing the events App.

import moment from 'moment-timezone';

/*
Events have many flavors:
  Recurring - all future
  Recurring - some past, some future
  Single events
  Events happening now
  Various locations:
  At a facility
  Online
  At a not-facility location
*/

const createRecurringEvents = () => {
  return this;
};
const createPastEvents = () => {
  //  Creates two events:
  // Past Event A: January 4th at 10:15:00 AM two months ago
  // Past
  const now = moment().clone();
  now.subtract(1, 'years');
  const lastYear = now.year();
  return [
    {
      entityUrl: { path: '/path-to-entity 1' },
      fieldDescription: 'Rando description 1',
      title: 'Rando title',
      fieldDatetimeRangeTimezone: [
        {
          value: moment(`${lastYear}-01-04 10:15:00`).unix(),
          endValue: moment(`${lastYear}-01-04 10:15:00`).add(1, 'hour').unix(),
          timezone: 'America/New_York',
        },
      ],
    },
    {
      entityUrl: { path: '/path-to-entity 2' },
      fieldDescription: 'Rando description 2',
      title: 'Rando title 2',
      fieldDatetimeRangeTimezone: [
        {
          value: moment(`${lastYear}-06-01 12:00:00`).unix(),
          endValue: moment(`${lastYear}-06-01 12:00:00`).add(1, 'hour').unix(),
          timezone: 'America/New_York',
        },
      ],
    },
  ];
};
const createFutureEvents = () => {
  // Create two events, one from Novenber 30th at 5:00pm of next year, and the other on March 1st of next year at 12:00pm. Each lasts for one hour.
  // TODO: put some more thought into the 'when' of these events to avoid situations where "next year" might be mere moments away.
  const now = moment().clone();
  now.add(1, 'years');
  const nextYear = now.year();
  return [
    {
      entityUrl: { path: '/path-to-entity 3' },
      fieldDescription: 'Rando description 3',
      title: 'Rando title 3',
      fieldDatetimeRangeTimezone: [
        {
          value: moment(`${nextYear}-11-30 17:00:00`).unix(),
          endValue: moment(`${nextYear}-11-30 17:00:00`).add(1, 'hour').unix(),
          timezone: 'America/New_York',
        },
      ],
    },
    {
      entityUrl: { path: '/path-to-entity 4' },
      fieldDescription: 'Rando description 4',
      title: 'Rando title 4',
      fieldDatetimeRangeTimezone: [
        {
          value: moment(`${nextYear}-12-01 12:00:00`).unix(),
          endValue: moment(`${nextYear}-12-01 12:00:00`).add(1, 'hour').unix(),
          timezone: 'America/New_York',
        },
      ],
    },
  ];
};
const createDuplicateEvents = () => {
  return this;
};
const createFacilityEvents = () => {
  return this;
};

const generateTestEvents = () => {
  // Setup
  const now = moment().clone();
  const tz = 'America/New_York';
  const events = [
    ...createPastEvents(),
    ...createFutureEvents()
  ];
  
  // end up with something that has the following shape
  const exampleEvent = {
    entityUrl: { path: '/path-to-entity' },
    fieldDatetimeRangeTimezone: [
      {
        value: 1234,
        endValue: 1234,
        timezone: '',
      },
      {
        value: 1234,
        endValue: 1234,
        timezone: '',
      },
    ], // required
    fieldDescription: '',
    fieldFacilityLocation: {},
    fieldFeatured: true,
    fieldLocationHumanreadable: '',
    title: '',
  };

  return events;
};

export default generateTestEvents;
