import moment from 'moment-timezone';
import { fleshOutRecurringEvents, removeDuplicateEvents } from '.';

moment.tz.setDefault('America/New_York');
const now = moment().clone();
let lastEntityId = 0;

/**
 * Creates a unique entity id (number).
 *
 * @returns {Number}
 *   A unique id.
 */
const uniqueEntityId = () => {
  lastEntityId += 1;
  return lastEntityId;
};

/**
 * Creates a new event object.
 *
 * @export
 * @param {Moment} start Start of the event
 * @param {Moment} end End of the event
 * @param {String} title The title of the event
 * @param {Object} eventData (optional) Additional data to add to the event. Parameters here will override default vaules.
 *
 * @returns {Object} The event
 */
const createEvent = (start, end, title, eventData = {}) => {
  const path = `/${title.replace(/\s+/g, '-').toLowerCase()}`;
  const event = {
    id: 'upcoming',
    entityId: uniqueEntityId(),
    entityUrl: { path },
    fieldDescription: `${title} description`,
    title,
    fieldDatetimeRangeTimezone: [
      {
        value: start,
        endValue: end,
        timezone: 'America/New_York',
      },
    ],
    fieldLocationHumanreadable: `1234 ${title} street`,
  };
  return Object.assign(event, eventData);
};

/**
 * Creates recurring events.
 *
 * @export
 * @returns {Array<Object>} An array of event objects.
 */
const createRecurringEvents = () => {
  const recurEventData = { id: 'upcoming' };
  const eventA = createEvent(
    now
      .clone()
      .add(1, 'hour')
      .unix(),
    now
      .clone()
      .add(1, 'day')
      .unix(),
    'Recurring Future Event A',
    recurEventData,
  );
  // Add additional event occurrence to eventA.
  eventA.fieldDatetimeRangeTimezone.push({
    value: now
      .clone()
      .add(1, 'week')
      .unix(),
    endValue: now
      .clone()
      .add(1, 'week')
      .add(1, 'hour')
      .unix(),
    timezone: 'America/New_York',
  });
  const eventB = createEvent(
    now.clone().unix(),
    now
      .clone()
      .subtract(1, 'hour')
      .unix(),
    'Recurring Past Event A',
    recurEventData,
  );
  // Add additional event occurrence to eventB.
  eventB.fieldDatetimeRangeTimezone.push({
    value: now
      .clone()
      .subtract(1, 'week')
      .unix(),
    endValue: now
      .clone()
      .subtract(1, 'week')
      .add(1, 'hour')
      .unix(),
    timezone: 'America/New_York',
  });
  return [eventA, eventB];
};

/**
 * Creates future events.
 *
 * @export
 * @returns {Array<Object>} An array of event objects.
 */
const createFutureEvents = () => {
  // Types: upcoming, next-month, next-week
  return [
    // upcoming
    createEvent(
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
    ),
    // next-week
    createEvent(
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
    ),
    // next-month
    createEvent(
      now
        .clone()
        .add(1, 'month')
        .startOf('month')
        .add(2, 'hours')
        .unix(),
      now
        .clone()
        .add(30, 'days')
        .add(1, 'hours')
        .unix(),
      'Next Month Event',
      { id: 'next-month' },
    ),
  ];
};

/**
 * Creates duplicate events.
 *
 * @export
 * @returns {Array<Object>} An array of event objects.
 */
const createDuplicateEvents = () => {
  const eventA = createEvent(
    now
      .clone()
      .add(5, 'days')
      .unix(),
    now
      .clone()
      .add(5, 'days')
      .add(1, 'hours')
      .unix(),
    'Duplicate Event A',
    { id: 'upcoming' },
  );

  const eventB = createEvent(
    now
      .clone()
      .add(5, 'days')
      .unix(),
    now
      .clone()
      .add(5, 'days')
      .add(1, 'hours')
      .unix(),
    'Duplicate Event B',
    { id: 'upcoming' },
  );
  // Duplicate events have the same "entityId".
  eventB.entityId = eventA.entityId;

  return [eventA, eventB];
};

/**
 * Creates events in various locations.
 *
 * @export
 * @returns {Array<Object>} An array of event objects.
 */
const createLocationEvents = () => {
  const facilityEventData = {
    fieldEventCost: 'Free',
    fieldFacilityLocation: {
      entity: {
        entityBundle: 'health_care_local_facility',
        entityId: uniqueEntityId(),
        entityType: 'node',
        entityUrl: {
          path: '/facility-event-a-facility-path',
        },
        title: 'Facility Center',
      },
    },
    fieldLocationHumanreadable: 'Lot 7, By Building 218 and Wadsworth Theatre',
    fieldLocationType: 'facility',
  };
  return [
    // location type: Facility
    createEvent(
      now
        .clone()
        .add(1, 'day')
        .unix(),
      now
        .clone()
        .add(1, 'day')
        .add(1, 'hour')
        .unix(),
      'Facility Event A',
      facilityEventData,
    ),
    createEvent(
      now
        .clone()
        .add(1, 'day')
        .unix(),
      now
        .clone()
        .add(1, 'day')
        .add(1, 'hour')
        .unix(),
      'Facility Event B',
      facilityEventData,
    ),
    // location type: Online
    createEvent(
      now
        .clone()
        .add(1, 'day')
        .add(1, 'hour')
        .unix(),
      now
        .clone()
        .add(1, 'day')
        .add(2, 'hour')
        .unix(),
      'Online Event A',
      {
        fieldEventCost: 'Free',
        fieldEventCta: 'register',
        fieldEventRegistrationrequired: true,
        fieldLink: {
          uri: 'https://www.example.com',
          url: { path: 'https://www.example.com' },
          title: '',
        },
        fieldLocationType: 'online',
        fieldUrlOfAnOnlineEvent: {
          uri: 'https://www.example.com',
          title: '',
        },
      },
    ),
    // location type: Other. The other location type is just a non-online, non-facility type. It isn't used specifically in the app.
    createEvent(
      now
        .clone()
        .add(3, 'day')
        .add(1, 'hour')
        .unix(),
      now
        .clone()
        .add(3, 'day')
        .add(2, 'hour')
        .unix(),
      'Other Event A',
      {
        fieldEventCost: 'Free',
        fieldEventCta: 'register',
        fieldEventRegistrationrequired: true,
        fieldLocationType: 'other',
      },
    ),
  ];
};

/**
 * Creates events that are occurring actively.
 *
 * @export
 * @returns {Array<Object>} An array of event objects.
 */
const createActiveEvents = () => {
  return [
    createEvent(
      now
        .clone()
        .subtract(10, 'hour')
        .unix(),
      now
        .clone()
        .add(4, 'hours')
        .unix(),
      'Active Event A',
      { id: 'upcoming' },
    ),
    createEvent(
      now.clone().unix(),
      now
        .clone()
        .add(6, 'hours')
        .unix(),
      'Active Event B',
      { id: 'upcoming' },
    ),
  ];
};

/**
 * Generates test events for use in testing the Events app.
 *
 * Events are generated with start/end times contextual to 'now', and include
 * future events, recurring events, and more.
 *
 * @export
 * @returns {Array<Object>} An array of event objects
 */
const generateTestEvents = () => {
  return fleshOutRecurringEvents(
    removeDuplicateEvents([
      ...createFutureEvents(),
      ...createRecurringEvents(),
      ...createDuplicateEvents(),
      ...createActiveEvents(),
      ...createLocationEvents(),
    ]),
  );
};

export {
  generateTestEvents,
  createEvent,
  createFutureEvents,
  createRecurringEvents,
  createDuplicateEvents,
  createActiveEvents,
  createLocationEvents,
};
