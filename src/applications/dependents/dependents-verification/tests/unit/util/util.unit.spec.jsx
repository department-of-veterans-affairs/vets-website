import { expect } from 'chai';
import sinon from 'sinon';
import * as apiModule from 'platform/utilities/api';
// import * as recordEventModule from 'platform/monitoring/record-event';
import * as helpers from 'platform/forms-system/src/js/helpers';
import * as utils from '../../../util/index';

describe('dependents/686c-674 util', () => {
  let stubs = [];

  afterEach(() => {
    stubs.forEach(stub => stub.restore && stub.restore());
    stubs = [];
    sinon.restore && sinon.restore();
  });

  it('should call transformForSubmit and return stringified payload', () => {
    const fakeFormConfig = { foo: 'bar' };
    const fakeForm = { baz: 'qux' };
    const fakeResult = { formData: 'transformed' };
    const transformStub = sinon
      .stub(helpers, 'transformForSubmit')
      .returns(fakeResult);
    stubs.push(transformStub);

    const result = utils.transform(fakeFormConfig, fakeForm);

    expect(transformStub.calledWith(fakeFormConfig, fakeForm)).to.be.true;
    expect(result).to.equal(
      JSON.stringify({ dependentsVerificationClaim: { form: fakeResult } }),
    );
  });

  //   it('ensureValidCSRFToken calls fetchNewCSRFToken if no token in storage', async () => {

  //     sinon
  //       .stub(localStorage, 'getItem')
  //       .withArgs('csrfToken')
  //       .returns(null);
  //     const fetchStub = sinon.stub(utils, 'fetchNewCSRFToken').resolves();
  //     stubs.push(localStorage.getItem, fetchStub);

  //     await utils.ensureValidCSRFToken();

  //     expect(fetchStub.called).to.be.true;
  //   });

  //   it('ensureValidCSRFToken logs present token', async () => {
  //     sinon
  //       .stub(localStorage, 'getItem')
  //       .withArgs('csrfToken')
  //       .returns('abc');
  //     const recordStub = sinon.stub(recordEventModule, 'default');
  //     stubs.push(localStorage.getItem, recordStub);

  //     await utils.ensureValidCSRFToken();

  //     expect(recordStub.calledWithMatch({ event: /present/ })).to.be.true;
  //   });

  it('submit - successful request', async () => {
    sinon.stub(utils, 'ensureValidCSRFToken').resolves();
    const apiStub = sinon
      .stub(apiModule, 'apiRequest')
      .resolves({ data: { attributes: { test: 123 } } });
    stubs.push(utils.ensureValidCSRFToken, apiStub);

    window.dataLayer = [];
    const fakeFormConfig = { trackingPrefix: 'test' };
    const fakeForm = {};

    const result = await utils.submit(fakeForm, fakeFormConfig);

    expect(result).to.deep.equal({ test: 123 });
    expect(window.dataLayer.some(e => e.event === 'test-submission-successful'))
      .to.be.true;
  });

  it('submit - CSRF failure retries then fails', async () => {
    sinon.stub(utils, 'ensureValidCSRFToken').resolves();
    const fakeResponse = {
      errors: [{ status: '403', detail: 'Invalid Authenticity Token' }],
    };
    const apiStub = sinon.stub(apiModule, 'apiRequest');
    apiStub
      .onFirstCall()
      .rejects(fakeResponse)
      .onSecondCall()
      .resolves({ data: { attributes: { foo: 'bar' } } });
    stubs.push(utils.ensureValidCSRFToken, apiStub);

    window.dataLayer = [];
    const fakeFormConfig = { trackingPrefix: 'again' };
    const fakeForm = {};

    const result = await utils.submit(fakeForm, fakeFormConfig);

    expect(result).to.deep.equal({ foo: 'bar' });
  });

  it('submit - onFailure for 429 response', async () => {
    sinon.stub(utils, 'ensureValidCSRFToken').resolves();

    const fakeResp = new Response(null, { status: 429 });
    fakeResp.headers.set('x-ratelimit-reset', '123');
    const apiStub = sinon.stub(apiModule, 'apiRequest').rejects(fakeResp);
    stubs.push(utils.ensureValidCSRFToken, apiStub);

    const fakeFormConfig = { trackingPrefix: 'rate' };
    const fakeForm = {};

    try {
      await utils.submit(fakeForm, fakeFormConfig);
      throw new Error('Should have thrown!');
    } catch (err) {
      expect(err.message).to.equal(
        'vets_throttled_error_dependents_verification',
      );
      expect(err.extra).to.equal(123);
    }
  });
});
