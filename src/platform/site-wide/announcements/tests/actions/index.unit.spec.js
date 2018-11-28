import { expect } from 'chai';

import localStorage from '../../../../utilities/storage/localStorage';

import * as announcementActions from '../../actions';

describe('initDismissedAnnouncements', () => {
  beforeEach(() => {
    localStorage.removeItem(announcementActions.ANNOUNCEMENTS_LOCAL_STORAGE);
  });

  it('returns an empty array from localStorage', () => {
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

    const result = announcementActions.initDismissedAnnouncements();

    expect(result).to.be.deep.equal({
      type: announcementActions.INIT_DISMISSED_ANNOUNCEMENTS,
      dismissedAnnouncements: ['dummy1'],
    });
  });
});
