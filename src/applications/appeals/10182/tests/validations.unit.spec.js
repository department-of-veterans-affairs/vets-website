import { expect } from 'chai';

import { requireIssue, optInValidation } from '../validations';
import { missingIssuesErrorMessage } from '../content/contestableIssues';
import { optInErrorMessage } from '../content/OptIn';
import { SELECTED } from '../constants';

describe('requireIssue validation', () => {
  const _ = null; // placeholder

  let errorMessage = '';
  const errors = {
    addError: message => {
      errorMessage = message || '';
    },
  };

  beforeEach(() => {
    errorMessage = '';
  });

  it('should show an error if no issues are selected', () => {
    requireIssue(errors, _, _, _, _, _, {});
    expect(errorMessage).to.equal(missingIssuesErrorMessage);
  });

  it('should show an error if no issues are selected', () => {
    const data = {
      contestableIssues: [{ [SELECTED]: false }, {}],
      additionalIssues: [{ [SELECTED]: false }, {}],
    };
    requireIssue(errors, _, _, _, _, _, data);
    expect(errorMessage).to.equal(missingIssuesErrorMessage);
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
