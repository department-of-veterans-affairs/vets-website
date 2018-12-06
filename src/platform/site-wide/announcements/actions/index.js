import localStorage from '../../../utilities/storage/localStorage';

export const INIT_DISMISSED_ANNOUNCEMENTS = 'INIT_DISMISSED_ANNOUNCEMENTS';
export const DISMISS_ANNOUNCEMENT = 'DISMISS_ANNOUNCEMENT';

export const ANNOUNCEMENTS_LOCAL_STORAGE = 'DISMISSED_ANNOUNCEMENTS';

const previouslyDismissedAnnouncements = (() => {
  let parsed = null;

  return {
    initializeFromLocalStorage() {
      parsed = [];

      const fromLocalStorage = localStorage.getItem(
        ANNOUNCEMENTS_LOCAL_STORAGE,
      );
      if (fromLocalStorage) {
        try {
          parsed = JSON.parse(fromLocalStorage);
        } catch (err) {
          // Value will default to an empty array
        }
      }
      return parsed;
    },

    getAll() {
      return parsed;
    },

    save(dismissedAnnouncementName) {
      parsed.push(dismissedAnnouncementName);
      localStorage.setItem(ANNOUNCEMENTS_LOCAL_STORAGE, JSON.stringify(parsed));
    },
  };
})();

export function initDismissedAnnouncements() {
  previouslyDismissedAnnouncements.initializeFromLocalStorage();
  return {
    type: INIT_DISMISSED_ANNOUNCEMENTS,
    dismissedAnnouncements: previouslyDismissedAnnouncements.getAll(),
  };
}

export function dismissAnnouncement(announcement, showEverytime) {
  if (!showEverytime) previouslyDismissedAnnouncements.save(announcement);

  return {
    type: DISMISS_ANNOUNCEMENT,
    announcement,
  };
}
