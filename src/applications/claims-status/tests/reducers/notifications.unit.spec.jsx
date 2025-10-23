import { expect } from 'chai';
import {
  SET_NOTIFICATION,
  CLEAR_NOTIFICATION,
  SET_ADDITIONAL_EVIDENCE_NOTIFICATION,
  CLEAR_ADDITIONAL_EVIDENCE_NOTIFICATION,
} from '../../actions/types';
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

    expect(state.message.title).to.equal('Testing');
    expect(state.message.body).to.equal('Body');
  });

  it('should clear a notification', () => {
    const state = notificationsReducer(undefined, {
      type: CLEAR_NOTIFICATION,
    });

    expect(state.message).to.be.null;
  });

  it('should set additional evidence notification', () => {
    const state = notificationsReducer(undefined, {
      type: SET_ADDITIONAL_EVIDENCE_NOTIFICATION,
      message: {
        title: 'Testing',
        body: 'Body',
      },
    });

    expect(state.additionalEvidenceMessage.title).to.equal('Testing');
    expect(state.additionalEvidenceMessage.body).to.equal('Body');
  });

  it('should clear additional evidence notification', () => {
    const state = notificationsReducer(undefined, {
      type: CLEAR_ADDITIONAL_EVIDENCE_NOTIFICATION,
    });

    expect(state.additionalEvidenceMessage).to.be.null;
  });
});
