import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { $ } from 'platform/forms-system/src/js/utilities/ui';
import * as recordEventModule from 'platform/monitoring/record-event';

import reducer from '../../../../redux/reducer';
import ConfirmationPage from '../../../../components/submit-flow/pages/ConfirmationPage';

const appointment = {
  location: { attributes: { name: 'VA location name' } },
  start: '2025-01-15T21:39:27.698Z',
  localStartTime: '2025-01-15T21:39:27+08:00',
};

describe('Confirmation page', () => {
  let recordEventStub;

  beforeEach(() => {
    recordEventStub = sinon.stub(recordEventModule, 'default');
  });

  afterEach(() => {
    recordEventStub.restore();
  });

  it('should render with expected content and record the pageview', () => {
    const screen = renderWithStoreAndRouter(<ConfirmationPage />, {
      initialState: {
        travelPay: {
          appointment: {
            isLoading: false,
            error: null,
            data: appointment,
          },
          claimSubmission: {
            isSubmitting: false,
            error: null,
            data: { claimId: '12345' },
          },
        },
      },
      reducers: reducer,
    });

    expect(screen.getByText('We’re processing your travel reimbursement claim'))
      .to.exist;
    expect(
      recordEventStub.calledWith({
        event: 'smoc-pageview',
        action: 'view',
        /* eslint-disable camelcase */
        heading_1: 'confirmation',
        /* eslint-enable camelcase */
      }),
    ).to.be.true;
    expect($('va-link[href="/my-health/travel-pay/claims/"]')).to.exist;
    expect($('va-link[text="Check your travel reimbursement claim status"]')).to
      .exist;

    expect(
      $(
        'va-link[href="/resources/how-to-set-up-direct-deposit-for-va-travel-pay-reimbursement/"]',
      ),
    ).to.exist;
    expect(
      $(
        'va-link[text="Learn how to set up direct deposit for travel pay reimbursement"]',
      ),
    ).to.exist;

    expect($('va-alert[status="success"]')).to.exist;
  });

  it('should render practictioner name if available', () => {
    const screen = renderWithStoreAndRouter(<ConfirmationPage />, {
      initialState: {
        travelPay: {
          appointment: {
            isLoading: false,
            error: null,
            data: {
              ...appointment,
              practitionerName: 'First Middle Last',
            },
          },
          claimSubmission: {
            isSubmitting: false,
            error: null,
            data: { claimId: '12345' },
          },
        },
      },
      reducers: reducer,
    });

    expect(screen.getByText('We’re processing your travel reimbursement claim'))
      .to.exist;

    expect(screen.getByText(/with First Middle Last/i)).to.exist;
  });

  it('should render a loading spinner while claim is submitting', () => {
    const screen = renderWithStoreAndRouter(<ConfirmationPage />, {
      initialState: {
        travelPay: {
          appointment: {
            isLoading: false,
            error: null,
            data: appointment,
          },
          claimSubmission: {
            isSubmitting: true,
            error: null,
            data: null,
          },
        },
      },
      reducers: reducer,
    });

    expect(screen.getByText('We’re processing your travel reimbursement claim'))
      .to.exist;
    expect($('va-loading-indicator')).to.exist;
  });
});
