// Node modules.
import moment from 'moment';
// Relative imports.
import _config from './config';

// Checks if the announcement has started.
const isStarted = announcement => {
  const { startsAt } = announcement;
  console.log('Name: ', announcement.name);

  // Assume announcement is valid if startsAt was NOT provided.
  if (!startsAt) {
    console.log('does not have startsAt', announcement.startsAt);
    return true;
  }

  // Derive if the announcement has started.
  const startsAtDate = moment(startsAt);
  const hasStarted = moment().isSameOrAfter(startsAtDate);

  // Announcement has not started.
  if (!hasStarted) {
    console.log('has NOT started', startsAtDate.format('YYYY-MM-DD h:mm a'));
    return false;
  }

  // Announcement has started.
  console.log('has started', startsAtDate.format('YYYY-MM-DD h:mm a'));
  return true;
};

// Checks if the announcement has expired.
const isNotExpired = announcement => {
  const { expiresAt } = announcement;
  console.log('Name: ', announcement.name);

  // Assume announcement is valid if expiresAt was NOT provided.
  if (!expiresAt) {
    console.log('does not have expiresAt', announcement.expiresAt);
    return true;
  }

  // Derive if the announcement has expired.
  const expiresAtDate = moment(expiresAt);
  const hasExpired = moment().isSameOrAfter(expiresAtDate);

  // Announcement has not expired.
  if (!hasExpired) {
    console.log('has NOT expired', expiresAtDate.format('YYYY-MM-DD h:mm a'));
    return true;
  }

  // Announcement has expired.
  console.log('has expired', expiresAtDate.format('YYYY-MM-DD h:mm a'));
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
