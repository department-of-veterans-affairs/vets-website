import { expect } from 'chai';
import * as api from 'platform/utilities/api';
import * as Sentry from '@sentry/browser';
import sinon from 'sinon';
import { waitFor } from '@testing-library/react';
import * as recordEventModule from 'platform/monitoring/record-event';
import { ensureValidCSRFToken } from '../../../actions/ensureValidCSRFToken';
import { API_ENDPOINTS } from '../../../utils/constants';

describe('CG ensureValidCSRFToken action', () => {
  const errorResponse = { bad: 'some error' };
  let apiRequestStub;
  let sentrySpy;
  let recordEventStub;

  beforeEach(() => {
    localStorage.setItem('csrfToken', 'my-token');
    apiRequestStub = sinon.stub(api, 'apiRequest').resolves([]);
    sentrySpy = sinon.spy(Sentry, 'captureMessage');
    recordEventStub = sinon.stub(recordEventModule, 'default');
  });

  afterEach(() => {
    apiRequestStub.restore();
    localStorage.clear();
    sentrySpy.restore();
    recordEventStub.restore();
  });

  context('has csrfToken in localStorage', () => {
    beforeEach(() => {
      localStorage.setItem('csrfToken', 'my-token');
    });

    it('calls recordEvent token-present successfully', async () => {
      await ensureValidCSRFToken('myMethod');

      await waitFor(() => {
        expect(
          recordEventStub.calledWith({
            event: 'caregivers-10-10cg-fetch-csrf-token-present',
          }),
        ).to.be.true;
      });
    });
  });

  context('no csrfToken in localStorage', () => {
    beforeEach(() => {
      localStorage.setItem('csrfToken', '');
    });

    it('successfully makes extra HEAD request to refresh csrfToken', async () => {
      apiRequestStub.onFirstCall().resolves({ meta: {} });

      await ensureValidCSRFToken('myMethod');

      await waitFor(() => {
        expect(
          recordEventStub.calledWith({
            event: 'caregivers-10-10cg-fetch-csrf-token-empty',
          }),
        ).to.be.true;
        expect(
          recordEventStub.calledWith({
            event: 'caregivers-10-10cg-fetch-csrf-token-present',
          }),
        ).to.be.false;
        expect(apiRequestStub.firstCall.args[0]).to.equal(
          API_ENDPOINTS.csrfCheck,
        );
        expect(apiRequestStub.callCount).to.equal(1);
        expect(sentrySpy.callCount).to.equal(2);
        expect(sentrySpy.firstCall.args[0]).to.equal(
          'No csrfToken when making myMethod call. Calling /v0/maintenance_windows to generate new one.',
        );
        expect(sentrySpy.secondCall.args[0]).to.equal(
          'No csrfToken when making myMethod call. /v0/maintenance_windows successfully called to generate token.',
        );
      });
    });

    it('returns error making extra HEAD request to refresh csrfToken', async () => {
      apiRequestStub.onFirstCall().rejects(errorResponse);

      await ensureValidCSRFToken('myMethod');

      await waitFor(() => {
        expect(apiRequestStub.callCount).to.equal(1);
        expect(sentrySpy.callCount).to.equal(2);
        expect(sentrySpy.firstCall.args[0]).to.equal(
          'No csrfToken when making myMethod call. Calling /v0/maintenance_windows to generate new one.',
        );
        expect(sentrySpy.secondCall.args[0]).to.equal(
          'No csrfToken when making myMethod call. /v0/maintenance_windows failed when called to generate token.',
        );
      });
    });
  });
});
