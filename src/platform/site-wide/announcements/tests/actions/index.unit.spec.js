import { expect } from 'chai';

import * as announcementActions from '../../actions';

const old = {
  localStorage: global.window.localStorage
};

const hooks = {
  beforeEach() {
    global.window.localStorage = [];
  },
  after() {
    window.localStorage = old.localStorage;
  }
};

describe('initDismissedAnnouncements', () => {
  beforeEach(hooks.beforeEach);
  after(hooks.after);

  it('returns dismissed announcements from localStorage', () => {
    let result = announcementActions.initDismissedAnnouncements();
    expect(result).to.be.deep.equal({
      type: announcementActions.INIT_DISMISSED_ANNOUNCEMENTS,
      dismissedAnnouncements: []
    });

    // Repeat the test, with a value in localStorage.
    global.window.localStorage[announcementActions.ANNOUNCEMENTS_LOCAL_STORAGE] = JSON.stringify(['dummy1']);
    result = announcementActions.initDismissedAnnouncements();

    expect(result).to.be.deep.equal({
      type: announcementActions.INIT_DISMISSED_ANNOUNCEMENTS,
      dismissedAnnouncements: ['dummy1']
    });
  });
});

describe('dismissAnnouncement', () => {
  beforeEach(hooks.beforeEach);
  after(hooks.after);

  it('adds dismissed announcements into localStorage', () => {
    let result = announcementActions.dismissAnnouncement('dummy');
    expect(result).to.be.deep.equal({
      type: announcementActions.DISMISS_ANNOUNCEMENT,
      announcement: 'dummy'
    });

    // initDismissedAnnouncements should now pull that announcement from localStorage
    result = announcementActions.initDismissedAnnouncements();
    expect(result).to.be.deep.equal({
      type: announcementActions.INIT_DISMISSED_ANNOUNCEMENTS,
      dismissedAnnouncements: ['dummy']
    });
  });
});
