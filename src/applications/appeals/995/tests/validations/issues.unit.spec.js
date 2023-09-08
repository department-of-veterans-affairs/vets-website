import { expect } from 'chai';
import sinon from 'sinon';

import { getDate } from '../../utils/dates';
import {
  checkIssues,
  uniqueIssue,
  maxIssues,
  selectionRequired,
  missingIssueName,
  maxNameLength,
} from '../../validations/issues';

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
      contestedIssues: new Array(MAX_LENGTH.SELECTIONS + 1).fill(template),
    });
    expect(errors.addError.called).to.be.true;
  });
});

describe('selectionRequired', () => {
  const _ = null;
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
  it('should show not show an error when a contested issue is selected', () => {
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
