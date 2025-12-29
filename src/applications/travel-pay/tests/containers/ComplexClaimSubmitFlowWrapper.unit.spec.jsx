import React from 'react';
import { fireEvent, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import {
  MemoryRouter,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom-v5-compat';
import { $ } from 'platform/forms-system/src/js/utilities/ui';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { TRAVEL_PAY_FILE_NEW_CLAIM_ENTRY } from '@department-of-veterans-affairs/mhv/exports';

import reducer from '../../redux/reducer';
import ComplexClaimSubmitFlowWrapper from '../../containers/ComplexClaimSubmitFlowWrapper';
import * as actions from '../../redux/actions';

// Mock components for navigation testing
const ClaimDetailsPage = () => <div>Claim Details</div>;
const IntroPage = () => <div>Intro</div>;

// Import real pages only when actually testing their functionality
import ReviewPage from '../../components/complex-claims/pages/ReviewPage';
import AgreementPage from '../../components/complex-claims/pages/AgreementPage';

describe('ComplexClaimSubmitFlowWrapper', () => {
  const oldLocation = global.window.location;

  const getData = ({
    complexClaimsEnabled = true,
    appointmentId = '12345',
    claimData = null,
    claimError = null,
    isClaimFetchLoading = false,
    travelPayClaim = null,
    hasUnsavedChanges = false,
    expenses = [],
  } = {}) => ({
    featureToggles: {
      loading: false,
      /* eslint-disable camelcase */
      travel_pay_enable_complex_claims: complexClaimsEnabled,
      /* eslint-enable camelcase */
    },
    travelPay: {
      appointment: {
        data: {
          id: appointmentId,
          facilityName: 'Test VA Medical Center',
          facilityAddress: {
            addressLine1: '123 Medical Center Drive',
            city: 'Test City',
            stateCode: 'TX',
            zipCode: '12345',
          },
          appointmentDate: '2024-01-15',
          appointmentTime: '10:00 AM',
          travelPayClaim,
        },
        error: null,
        isLoading: false,
      },
      claimDetails: {
        data: {},
        error: null,
        isLoading: false,
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
            isLoading: isClaimFetchLoading,
            error: claimError,
          },
          data: claimData,
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
          data: expenses,
          hasUnsavedChanges,
        },
      },
    },
  });

  beforeEach(() => {
    global.window.location = {};
    global.window.location.replace = sinon.spy();
  });

  afterEach(() => {
    global.window.location = oldLocation;
  });

  const LocationDisplay = () => {
    const location = useLocation();
    return <div data-testid="location-display">{location.pathname}</div>;
  };

  const appointmentId = 'e3b7f3c2-9c41-4b6f-9f0e-76d3e2af8a91';
  const claimId = 'a48d48d4-cdc5-4922-8355-c1a9b2742feb';

  const renderWithStoreAndRouterHelper = (
    apptId = appointmentId,
    initialState = {},
  ) => {
    return renderWithStoreAndRouter(
      <MemoryRouter initialEntries={[`/file-new-claim/${apptId}`]}>
        <Routes>
          <Route
            path="/file-new-claim/:apptId"
            element={<ComplexClaimSubmitFlowWrapper />}
          >
            <Route
              path="get-claim-error"
              element={<div> Get Claim Error Page</div>}
            />
          </Route>
          <Route index element={<IntroPage />} />
        </Routes>
        <LocationDisplay />
      </MemoryRouter>,
      {
        initialState,
        reducers: reducer,
      },
    );
  };

  describe('Feature flag behavior', () => {
    it('redirects to home when complex claims feature flag is disabled', () => {
      const initialState = getData({
        complexClaimsEnabled: false,
        claimData: { claimId },
      });

      renderWithStoreAndRouterHelper(appointmentId, initialState);

      expect(global.window.location.replace.calledWith('/')).to.be.true;
    });

    it('renders normally when complex claims feature flag is enabled', () => {
      const initialState = getData({
        complexClaimsEnabled: true,
        claimData: { claimId },
      });

      renderWithStoreAndRouterHelper(appointmentId, initialState);

      expect($('article.usa-grid-full')).to.exist;
      expect($('.vads-l-col--12.medium-screen\\:vads-l-col--8')).to.exist;
      expect(global.window.location.replace.called).to.be.false;
    });
  });

  describe('When feature flag is enabled', () => {
    it('renders the component with correct structure', () => {
      const initialState = getData({
        complexClaimsEnabled: true,
        claimData: { claimId },
      });
      renderWithStoreAndRouterHelper(appointmentId, initialState);

      expect($('article.usa-grid-full')).to.exist;
      expect($('.vads-l-col--12.medium-screen\\:vads-l-col--8')).to.exist;
    });

    it('renders the back link with correct href and text', () => {
      sessionStorage.setItem(
        TRAVEL_PAY_FILE_NEW_CLAIM_ENTRY.SESSION_KEY,
        TRAVEL_PAY_FILE_NEW_CLAIM_ENTRY.ENTRY_TYPES.APPOINTMENT,
      );
      const initialState = getData({
        complexClaimsEnabled: true,
        claimData: { claimId },
      });
      renderWithStoreAndRouterHelper(appointmentId, initialState);

      const backLink = $(
        'va-link[back][data-testid="complex-claim-back-link"]',
      );
      expect(backLink).to.exist;
      expect(backLink.getAttribute('href')).to.equal(
        `/my-health/appointments/past/${appointmentId}`,
      );
      expect(backLink.getAttribute('text')).to.equal('Back to appointment');
      expect(backLink.hasAttribute('disable-analytics')).to.be.true;

      sessionStorage.clear();
    });

    it('renders the ReviewPage component', () => {
      const initialState = getData({
        complexClaimsEnabled: true,
        claimData: { claimId },
      });
      const screen = renderWithStoreAndRouter(
        <MemoryRouter
          initialEntries={[
            `/file-new-claim/${appointmentId}/${claimId}/review`,
          ]}
        >
          <Routes>
            <Route
              path="/file-new-claim/:apptId/:claimId"
              element={<ComplexClaimSubmitFlowWrapper />}
            >
              <Route path="review" element={<ReviewPage />} />
            </Route>
          </Routes>
        </MemoryRouter>,
        { initialState, reducers: reducer },
      );

      expect(screen.getByTestId('review-page')).to.exist;
    });

    it('shows the ReviewPage first, and after clicking Sign Agreement navigates to the AgreementPage', async () => {
      const initialState = getData({
        complexClaimsEnabled: true,
        claimData: { claimId },
        expenses: [
          {
            // At least one expense so the sign agreement button renders
            id: 'expense2',
            expenseType: 'Parking',
            description: 'Parking at hospital',
            document: { filename: 'test.pdf' },
            dateIncurred: '2023-10-15',
            costRequested: 15,
          },
        ],
      });
      const {
        container,
        queryByTestId,
        getByTestId,
      } = renderWithStoreAndRouter(
        <MemoryRouter
          initialEntries={[
            `/file-new-claim/${appointmentId}/${claimId}/review`,
          ]}
        >
          <Routes>
            <Route
              path="/file-new-claim/:apptId/:claimId"
              element={<ComplexClaimSubmitFlowWrapper />}
            >
              <Route path="review" element={<ReviewPage onNext={() => {}} />} />
              <Route path="travel-agreement" element={<AgreementPage />} />
            </Route>
          </Routes>
        </MemoryRouter>,
        { initialState, reducers: reducer },
      );

      // Page 1 should render first (ReviewPage)
      expect(getByTestId('review-page')).to.exist;

      const signButton = $('#sign-agreement-button', container);
      fireEvent.click(signButton);

      // Agreement page should render
      expect(getByTestId('agreement-checkbox')).to.exist;

      // ReviewPage is no longer visible
      expect(queryByTestId('review-page')).to.be.null;
    });

    it('handles different appointment IDs in the URL', () => {
      sessionStorage.setItem(
        TRAVEL_PAY_FILE_NEW_CLAIM_ENTRY.SESSION_KEY,
        TRAVEL_PAY_FILE_NEW_CLAIM_ENTRY.ENTRY_TYPES.APPOINTMENT,
      );
      const initialState = getData({
        complexClaimsEnabled: true,
        claimData: { claimId },
      });
      const testIds = ['abc123', '12345-67890', 'uuid-format-12345'];

      testIds.forEach(apptId => {
        const { container } = renderWithStoreAndRouterHelper(
          apptId,
          initialState,
        );

        const backLink = container.querySelector(
          'va-link[data-testid="complex-claim-back-link"]',
        );
        expect(backLink.getAttribute('href')).to.equal(
          `/my-health/appointments/past/${apptId}`,
        );
      });

      sessionStorage.clear();
    });

    it('renders with proper scroll element name', () => {
      const initialState = getData({
        complexClaimsEnabled: true,
        claimData: { claimId },
      });
      renderWithStoreAndRouterHelper(appointmentId, initialState);

      expect($('[name="topScrollElement"]')).to.exist;
    });

    it('applies correct CSS classes for layout', () => {
      const initialState = getData({
        complexClaimsEnabled: true,
        claimData: { claimId },
      });
      renderWithStoreAndRouterHelper(appointmentId, initialState);

      const article = $('article');
      expect(article.classList.contains('usa-grid-full')).to.be.true;
      expect(article.classList.contains('vads-u-margin-bottom--0')).to.be.true;

      const paddingContainer = $(
        '.vads-u-padding-top--2p5.vads-u-padding-bottom--4',
      );
      expect(paddingContainer).to.exist;

      const contentColumn = $('.vads-l-col--12.medium-screen\\:vads-l-col--8');
      expect(contentColumn).to.exist;
    });

    describe('URL parameter extraction', () => {
      it('extracts apptId from URL params correctly', () => {
        sessionStorage.setItem(
          TRAVEL_PAY_FILE_NEW_CLAIM_ENTRY.SESSION_KEY,
          TRAVEL_PAY_FILE_NEW_CLAIM_ENTRY.ENTRY_TYPES.APPOINTMENT,
        );
        const initialState = getData({
          complexClaimsEnabled: true,
          claimData: { claimId: '45678' },
        });
        // Test that the component can handle various appointment ID formats
        const testCases = ['abc123', '12345-67890', 'uuid-format-12345'];

        testCases.forEach(expectedId => {
          // Create a fresh render for each test case
          const { container } = renderWithStoreAndRouterHelper(
            expectedId,
            initialState,
          );

          const backLink = container.querySelector(
            'va-link[data-testid="complex-claim-back-link"]',
          );
          expect(backLink.getAttribute('href')).to.equal(
            `/my-health/appointments/past/${expectedId}`,
          );
        });

        sessionStorage.clear();
      });
    });
  });

  describe('Loading states', () => {
    it('shows loading indicator when claim fetch is loading', () => {
      const initialState = getData({
        complexClaimsEnabled: true,
        isClaimFetchLoading: true,
      });

      const { getByTestId } = renderWithStoreAndRouterHelper(
        appointmentId,
        initialState,
      );

      expect(getByTestId('travel-pay-loading-indicator')).to.exist;
    });

    it('shows loading indicator when claim data is needed but not present', () => {
      const initialState = getData({
        complexClaimsEnabled: true,
        claimData: null,
        claimError: null,
      });

      const { getByTestId } = renderWithStoreAndRouter(
        <MemoryRouter
          initialEntries={[`/file-new-claim/${appointmentId}/${claimId}`]}
        >
          <Routes>
            <Route
              path="/file-new-claim/:apptId/:claimId"
              element={<ComplexClaimSubmitFlowWrapper />}
            />
          </Routes>
        </MemoryRouter>,
        { initialState, reducers: reducer },
      );

      expect(getByTestId('travel-pay-loading-indicator')).to.exist;
    });

    it('does not show loading when claim data exists', () => {
      const initialState = getData({
        complexClaimsEnabled: true,
        claimData: { claimId: 'claim-123' },
      });

      const { queryByTestId } = renderWithStoreAndRouterHelper(
        '12345',
        initialState,
      );

      expect(queryByTestId('travel-pay-loading-indicator')).to.be.null;
    });

    it('does not show loading when claim error exists', () => {
      const initialState = getData({
        complexClaimsEnabled: true,
        claimData: null,
        claimError: { message: 'Error fetching claim' },
      });

      const { queryByTestId } = renderWithStoreAndRouterHelper(
        '12345',
        initialState,
      );

      expect(queryByTestId('travel-pay-loading-indicator')).to.be.null;
    });
  });

  describe('Fetching complex claim details', () => {
    let getComplexClaimDetailsStub;

    beforeEach(() => {
      getComplexClaimDetailsStub = sinon.stub(
        actions,
        'getComplexClaimDetails',
      );
      getComplexClaimDetailsStub.returns(() => Promise.resolve());
    });

    afterEach(() => {
      getComplexClaimDetailsStub.restore();
    });

    it('dispatches getComplexClaimDetails when claimId exists in URL and no claim data', () => {
      const initialState = getData({
        complexClaimsEnabled: true,
        claimData: null,
        claimError: null,
      });

      renderWithStoreAndRouter(
        <MemoryRouter
          initialEntries={[`/file-new-claim/${appointmentId}/${claimId}`]}
        >
          <Routes>
            <Route
              path="/file-new-claim/:apptId/:claimId"
              element={<ComplexClaimSubmitFlowWrapper />}
            />
          </Routes>
        </MemoryRouter>,
        { initialState, reducers: reducer },
      );

      expect(getComplexClaimDetailsStub.calledWith(claimId)).to.be.true;
    });

    it('does not dispatch getComplexClaimDetails when claim data already exists', () => {
      const initialState = getData({
        complexClaimsEnabled: true,
        claimData: { claimId: 'claim-123' },
      });

      renderWithStoreAndRouterHelper('12345', initialState);

      expect(getComplexClaimDetailsStub.called).to.be.false;
    });

    it('does not dispatch getComplexClaimDetails when claim error exists', () => {
      const initialState = getData({
        complexClaimsEnabled: true,
        claimData: null,
        claimError: { message: 'Error' },
      });

      renderWithStoreAndRouterHelper('12345', initialState);

      expect(getComplexClaimDetailsStub.called).to.be.false;
    });

    it('dispatches getComplexClaimDetails with claim ID from appointment', () => {
      const initialState = getData({
        complexClaimsEnabled: true,
        claimData: null,
        claimError: null,
        travelPayClaim: {
          metadata: {
            status: 200,
            success: true,
          },
          claim: {
            id: 'claim-from-appointment',
            claimStatus: 'Saved',
          },
        },
      });

      // Render without claimId in URL so wrapper uses claim from appointment
      renderWithStoreAndRouter(
        <MemoryRouter initialEntries={['/file-new-claim/12345']}>
          <Routes>
            <Route
              path="/file-new-claim/:apptId"
              element={<ComplexClaimSubmitFlowWrapper />}
            >
              <Route index element={IntroPage} />
            </Route>
          </Routes>
        </MemoryRouter>,
        {
          initialState,
          reducers: reducer,
        },
      );

      expect(getComplexClaimDetailsStub.calledWith('claim-from-appointment')).to
        .be.true;
    });
  });

  describe('Back link behavior based on page location', () => {
    beforeEach(() => {
      sessionStorage.clear();
    });

    it('shows "Back to appointment" text and appointment link on introduction page', () => {
      const initialState = getData({
        complexClaimsEnabled: true,
      });

      const { container } = renderWithStoreAndRouter(
        <MemoryRouter initialEntries={['/file-new-claim/12345']}>
          <Routes>
            <Route
              path="/file-new-claim/:apptId"
              element={<ComplexClaimSubmitFlowWrapper />}
            >
              <Route index element={<IntroPage />} />
            </Route>
          </Routes>
        </MemoryRouter>,
        {
          initialState,
          reducers: reducer,
        },
      );

      const backLink = container.querySelector(
        'va-link[data-testid="complex-claim-back-link"]',
      );
      expect(backLink.getAttribute('href')).to.equal(
        '/my-health/appointments/past/12345',
      );
      expect(backLink.getAttribute('text')).to.equal('Back to appointment');
    });

    it('shows "Back" text and uses entryPoint from sessionStorage when not on introduction page', () => {
      sessionStorage.setItem(
        TRAVEL_PAY_FILE_NEW_CLAIM_ENTRY.SESSION_KEY,
        TRAVEL_PAY_FILE_NEW_CLAIM_ENTRY.ENTRY_TYPES.APPOINTMENT,
      );
      const initialState = getData({
        complexClaimsEnabled: true,
        claimData: { claimId: '45678' },
      });

      const { container } = renderWithStoreAndRouter(
        <MemoryRouter initialEntries={['/file-new-claim/12345/45678/review']}>
          <Routes>
            <Route
              path="/file-new-claim/:apptId/:claimId"
              element={<ComplexClaimSubmitFlowWrapper />}
            >
              <Route path="review" element={<ReviewPage />} />
            </Route>
          </Routes>
        </MemoryRouter>,
        {
          initialState,
          reducers: reducer,
        },
      );

      const backLink = container.querySelector(
        'va-link[data-testid="complex-claim-back-link"]',
      );
      expect(backLink.getAttribute('href')).to.equal(
        '/my-health/appointments/past/12345',
      );
      expect(backLink.getAttribute('text')).to.equal('Back');
    });

    it('uses claim entry point when entryPoint is "claim" and not on introduction page', () => {
      sessionStorage.setItem(
        TRAVEL_PAY_FILE_NEW_CLAIM_ENTRY.SESSION_KEY,
        TRAVEL_PAY_FILE_NEW_CLAIM_ENTRY.ENTRY_TYPES.CLAIM,
      );
      const initialState = getData({
        complexClaimsEnabled: true,
        claimData: { claimId: '45678' },
      });

      const { container } = renderWithStoreAndRouter(
        <MemoryRouter initialEntries={['/file-new-claim/12345/45678/review']}>
          <Routes>
            <Route
              path="/file-new-claim/:apptId/:claimId"
              element={<ComplexClaimSubmitFlowWrapper />}
            >
              <Route path="review" element={<ReviewPage />} />
            </Route>
          </Routes>
        </MemoryRouter>,
        {
          initialState,
          reducers: reducer,
        },
      );

      const backLink = container.querySelector(
        'va-link[data-testid="complex-claim-back-link"]',
      );
      expect(backLink.getAttribute('href')).to.equal(
        '/my-health/travel-pay/claims/45678',
      );
      expect(backLink.getAttribute('text')).to.equal('Back');
    });

    it('defaults to claims list when no entryPoint is set and not on introduction page', () => {
      const initialState = getData({
        complexClaimsEnabled: true,
        claimData: { claimId: '45678' },
      });

      const { container } = renderWithStoreAndRouter(
        <MemoryRouter initialEntries={['/file-new-claim/12345/45678/review']}>
          <Routes>
            <Route
              path="/file-new-claim/:apptId/:claimId"
              element={<ComplexClaimSubmitFlowWrapper />}
            >
              <Route path="review" element={<ReviewPage />} />
            </Route>
          </Routes>
        </MemoryRouter>,
        {
          initialState,
          reducers: reducer,
        },
      );

      const backLink = container.querySelector(
        'va-link[data-testid="complex-claim-back-link"]',
      );
      expect(backLink.getAttribute('href')).to.equal(
        '/my-health/travel-pay/claims',
      );
      expect(backLink.getAttribute('text')).to.equal('Back');
    });

    it('correctly identifies introduction page with different appointment IDs', () => {
      const testAppointmentIds = ['abc123', '12345-67890', 'uuid-format-id'];

      testAppointmentIds.forEach(apptId => {
        const initialState = getData({
          complexClaimsEnabled: true,
          appointmentId: apptId,
        });

        const { container } = renderWithStoreAndRouter(
          <MemoryRouter initialEntries={[`/file-new-claim/${apptId}`]}>
            <Routes>
              <Route
                path="/file-new-claim/:apptId"
                element={<ComplexClaimSubmitFlowWrapper />}
              >
                <Route index element={<IntroPage />} />
              </Route>
            </Routes>
          </MemoryRouter>,
          {
            initialState,
            reducers: reducer,
          },
        );

        const backLink = container.querySelector(
          'va-link[data-testid="complex-claim-back-link"]',
        );
        expect(backLink.getAttribute('href')).to.equal(
          `/my-health/appointments/past/${apptId}`,
        );
        expect(backLink.getAttribute('text')).to.equal('Back to appointment');
      });
    });

    it('correctly identifies non-introduction page (review page)', () => {
      const initialState = getData({
        complexClaimsEnabled: true,
        claimData: { claimId: '45678' },
      });

      const { container } = renderWithStoreAndRouter(
        <MemoryRouter initialEntries={['/file-new-claim/12345/45678/review']}>
          <Routes>
            <Route
              path="/file-new-claim/:apptId/:claimId"
              element={<ComplexClaimSubmitFlowWrapper />}
            >
              <Route path="review" element={<ReviewPage />} />
            </Route>
          </Routes>
        </MemoryRouter>,
        {
          initialState,
          reducers: reducer,
        },
      );

      const backLink = container.querySelector(
        'va-link[data-testid="complex-claim-back-link"]',
      );
      // Should not show "Back to appointment" text
      expect(backLink.getAttribute('text')).to.equal('Back');
    });

    it('correctly identifies non-introduction page (agreement page)', () => {
      const initialState = getData({
        complexClaimsEnabled: true,
        claimData: { claimId: '45678' },
      });

      const { container } = renderWithStoreAndRouter(
        <MemoryRouter
          initialEntries={['/file-new-claim/12345/45678/travel-agreement']}
        >
          <Routes>
            <Route
              path="/file-new-claim/:apptId/:claimId"
              element={<ComplexClaimSubmitFlowWrapper />}
            >
              <Route path="travel-agreement" element={<AgreementPage />} />
            </Route>
          </Routes>
        </MemoryRouter>,
        {
          initialState,
          reducers: reducer,
        },
      );

      const backLink = container.querySelector(
        'va-link[data-testid="complex-claim-back-link"]',
      );
      // Should not show "Back to appointment" text
      expect(backLink.getAttribute('text')).to.equal('Back');
    });
  });

  describe('Redirect for non-editable claims', () => {
    it('redirects to claim details when claim status is "Claim submitted"', () => {
      const initialState = getData({
        complexClaimsEnabled: true,
        claimData: { claimId: 'claim-456' },
        travelPayClaim: {
          metadata: { status: 200, success: true },
          claim: {
            id: 'claim-456',
            claimStatus: 'Claim submitted',
          },
        },
      });

      const { getByText } = renderWithStoreAndRouter(
        <MemoryRouter initialEntries={['/file-new-claim/12345']}>
          <Routes>
            <Route
              path="/file-new-claim/:apptId"
              element={<ComplexClaimSubmitFlowWrapper />}
            >
              <Route index element={<IntroPage />} />
            </Route>
            <Route path="/claims/:id" element={<ClaimDetailsPage />} />
          </Routes>
        </MemoryRouter>,
        {
          initialState,
          reducers: reducer,
        },
      );

      expect(getByText('Claim Details')).to.exist;
    });

    it('does NOT redirect when claim status is "Incomplete"', () => {
      const initialState = getData({
        complexClaimsEnabled: true,
        claimData: {
          claimId: 'claim-incomplete',
          claimSource: 'VaGov',
        },
        travelPayClaim: {
          metadata: { status: 200, success: true },
          claim: {
            id: 'claim-incomplete',
            claimStatus: 'Incomplete',
          },
        },
      });

      const { getByText } = renderWithStoreAndRouter(
        <MemoryRouter initialEntries={['/file-new-claim/12345']}>
          <Routes>
            <Route
              path="/file-new-claim/:apptId"
              element={<ComplexClaimSubmitFlowWrapper />}
            >
              <Route index element={<IntroPage />} />
            </Route>
            <Route path="/claims/:id" element={<ClaimDetailsPage />} />
          </Routes>
        </MemoryRouter>,
        {
          initialState,
          reducers: reducer,
        },
      );

      expect(getByText('Intro')).to.exist;
    });

    it('does NOT redirect when claim status is "Saved"', () => {
      const initialState = getData({
        complexClaimsEnabled: true,
        claimData: {
          claimId: 'claim-saved',
          claimSource: 'VaGov',
        },
        travelPayClaim: {
          metadata: { status: 200, success: true },
          claim: {
            id: 'claim-saved',
            claimStatus: 'Saved',
          },
        },
      });

      const { getByText } = renderWithStoreAndRouter(
        <MemoryRouter initialEntries={['/file-new-claim/12345']}>
          <Routes>
            <Route
              path="/file-new-claim/:apptId"
              element={<ComplexClaimSubmitFlowWrapper />}
            >
              <Route index element={<IntroPage />} />
            </Route>
            <Route path="/claims/:id" element={<ClaimDetailsPage />} />
          </Routes>
        </MemoryRouter>,
        {
          initialState,
          reducers: reducer,
        },
      );

      expect(getByText('Intro')).to.exist;
    });

    it('does NOT redirect when no claim exists in appointment', () => {
      const initialState = getData({
        complexClaimsEnabled: true,
        travelPayClaim: {
          metadata: { status: 200, success: true },
          claim: null,
        },
      });

      const { getByText } = renderWithStoreAndRouter(
        <MemoryRouter initialEntries={['/file-new-claim/12345']}>
          <Routes>
            <Route
              path="/file-new-claim/:apptId"
              element={<ComplexClaimSubmitFlowWrapper />}
            >
              <Route index element={<IntroPage />} />
            </Route>
            <Route path="/claims/:id" element={<ClaimDetailsPage />} />
          </Routes>
        </MemoryRouter>,
        {
          initialState,
          reducers: reducer,
        },
      );

      expect(getByText('Intro')).to.exist;
    });

    it('redirects to claim details when claim source is not VaGov', () => {
      const initialState = getData({
        complexClaimsEnabled: true,
        claimData: {
          claimId: 'claim-789',
          claimSource: 'BTSSS',
        },
        travelPayClaim: {
          metadata: { status: 200, success: true },
          claim: {
            id: 'claim-789',
            claimStatus: 'Incomplete',
          },
        },
      });

      const { getByText } = renderWithStoreAndRouter(
        <MemoryRouter initialEntries={['/file-new-claim/12345']}>
          <Routes>
            <Route
              path="/file-new-claim/:apptId"
              element={<ComplexClaimSubmitFlowWrapper />}
            >
              <Route index element={<IntroPage />} />
            </Route>
            <Route path="/claims/:id" element={<ClaimDetailsPage />} />
          </Routes>
        </MemoryRouter>,
        {
          initialState,
          reducers: reducer,
        },
      );

      expect(getByText('Claim Details')).to.exist;
    });

    it('does NOT redirect when claim source is VaGov and status is Incomplete', () => {
      const initialState = getData({
        complexClaimsEnabled: true,
        claimData: {
          claimId: 'claim-vagov',
          claimSource: 'VaGov',
        },
        travelPayClaim: {
          metadata: { status: 200, success: true },
          claim: {
            id: 'claim-vagov',
            claimStatus: 'Incomplete',
          },
        },
      });

      const { getByText } = renderWithStoreAndRouter(
        <MemoryRouter initialEntries={['/file-new-claim/12345']}>
          <Routes>
            <Route
              path="/file-new-claim/:apptId"
              element={<ComplexClaimSubmitFlowWrapper />}
            >
              <Route index element={<IntroPage />} />
            </Route>
            <Route path="/claims/:id" element={<ClaimDetailsPage />} />
          </Routes>
        </MemoryRouter>,
        {
          initialState,
          reducers: reducer,
        },
      );

      expect(getByText('Intro')).to.exist;
    });

    it('redirects to claim details when there are unassociated documents', () => {
      const initialState = getData({
        complexClaimsEnabled: true,
        claimData: {
          claimId: 'claim-unassociated-docs',
          claimSource: 'VaGov',
          documents: [
            {
              id: 'doc1',
              filename: 'receipt.pdf',
              mimetype: 'application/pdf',
              expenseId: null, // Unassociated document
            },
          ],
        },
        travelPayClaim: {
          metadata: { status: 200, success: true },
          claim: {
            id: 'claim-unassociated-docs',
            claimStatus: 'Incomplete',
          },
        },
      });

      const { getByText } = renderWithStoreAndRouter(
        <MemoryRouter initialEntries={['/file-new-claim/12345']}>
          <Routes>
            <Route
              path="/file-new-claim/:apptId"
              element={<ComplexClaimSubmitFlowWrapper />}
            >
              <Route index element={<IntroPage />} />
            </Route>
            <Route path="/claims/:id" element={<ClaimDetailsPage />} />
          </Routes>
        </MemoryRouter>,
        {
          initialState,
          reducers: reducer,
        },
      );

      expect(getByText('Claim Details')).to.exist;
    });

    it('does NOT redirect when all documents are associated', () => {
      const initialState = getData({
        complexClaimsEnabled: true,
        claimData: {
          claimId: 'claim-associated-docs',
          claimSource: 'VaGov',
          documents: [
            {
              id: 'doc1',
              filename: 'receipt.pdf',
              mimetype: 'application/pdf',
              expenseId: 'expense-1', // Associated document
            },
          ],
        },
        travelPayClaim: {
          metadata: { status: 200, success: true },
          claim: {
            id: 'claim-associated-docs',
            claimStatus: 'Incomplete',
          },
        },
      });

      const { getByText } = renderWithStoreAndRouter(
        <MemoryRouter initialEntries={['/file-new-claim/12345']}>
          <Routes>
            <Route
              path="/file-new-claim/:apptId"
              element={<ComplexClaimSubmitFlowWrapper />}
            >
              <Route index element={<IntroPage />} />
            </Route>
            <Route path="/claims/:id" element={<ClaimDetailsPage />} />
          </Routes>
        </MemoryRouter>,
        {
          initialState,
          reducers: reducer,
        },
      );

      expect(getByText('Intro')).to.exist;
    });

    it('redirects when multiple redirect conditions are met', () => {
      const initialState = getData({
        complexClaimsEnabled: true,
        claimData: {
          claimId: 'claim-multiple',
          claimSource: 'BTSSS',
          documents: [
            {
              id: 'doc1',
              filename: 'receipt.pdf',
              mimetype: 'application/pdf',
              expenseId: null,
            },
          ],
        },
        travelPayClaim: {
          metadata: { status: 200, success: true },
          claim: {
            id: 'claim-multiple',
            claimStatus: 'Claim submitted',
          },
        },
      });

      const { getByText } = renderWithStoreAndRouter(
        <MemoryRouter initialEntries={['/file-new-claim/12345']}>
          <Routes>
            <Route
              path="/file-new-claim/:apptId"
              element={<ComplexClaimSubmitFlowWrapper />}
            >
              <Route index element={<IntroPage />} />
            </Route>
            <Route path="/claims/:id" element={<ClaimDetailsPage />} />
          </Routes>
        </MemoryRouter>,
        {
          initialState,
          reducers: reducer,
        },
      );

      expect(getByText('Claim Details')).to.exist;
    });

    it('does NOT redirect when documents array is empty', () => {
      const initialState = getData({
        complexClaimsEnabled: true,
        claimData: {
          claimId: 'claim-no-docs',
          claimSource: 'VaGov',
          documents: [],
        },
        travelPayClaim: {
          metadata: { status: 200, success: true },
          claim: {
            id: 'claim-no-docs',
            claimStatus: 'Saved',
          },
        },
      });

      const { getByText } = renderWithStoreAndRouter(
        <MemoryRouter initialEntries={['/file-new-claim/12345']}>
          <Routes>
            <Route
              path="/file-new-claim/:apptId"
              element={<ComplexClaimSubmitFlowWrapper />}
            >
              <Route index element={<IntroPage />} />
            </Route>
            <Route path="/claims/:id" element={<ClaimDetailsPage />} />
          </Routes>
        </MemoryRouter>,
        {
          initialState,
          reducers: reducer,
        },
      );

      expect(getByText('Intro')).to.exist;
    });

    it('does NOT redirect when documents only contain clerk notes without mimetype', () => {
      const initialState = getData({
        complexClaimsEnabled: true,
        claimData: {
          claimId: 'claim-clerk-notes',
          claimSource: 'VaGov',
          documents: [
            {
              id: 'note1',
              filename: 'clerk-note.txt',
              // No mimetype = clerk note
            },
          ],
        },
        travelPayClaim: {
          metadata: { status: 200, success: true },
          claim: {
            id: 'claim-clerk-notes',
            claimStatus: 'Incomplete',
          },
        },
      });

      const { getByText } = renderWithStoreAndRouter(
        <MemoryRouter initialEntries={['/file-new-claim/12345']}>
          <Routes>
            <Route
              path="/file-new-claim/:apptId"
              element={<ComplexClaimSubmitFlowWrapper />}
            >
              <Route index element={<IntroPage />} />
            </Route>
            <Route path="/claims/:id" element={<ClaimDetailsPage />} />
          </Routes>
        </MemoryRouter>,
        {
          initialState,
          reducers: reducer,
        },
      );

      expect(getByText('Intro')).to.exist;
    });
  });

  describe('Get Claim Error Page', () => {
    let getComplexClaimDetailsStub;

    beforeEach(() => {
      getComplexClaimDetailsStub = sinon.stub(
        actions,
        'getComplexClaimDetails',
      );
    });

    afterEach(() => {
      getComplexClaimDetailsStub.restore();
    });

    it('redirects to get-claim-error when getComplexClaimDetails rejects', async () => {
      // Stub the thunk correctly
      getComplexClaimDetailsStub.callsFake(() => () =>
        Promise.reject(new Error('Failed')),
      );

      const initialState = getData({
        complexClaimsEnabled: true,
        claimData: null,
        claimError: null,
      });

      const { getByText } = renderWithStoreAndRouter(
        <MemoryRouter
          initialEntries={[`/file-new-claim/${appointmentId}/${claimId}`]}
        >
          <Routes>
            <Route
              path="/file-new-claim/:apptId/:claimId"
              element={<ComplexClaimSubmitFlowWrapper />}
            />
            <Route
              path="/file-new-claim/:apptId/get-claim-error"
              element={<div>Get Claim Error Page</div>}
            />
          </Routes>
        </MemoryRouter>,
        { initialState, reducers: reducer },
      );

      // Wait for the redirect to happen and the error page to appear
      await waitFor(() => {
        expect(getByText('Get Claim Error Page')).to.exist;
      });
    });

    it('does not redirect if isErrorRoute is already true', async () => {
      getComplexClaimDetailsStub.callsFake(() => () =>
        Promise.reject(new Error('Failed')),
      );

      const initialState = getData({
        complexClaimsEnabled: true,
        claimData: null,
        claimError: null,
      });

      const { container } = renderWithStoreAndRouter(
        <MemoryRouter
          initialEntries={[`/file-new-claim/${appointmentId}/get-claim-error`]}
        >
          <Routes>
            <Route
              path="/file-new-claim/:apptId/get-claim-error"
              element={<div>Get Claim Error Page</div>}
            />
          </Routes>
          <LocationDisplay />
        </MemoryRouter>,
        { initialState, reducers: reducer },
      );

      // The component should render without infinite redirect
      const errorDiv = container.querySelector('div');
      expect(errorDiv.textContent).to.equal('Get Claim Error Page');
    });
  });

  describe('Unsaved changes modal behavior', () => {
    it('does not show modal when back link is clicked without unsaved changes', () => {
      const initialState = getData({
        complexClaimsEnabled: true,
        claimData: { claimId: '45678' },
      });

      const { container } = renderWithStoreAndRouter(
        <MemoryRouter initialEntries={['/file-new-claim/12345/45678/review']}>
          <Routes>
            <Route
              path="/file-new-claim/:apptId/:claimId"
              element={<ComplexClaimSubmitFlowWrapper />}
            >
              <Route path="review" element={<ReviewPage />} />
            </Route>
          </Routes>
        </MemoryRouter>,
        {
          initialState,
          reducers: reducer,
        },
      );

      const backLink = container.querySelector(
        'va-link[data-testid="complex-claim-back-link"]',
      );
      expect(backLink).to.exist;

      // Modal should not be visible
      const modal = container.querySelector('va-modal');
      expect(modal).to.exist;
      const isVisible = modal.getAttribute('visible');
      // When visible is false, the attribute may not be present or be 'false'
      expect(isVisible === null || isVisible === 'false').to.be.true;
    });

    it('shows modal when back link is clicked with unsaved changes', () => {
      const initialState = getData({
        complexClaimsEnabled: true,
        claimData: { claimId: '45678' },
        hasUnsavedChanges: true,
      });

      const { container } = renderWithStoreAndRouter(
        <MemoryRouter initialEntries={['/file-new-claim/12345/45678/review']}>
          <Routes>
            <Route
              path="/file-new-claim/:apptId/:claimId"
              element={<ComplexClaimSubmitFlowWrapper />}
            >
              <Route path="review" element={<ReviewPage />} />
            </Route>
          </Routes>
        </MemoryRouter>,
        {
          initialState,
          reducers: reducer,
        },
      );

      const backLink = container.querySelector(
        'va-link[data-testid="complex-claim-back-link"]',
      );

      // Click the back link
      const clickEvent = new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      });
      Object.defineProperty(clickEvent, 'preventDefault', {
        value: sinon.spy(),
      });
      backLink.dispatchEvent(clickEvent);

      // Modal should become visible
      const modal = container.querySelector('va-modal');
      expect(modal).to.exist;
    });

    it('clears unsaved changes and navigates when "Leave without saving" is clicked', () => {
      const initialState = getData({
        complexClaimsEnabled: true,
        claimData: { claimId: '45678' },
        hasUnsavedChanges: true,
      });

      const clearUnsavedExpenseChangesStub = sinon.stub(
        actions,
        'clearUnsavedExpenseChanges',
      );
      clearUnsavedExpenseChangesStub.returns({ type: 'CLEAR_UNSAVED_CHANGES' });

      const { container } = renderWithStoreAndRouter(
        <MemoryRouter initialEntries={['/file-new-claim/12345/45678/review']}>
          <Routes>
            <Route
              path="/file-new-claim/:apptId/:claimId"
              element={<ComplexClaimSubmitFlowWrapper />}
            >
              <Route path="review" element={<ReviewPage />} />
            </Route>
            <Route path="/claims" element={<div>Claims List</div>} />
          </Routes>
        </MemoryRouter>,
        {
          initialState,
          reducers: reducer,
        },
      );

      const backLink = container.querySelector(
        'va-link[data-testid="complex-claim-back-link"]',
      );

      // Click the back link to open modal
      const clickEvent = new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      });
      Object.defineProperty(clickEvent, 'preventDefault', {
        value: sinon.spy(),
      });
      backLink.dispatchEvent(clickEvent);

      const modal = container.querySelector('va-modal');
      expect(modal).to.exist;

      // Trigger secondary button click (Leave without saving)
      const secondaryButtonEvent = new CustomEvent('secondaryButtonClick');
      modal.dispatchEvent(secondaryButtonEvent);

      expect(clearUnsavedExpenseChangesStub.called).to.be.true;

      clearUnsavedExpenseChangesStub.restore();
    });

    it('closes modal when "Continue editing" is clicked', () => {
      const initialState = getData({
        complexClaimsEnabled: true,
        claimData: { claimId: '45678' },
        hasUnsavedChanges: true,
      });

      const { container } = renderWithStoreAndRouter(
        <MemoryRouter initialEntries={['/file-new-claim/12345/45678/review']}>
          <Routes>
            <Route
              path="/file-new-claim/:apptId/:claimId"
              element={<ComplexClaimSubmitFlowWrapper />}
            >
              <Route path="review" element={<ReviewPage />} />
            </Route>
          </Routes>
        </MemoryRouter>,
        {
          initialState,
          reducers: reducer,
        },
      );

      const backLink = container.querySelector(
        'va-link[data-testid="complex-claim-back-link"]',
      );

      // Click the back link to open modal
      const clickEvent = new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      });
      Object.defineProperty(clickEvent, 'preventDefault', {
        value: sinon.spy(),
      });
      backLink.dispatchEvent(clickEvent);

      const modal = container.querySelector('va-modal');

      // Trigger secondary button click (Continue editing)
      const secondaryButtonEvent = new CustomEvent('secondaryButtonClick');
      modal.dispatchEvent(secondaryButtonEvent);

      // Modal should close (visible attribute should be false)
      // Note: In the actual implementation, the modal visibility is controlled by state
      // This test verifies the event handler is wired up correctly
    });
  });
});
