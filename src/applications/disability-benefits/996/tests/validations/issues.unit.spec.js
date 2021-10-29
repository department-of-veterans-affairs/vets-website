import { expect } from 'chai';
import sinon from 'sinon';

import { getDate } from '../../utils/dates';
import { SELECTED, MAX_SELECTIONS } from '../../constants';

import {
  uniqueIssue,
  maxIssues,
  areaOfDisagreementRequired,
} from '../../validations/issues';

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
      contestedIssues: new Array(MAX_SELECTIONS + 1).fill(template),
    });
    expect(errors.addError.called).to.be.true;
  });
});

describe('areaOfDisagreementRequired', () => {
  it('should show an error with no selections', () => {
    const errors = { addError: sinon.spy() };
    areaOfDisagreementRequired(errors);
    expect(errors.addError.called).to.be.true;
  });
  it('should show an error with other selected, but no entry text', () => {
    const errors = { addError: sinon.spy() };
    areaOfDisagreementRequired(errors, {
      disagreementOptions: { other: true },
    });
    expect(errors.addError.called).to.be.true;
  });
  it('should not show an error with a single selection', () => {
    const errors = { addError: sinon.spy() };
    areaOfDisagreementRequired(errors, { disagreementOptions: { foo: true } });
    expect(errors.addError.called).to.be.false;
  });
  it('should not show an error with other selected with entry text', () => {
    const errors = { addError: sinon.spy() };
    areaOfDisagreementRequired(errors, {
      disagreementOptions: { other: true },
      otherEntry: 'foo',
    });
    expect(errors.addError.called).to.be.false;
  });
});
