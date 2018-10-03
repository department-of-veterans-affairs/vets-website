import localStorage from '../../../utilities/storage/localStorage';

export const INIT_DISMISSED_ANNOUNCEMENTS = 'INIT_DISMISSED_ANNOUNCEMENTS';
export const DISMISS_ANNOUNCEMENT = 'DISMISS_ANNOUNCEMENT';

export const ANNOUNCEMENTS_LOCAL_STORAGE = 'DISMISSED_ANNOUNCEMENTS';

function localAnnouncements(dismissedAnnouncementName) {
  const fromLocalStorage = localStorage.getItem(ANNOUNCEMENTS_LOCAL_STORAGE);
  let parsed = [];

  if (fromLocalStorage) {
    try {
      parsed = JSON.parse(fromLocalStorage);
    } catch (err) {
      // Value will default to an empty array
    }
  }

  if (dismissedAnnouncementName) {
    parsed.push(dismissedAnnouncementName);
    localStorage.setItem(ANNOUNCEMENTS_LOCAL_STORAGE, JSON.stringify(parsed));
  }

  return parsed;
}

export function initDismissedAnnouncements() {
  return {
    type: INIT_DISMISSED_ANNOUNCEMENTS,
    dismissedAnnouncements: localAnnouncements(),
  };
}

export function dismissAnnouncement(announcement) {
  localAnnouncements(announcement);
  return {
    type: DISMISS_ANNOUNCEMENT,
    announcement,
  };
}
