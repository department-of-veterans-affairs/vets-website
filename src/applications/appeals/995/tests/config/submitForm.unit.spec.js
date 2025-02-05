import { expect } from 'chai';
import sinon from 'sinon';

import maximalTest from '../fixtures/data/maximal-test.json';
import formConfig from '../../config/form';
import { NEW_API, SUBMIT_URL, SUBMIT_URL_NEW } from '../../constants/apis';

import submitForm from '../../config/submitForm';

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
    submitForm(maximalTest, formConfig);
    expect(requests[0].url).to.contain(SUBMIT_URL);
    done();
  });

  it('should use new v1 engine route endpoint', done => {
    const data = { data: { [NEW_API]: true } };
    submitForm(data, formConfig);
    expect(requests[0].url).to.contain(SUBMIT_URL_NEW);
    done();
  });
});
