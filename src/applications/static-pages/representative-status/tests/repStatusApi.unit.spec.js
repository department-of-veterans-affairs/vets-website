import { expect } from 'chai';
import sinon from 'sinon';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import RepresentativeStatusApi from '../api/RepresentativeStatusApi';

describe('RepresentativeStatusApi', () => {
  let sandbox;
  let fetchStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    global.fetch = sandbox.stub(global, 'fetch');
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should fetch and return representative status successfully', async () => {
    const mockResponse = {
      ok: true,
      statusText: 'OK',
      json: () => Promise.resolve({ data: 'Mocked Data' }),
    };
    fetchStub = fetch.resolves(mockResponse);

    const result = await RepresentativeStatusApi.getRepresentativeStatus();

    const expectedUrl = `${
      environment.API_URL
    }/representation_management/v0/power_of_attorney`;
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

  it('should throw an error if the response is not ok', async () => {
    const mockErrorResponse = {
      ok: false,
      statusText: 'Internal Server Error',
      json: () => Promise.resolve({ error: 'Some error' }),
    };
    fetchStub = fetch.resolves(mockErrorResponse);

    try {
      await RepresentativeStatusApi.getRepresentativeStatus();
      throw new Error('Expected method to throw.');
    } catch (error) {
      expect(error.message).to.equal('Internal Server Error');
    }
  });

  it('should handle errors', async () => {
    const mockError = new Error('Network error');
    fetchStub = fetch.rejects(mockError);

    try {
      await RepresentativeStatusApi.getRepresentativeStatus();
      throw new Error('Expected method to reject.');
    } catch (error) {
      expect(error).to.equal(mockError);
    }
  });
});
