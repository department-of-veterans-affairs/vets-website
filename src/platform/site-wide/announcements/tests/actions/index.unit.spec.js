import { expect } from 'chai';

import localStorage from '../../../../utilities/storage/localStorage';

import * as announcementActions from '../../actions';

const hooks = {
  beforeEach() {
    localStorage.removeItem(announcementActions.ANNOUNCEMENTS_LOCAL_STORAGE);
  },
};

describe('initDismissedAnnouncements', () => {
  beforeEach(hooks.beforeEach);

  it('returns dismissed announcements from localStorage', () => {
    let result = announcementActions.initDismissedAnnouncements();
    expect(result).to.be.deep.equal({
      type: announcementActions.INIT_DISMISSED_ANNOUNCEMENTS,
      dismissedAnnouncements: [],
    });

    // Repeat the test, with a value in localStorage.
    localStorage.setItem(
      announcementActions.ANNOUNCEMENTS_LOCAL_STORAGE,
      JSON.stringify(['dummy1']),
    );
    result = announcementActions.initDismissedAnnouncements();

    expect(result).to.be.deep.equal({
      type: announcementActions.INIT_DISMISSED_ANNOUNCEMENTS,
      dismissedAnnouncements: ['dummy1'],
    });
  });
});

describe('dismissAnnouncement', () => {
  beforeEach(hooks.beforeEach);

  it('adds dismissed announcements into localStorage', () => {
    let result = announcementActions.dismissAnnouncement('dummy');
    expect(result).to.be.deep.equal({
      type: announcementActions.DISMISS_ANNOUNCEMENT,
      announcement: 'dummy',
    });

    // initDismissedAnnouncements should now pull that announcement from localStorage
    result = announcementActions.initDismissedAnnouncements();
    expect(result).to.be.deep.equal({
      type: announcementActions.INIT_DISMISSED_ANNOUNCEMENTS,
      dismissedAnnouncements: ['dummy'],
    });
  });
});
