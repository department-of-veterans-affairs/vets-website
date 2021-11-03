import { expect } from 'chai';

import formConfig from '../../config/form';

import { transform } from '../../config/submit-transformer';

import minimalDataV1 from '../fixtures/data/minimal-test-v1.json';
import maximalDataV1 from '../fixtures/data/maximal-test-v1.json';
import oneConferenceTimeDataV1 from '../fixtures/data/one-conference-time-test-v1.json';

import transformedMinimalDataV1 from '../fixtures/data/transformed/minimal-test-v1.json';
import transformedMaximalDataV1 from '../fixtures/data/transformed/maximal-test-v1.json';
import transformedOneConferenceTimeDataV1 from '../fixtures/data/transformed/one-conference-time-test-v1.json';

import maximalDataV2 from '../fixtures/data/maximal-test-v2.json';
import transformedMaximalDataV2 from '../fixtures/data/transformed/maximal-test-v2.json';

describe('transform', () => {
  it('should transform v1 minimal-test.json correctly', () => {
    const transformedResult = JSON.parse(transform(formConfig, minimalDataV1));
    // copy over variables that change based on date & location
    transformedResult.data.attributes.veteran.timezone = 'America/Chicago';

    expect(transformedResult).to.deep.equal(transformedMinimalDataV1);
  });
  it('should transform v1 maximal-test.json correctly', () => {
    const transformedResult = JSON.parse(transform(formConfig, maximalDataV1));
    // copy over variables that change based on date & location
    transformedResult.data.attributes.veteran.timezone = 'America/Los_Angeles';

    expect(transformedResult).to.deep.equal(transformedMaximalDataV1);
  });
  it('should transform v1 one-conference-time.json correctly', () => {
    const transformedResult = JSON.parse(
      transform(formConfig, oneConferenceTimeDataV1),
    );
    // copy over variables that change based on date & location
    transformedResult.data.attributes.veteran.timezone = 'America/Phoenix';

    expect(transformedResult).to.deep.equal(transformedOneConferenceTimeDataV1);
  });

  it('should transform v2 maximal-test.json correctly', () => {
    const transformedResult = JSON.parse(transform(formConfig, maximalDataV2));
    // copy over variables that change based on date & location
    transformedResult.data.attributes.veteran.timezone = 'America/Los_Angeles';

    expect(transformedResult).to.deep.equal(transformedMaximalDataV2);
  });
});
