import { expect } from 'chai';

import { checkValidations } from '../../validations';
import { missingIssueName } from '../../validations/issues';
import errorMessages from '../../content/errorMessages';

describe('checkValidations', () => {
  it('should return error messages', () => {
    expect(checkValidations([missingIssueName], '')).to.deep.equal([
      errorMessages.missingIssue, // simple validation function
    ]);
    expect(
      checkValidations([missingIssueName, missingIssueName], ''),
    ).to.deep.equal([errorMessages.missingIssue, errorMessages.missingIssue]);
  });
});
