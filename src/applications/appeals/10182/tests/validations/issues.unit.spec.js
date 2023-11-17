import { expect } from 'chai';
import sinon from 'sinon';

import { maxNameLength } from '../../validations/issues';

import { MAX_LENGTH, SELECTED } from '../../../shared/constants';
import { selectionRequired } from '../../../shared/validations/issues';

const _ = null;

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

describe('maxNameLength', () => {
  it('should show an error when a name is too long', () => {
    const errors = { addError: sinon.spy() };
    maxNameLength(errors, 'ab '.repeat(MAX_LENGTH.NOD_ISSUE_NAME / 2));
    expect(errors.addError.called).to.be.true;
  });
  it('should show an error when a name is not too long', () => {
    const errors = { addError: sinon.spy() };
    maxNameLength(errors, 'test');
    expect(errors.addError.called).to.be.false;
  });
});
