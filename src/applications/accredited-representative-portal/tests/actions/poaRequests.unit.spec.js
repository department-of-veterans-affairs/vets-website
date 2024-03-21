import {
  resetFetch,
  mockApiRequest,
} from '@department-of-veterans-affairs/platform-testing/unit/helpers';
import { expect } from 'chai';
import { acceptPOARequest, declinePOARequest } from '../../actions/poaRequests';

describe('POA request actions', () => {
  afterEach(() => {
    resetFetch();
  });

  it('should successfully accept a POA request', async () => {
    const mockResponse = { status: 'success' };
    mockApiRequest(mockResponse);
    const response = await acceptPOARequest('1234');
    expect(response).to.deep.equal(mockResponse);
  });

  it('should handle failed POA acceptance', async () => {
    const mockError = { ok: false, status: 400 };
    mockApiRequest(mockError, false);

    const result = await acceptPOARequest('1234');
    expect(result).to.equal({
      status: 'error',
      error: 'Server responded with status: 400',
    });
  });
});

describe('declinePOARequest', () => {
  it('should handle successful POA declination', async () => {
    const mockResponse = { ok: true, status: 200 };
    mockApiRequest(mockResponse);

    const result = await declinePOARequest('1234');
    expect(result).to.equal({ status: 'success' });
  });

  it('should handle failed POA declination', async () => {
    const mockError = { ok: false, status: 400 };
    mockApiRequest(mockError, false);

    const result = await declinePOARequest('1234');
    expect(result).to.equal({
      status: 'error',
      error: 'Server responded with status: 400',
    });
  });
});
