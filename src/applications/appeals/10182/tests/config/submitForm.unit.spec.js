import { expect } from 'chai';
import sinon from 'sinon';

import formConfig from '../../config/form';
import maximalData from '../fixtures/data/maximal-test.json';

import submitForm from '../../config/submitForm';
import { NEW_API, SUBMIT_URL_NEW } from '../../constants/apis';

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

  it('should use v1 endpoint', done => {
    const data = { data: maximalData.data };
    submitForm(data, formConfig);
    expect(requests[0].url).to.contain(formConfig.submitUrl);
    done();
  });

  it('should use new v1 engine route endpoint', done => {
    const data = { data: { ...maximalData.data, [NEW_API]: true } };
    submitForm(data, formConfig);
    expect(requests[0].url).to.contain(SUBMIT_URL_NEW);
    done();
  });
});
