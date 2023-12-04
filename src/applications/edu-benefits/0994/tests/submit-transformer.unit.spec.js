import { expect } from 'chai';
import _ from 'lodash';
import formConfig from '../config/form';
import { transform } from '../submit-transformer';
import maximal from './e2e/fixtures/data/maximal.json';

describe('transform', () => {
  it('should transform Form', () => {
    const clonedData = _.cloneDeep(maximal);
    const transformedResult = JSON.parse(transform(formConfig, clonedData));
    const form = JSON.parse(transformedResult.educationBenefitsClaim.form);
    expect(form).to.not.be.null;
  });
});
