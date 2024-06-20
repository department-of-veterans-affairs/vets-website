import { expect } from 'chai';
import { transformForSubmit } from 'platform/forms-system/src/js/helpers';
import { transform } from '../helpers';

describe('transform function', () => {
  it('should transform form data correctly', () => {
    const formConfig = { chapters: [] };
    const form = { data: {} };

    const result = transform(formConfig, form);
    const expectedFormData = transformForSubmit(formConfig, form);

    const expectedJson = JSON.stringify({
      educationBenefitsClaim: {
        form: expectedFormData,
      },
    });

    expect(result).to.equal(expectedJson);
  });
});
