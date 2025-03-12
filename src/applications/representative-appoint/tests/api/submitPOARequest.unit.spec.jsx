import { expect } from 'chai';
import sinon from 'sinon';
import * as Sentry from '@sentry/browser';
import { submitPOARequest } from '../../api/submitPOARequest';
import formData from '../fixtures/data/form-data.json';

describe('submitPOARequest', () => {
  let sandbox;
  let fetchStub;
  let fakeResponse;

  before(() => {
    if (typeof global.fetch !== 'function') {
      global.fetch = () => Promise.resolve();
    }
  });

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    fetchStub = sandbox.stub(global, 'fetch');
  });

  afterEach(() => {
    sandbox.restore();
  });

  function createFakeResponse(ok, statusText, responseData) {
    return {
      ok,
      statusText,
      json: sinon.stub().resolves(responseData),
    };
  }

  it('should return parsed JSON when the response is ok', async () => {
    const fakeResponseData = { success: true, data: 'some data' };
    fakeResponse = createFakeResponse(true, 'OK', fakeResponseData);
    fetchStub.resolves(fakeResponse);

    const result = await submitPOARequest(formData);
    expect(result).to.deep.equal(fakeResponseData);
    expect(fetchStub.calledOnce).to.be.true;
    expect(fakeResponse.json.calledOnce).to.be.true;
  });

  it('should throw an error when the response is not ok', async () => {
    const fakeErrorResponse = { error: 'Invalid form data' };
    fakeResponse = createFakeResponse(false, 'Bad Request', fakeErrorResponse);
    fetchStub.resolves(fakeResponse);

    try {
      await submitPOARequest(formData);
      expect.fail('Expected error to be thrown');
    } catch (error) {
      expect(error.message).to.include('Bad Request');
      expect(error.message).to.include('Invalid form data');
      expect(fetchStub.calledOnce).to.be.true;
      expect(fakeResponse.json.calledOnce).to.be.true;
    }
  });

  it('should handle errors thrown by fetch', async () => {
    const captureExceptionStub = sandbox.stub(Sentry, 'captureException');
    const fakeError = new Error('Network error');
    fetchStub.rejects(fakeError);

    try {
      await submitPOARequest(formData);
      expect.fail('Expected error to be thrown');
    } catch (error) {
      expect(error.message).to.include('Network error');
      expect(captureExceptionStub.calledOnce).to.be.true;
      expect(fetchStub.calledOnce).to.be.true;
    }
  });
});
