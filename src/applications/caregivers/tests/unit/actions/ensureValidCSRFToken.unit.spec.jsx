import { expect } from 'chai';
import * as api from 'platform/utilities/api';
import * as Sentry from '@sentry/browser';
import sinon from 'sinon';
import { waitFor } from '@testing-library/react';
import { ensureValidCSRFToken } from '../../../actions/ensureValidCSRFToken';
import { API_ENDPOINTS } from '../../../utils/constants';

describe('CG ensureValidCSRFToken action', () => {
  const errorResponse = { bad: 'some error' };
  const url = API_ENDPOINTS.csrfCheck;
  let apiRequestStub;
  let sentrySpy;

  beforeEach(() => {
    localStorage.setItem('csrfToken', '');
    apiRequestStub = sinon.stub(api, 'apiRequest').resolves([]);
    sentrySpy = sinon.spy(Sentry, 'captureMessage');
  });

  afterEach(() => {
    localStorage.clear();
    apiRequestStub.restore();
    sentrySpy.restore();
  });

  it('should successfully make HEAD request to refresh csrfToken', async () => {
    apiRequestStub.onFirstCall().resolves({ meta: {} });

    await ensureValidCSRFToken('myMethod');
    await waitFor(() => {
      expect(apiRequestStub.firstCall.args[0]).to.equal(url);
      expect(apiRequestStub.callCount).to.equal(1);
      expect(sentrySpy.callCount).to.equal(1);
      expect(sentrySpy.firstCall.args[0]).to.equal(
        `No csrfToken when making myMethod call. ${url} successfully called to generate token.`,
      );
    });
  });

  it('should return error making extra HEAD request to refresh csrfToken', async () => {
    apiRequestStub.onFirstCall().rejects(errorResponse);

    await ensureValidCSRFToken('myMethod');
    await waitFor(() => {
      expect(apiRequestStub.callCount).to.equal(1);
      expect(sentrySpy.callCount).to.equal(1);
      expect(sentrySpy.firstCall.args[0]).to.equal(
        `No csrfToken when making myMethod call. ${url} failed when called to generate token.`,
      );
    });
  });
});
