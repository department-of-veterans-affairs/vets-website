import { expect } from 'chai';

import cloneDeep from 'platform/utilities/data/cloneDeep';

import formConfig from '../../config/form';

import { transform } from '../../config/submit-transformer';

import maximalDataV2 from '../fixtures/data/maximal-test-v2.json';
import transformedMaximalDataV2 from '../fixtures/data/transformed/maximal-test-v2.json';

describe('transform', () => {
  it('should transform v2 maximal-test.json correctly', () => {
    const transformedResult = JSON.parse(transform(formConfig, maximalDataV2));
    // copy over variables that change based on date & location
    transformedResult.data.attributes.veteran.timezone = 'America/Los_Angeles';

    expect(transformedResult).to.deep.equal(transformedMaximalDataV2);
  });

  it('should fallback to defaults correctly', () => {
    const maxData = cloneDeep(maximalDataV2);
    delete maxData.data.benefitType;
    delete maxData.data.veteran.email;

    const transformedResult = JSON.parse(transform(formConfig, maxData));
    // copy over variables that change based on date & location
    transformedResult.data.attributes.veteran.timezone = 'America/Los_Angeles';

    const result = cloneDeep(transformedMaximalDataV2);
    result.data.attributes.veteran.email = '';

    expect(transformedResult).to.deep.equal(result);
  });

  it('should ignore informal conference', () => {
    const maxData = cloneDeep(maximalDataV2);
    maxData.data.informalConference = 'no';

    const transformedResult = JSON.parse(transform(formConfig, maxData));
    // copy over variables that change based on date & location
    transformedResult.data.attributes.veteran.timezone = 'America/Los_Angeles';

    const result = cloneDeep(transformedMaximalDataV2);
    result.data.attributes.informalConference = false;
    delete result.data.attributes.informalConferenceContact;
    delete result.data.attributes.informalConferenceTime;
    delete result.data.attributes.informalConferenceRep;

    expect(transformedResult).to.deep.equal(result);
  });

  it('should ignore informal conference', () => {
    const maxData = cloneDeep(maximalDataV2);
    maxData.data.informalConference = 'me';
    maxData.data.informalConferenceTime = 'time1200to1630';

    const transformedResult = JSON.parse(transform(formConfig, maxData));
    // copy over variables that change based on date & location
    transformedResult.data.attributes.veteran.timezone = 'America/Los_Angeles';

    const result = cloneDeep(transformedMaximalDataV2);
    result.data.attributes.informalConferenceContact = 'veteran';
    result.data.attributes.informalConferenceTime = '1200-1630 ET';
    delete result.data.attributes.informalConferenceRep;

    expect(transformedResult).to.deep.equal(result);
  });
});
