import { expect } from 'chai';
import sinon from 'sinon';

import formConfig from '../../config/form';
import maximalTestV2 from '../fixtures/data/maximal-test-v2.json';

import submitForm, { buildEventData } from '../../config/submitForm';

describe('HLR submit event data', () => {
  it('should build submit event data', () => {
    expect(buildEventData({ informalConference: 'no' })).to.deep.equal({
      'decision-reviews-informalConf': 'no',
    });
    expect(buildEventData({ informalConference: 'rep' })).to.deep.equal({
      'decision-reviews-informalConf': 'yes-with-rep',
    });
    expect(buildEventData({ informalConference: 'yes' })).to.deep.equal({
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

  it('should use v1 endpoint with v2 data', done => {
    submitForm(maximalTestV2, formConfig);
    expect(requests[0].url).to.contain('/v1/higher_level_reviews');
    done();
  });
});
