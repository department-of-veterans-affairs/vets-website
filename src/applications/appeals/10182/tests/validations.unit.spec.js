import { expect } from 'chai';
import sinon from 'sinon';

import {
  requireIssue,
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
