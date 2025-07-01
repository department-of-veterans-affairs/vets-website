import sinon from 'sinon-v20';
import * as api from 'platform/utilities/api';
import * as recordEventModule from 'platform/monitoring/record-event';
import { ensureValidCSRFToken } from '../../../actions/ensureValidCSRFToken';
import { API_ENDPOINTS } from '../../../utils/constants';

describe('CG `ensureValidCSRFToken` action', () => {
  const url = API_ENDPOINTS.csrfCheck;
  let apiRequestStub;
  let recordEventStub;

  beforeEach(() => {
    apiRequestStub = sinon.stub(api, 'apiRequest').resolves([]);
    recordEventStub = sinon.stub(recordEventModule, 'default');
  });

  afterEach(() => {
    localStorage.clear();
    sinon.restore();
  });

  it('should not make request to refresh csrfToken when token exists', async () => {
    localStorage.setItem('csrfToken', 'my-token');

    await ensureValidCSRFToken('myMethod');
    sinon.assert.notCalled(apiRequestStub);
    sinon.assert.notCalled(recordEventStub);
  });

  it('should successfully make `HEAD` request to refresh csrfToken when no token exists', async () => {
    localStorage.removeItem('csrfToken');
    apiRequestStub.resolves();

    await ensureValidCSRFToken('myMethod');
    sinon.assert.calledOnceWithExactly(apiRequestStub, url, { method: 'HEAD' });
    sinon.assert.calledOnceWithExactly(recordEventStub, {
      event: 'caregivers-csrf-token-fetch--success',
      method: 'myMethod',
    });
  });

  it('should return error when request to refresh csrfToken fails', async () => {
    localStorage.removeItem('csrfToken');
    apiRequestStub.rejects();

    await ensureValidCSRFToken('myMethod');
    sinon.assert.calledOnce(apiRequestStub);
    sinon.assert.calledOnceWithExactly(recordEventStub, {
      event: 'caregivers-csrf-token-fetch--failure',
      method: 'myMethod',
    });
  });
});
