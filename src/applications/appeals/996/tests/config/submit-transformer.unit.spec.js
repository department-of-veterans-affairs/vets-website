import { expect } from 'chai';

import cloneDeep from 'platform/utilities/data/cloneDeep';

import formConfig from '../../config/form';

import { transform } from '../../config/submit-transformer';

import maximalDataV2 from '../fixtures/data/maximal-test-v2.json';
import minimalDataV2 from '../fixtures/data/minimal-test-v2.json';
import transformedMaximalDataV2 from '../fixtures/data/transformed/maximal-test-v2.json';
import transformedMinimalDataV2 from '../fixtures/data/transformed/minimal-test-v2.json';

describe('transform', () => {
  it('should transform v2 maximal-test.json correctly', () => {
    const transformedResult = JSON.parse(transform(formConfig, maximalDataV2));
    // copy over variables that change based on date & location
    transformedResult.data.attributes.veteran.timezone = 'America/Los_Angeles';

    expect(transformedResult).to.deep.equal(transformedMaximalDataV2);
  });

  it('should transform v2 minimal-test.json correctly with false socOptIn when hlrUpdatedContent is set', () => {
    const data = cloneDeep(minimalDataV2);
    data.data.hlrUpdatedContent = false;

    const transformedResult = JSON.parse(transform(formConfig, data));
    // copy over variables that change based on date & location
    transformedResult.data.attributes.veteran.timezone = 'America/Los_Angeles';

    const result = cloneDeep(transformedMinimalDataV2);
    result.data.attributes.socOptIn = false;

    expect(transformedResult).to.deep.equal(result);
  });

  it('should transform v2 minimal-test.json correctly with true socOptIn when hlrUpdatedContent is set', () => {
    const data = cloneDeep(minimalDataV2);
    data.data.hlrUpdatedContent = true;
    data.data.informalConferenceChoice = 'yes';

    const transformedResult = JSON.parse(transform(formConfig, data));
    // copy over variables that change based on date & location
    transformedResult.data.attributes.veteran.timezone = 'America/Los_Angeles';

    const result = cloneDeep(transformedMinimalDataV2);
    result.data.attributes.socOptIn = true;

    expect(transformedResult).to.deep.equal(result);
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

  it('should always return socOptIn value from formData', () => {
    const maxData = cloneDeep(maximalDataV2);
    const transformedResult = JSON.parse(transform(formConfig, maxData));
    expect(transformedResult.data.attributes.socOptIn).to.be.true;

    const transformedResult2 = JSON.parse(
      transform(formConfig, {
        ...maxData,
        data: { ...maxData.data, socOptIn: false },
      }),
    );
    expect(transformedResult2.data.attributes.socOptIn).to.be.false;
  });

  it('should always return socOptIn true for updated form', () => {
    const maxData = cloneDeep(maximalDataV2);
    maxData.data.hlrUpdatedContent = true;
    const transformedResult = JSON.parse(transform(formConfig, maxData));
    expect(transformedResult.data.attributes.socOptIn).to.be.true;

    const transformedResult2 = JSON.parse(
      transform(formConfig, {
        ...maxData,
        data: { ...maxData.data, socOptIn: false },
      }),
    );
    expect(transformedResult2.data.attributes.socOptIn).to.be.true;
  });

  it('should ignore informal conference', () => {
    const maxData = cloneDeep(maximalDataV2);
    maxData.data.informalConference = 'no';
    maxData.data.hlrUpdatedContent = false;

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
    maxData.data.informalConferenceChoice = 'no';
    maxData.data.hlrUpdatedContent = true;

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
