import { expect } from 'chai';

import formConfig from '../../config/form';

import { transform } from '../../config/submit-transformer';

import maximalData from '../fixtures/data/maximal-test.json';
import transformedMaximalData from '../fixtures/data/transformed-maximal-test.json';

import minimalData from '../fixtures/data/minimal-test.json';
import transformedMinimalData from '../fixtures/data/transformed-minimal-test.json';

describe('transform', () => {
  it('should transform empty data correctly', () => {
    const transformedResult = JSON.parse(transform(formConfig, {}));
    // copy over variables that change based on date & location
    transformedResult.data.attributes.timezone = 'America/Los_Angeles';

    const emptyResult = {
      data: {
        attributes: {
          appealingVhaDenial: false,
          boardReviewOption: '',
          requestingExtension: false,
          socOptIn: false,
          timezone: 'America/Los_Angeles',
          veteran: {
            address: { zipCode5: '00000' },
            email: '',
            homeless: false,
            phone: {},
          },
        },
        type: 'noticeOfDisagreement',
      },
      included: [],
      nodUploads: [],
    };

    expect(transformedResult).to.deep.equal(emptyResult);
  });

  it('should transform maximal-test.json data correctly', () => {
    const data = { data: maximalData.data };
    const transformedResult = JSON.parse(transform(formConfig, data));
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
});
