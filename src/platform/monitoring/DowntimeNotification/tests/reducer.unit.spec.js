import scheduledDowntime from '../reducer';
import {
  RECEIVE_GLOBAL_DOWNTIME,
  RECEIVE_SCHEDULED_DOWNTIME,
} from '../actions';

describe('Downtime Notification Reducer', () => {
  describe('scheduledDowntime', () => {
    const scheduledDowntimeInterface = [
      'globalDowntime',
      'isReady',
      'serviceMap',
      'isPending',
      'dismissedDowntimeWarnings',
    ];

    it('returns the initial state', () => {
      const result = scheduledDowntime(undefined, {
        type: 'SHOULD_NOT_MATTER',
      });
      expect(result).toEqual(
        expect.arrayContaining(scheduledDowntimeInterface),
      );
    });

    it('flips the isReady flag and sets value when RECEIVE_SCHEDULED_DOWNTIME is dispatched', () => {
      const action = { type: RECEIVE_SCHEDULED_DOWNTIME, data: [] };
      const result = scheduledDowntime(undefined, action);

      expect(result).toEqual(
        expect.arrayContaining(scheduledDowntimeInterface),
      );
      expect(result.serviceMap).toBeInstanceOf(Map);
    });

    describe('globalDowntime', () => {
      const downtime = {
        startTime: 'startTime',
        endTime: 'endTime',
      };

      it('updates global downtime when received', () => {
        const state = scheduledDowntime(undefined, {
          type: RECEIVE_GLOBAL_DOWNTIME,
          downtime,
        });

        expect(state.globalDowntime.startTime).toBe(downtime.startTime);
        expect(state.globalDowntime.endTime).toBe(downtime.endTime);
      });

      it('updates global downtime independently of scheduled downtime', () => {
        const initialState = {
          globalDowntime: null,
          isPending: false,
          isReady: false,
          serviceMap: null,
        };

        const state = scheduledDowntime(initialState, {
          type: RECEIVE_GLOBAL_DOWNTIME,
          downtime,
        });

        expect(state.isPending).toBe(false);
        expect(state.isReady).toBe(false);
        expect(state.serviceMap).toBeNull();
      });
    });
  });
});
