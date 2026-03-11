import { expect } from 'chai';
import sinon from 'sinon';
import {
  mockFetch,
  setFetchJSONFailure,
  setFetchJSONResponse,
} from '@department-of-veterans-affairs/platform-testing/helpers';

import { notificationsReducer } from '../reducers/notifications';
import {
  fetchNotifications,
  dismissNotificationById,
  NOTIFICATIONS_RECEIVED_STARTED,
  NOTIFICATIONS_RECEIVED_SUCCEEDED,
  NOTIFICATIONS_RECEIVED_FAILED,
  NOTIFICATION_DISMISSAL_STARTED,
  NOTIFICATION_DISMISSAL_SUCCEEDED,
  NOTIFICATION_DISMISSAL_FAILED,
} from '../actions/notifications';

let oldWindow;

const setup = () => {
  oldWindow = global.window;
  mockFetch();
  global.window = Object.create(global.window);
  Object.assign(global.window, {
    dataLayer: [],
    appName: 'test-app',
  });
};

const teardown = () => {
  global.window = oldWindow;
};

describe('notifications reducer and actions', () => {
  const mockNotificationsResponse = {
    data: [
      {
        id: '1',
        type: 'onsite_notification',
        attributes: {
          createdAt: '2023-05-15T19:00:00Z',
          dismissed: false,
          templateId: 'f9947b27-df3b-4b09-875c-7f76594d766d',
          updatedAt: '2023-05-15T19:00:00Z',
          vaProfileId: '1',
        },
      },
      {
        id: '2',
        type: 'onsite_notification',
        attributes: {
          createdAt: '2023-05-16T19:00:00Z',
          dismissed: true, // This should be filtered out
          templateId: 'f9947b27-df3b-4b09-875c-7f76594d766d',
          updatedAt: '2023-05-16T19:00:00Z',
          vaProfileId: '1',
        },
      },
    ],
  };

  const mockDismissResponse = {
    data: {
      id: '1',
      type: 'onsite_notification',
      attributes: {
        createdAt: '2023-05-15T19:00:00Z',
        dismissed: true,
        templateId: 'f9947b27-df3b-4b09-875c-7f76594d766d',
        updatedAt: '2023-05-15T19:00:00Z',
        vaProfileId: '1',
      },
    },
  };

  const mockErrorResponse = {
    errors: [
      {
        title: 'Server Error',
        detail: 'Internal server error',
        code: '500',
        status: '500',
      },
    ],
  };

  beforeEach(setup);
  afterEach(teardown);

  describe('fetchNotifications action', () => {
    it('dispatches success actions when API call succeeds', done => {
      setFetchJSONResponse(global.fetch.onCall(0), mockNotificationsResponse);

      const thunk = fetchNotifications();
      const dispatch = sinon.spy();
      const getState = () => ({});

      thunk(dispatch, getState)
        .then(() => {
          expect(dispatch.callCount).to.equal(1);

          const successAction = dispatch.firstCall.args[0];
          expect(successAction.type).to.equal(NOTIFICATIONS_RECEIVED_SUCCEEDED);
          expect(successAction.notifications).to.have.lengthOf(1);
          expect(successAction.notifications[0].id).to.equal('1');
        })
        .then(done, done);
    });

    it('dispatches failure actions when API returns errors', done => {
      setFetchJSONResponse(global.fetch.onCall(0), mockErrorResponse);

      const thunk = fetchNotifications();
      const dispatch = sinon.spy();
      const getState = () => ({});

      thunk(dispatch, getState)
        .then(() => {
          expect(dispatch.callCount).to.equal(1);

          const failureAction = dispatch.firstCall.args[0];
          expect(failureAction.type).to.equal(NOTIFICATIONS_RECEIVED_FAILED);
          expect(failureAction.notificationError).to.be.true;
          expect(failureAction.errors).to.equal(mockErrorResponse.errors);
        })
        .then(done, done);
    });

    it('throws error when API call throws error', done => {
      setFetchJSONFailure(global.fetch.onCall(0), new Error('Network error'));

      const thunk = fetchNotifications();
      const dispatch = sinon.spy();
      const getState = () => ({});

      thunk(dispatch, getState).catch(() => {
        expect(dispatch.callCount).to.equal(0);
        done();
      });
    });
  });

  describe('dismissNotificationById action', () => {
    it('dispatches success actions when dismissal succeeds', done => {
      setFetchJSONResponse(global.fetch.onCall(0), mockDismissResponse);

      const thunk = dismissNotificationById('1');
      const dispatch = sinon.spy();
      const getState = () => ({});

      thunk(dispatch, getState)
        .then(() => {
          expect(dispatch.callCount).to.equal(1);

          const successAction = dispatch.firstCall.args[0];
          expect(successAction.type).to.equal(NOTIFICATION_DISMISSAL_SUCCEEDED);
          expect(successAction.successful).to.be.true;
          expect(successAction.id).to.equal('1');
        })
        .then(done, done);
    });

    it('dispatches failure actions when API returns errors', done => {
      setFetchJSONResponse(global.fetch.onCall(0), mockErrorResponse);

      const thunk = dismissNotificationById('1');
      const dispatch = sinon.spy();
      const getState = () => ({});

      thunk(dispatch, getState)
        .then(() => {
          expect(dispatch.callCount).to.equal(1);

          const failureAction = dispatch.firstCall.args[0];
          expect(failureAction.type).to.equal(NOTIFICATION_DISMISSAL_FAILED);
          expect(failureAction.dismissalError).to.be.true;
          expect(failureAction.errors).to.equal(mockErrorResponse.errors);
        })
        .then(done, done);
    });

    it('dispatches failure actions when API call throws error', done => {
      setFetchJSONFailure(global.fetch.onCall(0), new Error('Network error'));

      const thunk = dismissNotificationById('1');
      const dispatch = sinon.spy();
      const getState = () => ({});

      thunk(dispatch, getState)
        .then(() => {
          expect(dispatch.callCount).to.equal(1);

          const failureAction = dispatch.firstCall.args[0];
          expect(failureAction.type).to.equal(NOTIFICATION_DISMISSAL_FAILED);
          expect(failureAction.dismissalError).to.be.true;
        })
        .then(done, done);
    });
  });

  describe('notificationsReducer', () => {
    it('returns initial state', () => {
      const state = notificationsReducer(undefined, {});
      expect(state).to.deep.equal({
        isLoading: false,
        notificationError: false,
        dismissalError: false,
        notifications: [],
      });
    });

    it('handles NOTIFICATIONS_RECEIVED_STARTED', () => {
      const action = { type: NOTIFICATIONS_RECEIVED_STARTED };
      const state = notificationsReducer(
        { notificationError: true, notifications: [{ id: '1' }] },
        action,
      );
      expect(state.isLoading).to.be.true;
      expect(state.notificationError).to.be.false;
      expect(state.notifications).to.deep.equal([{ id: '1' }]);
    });

    it('handles NOTIFICATIONS_RECEIVED_SUCCEEDED', () => {
      const action = {
        type: NOTIFICATIONS_RECEIVED_SUCCEEDED,
        notifications: [{ id: '1' }, { id: '2' }],
      };
      const state = notificationsReducer(
        { isLoading: true, notificationError: true },
        action,
      );
      expect(state.isLoading).to.be.false;
      expect(state.notificationError).to.be.false;
      expect(state.notifications).to.deep.equal([{ id: '1' }, { id: '2' }]);
    });

    it('handles NOTIFICATIONS_RECEIVED_FAILED', () => {
      const action = {
        type: NOTIFICATIONS_RECEIVED_FAILED,
        errors: [{ code: '500' }],
      };
      const state = notificationsReducer(
        { isLoading: true, notificationError: false },
        action,
      );
      expect(state.isLoading).to.be.false;
      expect(state.notificationError).to.be.true;
      expect(state.errors).to.deep.equal([{ code: '500' }]);
    });

    it('handles NOTIFICATION_DISMISSAL_STARTED', () => {
      const action = { type: NOTIFICATION_DISMISSAL_STARTED };
      const state = notificationsReducer(
        { dismissalError: true, notifications: [{ id: '1' }] },
        action,
      );
      expect(state.isLoading).to.be.true;
      expect(state.dismissalError).to.be.false;
      expect(state.notifications).to.deep.equal([{ id: '1' }]);
    });

    it('handles NOTIFICATION_DISMISSAL_SUCCEEDED', () => {
      const action = {
        type: NOTIFICATION_DISMISSAL_SUCCEEDED,
        id: '1',
        successful: true,
      };
      const state = notificationsReducer(
        {
          isLoading: true,
          dismissalError: true,
          notifications: [{ id: '1' }, { id: '2' }],
        },
        action,
      );
      expect(state.isLoading).to.be.false;
      expect(state.dismissalError).to.be.false;
      expect(state.successful).to.be.true;
      expect(state.notifications).to.have.lengthOf(1);
      expect(state.notifications[0].id).to.equal('2');
    });

    it('handles NOTIFICATION_DISMISSAL_FAILED', () => {
      const action = {
        type: NOTIFICATION_DISMISSAL_FAILED,
        errors: [{ code: '500' }],
      };
      const state = notificationsReducer(
        { isLoading: true, dismissalError: false },
        action,
      );
      expect(state.isLoading).to.be.false;
      expect(state.dismissalError).to.be.true;
      expect(state.errors).to.deep.equal([{ code: '500' }]);
    });
  });
});
