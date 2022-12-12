import { expect } from 'chai';

import localStorage from '../../../../utilities/storage/localStorage';
import sessionStorage from '../../../../utilities/storage/sessionStorage';
import { AnnouncementBehavior } from '../../constants';
import * as announcementActions from '../../actions';

describe('initDismissedAnnouncements', () => {
  beforeEach(() => {
    localStorage.removeItem(announcementActions.ANNOUNCEMENTS_LOCAL_STORAGE);
    sessionStorage.removeItem(
      announcementActions.ANNOUNCEMENTS_SESSION_STORAGE,
    );
  });

  it('returns an empty array from localStorage & sessionStorage', () => {
    const result = announcementActions.initDismissedAnnouncements();
    expect(result).to.be.deep.equal({
      type: announcementActions.INIT_DISMISSED_ANNOUNCEMENTS,
      dismissedAnnouncements: [],
    });
  });

  it('returns previously-dismissed announcements during startup', () => {
    localStorage.setItem(
      announcementActions.ANNOUNCEMENTS_LOCAL_STORAGE,
      JSON.stringify(['dummy1']),
    );

    sessionStorage.setItem(
      announcementActions.ANNOUNCEMENTS_SESSION_STORAGE,
      JSON.stringify(['dummy2']),
    );
    const result = announcementActions.initDismissedAnnouncements();

    expect(result).to.be.deep.equal({
      type: announcementActions.INIT_DISMISSED_ANNOUNCEMENTS,
      dismissedAnnouncements: ['dummy1', 'dummy2'],
    });
  });
});

describe('previouslyDismissedAnnouncements', () => {
  describe('getAll', () => {
    it('should initially return an empty array', () => {
      const dismissedAnnouncements = announcementActions.previouslyDismissedAnnouncements.getAll();
      expect(dismissedAnnouncements).length.to.be(0);
    });
  });

  describe('initializeFromLocalStorage', () => {
    beforeEach(() => {
      localStorage.removeItem(announcementActions.ANNOUNCEMENTS_LOCAL_STORAGE);
      sessionStorage.removeItem(
        announcementActions.ANNOUNCEMENTS_SESSION_STORAGE,
      );
    });

    it('should return an announcement name from localStorage when saved with SHOW_ONCE', () => {
      announcementActions.previouslyDismissedAnnouncements.save(
        'dummy1',
        AnnouncementBehavior.SHOW_ONCE,
      );
      const dismissedAnnouncements = announcementActions.previouslyDismissedAnnouncements.initializeFromLocalStorage();
      expect(dismissedAnnouncements).length.to.be(1);
    });

    it('should return an announcement name from sessionStorage when saved with SHOW_ONCE_PER_SESSION', () => {
      announcementActions.previouslyDismissedAnnouncements.save(
        'dummy2',
        AnnouncementBehavior.SHOW_ONCE_PER_SESSION,
      );
      const dismissedAnnouncements = announcementActions.previouslyDismissedAnnouncements.initializeFromSessionStorage();
      expect(dismissedAnnouncements).length.to.be(1);
    });
  });
});
