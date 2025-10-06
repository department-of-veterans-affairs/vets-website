import { expect } from 'chai';
import sinon from 'sinon';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import * as platformApi from '@department-of-veterans-affairs/platform-utilities/api';
import { fetchRepresentatives } from '../../api/fetchRepresentatives';
import { setFindRepBaseUrlFromFlag } from '../../config/form';
import { REPRESENTATIVES_API } from '../../constants/api';
import repResults from '../fixtures/data/representative-results.json';

describe('fetchRepresentatives', () => {
  let sandbox;
  let fetchStub;
  const query = 'Bob';

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    fetchStub = sandbox.stub(platformApi, 'fetchAndUpdateSessionExpiration');
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('calls API_URL when flag is ON, with query param', async () => {
    setFindRepBaseUrlFromFlag(true);

    const mockResponse = {
      ok: true,
      statusText: 'OK',
      json: () => Promise.resolve({ repResults }),
    };
    fetchStub.resolves(mockResponse);

    await fetchRepresentatives({ query });

    const expectedUrl = `${
      environment.API_URL
    }${REPRESENTATIVES_API}?query=${query}`;
    sinon.assert.calledWith(fetchStub, expectedUrl, sinon.match.object);
  });

  it('calls staging base when flag is OFF, with query param', async () => {
    setFindRepBaseUrlFromFlag(false);

    const mockResponse = {
      ok: true,
      statusText: 'OK',
      json: () => Promise.resolve({ repResults }),
    };
    fetchStub.resolves(mockResponse);

    await fetchRepresentatives({ query });

    const expectedUrl = `https://staging-api.va.gov${REPRESENTATIVES_API}?query=${query}`;
    sinon.assert.calledWith(fetchStub, expectedUrl, sinon.match.object);
  });

  it('returns a list of representatives', async () => {
    setFindRepBaseUrlFromFlag(true);
    const mockResponse = {
      ok: true,
      statusText: 'OK',
      json: () => Promise.resolve({ repResults }),
    };
    fetchStub.resolves(mockResponse);

    const result = await fetchRepresentatives({ query });

    expect(result.repResults).to.deep.equal(repResults);
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
      await fetchRepresentatives({ query });
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
      await fetchRepresentatives({ query });
      expect.fail('Expected error to be thrown');
    } catch (error) {
      expect(error).to.equal(mockError);
    }
  });
});
