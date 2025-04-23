import { expect } from 'chai';
import formConfig from '../../../config/form';
import transformForSubmit from '../../../config/submit-transformer';
import fixture from '../../e2e/fixtures/data/test-data.json';

// just including this unit-test for coverage
// submit-transformer currently doesn't transform any formData
const transformedFixture = {
  ...fixture,
  formNumber: '40-0247',
};

describe('transformForSubmit', () => {
  it('should transform json correctly', () => {
    const data = {
      data: fixture,
    };

    const transformedResult = JSON.parse(transformForSubmit(formConfig, data));
    expect(transformedResult).to.deep.equal(transformedFixture);
  });
});
