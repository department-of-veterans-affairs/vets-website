// Node modules.
import { isBefore } from 'date-fns';
// Relative imports.
import _config from './config';
import { parseStringOrDate } from '../../utilities/date';

// Checks if the announcement has started.
const isStarted = announcement => {
  const { startsAt } = announcement;

  // Assume announcement is valid if startsAt was NOT provided.
  if (!startsAt) {
    return true;
  }

  // Derive if the announcement has started.
  const startsAtDate = parseStringOrDate(startsAt);

  return isBefore(startsAtDate, new Date());
};

// Checks if the announcement has expired.
const isNotExpired = announcement => {
  const { expiresAt } = announcement;

  // Assume announcement is valid if expiresAt was NOT provided.
  if (!expiresAt) {
    return true;
  }

  // Derive if the announcement has expired.
  const expiresAtDate = parseStringOrDate(expiresAt);

  return isBefore(new Date(), expiresAtDate);
};

export const selectAnnouncement = (
  state,
  config = _config,
  path = document.location.pathname,
) => {
  const { announcements } = state;
  let announcement;

  if (announcements.isInitialized) {
    announcement = config.announcements
      .filter(a => !a.disabled)
      .filter(isStarted)
      .filter(isNotExpired)
      .filter(a => !announcements.dismissed.includes(a.name))
      .find(a => a.paths.test(path));
  }

  return announcement;
};
