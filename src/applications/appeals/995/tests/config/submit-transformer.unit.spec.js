import { expect } from 'chai';

import formConfig from '../../config/form';

import { transform } from '../../config/submit-transformer';

import maximalDataV2 from '../fixtures/data/maximal-test.json';
import transformedMaximalDataV2 from '../fixtures/data/transformed-maximal-test.json';

// skip until we add 4142 transforms
describe.skip('transform', () => {
  it('should transform v2 maximal-test.json correctly', () => {
    const transformedResult = JSON.parse(transform(formConfig, maximalDataV2));
    // copy over variables that change based on date & location
    transformedResult.data.attributes.veteran.timezone = 'America/Los_Angeles';

    expect(transformedResult).to.deep.equal(transformedMaximalDataV2);
  });
});
