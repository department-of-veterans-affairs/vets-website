import _config from './config';
import moment from 'moment';

function isExpiredAnnouncement(announcement) {
  if (!announcement.expiresAt) return true;

  const expirationDate = moment(announcement.expiresAt);
  const isExpired = moment().isSameOrAfter(expirationDate);

  return !isExpired;
}

export function selectAnnouncement(
  state,
  config = _config,
  path = document.location.pathname,
) {
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
}
