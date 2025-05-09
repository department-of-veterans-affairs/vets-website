import { expect } from 'chai';
import formConfig from '../../../config/form';

describe('fullNamePath', () => {
  it('should be `veteranFullName` when applicant is veteran', () => {
    expect(
      formConfig.preSubmitInfo.statementOfTruth.fullNamePath({
        claimantType: 'VETERAN',
      }),
    ).to.equal('veteranFullName');
  });
  it('should be `claimantFullName` when applicant is not veteran', () => {
    expect(
      formConfig.preSubmitInfo.statementOfTruth.fullNamePath({
        claimantType: 'SPOUSE',
      }),
    ).to.equal('claimantFullName');
  });
});
