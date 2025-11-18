import { expect } from 'chai';
import sinon from 'sinon';

import { environment } from '@department-of-veterans-affairs/platform-utilities/exports';
import * as platformApiUtils from '@department-of-veterans-affairs/platform-utilities/api';

import { avsLoader } from '../../loaders/avsLoader.ts';

describe('avsLoader', () => {
  const params = { id: '123' };
  const mockData = { attributes: { avs: { id: 123, meta: {} } } };
  const apiBasePath = `${environment.API_URL}/avs/v0`;
  const sandbox = sinon.createSandbox();
  let apiRequestStub;

  beforeEach(() => {
    apiRequestStub = sandbox.stub(platformApiUtils, 'apiRequest');
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should return deferred data on successful API request', () => {
    apiRequestStub.resolves({ data: mockData });

    const result = avsLoader({ params });

    // avsLoader returns a defer object with an avs property
    expect(apiRequestStub.calledWith(`${apiBasePath}/avs/123`)).to.be.true;
    expect(result).to.have.property('data');
    expect(result.data).to.have.property('avs');
  });

  it('should throw an error when ID parameter is missing', () => {
    expect(() => avsLoader({ params: {} })).to.throw(
      'ID parameter is required',
    );
  });

  it('should handle API request errors', async () => {
    const apiError = new Error('API Error');
    apiRequestStub.rejects(apiError);

    const result = avsLoader({ params });

    // The error will be in the deferred data promise and should be the original API error
    try {
      await result.data.avs;
      expect.fail('Expected promise to reject');
    } catch (error) {
      expect(error.message).to.equal('API Error');
    }
  });
});
