import { expect } from 'chai';

import cloneDeep from 'platform/utilities/data/cloneDeep';

import formConfig from '../../config/form';

import { transform } from '../../config/submit-transformer';

import maximalData from '../fixtures/data/maximal-test.json';
import transformedMaximalData from '../fixtures/data/transformed-maximal-test.json';

import minimalData from '../fixtures/data/minimal-test.json';
import transformedMinimalData from '../fixtures/data/transformed-minimal-test.json';

import { SHOW_PART3 } from '../../constants';

describe('transform', () => {
  it('should transform empty data correctly', () => {
    const transformedResult = JSON.parse(transform(formConfig, {}));
    // copy over variables that change based on date & location
    transformedResult.data.attributes.timezone = 'America/Los_Angeles';

    const emptyResult = {
      data: {
        attributes: {
          boardReviewOption: '',
          socOptIn: false,
          timezone: 'America/Los_Angeles',
          veteran: {
            address: { zipCode5: '00000' },
            emailAddressText: '',
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
  it('should transform maximal-test.json correctly', () => {
    const data = { data: { ...maximalData.data, [SHOW_PART3]: false } };
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

  it('should transform maximal-test.json with part3 data correctly', () => {
    const data = { data: { ...maximalData.data, [SHOW_PART3]: true } };
    const transformedResult = JSON.parse(transform(formConfig, data));
    // copy over variables that change based on date & location
    transformedResult.data.attributes.timezone = 'America/Los_Angeles';

    const result = cloneDeep(transformedMaximalData);
    result.data.attributes.veteran.address.countryCodeISO2 = 'US';
    delete result.data.attributes.veteran.address.countryName;

    // add part III, box 11 data
    result.data.attributes.requestingExtension = true;
    result.data.attributes.extensionReason = 'Lorem ipsum';
    result.data.attributes.appealingVhaDenial = false;

    // switch emailAddressText to email for v1
    result.data.attributes.veteran.email =
      result.data.attributes.veteran.emailAddressText;
    delete result.data.attributes.veteran.emailAddressText;

    expect(transformedResult).to.deep.equal(result);
  });
});
