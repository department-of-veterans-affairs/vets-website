import localStorage from '../../../utilities/storage/localStorage';
import sessionStorage from '../../../utilities/storage/sessionStorage';
import { AnnouncementBehavior } from '../constants';

export const INIT_DISMISSED_ANNOUNCEMENTS = 'INIT_DISMISSED_ANNOUNCEMENTS';
export const DISMISS_ANNOUNCEMENT = 'DISMISS_ANNOUNCEMENT';

export const ANNOUNCEMENTS_LOCAL_STORAGE = 'DISMISSED_ANNOUNCEMENTS';
export const ANNOUNCEMENTS_SESSION_STORAGE = 'DISMISSED_ANNOUNCEMENTS';

let dismissedOnce = [];
let dismissedPerSession = [];

export const previouslyDismissedAnnouncements = {
  initializeFromLocalStorage() {
    const fromLocalStorage = localStorage.getItem(ANNOUNCEMENTS_LOCAL_STORAGE);
    if (fromLocalStorage) {
      try {
        dismissedOnce = JSON.parse(fromLocalStorage);
      } catch (err) {
        // Value will default to an empty array
      }
    }
    return dismissedOnce;
  },

  initializeFromSessionStorage() {
    const fromSessionStorage = sessionStorage.getItem(
      ANNOUNCEMENTS_SESSION_STORAGE,
    );
    if (fromSessionStorage) {
      try {
        dismissedPerSession = JSON.parse(fromSessionStorage);
      } catch (err) {
        // Value will default to an empty array
      }
    }
    return dismissedPerSession;
  },

  save(dismissedAnnouncementName, show) {
    switch (show) {
      case AnnouncementBehavior.SHOW_ONCE:
        dismissedOnce.push(dismissedAnnouncementName);
        localStorage.setItem(
          ANNOUNCEMENTS_LOCAL_STORAGE,
          JSON.stringify(dismissedOnce),
        );
        break;
      case AnnouncementBehavior.SHOW_ONCE_PER_SESSION:
        dismissedPerSession.push(dismissedAnnouncementName);
        sessionStorage.setItem(
          ANNOUNCEMENTS_SESSION_STORAGE,
          JSON.stringify(dismissedPerSession),
        );
        break;
      default:
        break;
    }
  },
};

export function initDismissedAnnouncements() {
  const localStored = previouslyDismissedAnnouncements.initializeFromLocalStorage();
  const sessionStored = previouslyDismissedAnnouncements.initializeFromSessionStorage();
  return {
    type: INIT_DISMISSED_ANNOUNCEMENTS,
    dismissedAnnouncements: [...localStored, ...sessionStored],
  };
}

export function dismissAnnouncement(announcement, show) {
  if (
    show === AnnouncementBehavior.SHOW_ONCE ||
    show === AnnouncementBehavior.SHOW_ONCE_PER_SESSION
  ) {
    previouslyDismissedAnnouncements.save(announcement, show);
  }

  return {
    type: DISMISS_ANNOUNCEMENT,
    announcement,
  };
}
