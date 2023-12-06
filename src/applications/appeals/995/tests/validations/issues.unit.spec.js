import { expect } from 'chai';
import sinon from 'sinon';

import { checkIssues, maxNameLength } from '../../validations/issues';

import { MAX_LENGTH, SELECTED } from '../../../shared/constants';

describe('checkIssues', () => {
  const _ = null;
  const getData = ({
    ciSelect = true,
    ciName = 'Test',
    ciDate = '2021-01-01',
    aiSelect = true,
    aiName = 'Test 2',
    aiDate = '2021-01-01',
  } = {}) => ({
    contestedIssues: [
      {
        attributes: {
          ratingIssueSubjectText: ciName,
          approxDecisionDate: ciDate,
        },
        [SELECTED]: ciSelect,
      },
    ],
    additionalIssues: [
      {
        issue: aiName,
        decisionDate: aiDate,
        [SELECTED]: aiSelect,
      },
    ],
  });

  it('should not show an error when there are no issues', () => {
    const errors = { addError: sinon.spy() };
    checkIssues(errors, _, _, _, _, _, {});
    expect(errors.addError.notCalled).to.be.true;
  });
  it('should not show an error when there are valid selected issues', () => {
    const errors = { addError: sinon.spy() };
    checkIssues(errors, _, _, _, _, _, getData());
    expect(errors.addError.notCalled).to.be.true;
  });
  it('should not show an error with missing unselected contestable issue name', () => {
    const errors = { addError: sinon.spy() };
    checkIssues(
      errors,
      _,
      _,
      _,
      _,
      _,
      getData({ ciSelect: false, ciName: '' }),
    );
    expect(errors.addError.notCalled).to.be.true;
  });
  it('should show an error with missing selected contestable issues name', () => {
    const errors = { addError: sinon.spy() };
    checkIssues(errors, _, _, _, _, _, getData({ ciName: '' }));
    expect(errors.addError.called).to.be.true;
  });
  it('should not show an error with invalid unselected contestable issue date', () => {
    const errors = { addError: sinon.spy() };
    checkIssues(
      errors,
      _,
      _,
      _,
      _,
      _,
      getData({ ciSelect: false, ciDate: '2021-?-?' }),
    );
    expect(errors.addError.notCalled).to.be.true;
  });
  it('should show an error with invalid selected contestable issues date', () => {
    const errors = { addError: sinon.spy() };
    checkIssues(errors, _, _, _, _, _, getData({ ciDate: '2021-?-?' }));
    expect(errors.addError.called).to.be.true;
  });

  it('should not show an error with missing unselected additional issue name', () => {
    const errors = { addError: sinon.spy() };
    checkIssues(
      errors,
      _,
      _,
      _,
      _,
      _,
      getData({ aiSelect: false, aiName: '' }),
    );
    expect(errors.addError.notCalled).to.be.true;
  });
  it('should show an error with missing selected additional issues name', () => {
    const errors = { addError: sinon.spy() };
    checkIssues(errors, _, _, _, _, _, getData({ aiName: '' }));
    expect(errors.addError.called).to.be.true;
  });
  it('should not show an error with invalid unselected additional issue date', () => {
    const errors = { addError: sinon.spy() };
    checkIssues(
      errors,
      _,
      _,
      _,
      _,
      _,
      getData({ aiSelect: false, aiDate: '2021-?-?' }),
    );
    expect(errors.addError.notCalled).to.be.true;
  });
  it('should show an error with invalid selected additional issues date', () => {
    const errors = { addError: sinon.spy() };
    checkIssues(errors, _, _, _, _, _, getData({ aiDate: '2021-?-?' }));
    expect(errors.addError.called).to.be.true;
  });
});

describe('maxNameLength', () => {
  it('should show an error when a name is too long', () => {
    const errors = { addError: sinon.spy() };
    maxNameLength(errors, 'ab '.repeat(MAX_LENGTH.ISSUE_NAME / 2));
    expect(errors.addError.called).to.be.true;
  });
  it('should show an error when a name is not too long', () => {
    const errors = { addError: sinon.spy() };
    maxNameLength(errors, 'test');
    expect(errors.addError.called).to.be.false;
  });
});
