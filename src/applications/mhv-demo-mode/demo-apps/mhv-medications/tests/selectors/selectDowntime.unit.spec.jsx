import { expect } from 'chai';
import { selectScheduledDowntime } from '../../selectors/selectDowntime';

describe('selectScheduledDowntime', () => {
  it('returns serviceMap when present', () => {
    const state = {
      scheduledDowntime: {
        serviceMap: [{ id: 'foo' }, { id: 'bar' }],
      },
    };
    const result = selectScheduledDowntime(state);
    expect(result).to.deep.equal([{ id: 'foo' }, { id: 'bar' }]);
  });

  it('returns empty array when scheduledDowntime is missing', () => {
    const state = {};
    const result = selectScheduledDowntime(state);
    expect(result).to.deep.equal([]);
  });

  it('returns empty array when serviceMap is undefined', () => {
    const state = {
      scheduledDowntime: {},
    };
    const result = selectScheduledDowntime(state);
    expect(result).to.deep.equal([]);
  });
});
