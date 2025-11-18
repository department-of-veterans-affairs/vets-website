import React from 'react';
import { fireEvent } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import { MemoryRouter, Route, Routes } from 'react-router-dom-v5-compat';
import { $ } from 'platform/forms-system/src/js/utilities/ui';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';

import reducer from '../../redux/reducer';
import ComplexClaimSubmitFlowWrapper from '../../containers/ComplexClaimSubmitFlowWrapper';
import * as actions from '../../redux/actions';

// Mock components for navigation testing
const ConfirmationPage = () => <div>Confirmation</div>;
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
          data: [],
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

  const renderWithStoreAndRouterHelper = (
    appointmentId = '12345',
    claimId = '45678',
    initialState = {},
  ) => {
    return renderWithStoreAndRouter(
      <MemoryRouter
        initialEntries={[
          `/file-new-claim/${appointmentId}/${claimId}/confirmation`,
        ]}
      >
        <Routes>
          <Route
            path="/file-new-claim/:apptId/:claimId"
            element={<ComplexClaimSubmitFlowWrapper />}
          >
            <Route path="confirmation" element={<ConfirmationPage />} />
          </Route>
        </Routes>
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
        claimData: { claimId: '45678' },
      });

      renderWithStoreAndRouterHelper('12345', '45678', initialState);

      expect(global.window.location.replace.calledWith('/')).to.be.true;
    });

    it('renders normally when complex claims feature flag is enabled', () => {
      const initialState = getData({
        complexClaimsEnabled: true,
        claimData: { claimId: '45678' },
      });

      renderWithStoreAndRouterHelper('12345', '45678', initialState);

      expect($('article.usa-grid-full')).to.exist;
      expect($('.vads-l-col--12.medium-screen\\:vads-l-col--8')).to.exist;
      expect(global.window.location.replace.called).to.be.false;
    });
  });

  describe('When feature flag is enabled', () => {
    it('renders the component with correct structure', () => {
      const initialState = getData({
        complexClaimsEnabled: true,
        claimData: { claimId: '45678' },
      });
      renderWithStoreAndRouterHelper('12345', '45678', initialState);

      expect($('article.usa-grid-full')).to.exist;
      expect($('.vads-l-col--12.medium-screen\\:vads-l-col--8')).to.exist;
    });

    it('renders the back link with correct href and text', () => {
      const initialState = getData({
        complexClaimsEnabled: true,
        claimData: { claimId: '45678' },
      });
      renderWithStoreAndRouterHelper('12345', '45678', initialState);

      const backLink = $(
        'va-link[back][data-testid="complex-claim-back-link"]',
      );
      expect(backLink).to.exist;
      expect(backLink.getAttribute('href')).to.equal(
        '/my-health/appointments/past/12345',
      );
      expect(backLink.getAttribute('text')).to.equal(
        'Back to your appointment',
      );
      expect(backLink.hasAttribute('disable-analytics')).to.be.true;
    });

    it('renders the ReviewPage component', () => {
      const initialState = getData({
        complexClaimsEnabled: true,
        claimData: { claimId: '45678' },
      });
      const screen = renderWithStoreAndRouter(
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
        { initialState, reducers: reducer },
      );

      expect(screen.getByTestId('review-page')).to.exist;
    });

    it('shows the ReviewPage first, and after clicking Sign Agreement navigates to the AgreementPage', async () => {
      const initialState = getData({
        complexClaimsEnabled: true,
        claimData: { claimId: '45678' },
      });
      const {
        container,
        queryByTestId,
        getByTestId,
      } = renderWithStoreAndRouter(
        <MemoryRouter initialEntries={['/file-new-claim/12345/45678/review']}>
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
      const initialState = getData({
        complexClaimsEnabled: true,
        claimData: { claimId: '45678' },
      });
      const testIds = ['abc123', '12345-67890', 'uuid-format-12345'];

      testIds.forEach(apptId => {
        const { container } = renderWithStoreAndRouterHelper(
          apptId,
          '45678',
          initialState,
        );

        const backLink = container.querySelector(
          'va-link[data-testid="complex-claim-back-link"]',
        );
        expect(backLink.getAttribute('href')).to.equal(
          `/my-health/appointments/past/${apptId}`,
        );
      });
    });

    it('renders with proper scroll element name', () => {
      const initialState = getData({
        complexClaimsEnabled: true,
        claimData: { claimId: '45678' },
      });
      renderWithStoreAndRouterHelper('12345', '45678', initialState);

      expect($('[name="topScrollElement"]')).to.exist;
    });

    it('applies correct CSS classes for layout', () => {
      const initialState = getData({
        complexClaimsEnabled: true,
        claimData: { claimId: '45678' },
      });
      renderWithStoreAndRouterHelper('12345', '45678', initialState);

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
            '45678',
            initialState,
          );

          const backLink = container.querySelector(
            'va-link[data-testid="complex-claim-back-link"]',
          );
          expect(backLink.getAttribute('href')).to.equal(
            `/my-health/appointments/past/${expectedId}`,
          );
        });
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
        '12345',
        '45678',
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

      const { getByTestId } = renderWithStoreAndRouterHelper(
        '12345',
        'claim-123',
        initialState,
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
        'claim-123',
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
        'claim-123',
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

      renderWithStoreAndRouterHelper('12345', 'claim-from-url', initialState);

      expect(getComplexClaimDetailsStub.calledWith('claim-from-url')).to.be
        .true;
    });

    it('does not dispatch getComplexClaimDetails when claim data already exists', () => {
      const initialState = getData({
        complexClaimsEnabled: true,
        claimData: { claimId: 'claim-123' },
      });

      renderWithStoreAndRouterHelper('12345', 'claim-123', initialState);

      expect(getComplexClaimDetailsStub.called).to.be.false;
    });

    it('does not dispatch getComplexClaimDetails when claim error exists', () => {
      const initialState = getData({
        complexClaimsEnabled: true,
        claimData: null,
        claimError: { message: 'Error' },
      });

      renderWithStoreAndRouterHelper('12345', 'claim-123', initialState);

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
              <Route index element={<div>Intro</div>} />
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
        claimData: { claimId: 'claim-incomplete' },
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
        claimData: { claimId: 'claim-saved' },
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
  });
});
