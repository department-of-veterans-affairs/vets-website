import { expect } from 'chai';
import { scheduledDowntime } from '../../../src/js/common/reducers';
import {
  RECEIVE_SCHEDULED_DOWNTIME,
  SET_CURRENT_DOWNTIME_STATUS,
  UNSET_CURRENT_DOWNTIME_STATUS
} from '../../../src/js/common/actions';

describe('Common Reducer', () => {
  describe('scheduledDowntime', () => {
    const scheduledDowntimeInterface = ['isReady', 'values', 'status'];
    it('returns the initial state', () => {
      const result = scheduledDowntime(undefined, { type: 'SHOULD_NOT_MATTER' });
      expect(result).to.have.all.keys(scheduledDowntimeInterface);
    });
    it('flips the isReady flag and sets value when RECEIVE_SCHEDULED_DOWNTIME is dispatched', () => {
      const value = [];
      const action = { type: RECEIVE_SCHEDULED_DOWNTIME, value };
      const result = scheduledDowntime(undefined, action);

      expect(result).to.have.all.keys(scheduledDowntimeInterface);
      expect(result.values).to.be.equal(value);
    });
    it('sets status when SET_CURRENT_DOWNTIME_STATUS is dispatched', () => {
      const value = 'ok';
      const action = { type: SET_CURRENT_DOWNTIME_STATUS, value };
      const result = scheduledDowntime(undefined, action);

      expect(result).to.have.all.keys(scheduledDowntimeInterface);
      expect(result.status).to.be.equal(value);
    });
    it('sets status to null when UNSET_CURRENT_DOWNTIME_STATUS is dispatched', () => {
      const action = { type: UNSET_CURRENT_DOWNTIME_STATUS };
      const result = scheduledDowntime(undefined, action);

      expect(result).to.have.all.keys(scheduledDowntimeInterface);
      expect(result.status).to.be.empty;
    });
  });
});
