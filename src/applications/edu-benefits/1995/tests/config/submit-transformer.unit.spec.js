import { expect } from 'chai';
import _ from 'lodash';
import formConfig from '../../config/form';
import { transform } from '../../config/submit-transformer';
import maximal from '../e2e/fixtures/data/maximal.json';

describe('transform', () => {
  it("should transform 'fryScholarship' 'chapter33FryScholarship' ", () => {
    const clonedData = _.cloneDeep(maximal);
    clonedData.data.benefit = 'fryScholarship';
    clonedData.data.benefitUpdate = 'fryScholarship';
    const transformedResult = JSON.parse(transform(formConfig, clonedData));
    const form = JSON.parse(transformedResult.educationBenefitsClaim.form);
    expect(form.benefit).to.deep.equal('chapter33FryScholarship');
    expect(form.benefitUpdate).to.deep.equal('chapter33FryScholarship');
  });

  it("should transform 'chapter33' 'chapter33Post911' ", () => {
    const clonedData = _.cloneDeep(maximal);
    clonedData.data.benefit = 'chapter33';
    clonedData.data.benefitUpdate = 'chapter33'; //
    const transformedResult = JSON.parse(transform(formConfig, clonedData));
    const form = JSON.parse(transformedResult.educationBenefitsClaim.form);
    expect(form.benefit).to.deep.equal('chapter33Post911');
    expect(form.benefitUpdate).to.deep.equal('chapter33Post911');
  });
});
