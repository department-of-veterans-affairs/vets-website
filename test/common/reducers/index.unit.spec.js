import { expect } from 'chai';
import { scheduledDowntime } from '../../../src/js/common/reducers';
import { RECEIVE_SCHEDULED_DOWNTIME } from '../../../src/js/common/actions';

describe('Common Reducer', () => {
  describe('scheduledDowntime', () => {
    const scheduledDowntimeInterface = ['isReady', 'values'];
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
  });
});
