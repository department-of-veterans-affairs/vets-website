import { render } from '@testing-library/react';
import { expect } from 'chai';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import { APP_TYPES, currency } from '../../utils/helpers';
import AlertCard from '../../components/AlertCard';
import BalanceCard from '../../components/BalanceCard';
import { GenericDisasterAlert } from '../../components/DisasterAlert';
import LoadingSpinner from '../../components/LoadingSpinner';
import OtherVADebts from '../../components/OtherVADebts';
import ZeroBalanceCard from '../../components/ZeroBalanceCard';

describe('combined debt portal component helpers', () => {
  describe('AlertCard helper: ', () => {
    it('should render', () => {
      const { getByTestId } = render(<AlertCard appType={APP_TYPES.DEBT} />);
      const alert = getByTestId('balance-card-alert-debt');
      expect(alert).to.exist;
    });
  });

  describe('BalanceCard helper: ', () => {
    const amount = 1000;
    const count = 3;
    const date = '2025-02-03';

    it('should render the correct data-testid for debt', () => {
      const { getByTestId } = render(
        <MemoryRouter>
          <BalanceCard
            amount={amount}
            count={count}
            date={date}
            appType={APP_TYPES.DEBT}
          />
        </MemoryRouter>,
      );
      const card = getByTestId('balance-card-debt');
      expect(card).to.exist;
    });

    it('should display the amount and debt header correctly', () => {
      const { getByTestId } = render(
        <MemoryRouter>
          <BalanceCard
            amount={amount}
            count={count}
            date={date}
            appType={APP_TYPES.DEBT}
          />
        </MemoryRouter>,
      );
      const cardAmount = getByTestId('card-amount');
      expect(cardAmount.textContent).to.include(currency(amount));
      expect(cardAmount.textContent).to.include(
        `for ${count} benefit overpayment${count > 1 ? 's' : ''}`,
      );
    });
  });

  describe('DisasterAlert helper: ', () => {
    it('should render without crashing', () => {
      const { container } = render(<GenericDisasterAlert />);
      expect(container).to.exist;
    });

    it('should render va-alert-expandable element', () => {
      const { container } = render(<GenericDisasterAlert />);
      const alertExpandable = container.querySelector('va-alert-expandable');
      expect(alertExpandable).to.exist;
    });

    it('should render the correct trigger text', () => {
      const { container } = render(<GenericDisasterAlert />);
      const alertExpandable = container.querySelector('va-alert-expandable');
      expect(alertExpandable.getAttribute('trigger')).to.equal(
        'Need help with VA debt after a natural disaster?',
      );
    });
  });

  describe('LoadingSpinner helper: ', () => {
    it('should render va-loading-indicator element', () => {
      const { container } = render(<LoadingSpinner margin={3} />);
      const loadingIndicator = container.querySelector('va-loading-indicator');

      expect(loadingIndicator).to.exist;
      expect(loadingIndicator.getAttribute('message')).to.equal(
        'Please wait while we load the application for you.',
      );
    });
  });

  describe('OtherVADebts helper: ', () => {
    it('should render the correct heading and body for VA debt', () => {
      const { getByRole, getByTestId } = render(
        <OtherVADebts module={APP_TYPES.DEBT} />,
      );

      // Test the heading text
      const heading = getByRole('heading', { name: 'Overpayment balances' });
      expect(heading).to.exist;

      // Test the body content for VA debt
      const body = getByTestId('other-va-debt-body');
      expect(body.textContent).to.include('VA benefit overpayments.');

      // Test the link for VA debt
      const link = getByTestId('other-va-debts-link');
      expect(link.getAttribute('href')).to.equal(
        '/manage-va-debt/summary/debt-balances',
      );
    });

    it('should render the correct heading and body for VA copay bills', () => {
      const { getByRole, getByTestId } = render(
        <OtherVADebts module={APP_TYPES.COPAY} />,
      );

      // Test the heading text
      const heading = getByRole('heading', { name: 'VA copay bills' });
      expect(heading).to.exist;

      // Test the body content for VA copay
      const body = getByTestId('other-va-copay-body');
      expect(body.textContent).to.include('VA health care copay bills.');
    });
  });

  describe('ZeroBalanceCard helper: ', () => {
    it('should render the correct title and content for VA debt', () => {
      const { getByTestId } = render(
        <ZeroBalanceCard appType={APP_TYPES.DEBT} />,
      );

      // Test the card title
      const title = getByTestId('card-title');
      expect(title.textContent).to.equal(
        "You don't have any outstanding overpayments",
      );

      // Test the content for VA debt
      const zeroBalanceCard = getByTestId('balance-card-zero-debt');
      expect(zeroBalanceCard).to.exist;

      const paragraph = zeroBalanceCard.querySelector('p');
      expect(paragraph.textContent).to.include(
        'If you think this is incorrect, call the Debt Management Center at',
      );
    });
  });
});
