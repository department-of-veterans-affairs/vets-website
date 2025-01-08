import { expect } from 'chai';
import sinon from 'sinon';

import formConfig from '../../config/form';
import maximalTestV2 from '../fixtures/data/maximal-test-v2.json';
import maximalTestV25 from '../fixtures/data/maximal-test-v2.5.json';
import { SUBMIT_URL, SUBMIT_URL_NEW } from '../../constants/apis';

import submitForm, { buildEventData } from '../../config/submitForm';

describe('HLR submit event data', () => {
  it('should build submit event data for new content', () => {
    const getData = value => ({
      informalConference: value,
      informalConferenceChoice: 'yes',
    });
    expect(buildEventData(getData('no'))).to.deep.equal({
      'decision-reviews-informalConf': 'no',
    });
    expect(buildEventData(getData('rep'))).to.deep.equal({
      'decision-reviews-informalConf': 'yes-with-rep',
    });
    expect(buildEventData(getData('yes'))).to.deep.equal({
      'decision-reviews-informalConf': 'yes',
    });
  });
});

describe('submitForm', () => {
  let xhr;
  let requests;

  beforeEach(() => {
    xhr = sinon.useFakeXMLHttpRequest();
    requests = [];
    xhr.onCreate = createdXhr => requests.push(createdXhr);
  });

  afterEach(() => {
    global.XMLHttpRequest = window.XMLHttpRequest;
    xhr.restore();
  });

  it('should use v2 endpoint with v2 data', done => {
    submitForm(maximalTestV2, formConfig);
    expect(requests[0].url).to.contain(SUBMIT_URL);
    done();
  });

  it('should use v2 endpoint with v3 data', done => {
    submitForm(maximalTestV25, formConfig);
    expect(requests[0].url).to.contain(SUBMIT_URL_NEW);
    done();
  });
});
