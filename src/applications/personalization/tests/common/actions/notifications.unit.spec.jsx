import { expect } from 'chai';
import * as notificationsActions from '../../../common/actions/notifications';
import {
  NOTIFICATIONS_RECEIVED_STARTED,
  NOTIFICATIONS_RECEIVED_SUCCEEDED,
  NOTIFICATIONS_RECEIVED_FAILED,
  NOTIFICATION_DISMISSAL_STARTED,
  NOTIFICATION_DISMISSAL_SUCCEEDED,
  NOTIFICATION_DISMISSAL_FAILED,
  fetchNotifications,
  dismissNotificationById,
} from '../../../common/actions/notifications';

describe('notifications actions', () => {
  describe('action type constants', () => {
    it('should export NOTIFICATIONS_RECEIVED_STARTED constant', () => {
      expect(NOTIFICATIONS_RECEIVED_STARTED).to.equal(
        'NOTIFICATIONS_RECEIVED_STARTED',
      );
    });

    it('should export NOTIFICATIONS_RECEIVED_SUCCEEDED constant', () => {
      expect(NOTIFICATIONS_RECEIVED_SUCCEEDED).to.equal(
        'NOTIFICATIONS_RECEIVED_SUCCEEDED',
      );
    });

    it('should export NOTIFICATIONS_RECEIVED_FAILED constant', () => {
      expect(NOTIFICATIONS_RECEIVED_FAILED).to.equal(
        'NOTIFICATIONS_RECEIVED_FAILED',
      );
    });

    it('should export NOTIFICATION_DISMISSAL_STARTED constant', () => {
      expect(NOTIFICATION_DISMISSAL_STARTED).to.equal(
        'NOTIFICATION_DISMISSAL_STARTED',
      );
    });

    it('should export NOTIFICATION_DISMISSAL_SUCCEEDED constant', () => {
      expect(NOTIFICATION_DISMISSAL_SUCCEEDED).to.equal(
        'NOTIFICATION_DISMISSAL_SUCCEEDED',
      );
    });

    it('should export NOTIFICATION_DISMISSAL_FAILED constant', () => {
      expect(NOTIFICATION_DISMISSAL_FAILED).to.equal(
        'NOTIFICATION_DISMISSAL_FAILED',
      );
    });
  });

  describe('fetchNotifications', () => {
    it('should be a function', () => {
      expect(fetchNotifications).to.be.a('function');
    });

    it('should return an async function', () => {
      const action = fetchNotifications();
      expect(action).to.be.a('function');
    });

    it('should return a function that accepts dispatch', () => {
      const action = fetchNotifications();
      expect(action.length).to.equal(1);
    });
  });

  describe('dismissNotificationById', () => {
    it('should be a function', () => {
      expect(dismissNotificationById).to.be.a('function');
    });

    it('should return an async function when called with an ID', () => {
      const action = dismissNotificationById('123');
      expect(action).to.be.a('function');
    });

    it('should return a function that accepts dispatch', () => {
      const action = dismissNotificationById('123');
      expect(action.length).to.equal(1);
    });

    it('should accept any ID value', () => {
      const stringId = dismissNotificationById('string-id');
      const numId = dismissNotificationById(123);
      const complexId = dismissNotificationById('123-abc-xyz');

      expect(stringId).to.be.a('function');
      expect(numId).to.be.a('function');
      expect(complexId).to.be.a('function');
    });
  });

  describe('exported actions', () => {
    it('should export fetchNotifications', () => {
      expect(notificationsActions.fetchNotifications).to.exist;
      expect(notificationsActions.fetchNotifications).to.be.a('function');
    });

    it('should export dismissNotificationById', () => {
      expect(notificationsActions.dismissNotificationById).to.exist;
      expect(notificationsActions.dismissNotificationById).to.be.a('function');
    });

    it('should export all action constants', () => {
      expect(notificationsActions.NOTIFICATIONS_RECEIVED_STARTED).to.exist;
      expect(notificationsActions.NOTIFICATIONS_RECEIVED_SUCCEEDED).to.exist;
      expect(notificationsActions.NOTIFICATIONS_RECEIVED_FAILED).to.exist;
      expect(notificationsActions.NOTIFICATION_DISMISSAL_STARTED).to.exist;
      expect(notificationsActions.NOTIFICATION_DISMISSAL_SUCCEEDED).to.exist;
      expect(notificationsActions.NOTIFICATION_DISMISSAL_FAILED).to.exist;
    });
  });
});
