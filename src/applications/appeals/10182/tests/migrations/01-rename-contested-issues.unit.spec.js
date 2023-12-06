import { expect } from 'chai';
import renameContestedIssues from '../../migrations/01-rename-contested-issues.js';

describe('NOD rename contestedIsuses migration', () => {
  it('should return migrated data', () => {
    const issues = [
      {
        type: 'contestableIssue',
        attributes: {
          ratingIssueSubjectText: 'tinnitus',
          approxDecisionDate: '2021-6-1',
          decisionIssueId: 1,
          ratingIssueReferenceId: '2',
          ratingDecisionReferenceId: '3',
          ratingIssuePercentNumber: '10',
        },
        'view:selected': true,
      },
      {
        type: 'contestableIssue',
        attributes: {
          ratingIssueSubjectText: 'left knee',
          approxDecisionDate: '2021-6-2',
        },
        'view:selected': false,
      },
    ];

    const getData = key => ({
      formData: {
        other: {},
        bool: true,
        [key]: issues,
      },
      metadata: {
        version: 1,
      },
    });
    const original = getData('contestableIssues');
    const result = getData('contestedIssues');
    expect(renameContestedIssues(original)).to.deep.equal(result);
  });
});
