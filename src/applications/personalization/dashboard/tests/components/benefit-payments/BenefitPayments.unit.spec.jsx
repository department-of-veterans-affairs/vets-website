import React from 'react';
import { expect } from 'chai';
import { oneDayAgo } from '@@profile/tests/helpers';
import { renderInReduxProvider } from '~/platform/testing/unit/react-testing-library-helpers';
import reducers from '~/applications/personalization/dashboard/reducers';
import BenefitPayments from '../../../components/benefit-payments/BenefitPayments';

describe('<BenefitPayments />', () => {
  const user = {
    profile: {
      loa: {
        current: 3,
        highest: 3,
      },
    },
  };

  context('when there are recent payments', () => {
    it('should render the payment card', () => {
      const initialState = {
        user,
        allPayments: {
          isLoading: false,
          error: null,
          payments: [
            {
              payCheckAmount: '$3,261.10',
              payCheckDt: oneDayAgo(),
              payCheckId: '001',
              payCheckReturnFiche: 'C',
              payCheckType: 'Compensation & Pension - Recurring',
              paymentMethod: ' Direct Deposit',
              bankName: 'NAVY FEDERAL CREDIT UNION',
              accountNumber: '****1234',
            },
          ],
        },
      };

      const view = renderInReduxProvider(<BenefitPayments />, {
        initialState,
        reducers,
      });

      expect(view.getByTestId('dashboard-section-payment')).to.exist;
      expect(view.queryByTestId('payment-card')).to.exist;
      expect(view.getByTestId('manage-direct-deposit-link')).to.exist;
      expect(view.queryByTestId('no-recent-payments-text')).to.not.exist;
      expect(view.queryByTestId('view-payment-history-link')).to.not.exist;
      expect(view.queryByTestId('payments-error')).to.not.exist;
    });
  });

  context('when there are no recent payments', () => {
    it('should render the no payments text', () => {
      const initialState = {
        user,
        allPayments: {
          isLoading: false,
          error: null,
          payments: [
            {
              payCheckAmount: '$3,261.10',
              payCheckDt: '04/01/2019',
              payCheckId: '001',
              payCheckReturnFiche: 'C',
              payCheckType: 'Compensation & Pension - Recurring',
              paymentMethod: ' Direct Deposit',
              bankName: 'NAVY FEDERAL CREDIT UNION',
              accountNumber: '****1234',
            },
            {
              payCheckAmount: '$3,261.10',
              payCheckDt: '04/01/2019',
              payCheckId: '001',
              payCheckReturnFiche: 'C',
              payCheckType: 'Compensation & Pension - Recurring',
              paymentMethod: ' Direct Deposit',
              bankName: 'NAVY FEDERAL CREDIT UNION',
              accountNumber: '****1234',
            },
          ],
        },
      };

      const view = renderInReduxProvider(<BenefitPayments />, {
        initialState,
        reducers,
      });

      expect(view.getByTestId('dashboard-section-payment')).to.exist;
      expect(view.getByTestId('no-recent-payments-text')).to.exist;
      expect(view.getByTestId('manage-direct-deposit-link')).to.exist;
      expect(view.getByTestId('view-payment-history-link')).to.exist;
      expect(view.queryByTestId('payment-card')).to.not.exist;
      expect(view.queryByTestId('payments-error')).to.not.exist;
    });
  });

  context('when there is a payment error', () => {
    it('should render the payment error card', () => {
      const initialState = {
        user,
        allPayments: {
          isLoading: false,
          error: true,
          payments: [],
        },
      };

      const view = renderInReduxProvider(<BenefitPayments />, {
        initialState,
        reducers,
      });

      expect(view.getByTestId('payments-error')).to.exist;
      expect(view.getByTestId('dashboard-section-payment')).to.exist;
      expect(view.getByTestId('manage-direct-deposit-link')).to.exist;
      expect(view.getByTestId('view-payment-history-link')).to.exist;
      expect(view.queryByTestId('no-recent-payments-text')).to.not.exist;
      expect(view.queryByTestId('payment-card')).to.not.exist;
    });
  });
});
