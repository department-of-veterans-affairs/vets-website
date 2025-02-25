import { expect } from 'chai';
import sinon from 'sinon';
import { mockApiRequest } from 'platform/testing/unit/helpers';
import * as Sentry from '@sentry/browser';
import { submitPOARequest } from '../../api/submitPOARequest';
import formData from '../fixtures/data/form-data.json';

describe('submitPOARequest', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should return parsed JSON when the response is ok', async () => {
    const fakeResponseData = { success: true, data: 'some data' };
    const fakeResponse = {
      ok: true,
      statusText: 'OK',
      json: () => Promise.resolve(fakeResponseData),
    };

    mockApiRequest(fakeResponse);

    const result = await submitPOARequest(formData);
    expect(result).to.deep.equal(fakeResponseData);
  });

  it('should throw an error when the response is not ok', async () => {
    const fakeErrorResponse = { error: 'Invalid form data' };
    const fakeResponse = {
      ok: false,
      statusText: 'Bad Request',
      json: () => Promise.resolve(fakeErrorResponse),
    };

    mockApiRequest(fakeResponse);

    try {
      await submitPOARequest(formData);
      expect.fail('Expected error to be thrown');
    } catch (error) {
      expect(error.message).to.include('Bad Request');
      expect(error.message).to.include('Invalid form data');
    }
  });

  it('should handle errors thrown by apiRequest', async () => {
    const captureExceptionStub = sandbox.stub(Sentry, 'captureException');

    mockApiRequest(Promise.reject(new Error('Network error')));

    try {
      await submitPOARequest(formData);
      expect.fail('Expected error to be thrown');
    } catch (error) {
      expect(error.message).to.include('Network error');
      expect(captureExceptionStub.calledOnce).to.be.true;
    }
  });
});
