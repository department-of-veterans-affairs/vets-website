import _config from './config';

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
      .find(a => a.paths.test(path));

    if (announcement && announcements.dismissed.includes(announcement.name)) {
      announcement = null;
    }
  }

  return announcement;
}
