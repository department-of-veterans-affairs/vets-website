// Node modules.
import moment from 'moment';
// Relative imports.
import _config from './config';

// Checks if the announcement has started.
const isStarted = announcement => {
  const { startsAt } = announcement;

  // Assume announcement is valid if startsAt was NOT provided.
  if (!startsAt) {
    return true;
  }

  // Derive if the announcement has started.
  const startsAtDate = moment(startsAt);
  const hasStarted = moment().isSameOrAfter(startsAtDate);

  // Announcement has not started.
  if (!hasStarted) {
    return false;
  }

  // Announcement has started.
  return true;
};

// Checks if the announcement has expired.
const isNotExpired = announcement => {
  const { expiresAt } = announcement;

  // Assume announcement is valid if expiresAt was NOT provided.
  if (!expiresAt) {
    return true;
  }

  // Derive if the announcement has expired.
  const expiresAtDate = moment(expiresAt);
  const hasExpired = moment().isSameOrAfter(expiresAtDate);

  // Announcement has not expired.
  if (!hasExpired) {
    return true;
  }

  // Announcement has expired.
  return false;
};

export const selectAnnouncement = (
  state,
  config = _config,
  path = document.location.pathname,
) => {
  const announcements = state.announcements;
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
