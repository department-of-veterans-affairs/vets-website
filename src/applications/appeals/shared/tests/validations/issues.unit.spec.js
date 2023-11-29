import { expect } from 'chai';
import sinon from 'sinon';

import {
  maxIssues,
  uniqueIssue,
  missingIssueName,
  selectionRequired,
} from '../../validations/issues';

import { getDate } from '../../utils/dates';
import { SELECTED, MAX_LENGTH } from '../../constants';

const _ = null;

describe('uniqueIssue', () => {
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

describe('missingIssueName', () => {
  it('should show an error when a name is missing', () => {
    const errors = { addError: sinon.spy() };
    missingIssueName(errors);
    expect(errors.addError.called).to.be.true;
  });
  it('should show an error when a name is missing', () => {
    const errors = { addError: sinon.spy() };
    missingIssueName(errors, 'test');
    expect(errors.addError.called).to.be.false;
  });
});

describe('selectionRequired', () => {
  const getData = (selectContested = false, selectAdditional = false) => ({
    contestedIssues: [
      {
        attributes: {
          ratingIssueSubjectText: 'test',
          approxDecisionDate: '2021-01-01',
        },
        [SELECTED]: selectContested,
      },
    ],
    additionalIssues: [
      {
        issue: 'test 2',
        decisionDate: '2021-01-01',
        [SELECTED]: selectAdditional,
      },
    ],
  });
  it('should show an error when no issues are selected', () => {
    const errors = { addError: sinon.spy() };
    selectionRequired(errors, _, getData());
    expect(errors.addError.called).to.be.true;
  });
  it('should show not show an error when a contestable issue is selected', () => {
    const errors = { addError: sinon.spy() };
    selectionRequired(errors, _, getData(true));
    expect(errors.addError.called).to.be.false;
  });
  it('should show not show an error when an additional issue is selected', () => {
    const errors = { addError: sinon.spy() };
    selectionRequired(errors, _, getData(false, true));
    expect(errors.addError.called).to.be.false;
  });
});

describe('maxIssues', () => {
  it('should not show an error when the array length is less than max', () => {
    const errors = { addError: sinon.spy() };
    maxIssues(errors, []);
    expect(errors.addError.called).to.be.false;
  });
  it('should show not show an error when the array length is greater than max', () => {
    const errors = { addError: sinon.spy() };
    const validDate = getDate({ offset: { months: -2 } });
    const template = {
      issue: 'x',
      decisionDate: validDate,
      [SELECTED]: true,
    };
    maxIssues(errors, {
      contestedIssues: new Array(MAX_LENGTH.SELECTIONS + 1).fill(template),
    });
    expect(errors.addError.called).to.be.true;
  });
});
