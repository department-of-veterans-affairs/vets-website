import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';

import * as api from 'platform/utilities/api';
import * as formsHelpers from 'platform/forms/helpers';

import NextStepsSection from '../../../components/NextStepsSection';

describe('NextStepsSection confirmation page component', () => {
  let apiStub;
  let getFormLinkStub;
  let inProgressApiStub;

  const MOCK_PENSION_LINK = '/mock/pension/link';
  const MOCK_IN_PROGRESS_ENDPOINT = '/mock/in-progress/21P-527EZ';

  beforeEach(() => {
    getFormLinkStub = sinon
      .stub(formsHelpers, 'getFormLink')
      .callsFake(() => MOCK_PENSION_LINK);
    inProgressApiStub = sinon
      .stub(formsHelpers, 'inProgressApi')
      .callsFake(() => MOCK_IN_PROGRESS_ENDPOINT);
  });

  afterEach(() => {
    if (apiStub) {
      apiStub.restore();
      apiStub = null;
    }
    if (getFormLinkStub) {
      getFormLinkStub.restore();
      getFormLinkStub = null;
    }
    if (inProgressApiStub) {
      inProgressApiStub.restore();
      inProgressApiStub = null;
    }
  });

  it('shows loading indicator while checking in-progress app', async () => {
    let resolveReq;
    const pending = new Promise(res => {
      resolveReq = res;
    });
    apiStub = sinon.stub(api, 'apiRequest').returns(pending);

    const { container } = render(<NextStepsSection loggedIn />);

    const loader = container.querySelector('va-loading-indicator');
    expect(loader).to.exist;
    const msg = loader.getAttribute('message');
    expect(msg).to.include('Checking your in-progress applications');

    resolveReq({});
    await waitFor(() => {
      expect(container.querySelector('va-loading-indicator')).to.not.exist;
    });
  });

  it('renders in-progress message with action link when pension benefits in progress form exists)', async () => {
    apiStub = sinon.stub(api, 'apiRequest').resolves({}); // 200 → has draft

    const { getByText, container } = render(<NextStepsSection loggedIn />);

    await waitFor(() => {
      expect(getByText(/You have an in-progress Pension benefits application/i))
        .to.exist;

      const actionEl = container.querySelector('va-link-action');
      expect(actionEl).to.exist;
      expect(actionEl.getAttribute('href')).to.equal(MOCK_PENSION_LINK);

      expect(
        container.textContent.includes(
          'You don’t need to reapply for Veterans Pension or DIC',
        ),
      ).to.be.false;
    });

    expect(formsHelpers.getFormLink.calledWith('21P-527EZ')).to.be.true;
    expect(formsHelpers.inProgressApi.calledWith('21P-527EZ')).to.be.true;
  });

  it('falls back to public NextSteps content if no pension benefits in progress form is not found', async () => {
    apiStub = sinon.stub(api, 'apiRequest').rejects(new Error('not found'));

    const { getByText, querySelector } = render(<NextStepsSection loggedIn />);

    await waitFor(() => {
      expect(
        getByText(/You don’t need to reapply for Veterans Pension or DIC/i),
      ).to.exist;

      expect(querySelector?.('va-link-action')).to.not.exist;
    });
  });
});
