import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { render, fireEvent } from '@testing-library/react';
import { $ } from 'platform/forms-system/src/js/utilities/ui';

import ConfirmationPage from '../../../../components/complex-claims/pages/ConfirmationPage';

describe('Complex Claims ConfirmationPage', () => {
  let windowPrintStub;

  beforeEach(() => {
    windowPrintStub = sinon.stub(window, 'print');
  });

  afterEach(() => {
    windowPrintStub.restore();
  });

  it('renders success confirmation when no error and data is present', () => {
    const screen = render(<ConfirmationPage />);

    expect(screen.getByRole('heading', { level: 1 })).to.have.property(
      'textContent',
      'We’re processing your travel reimbursement claim',
    );
    expect($('va-alert[status="success"]')).to.exist;
    expect(screen.getByText('Claim submitted')).to.exist;
  });

  it('renders appointment details in success alert', () => {
    render(<ConfirmationPage />);

    // Find the success alert first, then check its content
    const successAlert = $('va-alert[status="success"]');
    expect(successAlert).to.exist;

    // Check that the appointment details are present in the success alert
    const alertText = successAlert.textContent;
    expect(alertText).to.include(
      'This claim is for your appointment at Fort Collins VA Clinic',
    );
  });

  it('renders print button', () => {
    render(<ConfirmationPage />);

    const printButton = $('va-button[text="Print this page for your records"]');
    expect(printButton).to.exist;

    fireEvent.click(printButton);
    expect(windowPrintStub.calledOnce).to.be.true;
  });

  it('renders what happens next section with process list', () => {
    const screen = render(<ConfirmationPage />);

    expect(screen.getByText('What happens next')).to.exist;
    expect($('va-process-list')).to.exist;
    expect($('va-process-list-item[header="VA will review your claim"]')).to
      .exist;
    expect(
      $(
        `va-process-list-item[header="If your claim is approved, you’ll receive reimbursement via direct deposit"]`,
      ),
    ).to.exist;

    // Links in process list
    expect(
      $(
        'va-link[href="/my-health/travel-pay/claims/"][text="Check your travel reimbursement claim status"]',
      ),
    ).to.exist;
    expect(
      $(
        'va-link[href="/my-health/travel-reimbursement-claims/direct-deposit"][text="Set up direct deposit"]',
      ),
    ).to.exist;
  });

  it('renders link action to submit another claim', () => {
    render(<ConfirmationPage />);

    expect(
      $(
        'va-link-action[text="Submit another travel reimbursement claim"][href="/my-health/appointments/past"]',
      ),
    ).to.exist;
  });
});
