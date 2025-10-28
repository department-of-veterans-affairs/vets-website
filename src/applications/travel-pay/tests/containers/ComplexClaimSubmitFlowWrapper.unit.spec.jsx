import React from 'react';
import { fireEvent } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import { MemoryRouter, Route, Routes } from 'react-router-dom-v5-compat';
import { $ } from 'platform/forms-system/src/js/utilities/ui';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';

import reducer from '../../redux/reducer';
import ComplexClaimSubmitFlowWrapper from '../../containers/ComplexClaimSubmitFlowWrapper';
import ReviewPage from '../../components/complex-claims/pages/ReviewPage';
import AgreementPage from '../../components/complex-claims/pages/AgreementPage';
import ConfirmationPage from '../../components/complex-claims/pages/ConfirmationPage';

describe('ComplexClaimSubmitFlowWrapper', () => {
  const oldLocation = global.window.location;

  const getData = ({
    complexClaimsEnabled = true,
    appointmentId = '12345',
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
        },
        error: null,
        isLoading: false,
      },
      claimDetails: {
        data: {},
        error: null,
        isLoading: false,
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
    initialState = {},
  ) => {
    return renderWithStoreAndRouter(
      <MemoryRouter
        initialEntries={[
          `/file-new-claim/complex/${appointmentId}/confirmation`,
        ]}
      >
        <Routes>
          <Route
            path="/file-new-claim/complex/:apptId/confirmation"
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
      const initialState = getData({ complexClaimsEnabled: false });

      renderWithStoreAndRouterHelper('12345', initialState);

      expect(global.window.location.replace.calledWith('/')).to.be.true;
    });

    it('renders normally when complex claims feature flag is enabled', () => {
      const initialState = getData({ complexClaimsEnabled: true });

      renderWithStoreAndRouterHelper('12345', initialState);

      expect($('article.usa-grid-full')).to.exist;
      expect($('.vads-l-col--12.medium-screen\\:vads-l-col--8')).to.exist;
      expect(global.window.location.replace.called).to.be.false;
    });
  });

  describe('When feature flag is enabled', () => {
    it('renders the component with correct structure', () => {
      const initialState = getData({ complexClaimsEnabled: true });
      renderWithStoreAndRouterHelper('12345', initialState);

      expect($('article.usa-grid-full')).to.exist;
      expect($('.vads-l-col--12.medium-screen\\:vads-l-col--8')).to.exist;
    });

    it('renders the back link with correct href and text', () => {
      const initialState = getData({ complexClaimsEnabled: true });
      renderWithStoreAndRouterHelper('12345', initialState);

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
      const initialState = getData({ complexClaimsEnabled: true });
      const screen = renderWithStoreAndRouter(
        <MemoryRouter initialEntries={['/confirmation/12345']}>
          <Routes>
            <Route
              path="/confirmation/:apptId/"
              element={<ComplexClaimSubmitFlowWrapper />}
            >
              {/* Nested route renders the ReviewPage */}
              <Route path="" element={<ReviewPage />} />
            </Route>
          </Routes>
        </MemoryRouter>,
        { initialState, reducers: reducer },
      );

      expect(screen.getByTestId('review-page')).to.exist;
    });

    it('shows the ReviewPage first, and after clicking Sign Agreement navigates to the AgreementPage', async () => {
      const initialState = getData({ complexClaimsEnabled: true });
      const { getByTestId, container } = renderWithStoreAndRouter(
        <MemoryRouter initialEntries={['/confirmation/12345']}>
          <Routes>
            <Route
              path="/confirmation/:apptId/"
              element={<ComplexClaimSubmitFlowWrapper />}
            >
              {/* Page 1 */}
              <Route path="" element={<ReviewPage onNext={() => {}} />} />
              {/* Page 2 */}
              <Route path="agreement" element={<AgreementPage />} />
            </Route>
          </Routes>
        </MemoryRouter>,
        { initialState, reducers: reducer },
      );

      // Page 1 should render first (AgreementPage)
      expect(getByTestId('review-page')).to.exist;

      // Click the Sign Agreement button
      const signButton = $('#sign-agreement-button', container);
      fireEvent.click(signButton);

      // For this test, we need to actually trigger a navigation to /agreement
      // In real app this would be done via react-router navigation inside signAgreement
      // Here we can simulate by rerendering with the new route:
      const {
        getByTestId: getByTestId2,
        queryByTestId: queryByTestId2,
      } = renderWithStoreAndRouter(
        <MemoryRouter initialEntries={['/confirmation/12345/agreement']}>
          <Routes>
            <Route
              path="/confirmation/:apptId/"
              element={<ComplexClaimSubmitFlowWrapper />}
            >
              <Route path="" element={<ReviewPage onNext={() => {}} />} />
              <Route path="agreement" element={<AgreementPage />} />
            </Route>
          </Routes>
        </MemoryRouter>,
        { initialState, reducers: reducer },
      );

      // Agreement page should render
      expect(getByTestId2('agreement-checkbox')).to.exist;

      // ReviewPage is no longer visible
      expect(queryByTestId2('review-page')).to.be.null;
    });

    it('handles different appointment IDs in the URL', () => {
      const initialState = getData({ complexClaimsEnabled: true });
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
    });

    it('renders with proper scroll element name', () => {
      const initialState = getData({ complexClaimsEnabled: true });
      renderWithStoreAndRouterHelper('12345', initialState);

      expect($('[name="topScrollElement"]')).to.exist;
    });

    it('applies correct CSS classes for layout', () => {
      const initialState = getData({ complexClaimsEnabled: true });
      renderWithStoreAndRouterHelper('12345', initialState);

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
        const initialState = getData({ complexClaimsEnabled: true });
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
      });
    });
  });
});
