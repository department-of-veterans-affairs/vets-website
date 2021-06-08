import { expect } from 'chai';
import sinon from 'sinon';

import { getDate } from '../utils/dates';
import {
  requireIssue,
  validateDate,
  isValidDate,
  validAdditionalIssue,
  areaOfDisagreementRequired,
  optInValidation,
} from '../validations';
import { optInErrorMessage } from '../content/OptIn';
import { SELECTED } from '../constants';

describe('requireIssue validation', () => {
  const _ = undefined; // placeholder

  let errorMessage = '';
  const errors = {
    addError: message => {
      errorMessage = message || '';
    },
    additionalIssues: {
      addError: message => {
        errorMessage = message || '';
      },
    },
  };

  beforeEach(() => {
    errorMessage = '';
  });

  it('should show an error if no issues are selected', () => {
    requireIssue(errors, _, _, _, _, _, {});
    // errorMessage will contain JSX
    expect(errorMessage).to.not.equal('');
  });

  it('should show an error if no issues are selected', () => {
    const data = {
      contestableIssues: [{ [SELECTED]: false }, {}],
      additionalIssues: [{ [SELECTED]: false }, {}],
    };
    requireIssue(errors, _, _, _, _, _, data);
    // errorMessage will contain JSX
    expect(errorMessage).to.not.equal('');
  });

  it('should not show an error if a single contestable issue is selected', () => {
    const data = {
      contestableIssues: [{ [SELECTED]: true }, {}],
      additionalIssues: [{ [SELECTED]: false }, {}],
    };
    requireIssue(errors, _, _, _, _, _, data);
    expect(errorMessage).to.equal('');
  });
  it('should not show an error if a single added issue is selected', () => {
    const data = {
      contestableIssues: [{ [SELECTED]: false }, {}],
      additionalIssues: [{ [SELECTED]: true }, {}],
    };
    requireIssue(errors, _, _, _, _, _, data);
    expect(errorMessage).to.equal('');
  });

  it('should not show an error if a two issues are selected', () => {
    const data = {
      contestableIssues: [{ [SELECTED]: true }, {}],
      additionalIssues: [{ [SELECTED]: true }, {}],
    };
    requireIssue(errors, _, _, _, _, _, data);
    expect(errorMessage).to.equal('');
  });
});

describe('validAdditionalIssue', () => {
  it('should not show an error for valid additional issues', () => {
    const errors = { addError: sinon.spy() };
    expect(
      validAdditionalIssue(errors, {
        additionalIssues: [
          { issue: 'foo', decisionDate: getDate({ offset: { months: -1 } }) },
        ],
      }),
    );
    expect(errors.addError.called).to.be.false;
  });
  it('should show an error for additional issues with no name', () => {
    const errors = { addError: sinon.spy() };
    expect(
      validAdditionalIssue(errors, {
        additionalIssues: [
          { issue: '', decisionDate: getDate({ offset: { months: -1 } }) },
        ],
      }),
    );
    expect(errors.addError.called).to.be.true;
  });
  it('should show an error for additional issues with an empty decision date', () => {
    const errors = { addError: sinon.spy() };
    expect(
      validAdditionalIssue(errors, {
        additionalIssues: [{ issue: 'test', decisionDate: '' }],
      }),
    );
    expect(errors.addError.called).to.be.true;
  });
  it('should show an error for additional issues with an old decision date', () => {
    const errors = { addError: sinon.spy() };
    expect(
      validAdditionalIssue(errors, {
        additionalIssues: [
          { issue: 'test', decisionDate: getDate({ offset: { months: -15 } }) },
        ],
      }),
    );
    expect(errors.addError.called).to.be.true;
  });
});

describe('validateDate & isValidDate', () => {
  let errorMessage = '';
  const errors = {
    addError: message => {
      errorMessage = message || '';
    },
  };

  beforeEach(() => {
    errorMessage = '';
  });

  it('should allow valid dates', () => {
    const date = getDate({ offset: { weeks: -1 } });
    validateDate(errors, date);
    expect(errorMessage).to.equal('');
    expect(isValidDate(date)).to.be.true;
  });
  it('should throw a invalid date error', () => {
    validateDate(errors, '200');
    expect(errorMessage).to.contain('provide a valid date');
    expect(isValidDate('200')).to.be.false;
  });
  it('should throw a range error for dates too old', () => {
    validateDate(errors, '1899');
    expect(errorMessage).to.contain('enter a year between');
    expect(isValidDate('1899')).to.be.false;
  });
  it('should throw an error for dates in the future', () => {
    const date = getDate({ offset: { weeks: 1 } });
    validateDate(errors, date);
    expect(errorMessage).to.contain('past decision date');
    expect(isValidDate(date)).to.be.false;
  });
  it('should throw an error for dates more than a year in the past', () => {
    const date = getDate({ offset: { weeks: -60 } });
    validateDate(errors, date);
    expect(errorMessage).to.contain('date less than a year');
    expect(isValidDate(date)).to.be.false;
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

describe('optInValidation', () => {
  let errorMessage = '';
  const errors = {
    addError: message => {
      errorMessage = message || '';
    },
  };

  beforeEach(() => {
    errorMessage = '';
  });

  it('should show an error when the value is false', () => {
    optInValidation(errors, false);
    expect(errorMessage).to.equal(optInErrorMessage);
  });
  it('should not show an error when the value is true', () => {
    optInValidation(errors, true);
    expect(errorMessage).to.equal('');
  });
});
