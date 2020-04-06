import { SET_NOTIFICATION, CLEAR_NOTIFICATION } from '../../actions';
import notificationsReducer from '../../reducers/notifications';

describe('notificationsReducer', () => {
  it('should set a notification', () => {
    const state = notificationsReducer(undefined, {
      type: SET_NOTIFICATION,
      message: {
        title: 'Testing',
        body: 'Body',
      },
    });

    expect(state.message.title).toBe('Testing');
    expect(state.message.body).toBe('Body');
  });
  it('should clear a notification', () => {
    const state = notificationsReducer(undefined, {
      type: CLEAR_NOTIFICATION,
    });

    expect(state.message).toBeNull();
  });
});
