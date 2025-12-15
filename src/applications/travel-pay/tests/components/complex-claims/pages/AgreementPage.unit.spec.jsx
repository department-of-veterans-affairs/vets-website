import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { $ } from 'platform/forms-system/src/js/utilities/ui';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { fireEvent } from '@testing-library/react';
import {
  MemoryRouter,
  Routes,
  Route,
  useLocation,
} from 'react-router-dom-v5-compat';
import AgreementPage from '../../../../components/complex-claims/pages/AgreementPage';
import reducer from '../../../../redux/reducer';
import * as actions from '../../../../redux/actions';

describe('Travel Pay – AgreementPage', () => {
  const apptId = '12345';
  const claimId = '45678';
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  const LocationDisplay = () => {
    const location = useLocation();
    return <div data-testid="location-display">{location.pathname}</div>;
  };

  const getData = () => ({
    travelPay: {
      travelClaims: {
        isLoading: false,
        claims: {},
      },
      claimDetails: {
        isLoading: false,
        error: null,
        data: {},
      },
      appointment: {
        isLoading: false,
        error: null,
        data: null,
      },
      claimSubmission: {
        isSubmitting: false,
        error: null,
        data: null,
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
          fetch: {
            isLoading: false,
            error: null,
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
          data: [],
        },
      },
    },
  });

  it('should render the agreement page correctly', () => {
    const screen = renderWithStoreAndRouter(
      <MemoryRouter
        initialEntries={[
          `/file-new-claim/${apptId}/${claimId}/travel-agreement`,
        ]}
      >
        <AgreementPage />
      </MemoryRouter>,
      {
        initialState: getData(),
        reducers: reducer,
      },
    );

    expect(
      screen.getByRole('heading', { name: /beneficiary travel agreement/i }),
    ).to.exist;

    expect(screen.getByText(/Penalty statement:/i)).to.exist;
    expect(screen.getByText(/severe criminal and civil penalties/i)).to.exist;
    expect(screen.getByTestId('travel-agreement-content')).to.exist;

    const checkbox = $('va-checkbox[name="accept-agreement"]');
    expect(checkbox).to.exist;
    expect(checkbox).to.have.attribute('checked', 'false');
    expect(checkbox).to.not.have.attribute('error');

    // Check for individual buttons instead of button pair
    const backButton = $('va-button[text="Back"]');
    const submitButton = $('va-button[text="Submit claim"]');
    expect(backButton).to.exist;
    expect(submitButton).to.exist;
  });

  it('should show an error when submitting without checking the box', () => {
    renderWithStoreAndRouter(
      <MemoryRouter
        initialEntries={[
          `/file-new-claim/${apptId}/${claimId}/travel-agreement`,
        ]}
      >
        <AgreementPage />
      </MemoryRouter>,
      {
        initialState: getData(),
        reducers: reducer,
      },
    );

    const checkbox = $('va-checkbox[name="accept-agreement"]');
    expect(checkbox).to.have.attribute('checked', 'false');

    // Simulate clicking Submit
    const submitButton = $('va-button[text="Submit claim"]');
    expect(submitButton).to.exist;
    fireEvent.click(submitButton);

    const errorCheckbox = $('va-checkbox[name="accept-agreement"]');
    expect(errorCheckbox).to.have.attribute(
      'error',
      'You must accept the beneficiary travel agreement before continuing.',
    );
  });

  it('should clear error when checkbox is checked and submit is clicked', async () => {
    renderWithStoreAndRouter(
      <MemoryRouter
        initialEntries={[
          `/file-new-claim/${apptId}/${claimId}/travel-agreement`,
        ]}
      >
        <Routes>
          <Route
            path="/file-new-claim/:apptId/:claimId/travel-agreement"
            element={<AgreementPage />}
          />
        </Routes>
        <LocationDisplay />
      </MemoryRouter>,
      {
        initialState: getData(),
        reducers: reducer,
      },
    );

    const checkbox = $('va-checkbox[name="accept-agreement"]');
    checkbox.__events.vaChange(); // simulate user checking box

    expect(checkbox).to.have.attribute('checked', 'true');

    const submitButton = $('va-button[text="Submit claim"]');
    expect(submitButton).to.exist;

    // Just test that the button can be clicked without error
    // Navigation testing would require mocking the async action
    fireEvent.click(submitButton);

    // Verify no error on checkbox after successful click
    expect(checkbox).to.not.have.attribute('error');
  });

  it('should toggle the checkbox on multiple clicks', () => {
    renderWithStoreAndRouter(
      <MemoryRouter
        initialEntries={[
          `/file-new-claim/${apptId}/${claimId}/travel-agreement`,
        ]}
      >
        <AgreementPage />
      </MemoryRouter>,
      {
        initialState: getData(),
        reducers: reducer,
      },
    );

    const checkbox = $('va-checkbox[name="accept-agreement"]');
    expect(checkbox).to.have.attribute('checked', 'false');

    checkbox.__events.vaChange();
    expect(checkbox).to.have.attribute('checked', 'true');

    checkbox.__events.vaChange();
    expect(checkbox).to.have.attribute('checked', 'false');
  });

  it('navigates to the review page when back button is clicked', () => {
    const screen = renderWithStoreAndRouter(
      <MemoryRouter
        initialEntries={[
          `/file-new-claim/${apptId}/${claimId}/travel-agreement`,
        ]}
      >
        <Routes>
          <Route
            path="/file-new-claim/:apptId/:claimId/travel-agreement"
            element={<AgreementPage />}
          />
          <Route
            path="/file-new-claim/:apptId/:claimId/review"
            element={<div data-testid="review-page">Review Page</div>}
          />
        </Routes>
        <LocationDisplay />
      </MemoryRouter>,
      {
        initialState: getData(),
        reducers: reducer,
      },
    );

    // Click the back button
    const backButton = $('va-button[text="Back"]');
    expect(backButton).to.exist;
    fireEvent.click(backButton);

    // Check that the location updated
    expect(screen.getByTestId('location-display').textContent).to.equal(
      `/file-new-claim/${apptId}/${claimId}/review`,
    );
  });

  it('navigates to the confirmation page even when submission fails', async () => {
    // Mock submitComplexClaim to reject
    const mockSubmitComplexClaim = sandbox
      .stub(actions, 'submitComplexClaim')
      .callsFake(() => () => Promise.reject(new Error('Submission failed')));

    const screen = renderWithStoreAndRouter(
      <MemoryRouter
        initialEntries={[
          `/file-new-claim/${apptId}/${claimId}/travel-agreement`,
        ]}
      >
        <Routes>
          <Route
            path="/file-new-claim/:apptId/:claimId/travel-agreement"
            element={<AgreementPage />}
          />
          <Route
            path="/file-new-claim/:apptId/:claimId/confirmation"
            element={
              <div data-testid="confirmation-page">Confirmation Page</div>
            }
          />
        </Routes>
        <LocationDisplay />
      </MemoryRouter>,
      {
        initialState: getData(),
        reducers: reducer,
      },
    );

    // Check the agreement checkbox
    const checkbox = $('va-checkbox[name="accept-agreement"]');
    checkbox.__events.vaChange();
    expect(checkbox).to.have.attribute('checked', 'true');

    // Click submit button
    const submitButton = $('va-button[text="Submit claim"]');
    fireEvent.click(submitButton);

    // Wait for navigation to confirmation page
    expect(await screen.findByTestId('confirmation-page')).to.exist;
    expect(screen.getByTestId('location-display').textContent).to.equal(
      `/file-new-claim/${apptId}/${claimId}/confirmation`,
    );

    // Verify the action was called
    expect(mockSubmitComplexClaim.calledOnce).to.be.true;
  });
});
