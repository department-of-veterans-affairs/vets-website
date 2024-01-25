import { expect } from 'chai';
import getNameKeyForSignature from '../../helpers/signatureKeyName';

describe('Signature key name', () => {
  it('should be "veteransFullName" when certifierRole is "sponsor"', () => {
    expect(getNameKeyForSignature({ certifierRole: 'sponsor' })).to.equal(
      'veteransFullName',
    );
  });
  it('should be first applicant name when certifierRole is "applicant"', () => {
    expect(getNameKeyForSignature({ certifierRole: 'applicant' })).to.equal(
      'applicants[0].applicantName',
    );
  });
  it("should be the certifier's name when certifierRole is unspecified", () => {
    expect(getNameKeyForSignature({ certifierRole: 'other' })).to.equal(
      'certifierName',
    );
  });
});
