import { expect } from 'chai';
import renameContestedIssues from '../../migrations/01-rename-contested-issues';

describe('NOD rename contestedIsuses migration', () => {
  it('should return contestedIssues empty array', () => {
    const savedData = { formData: {}, metadata: { version: 1 } };
    const result = {
      formData: { contestedIssues: [] },
      metadata: { version: 1 },
    };
    expect(renameContestedIssues(savedData)).to.deep.equal(result);
  });
  it('should return unaltered saved data', () => {
    const data = {
      formData: {
        other: {},
        bool: true,
        contestedIssues: [],
      },
      metadata: {
        version: 1,
      },
    };
    expect(renameContestedIssues(data)).to.deep.equal(data);
  });
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
