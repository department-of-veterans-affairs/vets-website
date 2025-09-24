import { expect } from 'chai';
import sinon from 'sinon';
import { waitFor } from '@testing-library/react';
import * as api from 'platform/utilities/api';
import * as recordEventModule from 'platform/monitoring/record-event';
import { ensureValidCSRFToken } from '../../../../utils/actions/ensureValidCSRFToken';
import { API_ENDPOINTS } from '../../../../utils/constants';

describe('hca ensureValidCSRFToken action', () => {
  const url = API_ENDPOINTS.csrfCheck;
  let apiRequestStub;
  let recordEventStub;

  beforeEach(() => {
    localStorage.setItem('csrfToken', '');
    apiRequestStub = sinon.stub(api, 'apiRequest').resolves([]);
    recordEventStub = sinon.stub(recordEventModule, 'default');
  });

  afterEach(() => {
    localStorage.clear();
    apiRequestStub.restore();
    recordEventStub.restore();
  });

  it('should not make request to refresh csrfToken when token exists', async () => {
    localStorage.setItem('csrfToken', 'my-token');

    await ensureValidCSRFToken();
    await waitFor(() => {
      expect(apiRequestStub.called).to.be.false;
      expect(recordEventStub.called).to.be.false;
    });
  });

  it('should successfully make `HEAD` request to refresh csrfToken when no token exists', async () => {
    const event = {
      event: 'hca-csrf-token-fetch--success',
      method: 'myMethod',
    };

    apiRequestStub.onFirstCall().resolves({ meta: {} });

    await ensureValidCSRFToken(event.method);
    await waitFor(() => {
      expect(apiRequestStub.firstCall.args[0]).to.equal(url);
      expect(apiRequestStub.callCount).to.equal(1);
      expect(recordEventStub.callCount).to.equal(1);
      expect(recordEventStub.calledWith(event)).to.be.true;
    });
  });

  it('should return error when request to refresh csrfToken fails', async () => {
    const event = {
      event: 'hca-csrf-token-fetch--failure',
      method: 'myMethod',
    };

    apiRequestStub.onFirstCall().rejects({ bad: 'some error' });

    await ensureValidCSRFToken(event.method);
    await waitFor(() => {
      expect(apiRequestStub.callCount).to.equal(1);
      expect(recordEventStub.callCount).to.equal(1);
      expect(recordEventStub.calledWith(event)).to.be.true;
    });
  });
});
