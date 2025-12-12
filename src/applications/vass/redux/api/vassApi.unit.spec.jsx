import { expect } from 'chai';
import sinon from 'sinon';
import { apiRequest } from 'platform/utilities/api';
import { vassApi } from './vassApi';

describe('VASS API: getAppointmentAvailability', () => {
  let apiRequestStub;

  beforeEach(() => {
    apiRequestStub = sinon.stub();
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should call the correct endpoint with GET method', async () => {
    const mockResponse = {
      data: {
        availableTimeSlots: [
          {
            dtStartUtc: '2025-12-15T14:00:00Z',
            dtEndUtc: '2025-12-15T14:30:00Z',
          },
        ],
      },
    };

    apiRequestStub.resolves(mockResponse);
    sinon.stub(apiRequest).callsFake(apiRequestStub);

    const endpoint = vassApi.endpoints.getAppointmentAvailability;
    const result = await endpoint.queryFn();

    expect(result).to.deep.equal(mockResponse);
  });

  it('should include Authorization header with Bearer token', async () => {
    const mockToken = 'test-jwt-token';
    localStorage.setItem('token', mockToken);

    const mockResponse = {
      data: {
        availableTimeSlots: [],
      },
    };

    apiRequestStub.resolves(mockResponse);
    const apiStub = sinon.stub(apiRequest).callsFake(apiRequestStub);

    const endpoint = vassApi.endpoints.getAppointmentAvailability;
    await endpoint.queryFn();

    // Verify the API was called with correct authorization header
    expect(apiStub.calledOnce).to.be.true;
    const callArgs = apiStub.firstCall.args;
    expect(callArgs[1].headers.Authorization).to.equal(`Bearer ${mockToken}`);

    localStorage.removeItem('token');
  });

  it('should handle API errors gracefully', async () => {
    const mockError = {
      status: 500,
      message: 'Internal Server Error',
    };

    apiRequestStub.rejects(mockError);
    sinon.stub(apiRequest).callsFake(apiRequestStub);

    const endpoint = vassApi.endpoints.getAppointmentAvailability;
    const result = await endpoint.queryFn();

    expect(result.error).to.exist;
    expect(result.error.status).to.equal(500);
  });

  it('should use correct endpoint URL', async () => {
    const mockResponse = {
      data: {
        availableTimeSlots: [],
      },
    };

    apiRequestStub.resolves(mockResponse);
    const apiStub = sinon.stub(apiRequest).callsFake(apiRequestStub);

    const endpoint = vassApi.endpoints.getAppointmentAvailability;
    await endpoint.queryFn();

    // Verify the endpoint URL includes the correct path
    const callArgs = apiStub.firstCall.args;
    expect(callArgs[0]).to.include('/vass/v0/appointment-availability');
  });

  it('should set Content-Type header to application/json', async () => {
    const mockResponse = {
      data: {
        availableTimeSlots: [],
      },
    };

    apiRequestStub.resolves(mockResponse);
    const apiStub = sinon.stub(apiRequest).callsFake(apiRequestStub);

    const endpoint = vassApi.endpoints.getAppointmentAvailability;
    await endpoint.queryFn();

    const callArgs = apiStub.firstCall.args;
    expect(callArgs[1].headers['Content-Type']).to.equal('application/json');
  });
});
