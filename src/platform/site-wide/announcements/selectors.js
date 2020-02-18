// Node modules.
import moment from 'moment';
// Relative imports.
import _config from './config';

// Checks if the announcement has expired.
const isExpiredAnnouncement = announcement => {
  if (!announcement.expiresAt) return true;

  const expiresAtDate = moment(announcement.expiresAt);
  const hasExpired = moment().isSameOrAfter(expiresAtDate);

  return !hasExpired;
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
      .filter(isExpiredAnnouncement)
      .filter(a => !announcements.dismissed.includes(a.name))
      .find(a => a.paths.test(path));
  }

  return announcement;
};
