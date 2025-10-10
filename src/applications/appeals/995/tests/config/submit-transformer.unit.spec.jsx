import { expect } from 'chai';
import { transform } from '../../config/submit-transformer';
import comprehensiveData from '../fixtures/data/pre-api-comprehensive-test.json';
import transformedComprehensiveData from '../fixtures/data/transformed-comprehensive-test.json';
import noEvidence from '../fixtures/data/pre-api-no-evidence-test.json';
import transformedNoEvidence from '../fixtures/data/transformed-no-evidence-test.json';

describe('transform', () => {
  it('should transform pre-api-comprehensive-test.json correctly', () => {
    const transformedResult = JSON.parse(transform(comprehensiveData));
    // copy over variables that change based on date & location
    transformedResult.data.attributes.veteran.timezone = 'America/Los_Angeles';

    expect(transformedResult).to.deep.equal(transformedComprehensiveData);
  });

  it('should transform no evidence test correctly', () => {
    const transformedResult = JSON.parse(transform(noEvidence));
    // copy over variables that change based on date & location
    transformedResult.data.attributes.veteran.timezone = 'America/Los_Angeles';

    expect(transformedResult).to.deep.equal(transformedNoEvidence);
  });

  it('should set the benefitType to "compensation" for non-supported entries', () => {
    const data = {
      data: {
        ...comprehensiveData.data,
        benefitType: 'other',
      },
    };

    const transformedResult = JSON.parse(transform(data));
    // copy over variables that change based on date & location
    transformedResult.data.attributes.veteran.timezone = 'America/Los_Angeles';

    expect(transformedResult).to.deep.equal(transformedComprehensiveData);
  });
});
