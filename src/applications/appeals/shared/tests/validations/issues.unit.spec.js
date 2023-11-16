import { expect } from 'chai';
import sinon from 'sinon';

import { uniqueIssue } from '../../validations';

describe('uniqueIssue', () => {
  const _ = null;
  const contestedIssues = [
    {
      attributes: {
        ratingIssueSubjectText: 'test',
        approxDecisionDate: '2021-01-01',
      },
    },
  ];

  it('should not show an error when there are no issues', () => {
    const errors = { addError: sinon.spy() };
    uniqueIssue(errors, _, _, _, _, _, {});
    expect(errors.addError.notCalled).to.be.true;
  });
  it('should not show an error when there are duplicate contested issues', () => {
    const errors = { addError: sinon.spy() };
    uniqueIssue(errors, _, _, _, _, _, {
      contestedIssues: [contestedIssues[0], contestedIssues[0]],
    });
    expect(errors.addError.notCalled).to.be.true;
  });
  it('should not show an error when there are no duplicate issues (only date differs)', () => {
    const errors = { addError: sinon.spy() };
    uniqueIssue(errors, _, _, _, _, _, {
      contestedIssues,
      additionalIssues: [{ issue: 'test', decisionDate: '2021-01-02' }],
    });
    expect(errors.addError.notCalled).to.be.true;
  });
  it('should show an error when there is a duplicate additional issue', () => {
    const errors = { addError: sinon.spy() };
    uniqueIssue(errors, _, _, _, _, _, {
      contestedIssues,
      additionalIssues: [{ issue: 'test', decisionDate: '2021-01-01' }],
    });
    expect(errors.addError.called).to.be.true;
  });
  it('should show an error when there are multiple duplicate additional issue', () => {
    const errors = { addError: sinon.spy() };
    uniqueIssue(errors, _, _, _, _, _, {
      contestedIssues,
      additionalIssues: [
        { issue: 'test2', decisionDate: '2021-02-01' },
        { issue: 'test2', decisionDate: '2021-02-01' },
      ],
    });
    expect(errors.addError.called).to.be.true;
  });
});
