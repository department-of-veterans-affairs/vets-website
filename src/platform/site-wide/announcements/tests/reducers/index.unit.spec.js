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
    expect(newState.isInitialized).toBe(false);
  });

  it('flips isInitialized to true when the init action is dispatched', () => {
    action = {
      type: announcementActions.INIT_DISMISSED_ANNOUNCEMENTS,
      dismissedAnnouncements: ['dummy'],
    };
    const newState = reducer(state, action);
    expect(newState.isInitialized).toBe(true);
    expect(newState.dismissed).toEqual(['dummy']);
  });

  it('adds dismissed announcements into state', () => {
    action = {
      type: announcementActions.DISMISS_ANNOUNCEMENT,
      announcement: 'dummy',
    };
    let newState = reducer(state, action);
    expect(newState.dismissed).toEqual(['dummy']);

    action.announcement = 'dummy2';
    newState = reducer(newState, action);
    expect(newState.dismissed).toEqual(['dummy', 'dummy2']);
  });
});
