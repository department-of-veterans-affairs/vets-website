import { expect } from 'chai';
import sinon from 'sinon';
import * as platformApi from '@department-of-veterans-affairs/platform-utilities/api';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import * as Sentry from '@sentry/browser';
import sendNextStepsEmail from '../../api/sendNextStepsEmail';
import { setFindRepBaseUrlFromFlag } from '../../config/form';
import { NEXT_STEPS_EMAIL_API } from '../../constants/api';
import manifest from '../../manifest.json';

describe('sendNextStepsEmail', () => {
  let sandbox;
  let fetchStub;
  let sentryStub;

  const body = {
    formNumber: '21-22',
    formName:
      "Appointment of Veterans Service Organization as Claimant's Representative",
    firstName: 'Bob',
    emailAddress: 'test@test,com',
    entityId: '12345',
    entityType: 'organization',
  };

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    fetchStub = sandbox.stub(platformApi, 'fetchAndUpdateSessionExpiration');
    sentryStub = sandbox.stub(Sentry, 'captureException');
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('calls API_URL when flag is ON, with provided body', async () => {
    setFindRepBaseUrlFromFlag(true); // ON → environment.API_URL

    const mockResponse = {
      ok: true,
      statusText: 'OK',
      json: () => Promise.resolve({ message: 'email enqueued' }),
    };
    fetchStub.resolves(mockResponse);

    await sendNextStepsEmail(body);

    const expectedUrl = `${environment.API_URL}${NEXT_STEPS_EMAIL_API}`;
    sinon.assert.calledWith(
      fetchStub,
      expectedUrl,
      sinon.match({
        method: 'POST',
        mode: 'cors',
        credentials: 'include',
        headers: sinon.match({
          'X-Key-Inflection': 'camel',
          'Sec-Fetch-Mode': 'cors',
          'Content-Type': 'application/json',
          'Source-App-Name': manifest.entryName,
        }),
        body: JSON.stringify(body),
      }),
    );
  });

  it('calls staging base when flag is OFF', async () => {
    setFindRepBaseUrlFromFlag(false); // OFF → staging

    const mockResponse = {
      ok: true,
      statusText: 'OK',
      json: () => Promise.resolve({ message: 'email enqueued' }),
    };
    fetchStub.resolves(mockResponse);

    await sendNextStepsEmail(body);

    const expectedUrl = `https://staging-api.va.gov${NEXT_STEPS_EMAIL_API}`;
    sinon.assert.calledWith(fetchStub, expectedUrl, sinon.match.object);
  });

  it('returns the API response as JSON', async () => {
    setFindRepBaseUrlFromFlag(true);

    const mockResponse = {
      ok: true,
      statusText: 'OK',
      json: () => Promise.resolve({ message: 'email enqueued' }),
    };
    fetchStub.resolves(mockResponse);

    const result = await sendNextStepsEmail(body);

    expect(result).to.eql({ message: 'email enqueued' });
  });

  it('throws a detailed error when response is not ok', async () => {
    setFindRepBaseUrlFromFlag(true);

    const mockErrorResponse = {
      ok: false,
      statusText: 'Internal Server Error',
      json: () => Promise.resolve({ error: 'Some error' }),
    };
    fetchStub.resolves(mockErrorResponse);

    try {
      await sendNextStepsEmail(body);
      expect.fail('Expected error to be thrown');
    } catch (error) {
      const expectedUrl = `${environment.API_URL}${NEXT_STEPS_EMAIL_API}`;
      expect(error.message).to.equal(
        `Error on API request to ${expectedUrl}: Internal Server Error. Some error`,
      );
      sinon.assert.calledOnce(sentryStub);
    }
  });

  it('bubbles network errors and reports to Sentry', async () => {
    setFindRepBaseUrlFromFlag(true);

    const mockError = new Error('Network error');
    fetchStub.rejects(mockError);

    try {
      await sendNextStepsEmail(body);
      expect.fail('Expected error to be thrown');
    } catch (error) {
      expect(error).to.equal(mockError);
      sinon.assert.calledOnce(sentryStub);
    }
  });
});
