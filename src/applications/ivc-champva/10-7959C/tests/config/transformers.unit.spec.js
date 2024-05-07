import { expect } from 'chai';
import formConfig from '../../config/form';
import mockData from '../fixtures/data/test-data.json';

import transformForSubmit from '../../config/submitTransformer';
import { prefillTransformer } from '../../config/prefillTransformer';

describe('Prefill transformer', () => {
  it('should return pages, formData, and metadata', () => {
    const result = prefillTransformer({}, {}, {});
    expect(
      ['pages', 'formData', 'metadata'].every(k =>
        Object.keys(result).includes(k),
      ),
    ).to.be.true;
  });
});

describe('Submit transformer', () => {
  it('should add the form number to the data', () => {
    const result = JSON.parse(transformForSubmit(formConfig, mockData));
    expect(result.form_number).to.equal(formConfig.formId);
  });
  it('should set `hasOtherHealthInsurance` to true if applicant has either primary or secondary', () => {
    expect(
      JSON.parse(
        transformForSubmit(formConfig, {
          data: {
            ...mockData.data,
            applicantHasPrimary: true,
            applicantHasSecondary: false,
          },
        }),
      ).hasOtherHealthInsurance,
    ).to.be.true;
    expect(
      JSON.parse(
        transformForSubmit(formConfig, {
          data: {
            ...mockData.data,
            applicantHasPrimary: false,
            applicantHasSecondary: true,
          },
        }),
      ).hasOtherHealthInsurance,
    ).to.be.true;
  });
});
