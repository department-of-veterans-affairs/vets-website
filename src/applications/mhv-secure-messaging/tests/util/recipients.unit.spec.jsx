import { expect } from 'chai';
import { getUniqueTriageGroups } from '../../util/recipients';

describe('getUniqueTriageGroups', () => {
  it('should return unique triage groups sorted by sentDate in descending order', () => {
    const threadList = [
      {
        recipientId: '1',
        triageGroupName: 'Group A',
        sentDate: '2025-05-01T10:00:00Z',
      },
      {
        recipientId: '2',
        triageGroupName: 'Group B',
        sentDate: '2025-05-02T10:00:00Z',
      },
      {
        recipientId: '1',
        triageGroupName: 'Group A',
        sentDate: '2025-05-03T10:00:00Z',
      },
    ];

    const result = getUniqueTriageGroups(threadList);

    expect(result).to.deep.equal([
      {
        triageGroupName: 'Group B',
        sentDate: '2025-05-02T10:00:00Z',
        triageGroupId: '2',
      },
      {
        triageGroupName: 'Group A',
        sentDate: '2025-05-01T10:00:00Z',
        triageGroupId: '1',
      },
    ]);
  });

  it('should return an empty array if threadList is empty', () => {
    const threadList = [];
    const result = getUniqueTriageGroups(threadList);
    expect(result).to.deep.equal([]);
  });

  it('should handle threads with the same sentDate correctly', () => {
    const threadList = [
      {
        recipientId: '1',
        triageGroupName: 'Group A',
        sentDate: '2025-05-01T10:00:00Z',
      },
      {
        recipientId: '2',
        triageGroupName: 'Group B',
        sentDate: '2025-05-01T10:00:00Z',
      },
    ];

    const result = getUniqueTriageGroups(threadList);

    expect(result).to.deep.equal([
      {
        triageGroupName: 'Group A',
        sentDate: '2025-05-01T10:00:00Z',
        triageGroupId: '1',
      },
      {
        triageGroupName: 'Group B',
        sentDate: '2025-05-01T10:00:00Z',
        triageGroupId: '2',
      },
    ]);
  });
});
