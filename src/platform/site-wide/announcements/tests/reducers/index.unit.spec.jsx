import { expect } from 'chai';

import * as announcementActions from '../../actions';
import reducer from '../../reducers';

describe('announcementsReducer', () => {
  let state;
  let action;

  beforeEach(() => {
    state = undefined;
    action = { type: 'NOT_RELEVANT' };
  });

  it('defaults isInitialized to false', () => {
    const newState = reducer(state, action);
    expect(newState.isInitialized).to.be.false;
  });

  it('flips isInitialized to true when the init action is dispatched', () => {
    action = {
      type: announcementActions.INIT_DISMISSED_ANNOUNCEMENTS,
      dismissedAnnouncements: ['dummy'],
    };
    const newState = reducer(state, action);
    expect(newState.isInitialized).to.be.true;
    expect(newState.dismissed).to.be.deep.equal(['dummy']);
  });

  it('adds dismissed announcements into state', () => {
    action = {
      type: announcementActions.DISMISS_ANNOUNCEMENT,
      announcement: 'dummy',
    };
    let newState = reducer(state, action);
    expect(newState.dismissed).to.be.deep.equal(['dummy']);

    action.announcement = 'dummy2';
    newState = reducer(newState, action);
    expect(newState.dismissed).to.be.deep.equal(['dummy', 'dummy2']);
  });
});
