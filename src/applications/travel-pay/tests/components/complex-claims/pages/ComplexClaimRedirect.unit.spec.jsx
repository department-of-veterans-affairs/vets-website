import React from 'react';
import { expect } from 'chai';
import { MemoryRouter, Routes, Route } from 'react-router-dom-v5-compat';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';

import reducer from '../../../../redux/reducer';
import ComplexClaimRedirect from '../../../../components/complex-claims/pages/ComplexClaimRedirect';

// Mock components for navigation testing
const IntroPage = () => <div data-testid="intro-page">Intro</div>;
const ChooseExpensePage = () => (
  <div data-testid="choose-expense-page">Choose Expense</div>
);
const ReviewPage = () => <div data-testid="review-page">Review</div>;

describe('ComplexClaimRedirect', () => {
  const getInitialState = ({
    claimId = null,
    expenses = [],
    appointmentId = '12345',
    isClaimFetchLoading = false,
  } = {}) => ({
    featureToggles: {
      loading: false,
    },
    travelPay: {
      appointment: {
        data: {
          id: appointmentId,
        },
        error: null,
        isLoading: false,
      },
      complexClaim: {
        claim: {
          data: claimId ? { claimId } : null,
          fetch: {
            isLoading: isClaimFetchLoading,
            error: null,
          },
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
        },
      },
    },
  });

  describe('Navigation logic', () => {
    it('redirects to intro page when no claimId exists in URL or store', () => {
      const initialState = getInitialState({
        claimId: null,
        appointmentId: '12345',
      });

      const { getByTestId } = renderWithStoreAndRouter(
        <MemoryRouter initialEntries={['/redirect']}>
          <Routes>
            <Route path="/file-new-claim/:apptId" element={<IntroPage />} />
            <Route path="/redirect" element={<ComplexClaimRedirect />} />
          </Routes>
        </MemoryRouter>,
        {
          initialState,
          reducers: reducer,
        },
      );

      expect(getByTestId('intro-page')).to.exist;
    });

    it('redirects to choose-expense when claim exists but no expenses', () => {
      const initialState = getInitialState({
        claimId: 'claim-123',
        expenses: [],
      });

      const { getByTestId } = renderWithStoreAndRouter(
        <MemoryRouter
          initialEntries={['/file-new-claim/12345/claim-123/redirect']}
        >
          <Routes>
            <Route
              path="/file-new-claim/:apptId/:claimId/choose-expense"
              element={<ChooseExpensePage />}
            />
            <Route
              path="/file-new-claim/:apptId/:claimId/redirect"
              element={<ComplexClaimRedirect />}
            />
          </Routes>
        </MemoryRouter>,
        {
          initialState,
          reducers: reducer,
        },
      );

      expect(getByTestId('choose-expense-page')).to.exist;
    });

    it('redirects to review when claim exists with expenses', () => {
      const initialState = getInitialState({
        claimId: 'claim-123',
        expenses: [
          {
            id: 'expense-1',
            expenseType: 'Mileage',
            costRequested: 10,
          },
        ],
      });

      const { getByTestId } = renderWithStoreAndRouter(
        <MemoryRouter
          initialEntries={['/file-new-claim/12345/claim-123/redirect']}
        >
          <Routes>
            <Route
              path="/file-new-claim/:apptId/:claimId/review"
              element={<ReviewPage />}
            />
            <Route
              path="/file-new-claim/:apptId/:claimId/redirect"
              element={<ComplexClaimRedirect />}
            />
          </Routes>
        </MemoryRouter>,
        {
          initialState,
          reducers: reducer,
        },
      );

      expect(getByTestId('review-page')).to.exist;
    });

    it('redirects to review when claim exists with multiple expenses', () => {
      const initialState = getInitialState({
        claimId: 'claim-123',
        expenses: [
          {
            id: 'expense-1',
            expenseType: 'Mileage',
            costRequested: 10,
          },
          {
            id: 'expense-2',
            expenseType: 'Parking',
            costRequested: 15,
          },
        ],
      });

      const { getByTestId } = renderWithStoreAndRouter(
        <MemoryRouter
          initialEntries={['/file-new-claim/12345/claim-123/redirect']}
        >
          <Routes>
            <Route
              path="/file-new-claim/:apptId/:claimId/review"
              element={<ReviewPage />}
            />
            <Route
              path="/file-new-claim/:apptId/:claimId/redirect"
              element={<ComplexClaimRedirect />}
            />
          </Routes>
        </MemoryRouter>,
        {
          initialState,
          reducers: reducer,
        },
      );

      expect(getByTestId('review-page')).to.exist;
    });
  });

  describe('ClaimId source priority', () => {
    it('uses claimId from URL params when available', () => {
      const initialState = getInitialState({
        claimId: 'store-claim-id',
        expenses: [],
      });

      const { getByTestId } = renderWithStoreAndRouter(
        <MemoryRouter
          initialEntries={['/file-new-claim/12345/url-claim-id/redirect']}
        >
          <Routes>
            <Route
              path="/file-new-claim/:apptId/:claimId/choose-expense"
              element={<ChooseExpensePage />}
            />
            <Route
              path="/file-new-claim/:apptId/:claimId/redirect"
              element={<ComplexClaimRedirect />}
            />
          </Routes>
        </MemoryRouter>,
        {
          initialState,
          reducers: reducer,
        },
      );

      // Should use URL claimId, not store claimId
      expect(getByTestId('choose-expense-page')).to.exist;
    });

    it('falls back to claimId from Redux store when not in URL', () => {
      const initialState = getInitialState({
        claimId: 'store-claim-123',
        expenses: [{ id: 'expense-1', expenseType: 'Mileage' }],
      });

      const { getByTestId } = renderWithStoreAndRouter(
        <MemoryRouter initialEntries={['/intro']}>
          <Routes>
            <Route
              path="/file-new-claim/:apptId/:claimId/review"
              element={<ReviewPage />}
            />
            <Route path="/intro" element={<ComplexClaimRedirect />} />
          </Routes>
        </MemoryRouter>,
        {
          initialState,
          reducers: reducer,
        },
      );

      expect(getByTestId('review-page')).to.exist;
    });
  });

  describe('AppointmentId source priority', () => {
    it('uses apptId from URL params when available', () => {
      const initialState = getInitialState({
        claimId: 'claim-123',
        expenses: [],
        appointmentId: 'store-appt-id',
      });

      const { getByTestId } = renderWithStoreAndRouter(
        <MemoryRouter
          initialEntries={['/file-new-claim/url-appt-id/claim-123/redirect']}
        >
          <Routes>
            <Route
              path="/file-new-claim/:apptId/:claimId/choose-expense"
              element={<ChooseExpensePage />}
            />
            <Route
              path="/file-new-claim/:apptId/:claimId/redirect"
              element={<ComplexClaimRedirect />}
            />
          </Routes>
        </MemoryRouter>,
        {
          initialState,
          reducers: reducer,
        },
      );

      // Should use URL apptId, not store apptId
      expect(getByTestId('choose-expense-page')).to.exist;
    });

    it('falls back to apptId from appointment store when not in URL', () => {
      const initialState = getInitialState({
        claimId: 'claim-123',
        expenses: [],
        appointmentId: 'store-appt-999',
      });

      const { getByTestId } = renderWithStoreAndRouter(
        <MemoryRouter initialEntries={['/intro']}>
          <Routes>
            <Route
              path="/file-new-claim/:apptId/:claimId/choose-expense"
              element={<ChooseExpensePage />}
            />
            <Route path="/intro" element={<ComplexClaimRedirect />} />
          </Routes>
        </MemoryRouter>,
        {
          initialState,
          reducers: reducer,
        },
      );

      expect(getByTestId('choose-expense-page')).to.exist;
    });
  });

  describe('Edge cases', () => {
    it('handles null expenses array', () => {
      const initialState = getInitialState({
        claimId: 'claim-123',
        expenses: null,
      });

      const { getByTestId } = renderWithStoreAndRouter(
        <MemoryRouter
          initialEntries={['/file-new-claim/12345/claim-123/redirect']}
        >
          <Routes>
            <Route
              path="/file-new-claim/:apptId/:claimId/choose-expense"
              element={<ChooseExpensePage />}
            />
            <Route
              path="/file-new-claim/:apptId/:claimId/redirect"
              element={<ComplexClaimRedirect />}
            />
          </Routes>
        </MemoryRouter>,
        {
          initialState,
          reducers: reducer,
        },
      );

      expect(getByTestId('choose-expense-page')).to.exist;
    });

    it('handles undefined expenses array', () => {
      const initialState = getInitialState({
        claimId: 'claim-123',
        expenses: undefined,
      });

      const { getByTestId } = renderWithStoreAndRouter(
        <MemoryRouter
          initialEntries={['/file-new-claim/12345/claim-123/redirect']}
        >
          <Routes>
            <Route
              path="/file-new-claim/:apptId/:claimId/choose-expense"
              element={<ChooseExpensePage />}
            />
            <Route
              path="/file-new-claim/:apptId/:claimId/redirect"
              element={<ComplexClaimRedirect />}
            />
          </Routes>
        </MemoryRouter>,
        {
          initialState,
          reducers: reducer,
        },
      );

      expect(getByTestId('choose-expense-page')).to.exist;
    });
  });
});
