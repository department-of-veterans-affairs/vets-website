import { expect } from 'chai';
import sinon from 'sinon';
import maximalTest from '../e2e/fixtures/data/maximal.json';
import formConfig from '../../config/form';
import { SUBMIT_URL } from '../../constants';
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
});
