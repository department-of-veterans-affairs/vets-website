// Node modules.
import moment from 'moment';

// Derive startsAt and expiresAt.
const startsAt = moment.utc('2020-06-02T17:00:00.248Z').local();
const expiresAt = moment.utc('2020-06-03T19:00:00.248Z').local();

// Format startsAt and expiresAt.
const formattedStartsAt = startsAt.format('dddd M/D, h:mm a');
const formattedExpiresAt = expiresAt.format('dddd M/D, h:mm a');

// Derive the how long the downtime will be in hours.
const duration = moment.duration(expiresAt.diff(startsAt));
const hours = duration.asHours();

export default {
  id: '1',
  startsAt,
  expiresAt,
  title: 'Site maintenance',
  content:
    "We’re working on VA.gov right now. If you have trouble signing in or using tools, check back after we're finished. Thank you for your patience.",
  warnStartsAt: startsAt.clone().subtract(12, 'hours'),
  warnTitle: 'Upcoming site maintenance',
  warnContent: `We’ll be doing some work on VA.gov. The maintenance will last ${hours} hour(s). During that time, you won’t be able to sign in or use tools.`,
};
