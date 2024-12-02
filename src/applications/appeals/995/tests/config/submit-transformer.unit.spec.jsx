import { expect } from 'chai';

import formConfig from '../../config/form';

import { transform } from '../../config/submit-transformer';

import maximalData from '../fixtures/data/maximal-test.json';
import transformedMaximalData from '../fixtures/data/transformed-maximal-test.json';

import noEvidence from '../fixtures/data/no-evidence-test.json';
import transformedNoEvidence from '../fixtures/data/transformed-no-evidence-test.json';

describe('transform', () => {
  it('should transform maximal-test.json correctly', () => {
    const transformedResult = JSON.parse(transform(formConfig, maximalData));
    // copy over variables that change based on date & location
    transformedResult.data.attributes.veteran.timezone = 'America/Los_Angeles';

    expect(transformedResult).to.deep.equal(transformedMaximalData);
  });

  it('should transform no evidence test correctly', () => {
    const transformedResult = JSON.parse(transform(formConfig, noEvidence));
    // copy over variables that change based on date & location
    transformedResult.data.attributes.veteran.timezone = 'America/Los_Angeles';

    expect(transformedResult).to.deep.equal(transformedNoEvidence);
  });

  it('should set the benefitType to "compensation" for non-supported entries', () => {
    const data = {
      data: {
        ...maximalData.data,
        benefitType: 'other',
      },
    };
    const transformedResult = JSON.parse(transform(formConfig, data));
    // copy over variables that change based on date & location
    transformedResult.data.attributes.veteran.timezone = 'America/Los_Angeles';

    expect(transformedResult).to.deep.equal(transformedMaximalData);
  });
});
