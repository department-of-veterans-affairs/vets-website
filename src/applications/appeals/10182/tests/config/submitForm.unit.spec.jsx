import { expect } from 'chai';
import sinon from 'sinon';

import formConfig from '../../config/form';
import maximalData from '../fixtures/data/maximal-test.json';

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

  it('should use v1 endpoint', done => {
    const data = { data: maximalData.data };
    submitForm(data, formConfig);
    expect(requests[0].url).to.contain(`/v1/${formConfig.submitUrl}`);
    done();
  });
});
