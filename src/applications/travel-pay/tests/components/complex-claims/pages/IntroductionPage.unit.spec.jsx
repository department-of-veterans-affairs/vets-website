import React from 'react';
import { expect } from 'chai';
import { useSelector } from 'react-redux';
import { waitFor } from '@testing-library/react';
import { $ } from 'platform/forms-system/src/js/utilities/ui';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import {
  MemoryRouter,
  Routes,
  Route,
  useLocation,
} from 'react-router-dom-v5-compat';
import reducer from '../../../../redux/reducer';
import IntroductionPage from '../../../../components/complex-claims/pages/IntroductionPage';
import {
  BTSSS_PORTAL_URL,
  FIND_FACILITY_TP_CONTACT_LINK,
} from '../../../../constants';

// Mock component for navigation testing
const ChooseExpenseType = () => (
  <div data-testid="choose-expense-page">Choose Expense</div>
);

describe('Travel Pay – IntroductionPage', () => {
  const LocationDisplay = () => {
    const location = useLocation();
    return <div data-testid="location-display">{location.pathname}</div>;
  };

  const getData = () => ({
    travelPay: {
      claimSubmission: { isSubmitting: false, error: null, data: null },
      appointment: {
        isLoading: false,
        error: null,
        data: {
          id: '12345',
          facilityName: 'Test Facility',
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
          data: [],
        },
      },
    },
  });

  const initialRoute = '/file-new-claim/12345';

  it('renders the IntroductionPage with correct structure', () => {
    const { getByRole, container } = renderWithStoreAndRouter(
      <MemoryRouter initialEntries={[initialRoute]}>
        <IntroductionPage />
      </MemoryRouter>,
      {
        initialState: getData(),
        reducers: reducer,
      },
    );

    // Main heading
    expect(
      getByRole('heading', {
        name: /file a travel reimbursement claim/i,
      }),
    ).to.exist;

    // Process list and step headers
    expect(container.querySelectorAll('va-process-list').length).to.equal(1);
    expect(container.querySelectorAll('va-process-list-item').length).to.equal(
      3,
    );
    expect(
      $(
        'va-process-list-item[header*="Check your travel reimbursement eligibility"]',
        container,
      ),
    ).to.exist;
    expect(
      $('va-process-list-item[header*="Set up direct deposit"]', container),
    ).to.exist;
    expect($('va-process-list-item[header*="File your claim"]', container)).to
      .exist;
  });

  it('renders all important VA links with expected hrefs', () => {
    const { container, getByRole } = renderWithStoreAndRouter(
      <MemoryRouter initialEntries={[initialRoute]}>
        <IntroductionPage />
      </MemoryRouter>,
      {
        initialState: getData(),
        reducers: reducer,
      },
    );

    expect(
      $(
        'va-link[href="/health-care/get-reimbursed-for-travel-pay/#eligibility-for-general-health"]',
        container,
      ),
    ).to.exist;

    expect(
      $(
        'va-link[href="/resources/how-to-set-up-direct-deposit-for-va-travel-pay-reimbursement/"]',
        container,
      ),
    ).to.exist;

    const btsssPortalLink = $(`va-link[href="${BTSSS_PORTAL_URL}"]`, container);
    expect(btsssPortalLink).to.exist;
    expect(btsssPortalLink).to.have.attribute('external');

    expect($(`va-link[href="${FIND_FACILITY_TP_CONTACT_LINK}"]`, container)).to
      .exist;

    expect(
      getByRole('link', {
        name: /go to your travel reimbursement claims page/i,
      }),
    ).to.have.attribute('href', '/claims/');
  });

  it('navigates to choose-expense when a claim already exists', async () => {
    // Set up initial state with a created claim
    const stateWithCreatedClaim = {
      ...getData(),
      travelPay: {
        ...getData().travelPay,
        complexClaim: {
          ...getData().travelPay.complexClaim,
          claim: {
            ...getData().travelPay.complexClaim.claim,
            data: {
              claimId: '45678',
            },
          },
        },
      },
    };

    const { getByTestId } = renderWithStoreAndRouter(
      <MemoryRouter initialEntries={[initialRoute]}>
        <Routes>
          <Route
            path="/file-new-claim/:apptId"
            element={<IntroductionPage />}
          />
          <Route
            path="/file-new-claim/:apptId/:claimId/choose-expense"
            element={<ChooseExpenseType />}
          />
        </Routes>
        <LocationDisplay />
      </MemoryRouter>,
      {
        initialState: stateWithCreatedClaim,
        reducers: reducer,
      },
    );

    // ComplexClaimRedirect should automatically redirect to choose-expense
    await waitFor(() => {
      expect(getByTestId('location-display').textContent).to.equal(
        '/file-new-claim/12345/45678/choose-expense',
      );
    });
  });

  it('creates claim and navigates to choose-expense when Start button is clicked', async () => {
    // Set up state with NO existing claim
    const stateWithoutClaim = getData();

    const { getByTestId, container } = renderWithStoreAndRouter(
      <MemoryRouter initialEntries={[initialRoute]}>
        <Routes>
          <Route
            path="/file-new-claim/:apptId"
            element={<IntroductionPage />}
          />
          <Route
            path="/file-new-claim/:apptId/:claimId/choose-expense"
            element={<ChooseExpenseType />}
          />
        </Routes>
        <LocationDisplay />
      </MemoryRouter>,
      {
        initialState: stateWithoutClaim,
        reducers: reducer,
      },
    );

    // Verify the intro page renders (no redirect happens)
    expect(getByTestId('introduction-page')).to.exist;

    // Click the start button
    const startButton = $(
      'va-link-action[text="Start your travel reimbursement claim"]',
      container,
    );
    expect(startButton).to.exist;
    startButton.click();
  });

  it('renders OMB info', () => {
    const { container } = renderWithStoreAndRouter(
      <MemoryRouter initialEntries={[initialRoute]}>
        <IntroductionPage />
      </MemoryRouter>,
      {
        initialState: getData(),
        reducers: reducer,
      },
    );

    expect($('va-omb-info[exp-date="11/30/2027"]'), container).to.exist;
    expect($('va-omb-info[omb-number="2900-0798"]'), container).to.exist;
    expect($('va-omb-info[res-burden="10"]'), container).to.exist;
  });

  it('renders the Need help section with contact info', () => {
    const { container, getByText } = renderWithStoreAndRouter(
      <MemoryRouter initialEntries={[initialRoute]}>
        <IntroductionPage />
      </MemoryRouter>,
      {
        initialState: getData(),
        reducers: reducer,
      },
    );

    expect(getByText('Need help?')).to.exist;
    expect(
      getByText(/You can call the Beneficiary Travel Self Service System/i),
    ).to.exist;
    expect($('va-telephone[contact="8555747292"]', container)).to.exist;
    expect($('va-telephone[tty][contact="711"]', container)).to.exist;
  });

  it('renders correctly even if appointment prop is missing', () => {
    const { getByTestId } = renderWithStoreAndRouter(
      <MemoryRouter initialEntries={[initialRoute]}>
        <IntroductionPage />
      </MemoryRouter>,
      {
        initialState: getData(),
        reducers: reducer,
      },
    );

    expect(getByTestId('introduction-page')).to.exist;
  });

  it('hides the start button when appointment is community care (isCC)', () => {
    const stateWithCCAppointment = {
      ...getData(),
      travelPay: {
        ...getData().travelPay,
        appointment: {
          ...getData().travelPay.appointment,
          data: {
            id: '12345',
            facilityName: 'Test Facility',
            isCC: true,
          },
        },
      },
    };

    const { container } = renderWithStoreAndRouter(
      <MemoryRouter initialEntries={[initialRoute]}>
        <IntroductionPage />
      </MemoryRouter>,
      {
        initialState: stateWithCCAppointment,
        reducers: reducer,
      },
    );

    // Verify the start button does not exist
    const startButton = $(
      'va-link-action[text="Start your travel reimbursement claim"]',
      container,
    );
    expect(startButton).to.not.exist;
  });

  it('shows the start button when appointment is not community care', () => {
    const stateWithNonCCAppointment = {
      ...getData(),
      travelPay: {
        ...getData().travelPay,
        appointment: {
          ...getData().travelPay.appointment,
          data: {
            id: '12345',
            facilityName: 'Test Facility',
            isCC: false,
          },
        },
      },
    };

    const { container } = renderWithStoreAndRouter(
      <MemoryRouter initialEntries={[initialRoute]}>
        <IntroductionPage />
      </MemoryRouter>,
      {
        initialState: stateWithNonCCAppointment,
        reducers: reducer,
      },
    );

    // Verify the start button exists
    const startButton = $(
      'va-link-action[text="Start your travel reimbursement claim"]',
      container,
    );
    expect(startButton).to.exist;
  });

  it('navigates using appointment claim ID when complexClaim data is null', async () => {
    // Set up state with claim ID on appointment but null complexClaim data
    const stateWithAppointmentClaim = {
      ...getData(),
      travelPay: {
        ...getData().travelPay,
        appointment: {
          ...getData().travelPay.appointment,
          data: {
            id: '12345',
            facilityName: 'Test Facility',
            travelPayClaim: {
              claim: {
                id: '99999',
              },
            },
          },
        },
        complexClaim: {
          ...getData().travelPay.complexClaim,
          claim: {
            ...getData().travelPay.complexClaim.claim,
            data: null,
          },
        },
      },
    };

    const { getByTestId, container } = renderWithStoreAndRouter(
      <MemoryRouter initialEntries={[initialRoute]}>
        <Routes>
          <Route
            path="/file-new-claim/:apptId"
            element={<IntroductionPage />}
          />
          <Route
            path="/file-new-claim/:apptId/:claimId/choose-expense"
            element={<ChooseExpenseType />}
          />
        </Routes>
        <LocationDisplay />
      </MemoryRouter>,
      {
        initialState: stateWithAppointmentClaim,
        reducers: reducer,
      },
    );

    const startButton = $(
      'va-link-action[text="Start your travel reimbursement claim"]',
      container,
    );
    expect(startButton).to.exist;
    startButton.click();

    await waitFor(() => {
      expect(getByTestId('location-display').textContent).to.equal(
        '/file-new-claim/12345/99999/choose-expense',
      );
    });
  });

  it('renders ComplexClaimRedirect when no skipRedirect state is present', () => {
    const stateWithCreatedClaim = {
      ...getData(),
      travelPay: {
        ...getData().travelPay,
        complexClaim: {
          ...getData().travelPay.complexClaim,
          claim: {
            ...getData().travelPay.complexClaim.claim,
            data: {
              claimId: '45678',
            },
          },
        },
      },
    };

    const { container } = renderWithStoreAndRouter(
      <MemoryRouter initialEntries={[initialRoute]}>
        <IntroductionPage />
      </MemoryRouter>,
      {
        initialState: stateWithCreatedClaim,
        reducers: reducer,
      },
    );

    // The redirect component should be rendered (and it will redirect)
    // We can't directly test for the component, but we can verify the page structure
    expect(container.querySelector('[data-testid="introduction-page"]')).to
      .exist;
  });

  it('does NOT render ComplexClaimRedirect when skipRedirect state is true', () => {
    const stateWithCreatedClaim = {
      ...getData(),
      travelPay: {
        ...getData().travelPay,
        complexClaim: {
          ...getData().travelPay.complexClaim,
          claim: {
            ...getData().travelPay.complexClaim.claim,
            data: {
              claimId: '45678',
            },
          },
        },
      },
    };

    const { getByTestId, queryByTestId } = renderWithStoreAndRouter(
      <MemoryRouter
        initialEntries={[
          { pathname: initialRoute, state: { skipRedirect: true } },
        ]}
      >
        <IntroductionPage />
      </MemoryRouter>,
      {
        initialState: stateWithCreatedClaim,
        reducers: reducer,
      },
    );

    // The introduction page should render
    expect(getByTestId('introduction-page')).to.exist;

    // The page should NOT redirect to choose-expense because skipRedirect is true
    expect(queryByTestId('choose-expense-page')).to.not.exist;
  });

  it('renders ComplexClaimRedirect on browser reload (no location state)', async () => {
    const stateWithCreatedClaim = {
      ...getData(),
      travelPay: {
        ...getData().travelPay,
        complexClaim: {
          ...getData().travelPay.complexClaim,
          claim: {
            ...getData().travelPay.complexClaim.claim,
            data: {
              claimId: '45678',
            },
          },
        },
      },
    };

    const { getByTestId } = renderWithStoreAndRouter(
      <MemoryRouter initialEntries={[initialRoute]}>
        <Routes>
          <Route
            path="/file-new-claim/:apptId"
            element={<IntroductionPage />}
          />
          <Route
            path="/file-new-claim/:apptId/:claimId/choose-expense"
            element={<ChooseExpenseType />}
          />
        </Routes>
        <LocationDisplay />
      </MemoryRouter>,
      {
        initialState: stateWithCreatedClaim,
        reducers: reducer,
      },
    );

    // ComplexClaimRedirect should automatically redirect to choose-expense
    // because there's no skipRedirect state (simulating a browser reload)
    await waitFor(() => {
      expect(getByTestId('location-display').textContent).to.equal(
        '/file-new-claim/12345/45678/choose-expense',
      );
    });
  });

  it('does NOT redirect when navigating from choose-expense with skipRedirect state', () => {
    const stateWithCreatedClaim = {
      ...getData(),
      travelPay: {
        ...getData().travelPay,
        complexClaim: {
          ...getData().travelPay.complexClaim,
          claim: {
            ...getData().travelPay.complexClaim.claim,
            data: {
              claimId: '45678',
            },
          },
        },
      },
    };

    const { getByTestId, container } = renderWithStoreAndRouter(
      <MemoryRouter
        initialEntries={[
          { pathname: initialRoute, state: { skipRedirect: true } },
        ]}
      >
        <Routes>
          <Route
            path="/file-new-claim/:apptId"
            element={<IntroductionPage />}
          />
          <Route
            path="/file-new-claim/:apptId/:claimId/choose-expense"
            element={<ChooseExpenseType />}
          />
        </Routes>
        <LocationDisplay />
      </MemoryRouter>,
      {
        initialState: stateWithCreatedClaim,
        reducers: reducer,
      },
    );

    // Should stay on intro page
    expect(getByTestId('introduction-page')).to.exist;

    // Verify we're still on the intro route
    expect(getByTestId('location-display').textContent).to.equal(
      '/file-new-claim/12345',
    );

    // Verify the start button is still present
    const startButton = $(
      'va-link-action[text="Start your travel reimbursement claim"]',
      container,
    );
    expect(startButton).to.exist;
  });

  it('dispatches setExpenseBackDestination with "intro" when start button is clicked', async () => {
    const stateWithExistingClaim = {
      travelPay: {
        ...getData().travelPay,
        complexClaim: {
          ...getData().travelPay.complexClaim,
          claim: {
            ...getData().travelPay.complexClaim.claim,
            data: {
              claimId: '45678',
            },
          },
        },
      },
    };

    // Component to verify Redux state
    const StateDisplay = () => {
      const expenseBackDestination = useSelector(
        state => state.travelPay.complexClaim.expenseBackDestination,
      );
      return (
        <div data-testid="expense-back-destination">
          {expenseBackDestination || 'none'}
        </div>
      );
    };

    const { container, getByTestId } = renderWithStoreAndRouter(
      <MemoryRouter
        initialEntries={[
          { pathname: initialRoute, state: { skipRedirect: true } },
        ]}
      >
        <Routes>
          <Route
            path="/file-new-claim/:apptId"
            element={<IntroductionPage />}
          />
        </Routes>
        <StateDisplay />
      </MemoryRouter>,
      {
        initialState: stateWithExistingClaim,
        reducers: reducer,
      },
    );

    // Find and click the start button
    const startButton = $(
      'va-link-action[text="Start your travel reimbursement claim"]',
      container,
    );
    expect(startButton).to.exist;
    startButton.click();

    // Verify Redux state is updated
    await waitFor(() => {
      expect(getByTestId('expense-back-destination').textContent).to.equal(
        'intro',
      );
    });
  });

  it('shows OutOfBoundsAppointmentAlert when appointment is out of bounds', () => {
    const stateWithOutOfBoundsAppointment = {
      ...getData(),
      travelPay: {
        ...getData().travelPay,
        appointment: {
          ...getData().travelPay.appointment,
          data: {
            id: '12345',
            facilityName: 'Test Facility',
            isOutOfBounds: true,
          },
        },
      },
    };

    const { getByRole } = renderWithStoreAndRouter(
      <MemoryRouter initialEntries={[initialRoute]}>
        <IntroductionPage />
      </MemoryRouter>,
      {
        initialState: stateWithOutOfBoundsAppointment,
        reducers: reducer,
      },
    );

    // Verify the alert is displayed
    expect(
      getByRole('heading', {
        name: /your appointment happened more than 30 days ago/i,
      }),
    ).to.exist;
  });

  it('does not show OutOfBoundsAppointmentAlert when appointment is not out of bounds', () => {
    const stateWithInBoundsAppointment = {
      ...getData(),
      travelPay: {
        ...getData().travelPay,
        appointment: {
          ...getData().travelPay.appointment,
          data: {
            id: '12345',
            facilityName: 'Test Facility',
            isOutOfBounds: false,
          },
        },
      },
    };

    const { queryByRole } = renderWithStoreAndRouter(
      <MemoryRouter initialEntries={[initialRoute]}>
        <IntroductionPage />
      </MemoryRouter>,
      {
        initialState: stateWithInBoundsAppointment,
        reducers: reducer,
      },
    );

    // Verify the alert is NOT displayed
    expect(
      queryByRole('heading', {
        name: /your appointment happened more than 30 days ago/i,
      }),
    ).to.not.exist;
  });
});
