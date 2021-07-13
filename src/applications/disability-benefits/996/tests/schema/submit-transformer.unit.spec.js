import { expect } from 'chai';

import formConfig from '../../config/form';

import { transform } from '../../config/submit-transformer';

import minimalData from '../fixtures/data/minimal-test.json';
import maximalData from '../fixtures/data/maximal-test.json';
import oneConferenceTimeData from '../fixtures/data/one-conference-time-test.json';

import transformedMinimalData from '../fixtures/data/transformed-minimal-test.json';
import transformedMaximalData from '../fixtures/data/transformed-maximal-test.json';
import transformedOneConferenceTimeData from '../fixtures/data/transformed-one-conference-time-test.json';

describe('transform', () => {
  it('should transform minimal-test.json correctly', () => {
    const transformedResult = JSON.parse(transform(formConfig, minimalData));
    // copy over variables that change based on date & location
    transformedResult.data.attributes.veteran.timezone = 'America/Chicago';

    expect(transformedResult).to.deep.equal(transformedMinimalData);
  });
  it('should transform maximal-test.json correctly', () => {
    const transformedResult = JSON.parse(transform(formConfig, maximalData));
    // copy over variables that change based on date & location
    transformedResult.data.attributes.veteran.timezone = 'America/Los_Angeles';

    expect(transformedResult).to.deep.equal(transformedMaximalData);
  });
  it('should transform one-conference-time.json correctly', () => {
    const transformedResult = JSON.parse(
      transform(formConfig, oneConferenceTimeData),
    );
    // copy over variables that change based on date & location
    transformedResult.data.attributes.veteran.timezone = 'America/Phoenix';

    expect(transformedResult).to.deep.equal(transformedOneConferenceTimeData);
  });
});
