import { expect } from 'chai';
import sinon from 'sinon';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import * as platformApi from '@department-of-veterans-affairs/platform-utilities/api';
import fetchRepStatus from '../../api/fetchRepStatus';
import { setFindRepBaseUrlFromFlag } from '../../config/form';
import { REPRESENTATIVE_STATUS_API } from '../../constants/api';

describe('fetchRepStatus', () => {
  let sandbox;
  let fetchStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    fetchStub = sandbox.stub(platformApi, 'fetchAndUpdateSessionExpiration');
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('uses API_URL when the flag is ON', async () => {
    setFindRepBaseUrlFromFlag(true);
    const mockResponse = {
      ok: true,
      statusText: 'OK',
      json: () => Promise.resolve({ data: 'Mocked Data' }),
    };
    fetchStub.resolves(mockResponse);

    const result = await fetchRepStatus();

    const expectedUrl = `${environment.API_URL}${REPRESENTATIVE_STATUS_API}`;
    sinon.assert.calledWith(fetchStub, expectedUrl, {
      'Content-Type': 'application/json',
      mode: 'cors',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'X-Key-Inflection': 'camel',
      },
    });
    expect(result).to.have.nested.property('data', 'Mocked Data');
  });

  it('uses staging base when the flag is OFF', async () => {
    setFindRepBaseUrlFromFlag(false);
    const mockResponse = {
      ok: true,
      statusText: 'OK',
      json: () => Promise.resolve({ data: 'Mocked Data' }),
    };
    fetchStub.resolves(mockResponse);

    await fetchRepStatus();

    const expectedUrl = `https://staging-api.va.gov${REPRESENTATIVE_STATUS_API}`;
    sinon.assert.calledWith(fetchStub, expectedUrl, sinon.match.object);
  });

  it('throws when response is not ok', async () => {
    setFindRepBaseUrlFromFlag(true);
    const mockErrorResponse = {
      ok: false,
      statusText: 'Internal Server Error',
      json: () => Promise.resolve({ error: 'Some error' }),
    };
    fetchStub.resolves(mockErrorResponse);

    try {
      await fetchRepStatus();
      expect.fail('Expected error to be thrown');
    } catch (error) {
      expect(error.message).to.equal('Internal Server Error');
    }
  });

  it('bubbles network errors', async () => {
    setFindRepBaseUrlFromFlag(true);
    const mockError = new Error('Network error');
    fetchStub.rejects(mockError);

    try {
      await fetchRepStatus();
      expect.fail('Expected error to be thrown');
    } catch (error) {
      expect(error).to.equal(mockError);
    }
  });
});
