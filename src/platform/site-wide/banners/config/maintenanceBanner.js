// Node modules.
import { addHours, subHours, differenceInHours } from 'date-fns';

// Derive startsAt and expiresAt. UTC is 4 hours ahead of ET.
const startsAt = new Date('2020-06-09T14:00:00.014Z');
const expiresAt = addHours(startsAt, 24);

// Derive the how long the downtime will be in hours.
const hours = differenceInHours(expiresAt, startsAt);

export default {
  id: '1',
  startsAt,
  expiresAt,
  title: 'Site maintenance',
  content:
    "We’re working on VA.gov right now. If you have trouble signing in or using tools, check back after we're finished. Thank you for your patience.",
  warnStartsAt: subHours(startsAt, 12),
  warnTitle: 'Upcoming site maintenance',
  warnContent: `We’ll be doing some work on VA.gov. The maintenance will last ${hours} hour${
    hours > 1 ? 's' : ''
  }. During that time, you won’t be able to sign in or use tools.`,
};
