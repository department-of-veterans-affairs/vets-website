import { expect } from 'chai';
import sinon from 'sinon';
import * as platformApi from '@department-of-veterans-affairs/platform-utilities/api';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';

import { fetchRepresentatives } from '../../api/fetchRepresentatives';
import { setRepresentativesApiFromFlag } from '../../constants/api';
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

  it('should call the api with the query param', async () => {
    const mockResponse = {
      ok: true,
      statusText: 'OK',
      json: () => Promise.resolve({ repResults }),
    };
    fetchStub.resolves(mockResponse);

    await fetchRepresentatives({ query });

    const expectedUrl = `${
      environment.API_URL
    }/representation_management/v0/original_entities?query=${query}`;

    sinon.assert.calledWith(fetchStub, expectedUrl, sinon.match.object);
  });

  it('returns a list of representatives', async () => {
    const mockResponse = {
      ok: true,
      statusText: 'OK',
      json: () => Promise.resolve({ repResults }),
    };
    fetchStub.resolves(mockResponse);

    const result = await fetchRepresentatives({ query });

    expect(result.repResults).to.deep.equal(repResults);
  });

  it('should throw an error if the response is not ok', async () => {
    const mockErrorResponse = {
      ok: false,
      statusText: 'Internal Server Error',
      json: () => Promise.resolve({ error: 'Some error' }),
    };
    fetchStub.resolves(mockErrorResponse);

    try {
      await fetchRepresentatives({ query });
    } catch (error) {
      expect(error.message).to.equal('Internal Server Error');
    }
  });

  it('should handle errors', async () => {
    const mockError = new Error('Network error');
    fetchStub.rejects(mockError);

    try {
      await fetchRepresentatives({ query });
    } catch (error) {
      expect(error).to.equal(mockError);
    }
  });

  it('uses /original_entities when flag is OFF', async () => {
    setRepresentativesApiFromFlag(false);

    const mockResponse = {
      ok: true,
      statusText: 'OK',
      json: () => Promise.resolve({ repResults }),
    };
    fetchStub.resolves(mockResponse);

    await fetchRepresentatives({ query });

    const expectedUrl = `${
      environment.API_URL
    }/representation_management/v0/original_entities?query=${query}`;
    sinon.assert.calledWith(fetchStub, expectedUrl, sinon.match.object);
  });

  it('uses /accredited_entities_for_appoint when flag is ON', async () => {
    setRepresentativesApiFromFlag(true);

    const mockResponse = {
      ok: true,
      statusText: 'OK',
      json: () => Promise.resolve({ repResults }),
    };
    fetchStub.resolves(mockResponse);

    await fetchRepresentatives({ query });

    const expectedUrl = `${
      environment.API_URL
    }/representation_management/v0/accredited_entities_for_appoint?query=${query}`;
    sinon.assert.calledWith(fetchStub, expectedUrl, sinon.match.object);
  });
});
