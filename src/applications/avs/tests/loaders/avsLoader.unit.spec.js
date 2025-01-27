import { expect } from 'chai';
import sinon from 'sinon';

import { environment } from '@department-of-veterans-affairs/platform-utilities/exports';
import * as platformApiUtils from '@department-of-veterans-affairs/platform-utilities/api';

import { avsLoader } from '../../loaders/avsLoader';

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

  it('should return deferred data on successful API request', async () => {
    apiRequestStub.resolves({ data: mockData });

    // We can't use await here because of how defer works.
    avsLoader({ params }).then(result => {
      expect(apiRequestStub.calledWith(`${apiBasePath}/avs/123`)).to.be.true;
      expect(result.data.avs).to.equal(mockData.attributes);
    });
  });

  it('should throw an error on failed API request', async () => {
    apiRequestStub.rejects(new Error('API Error'));

    try {
      await avsLoader({ params });
    } catch (e) {
      expect(e.message).to.equal('Error loading prescription data');
    }
  });
});
