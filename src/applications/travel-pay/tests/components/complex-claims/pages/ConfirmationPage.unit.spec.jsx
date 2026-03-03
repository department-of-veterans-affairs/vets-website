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

const defaultClaim = {
  claimId,
  totalCostRequested: 100.25,
  expenses: [
    {
      id: 'expense1',
      expenseType: 'Mileage',
      tripType: 'OneWay',
      address: {
        addressLine1: '123 Main St',
        addressLine2: 'Suite 100',
        city: 'Denver',
        stateCode: 'CO',
        zipCode: '80202',
      },
      costRequested: 50.25,
    },
    {
      id: 'expense2',
      expenseType: 'Parking',
      tripType: 'OneWay',
      costRequested: 50.0,
    },
  ],
  documents: [
    {
      documentId: '9c63737a-f29e-f011-b4cc-001dd806c742',
      filename: 'test.pdf',
      mimetype: 'application/pdf',
      createdon: '2025-10-01T18:14:37Z',
      expenseId: 'expense2', // Doc is associated with expense
    },
  ],
};

const getData = () => ({
  travelPay: {
    appointment: {
      isLoading: false,
      error: null,
      data: appointment,
    },
    claimSubmission: { isSubmitting: false, error: null, data: null },
    claimDetails: {
      data: {
        [claimId]: defaultClaim,
      },
    },
    complexClaim: {
      claim: {
        creation: {
          isLoading: false,
          error: null,
        },
        submission: {
          id: '',
          isSubmitting: false,
          error: null,
          data: null,
        },
        data: null,
      },
      expenses: {
        creation: {
          isLoading: false,
          error: null,
        },
        update: {
          id: '',
          isLoading: false,
          error: null,
        },
        delete: {
          id: '',
          isLoading: false,
          error: null,
        },
        data: defaultClaim.expenses,
      },
    },
  },
  user: {
    profile: {
      vapContactInfo: {
        residentialAddress: {
          addressLine1: '123 Test St',
          addressLine2: '',
          city: 'Test City',
          stateCode: 'CO',
          zipCode: '80202',
        },
      },
    },
  },
});

const renderConfirmationPage = (state = getData()) => {
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

const stateWithSuccess = {
  ...getData(),
  travelPay: {
    ...getData().travelPay,
    complexClaim: {
      ...getData().travelPay.complexClaim,
      claim: {
        ...getData().travelPay.complexClaim.claim,
        submission: {
          isSubmitting: false,
          error: null,
          data: { claimNumber: claimId },
        },
      },
    },
  },
};

const stateWithoutAppointment = {
  ...getData(),
  travelPay: {
    ...getData().travelPay,
    appointment: {
      isLoading: false,
      error: null,
      data: null, // no appointment data
    },
    complexClaim: {
      ...getData().travelPay.complexClaim,
      claim: {
        ...getData().travelPay.complexClaim.claim,
        submission: {
          isSubmitting: false,
          error: null,
          data: { claimNumber: claimId }, // submission exists so success alert renders
        },
      },
    },
  },
};

const stateWithError = {
  ...getData(),
  travelPay: {
    ...getData().travelPay,
    complexClaim: {
      ...getData().travelPay.complexClaim,
      claim: {
        ...getData().travelPay.complexClaim.claim,
        submission: {
          isSubmitting: false,
          error: new Error('Forced submit error for testing'), // just needs to exist
          data: null,
        },
      },
    },
  },
};

const stateSubmitting = {
  ...getData(),
  travelPay: {
    ...getData().travelPay,
    complexClaim: {
      ...getData().travelPay.complexClaim,
      claim: {
        ...getData().travelPay.complexClaim.claim,
        submission: {
          isSubmitting: true,
          error: null,
          data: null,
        },
      },
    },
  },
};

describe('Complex Claims ConfirmationPage', () => {
  it('renders loading indicator when submission is in progress', () => {
    const screen = renderConfirmationPage(stateSubmitting);

    const loadingIndicator = screen.getByTestId(
      'travel-pay-confirmation-loading-indicator',
    );
    expect(loadingIndicator).to.exist;

    // Main content should not render
    expect($('va-alert')).to.not.exist;
    expect($('va-accordion')).to.not.exist;
    expect($('va-process-list')).to.not.exist;
  });

  it('does not render an alert when submission state has neither error nor data', () => {
    renderConfirmationPage();

    // No alert should be rendered
    expect($('va-alert')).to.not.exist;

    // Main content like process list should still render
    expect($('va-process-list')).to.exist;
  });

  it('renders success confirmation', () => {
    const screen = renderConfirmationPage(stateWithSuccess);

    expect(screen.getByRole('heading', { level: 1 })).to.have.property(
      'textContent',
      'We’re processing your travel reimbursement claim',
    );
    expect($('va-alert[status="success"]')).to.exist;
    expect(screen.getByText('Claim submitted')).to.exist;
  });

  it('renders appointment details in success alert', () => {
    renderConfirmationPage(stateWithSuccess);

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
    renderConfirmationPage(stateWithSuccess);

    // Check that the claim ID is displayed
    const successAlert = $('va-alert[status="success"]');
    expect(successAlert).to.exist;
    expect(successAlert.textContent).to.include(`Claim number: ${claimId}`);
  });

  it('does not render appointment details when no appointment data', () => {
    renderConfirmationPage(stateWithoutAppointment);

    const successAlert = $('va-alert[status="success"]');
    expect(successAlert).to.exist;
    expect(successAlert.textContent).to.not.include(
      'This claim is for your appointment',
    );
  });

  it('renders error alert even when appointment data is missing', () => {
    const stateErrorNoAppointment = {
      ...stateWithError,
      travelPay: {
        ...stateWithError.travelPay,
        appointment: {
          isLoading: false,
          error: null,
          data: null,
        },
      },
    };
    renderConfirmationPage(stateErrorNoAppointment);

    const errorAlert = $('va-alert[status="error"]');
    expect(errorAlert).to.exist;
    expect(errorAlert.textContent).to.include(
      'We’re sorry. We couldn’t file your travel reimbursement claim',
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
    expect($('va-process-list-item[header="We’ll review your claim"]')).to
      .exist;
    // Check for the second process list item by counting them
    const processListItems = document.querySelectorAll('va-process-list-item');
    expect(processListItems).to.have.length(2);

    // Links in process list
    expect(
      $(
        'va-link[href="/my-health/travel-pay/claims/"][text="Review your travel reimbursement claim status"]',
      ),
    ).to.exist;
    expect(
      $(
        'va-link[href="/resources/how-to-set-up-direct-deposit-for-va-travel-pay-reimbursement/"][text="Learn how to set up direct deposit for travel pay"]',
      ),
    ).to.exist;
  });

  it('renders expense accordion', () => {
    const {
      container,
      getAllByTestId,
      queryByTestId,
    } = renderConfirmationPage();
    expect(container.querySelector('va-accordion')).to.exist;
    expect(
      container.querySelector('va-accordion-item[header="Submitted expenses"]'),
    ).to.exist;
    // Expect multiple headers within the va-accordion-item
    const headers = getAllByTestId('expense-type-header');
    expect(headers).to.have.lengthOf(2);
    // Dont render edit or delete buttons
    expect(queryByTestId('parking-edit-expense-link')).to.not.exist;
    expect(queryByTestId('parking-delete-expense-button')).to.not.exist;
    expect(queryByTestId('mileage-edit-expense-link')).to.not.exist;
    expect(queryByTestId('mileage-delete-expense-button')).to.not.exist;
    expect(queryByTestId('delete-expense-modal')).to.not.exist;
  });

  it('renders link action to submit another claim', () => {
    const { container } = renderConfirmationPage();

    expect(
      container.querySelector(
        'va-link-action[text="Go to your past appointments to file another claim"][href="/my-health/appointments/past"]',
      ),
    ).to.exist;
  });

  it('renders error alert when submission fails', () => {
    const screen = renderConfirmationPage(stateWithError);

    const header = screen.getByRole('heading', { level: 1 });
    expect(header.textContent).to.equal('We couldn’t file your claim');

    const errorAlert = $('va-alert[status="error"]');
    expect(errorAlert).to.exist;
    expect(errorAlert.textContent).to.include(
      'We’re sorry. We couldn’t file your travel reimbursement claim',
    );

    // Appointment details should NOT be rendered in error state
    expect(errorAlert.textContent).to.not.include(
      'This claim is for your appointment',
    );
  });
});
