import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { fireEvent } from '@testing-library/react';
import { $ } from 'platform/forms-system/src/js/utilities/ui';
import { MemoryRouter, Routes, Route } from 'react-router-dom-v5-compat';

import reducer from '../../../../redux/reducer';
import ConfirmationPage from '../../../../components/complex-claims/pages/ConfirmationPage';

const appointment = {
  location: { attributes: { name: 'Fort Collins VA Clinic' } },
  start: '2025-01-15T21:39:27.698Z',
  localStartTime: '2025-03-20T16:30:00.000-08:00',
};

const claimId = 'test-claim-id-123';
const apptId = 'appt-123';

const initialState = {
  travelPay: {
    appointment: {
      isLoading: false,
      error: null,
      data: appointment,
    },
  },
};

const renderConfirmationPage = (state = initialState) => {
  return renderWithStoreAndRouter(
    <MemoryRouter
      initialEntries={[`/file-new-claim/${apptId}/${claimId}/confirmation`]}
    >
      <Routes>
        <Route
          path="/file-new-claim/:apptId/:claimId/confirmation"
          element={<ConfirmationPage />}
        />
      </Routes>
    </MemoryRouter>,
    {
      initialState: state,
      reducers: reducer,
    },
  );
};

describe('Complex Claims ConfirmationPage', () => {
  it('renders success confirmation', () => {
    const screen = renderConfirmationPage();

    expect(screen.getByRole('heading', { level: 1 })).to.have.property(
      'textContent',
      'We’re processing your travel reimbursement claim',
    );
    expect($('va-alert[status="success"]')).to.exist;
    expect(screen.getByText('Claim submitted')).to.exist;
  });

  it('renders appointment details in success alert', () => {
    renderConfirmationPage();

    // Find the success alert first, then check its content
    const successAlert = $('va-alert[status="success"]');
    expect(successAlert).to.exist;

    // Check that the appointment details are present in the success alert
    const alertText = successAlert.textContent;
    expect(alertText).to.include(
      'This claim is for your appointment at Fort Collins VA Clinic',
    );
  });

  it('renders claim ID from URL params', () => {
    renderConfirmationPage();

    // Check that the claim ID is displayed
    const successAlert = $('va-alert[status="success"]');
    expect(successAlert).to.exist;
    expect(successAlert.textContent).to.include(`Claim number: ${claimId}`);
  });

  it('does not render appointment details when no appointment data', () => {
    const stateWithoutAppointment = {
      travelPay: {
        appointment: {
          isLoading: false,
          error: null,
          data: null,
        },
      },
    };

    renderConfirmationPage(stateWithoutAppointment);

    const successAlert = $('va-alert[status="success"]');
    expect(successAlert).to.exist;
    expect(successAlert.textContent).to.not.include(
      'This claim is for your appointment',
    );
  });

  it('renders print button', () => {
    const oldPrint = global.window.print;
    const printSpy = sinon.spy();
    global.window.print = printSpy;

    renderConfirmationPage();

    const printButton = $('va-button[text="Print this page for your records"]');
    expect(printButton).to.exist;

    expect(printSpy.notCalled).to.be.true;
    fireEvent.click(printButton);
    expect(printSpy.calledOnce).to.be.true;

    global.window.print = oldPrint;
  });

  it('renders what happens next section with process list', () => {
    const screen = renderConfirmationPage();

    expect(screen.getByText('What happens next')).to.exist;
    expect($('va-process-list')).to.exist;
    expect($('va-process-list-item[header="VA will review your claim"]')).to
      .exist;
    // Check for the second process list item by counting them
    const processListItems = document.querySelectorAll('va-process-list-item');
    expect(processListItems).to.have.length(2);

    // Links in process list
    expect(
      $(
        'va-link[href="/my-health/travel-pay/claims/"][text="Check your travel reimbursement claim status"]',
      ),
    ).to.exist;
    expect(
      $(
        'va-link[href="/resources/how-to-set-up-direct-deposit-for-va-travel-pay-reimbursement/"][text="Set up direct deposit"]',
      ),
    ).to.exist;
  });

  it('renders link action to submit another claim', () => {
    renderConfirmationPage();

    expect(
      $(
        'va-link-action[text="Submit another travel reimbursement claim"][href="/my-health/appointments/past"]',
      ),
    ).to.exist;
  });
});
