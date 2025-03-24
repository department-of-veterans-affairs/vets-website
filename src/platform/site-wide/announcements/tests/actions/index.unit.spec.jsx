import { expect } from 'chai';

import localStorage from '../../../../utilities/storage/localStorage';
import sessionStorage from '../../../../utilities/storage/sessionStorage';
import { AnnouncementBehavior } from '../../constants';
import * as announcementActions from '../../actions';

describe('previouslyDismissedAnnouncements interface', () => {
  afterEach(() => {
    localStorage.removeItem(announcementActions.ANNOUNCEMENTS_LOCAL_STORAGE);
    sessionStorage.removeItem(
      announcementActions.ANNOUNCEMENTS_SESSION_STORAGE,
    );
  });

  it('should return an announcement name from localStorage when saved with SHOW_ONCE', () => {
    announcementActions.previouslyDismissedAnnouncements.save(
      'dummyA',
      AnnouncementBehavior.SHOW_ONCE,
    );
    let stored = localStorage.getItem(
      announcementActions.ANNOUNCEMENTS_LOCAL_STORAGE,
    );
    try {
      stored = JSON.parse(stored);
    } catch (err) {
      // Fail silently
    }
    expect(stored).to.contain('dummyA');
  });

  it('should return an announcement name from localStorage when saved with SHOW_ONCE_PER_SESSION', () => {
    announcementActions.previouslyDismissedAnnouncements.save(
      'dummyB',
      AnnouncementBehavior.SHOW_ONCE_PER_SESSION,
    );
    let stored = sessionStorage.getItem(
      announcementActions.ANNOUNCEMENTS_SESSION_STORAGE,
    );
    try {
      stored = JSON.parse(stored);
    } catch (err) {
      // Fail silently
    }
    expect(stored).to.contain('dummyB');
  });

  it('should return an announcement name when initialized from localStorage', () => {
    localStorage.setItem(
      announcementActions.ANNOUNCEMENTS_LOCAL_STORAGE,
      JSON.stringify(['dummyC']),
    );
    const dismissedAnnouncements = announcementActions.previouslyDismissedAnnouncements.initializeFromLocalStorage();
    expect(dismissedAnnouncements).length.to.be(1);
  });

  it('should return an announcement name when initialized from sessionStorage', () => {
    sessionStorage.setItem(
      announcementActions.ANNOUNCEMENTS_SESSION_STORAGE,
      JSON.stringify(['dummyD']),
    );
    const dismissedAnnouncements = announcementActions.previouslyDismissedAnnouncements.initializeFromSessionStorage();
    expect(dismissedAnnouncements).length.to.be(1);
  });
});
