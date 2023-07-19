import { expect } from 'chai';

import formConfig from '../../config/form';

import { transform } from '../../config/submit-transformer';

import maximalData from '../fixtures/data/maximal-test.json';
import transformedMaximalData from '../fixtures/data/transformed-maximal-test.json';

import minimalData from '../fixtures/data/minimal-test.json';
import transformedMinimalData from '../fixtures/data/transformed-minimal-test.json';

import { SHOW_PART3 } from '../../constants';

describe('transform', () => {
  it('should transform maximal-test.json correctly', () => {
    const transformedResult = JSON.parse(transform(formConfig, maximalData));
    // copy over variables that change based on date & location
    transformedResult.data.attributes.timezone = 'America/Los_Angeles';

    expect(transformedResult).to.deep.equal(transformedMaximalData);
  });
  it('should transform minimal-test.json correctly', () => {
    const transformedResult = JSON.parse(transform(formConfig, minimalData));
    // copy over variables that change based on date & location
    transformedResult.data.attributes.timezone = 'America/Los_Angeles';

    expect(transformedResult).to.deep.equal(transformedMinimalData);
  });

  it('should transform maximal-test.json with part3 data correctly', () => {
    const data = { data: { [SHOW_PART3]: true, ...maximalData.data } };
    const transformedResult = JSON.parse(transform(formConfig, data));
    // copy over variables that change based on date & location
    transformedResult.data.attributes.timezone = 'America/Los_Angeles';

    expect(transformedResult).to.deep.equal({
      ...transformedMaximalData,
      data: {
        type: 'noticeOfDisagreement',
        attributes: {
          ...transformedMaximalData.data.attributes,
          requestingExtension: true,
          extensionReason: 'Lorem ipsum',
          appealingVhaDenial: false,
        },
      },
    });
  });
});
