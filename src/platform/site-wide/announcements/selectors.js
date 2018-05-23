import config from './config';

export function selectAnnouncement(state) {
  const announcements = state.announcements;
  let announcement = null;

  if (announcements.isInitialized) {
    const path = document.location.pathname;
    announcement = config.announcements.find(announcement => {
      const matchesPath = announcement.paths.test(path);
      const dismissed = announcements.dismissed.includes(announcement.name);
      return matchesPath && !dismissed;
    });
  }

  return announcement;
}
