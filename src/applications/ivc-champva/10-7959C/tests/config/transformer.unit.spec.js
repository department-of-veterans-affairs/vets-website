/* eslint-disable camelcase */
import { expect } from 'chai';
import formConfig from '../../config/form';
import transformForSubmit from '../../config/submitTransformer';

describe('transform for submit', () => {
  it('should convert insurance types to list of boolean properties', () => {
    const testData = {
      data: {
        applicants: [
          {
            applicantPrimaryInsuranceType: 'hmo, medigap',
          },
        ],
      },
    };
    const transformed = JSON.parse(transformForSubmit(formConfig, testData));
    expect(
      JSON.stringify(transformed.applicants[0].applicantPrimaryInsuranceType),
    ).to.equal(
      JSON.stringify({
        is_hmo: true,
        is_medigap: true,
      }),
    );
  });
  it('should convert values of "yes" and "no" to booleans', () => {
    const testData = {
      data: {
        applicants: [
          {
            applicantPrimaryEOB: { providesEOB: 'yes' },
            applicantPrimaryThroughEmployer: { throughEmployer: 'no' },
          },
        ],
      },
    };
    const transformed = JSON.parse(transformForSubmit(formConfig, testData));
    expect(transformed.applicants[0].applicantPrimaryEOB.providesEOB).to.equal(
      true,
    );
    expect(
      transformed.applicants[0].applicantPrimaryThroughEmployer.throughEmployer,
    ).to.equal(false);
  });
});
