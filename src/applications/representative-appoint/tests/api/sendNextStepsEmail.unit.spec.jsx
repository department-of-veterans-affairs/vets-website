import { expect } from 'chai';
import sinon from 'sinon';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import sendNextStepsEmail from '../../api/sendNextStepsEmail';

describe('sendNextStepsEmail', () => {
  let sandbox;
  let fetchStub;
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
    global.fetch = sandbox.stub(global, 'fetch');
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should call the api with the provided body', async () => {
    const mockResponse = {
      ok: true,
      statusText: 'OK',
      json: () => Promise.resolve({ message: 'email enqueued' }),
    };
    fetchStub = fetch.resolves(mockResponse);

    await sendNextStepsEmail(body);

    const expectedUrl = `${
      environment.API_URL
    }/representation_management/v0/next_steps_email`;

    sinon.assert.calledWith(fetchStub, expectedUrl, {
      body: JSON.stringify(body),
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Sec-Fetch-Mode': 'cors',
        'Source-App-Name': 'appoint-a-representative',
        'X-CSRF-Token': null,
        'X-Key-Inflection': 'camel',
      },
      method: 'POST',
      mode: 'cors',
    });
  });

  it('returns the api response as json', async () => {
    const mockResponse = {
      ok: true,
      statusText: 'OK',
      json: () => Promise.resolve({ message: 'email enqueued' }),
    };
    fetchStub = fetch.resolves(mockResponse);

    const result = await sendNextStepsEmail(body);

    expect(result).to.eql({ message: 'email enqueued' });
  });

  it('should throw an error if the response is not ok', async () => {
    const mockErrorResponse = {
      ok: false,
      statusText: 'Internal Server Error',
      json: () => Promise.resolve({ error: 'Some error' }),
    };
    fetchStub = fetch.resolves(mockErrorResponse);
    const expectedError =
      'Error on API request to https://dev-api.va.gov/representation_management/v0/next_steps_email: Internal Server Error. Some error';

    try {
      await sendNextStepsEmail(body);
    } catch (error) {
      expect(error.message).to.equal(expectedError);
    }
  });

  it('should handle errors', async () => {
    const mockError = new Error('Network error');
    fetchStub = fetch.rejects(mockError);

    try {
      await sendNextStepsEmail(body);
    } catch (error) {
      expect(error).to.equal(mockError);
    }
  });
});
