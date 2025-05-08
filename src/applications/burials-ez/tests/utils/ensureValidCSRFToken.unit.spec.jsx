import { expect } from 'chai';
import * as api from '@department-of-veterans-affairs/platform-utilities/api';
import sinon from 'sinon';
import { waitFor } from '@testing-library/react';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import * as recordEventModule from '@department-of-veterans-affairs/platform-monitoring/record-event';
import { ensureValidCSRFToken } from '../../utils/ensureValidCSRFToken';

describe('Burials ensureValidCSRFToken action', () => {
  const errorResponse = { bad: 'some error' };
  let apiRequestStub;
  let recordEventStub;

  beforeEach(() => {
    localStorage.setItem('csrfToken', 'my-token');
    apiRequestStub = sinon.stub(api, 'apiRequest').resolves([]);
    recordEventStub = sinon.stub(recordEventModule, 'default');
  });

  afterEach(() => {
    apiRequestStub.restore();
    localStorage.clear();
    recordEventStub.restore();
  });

  context('has csrfToken in localStorage', () => {
    beforeEach(() => {
      localStorage.setItem('csrfToken', 'my-token');
    });

    it('calls recordEvent token-present successfully', async () => {
      await ensureValidCSRFToken();

      await waitFor(() => {
        expect(
          recordEventStub.calledWith({
            event: 'burials-21p-530-fetch-csrf-token-present',
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

      await ensureValidCSRFToken();

      await waitFor(() => {
        expect(
          recordEventStub.calledWith({
            event: 'burials-21p-530-fetch-csrf-token-empty',
          }),
        ).to.be.true;
        expect(
          recordEventStub.calledWith({
            event: 'burials-21p-530-fetch-csrf-token-present',
          }),
        ).to.be.false;
        expect(
          recordEventStub.calledWith({
            event: 'burials-21p-530-fetch-csrf-token-success',
          }),
        ).to.be.true;
        expect(
          recordEventStub.calledWith({
            event: 'burials-21p-530-fetch-csrf-token-failure',
          }),
        ).to.be.false;
        expect(apiRequestStub.firstCall.args[0]).to.equal(
          `${environment.API_URL}/v0/maintenance_windows`,
        );
        expect(apiRequestStub.callCount).to.equal(1);
      });
    });

    it('returns error making extra HEAD request to refresh csrfToken', async () => {
      apiRequestStub.onFirstCall().rejects(errorResponse);

      await ensureValidCSRFToken('myMethod');

      await waitFor(() => {
        expect(
          recordEventStub.calledWith({
            event: 'burials-21p-530-fetch-csrf-token-failure',
          }),
        ).to.be.true;
        expect(apiRequestStub.callCount).to.equal(1);
      });
    });
  });
});
