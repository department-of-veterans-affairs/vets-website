// Node modules.
import moment from 'moment';

// Derive startsAt and expiresAt.
const startsAt = moment.utc('2020-06-04T17:00:00.248Z').local();
const expiresAt = moment.utc('2020-06-05T19:00:00.248Z').local();

export default {
  id: '1',
  startsAt,
  expiresAt,
  title: 'DS Logon is down for maintenance.',
  content:
    'DS Logon is down for maintenance. Please use ID.me or MyHealtheVet to sign in or use online tools.',
  warnStartsAt: startsAt.clone().subtract(12, 'hours'),
  warnTitle: 'DS Logon will be down for maintenance',
  warnContent: `DS Logon will be unavailable from ${startsAt.format(
    'dddd M/D, h:mm a',
  )} to ${expiresAt.format(
    'dddd M/D, h:mm a',
  )} Please use ID.me or MyHealtheVet to sign in or use online tools during this time.`,
};
