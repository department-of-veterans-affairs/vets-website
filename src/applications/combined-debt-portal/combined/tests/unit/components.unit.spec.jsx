import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';

import { APP_TYPES, currency } from '../../utils/helpers';
import AlertCard from '../../components/AlertCard';
import BalanceCard from '../../components/BalanceCard';
import { GenericDisasterAlert } from '../../components/DisasterAlert';
import LoadingSpinner from '../../components/LoadingSpinner';
import OtherVADebts from '../../components/OtherVADebts';
import ZeroBalanceCard from '../../components/ZeroBalanceCard';

describe('combined debt portal component helpers', () => {
  describe('AlertCard helper: ', () => {
    let wrapper;
    beforeEach(() => {
      wrapper = shallow(<AlertCard appType={APP_TYPES.DEBT} />);
    });

    it('should render', () => {
      const alert = wrapper.find('[data-testid="balance-card-alert-debt"]');
      expect(alert).to.have.lengthOf(1);
    });
  });

  describe('BalanceCard helper: ', () => {
    let wrapper;

    const amount = 1000;
    const count = 3;
    const date = '2025-02-03';

    beforeEach(() => {
      wrapper = shallow(
        <BalanceCard
          amount={amount}
          count={count}
          date={date}
          appType={APP_TYPES.DEBT}
        />,
      );
    });

    it('should render the correct data-testid for debt', () => {
      const card = wrapper.find('[data-testid="balance-card-debt"]');
      expect(card).to.have.lengthOf(1);
    });

    it('should display the amount and debt header correctly', () => {
      const cardAmount = wrapper.find('[data-testid="card-amount"]');
      expect(cardAmount.text()).to.include(currency(amount)); // Assuming currency is something like "$1,000.00"
      expect(cardAmount.text()).to.include(
        `for ${count} benefit overpayment${count > 1 ? 's' : ''}`,
      );
    });
  });
  describe('DisasterAlert helper: ', () => {
    let wrapper;

    beforeEach(() => {
      // Shallow render the component before each test
      wrapper = shallow(<GenericDisasterAlert />);
    });

    it('should render without crashing', () => {
      // Test if the component renders successfully
      expect(wrapper.exists()).to.be.true;
    });

    it('should render va-alert-expandable element', () => {
      // Check that the va-alert-expandable is rendered
      expect(wrapper.find('va-alert-expandable')).to.have.lengthOf(1);
    });

    it('should render the correct trigger text', () => {
      // Check that the correct trigger text is displayed in va-alert-expandable
      const triggerText = wrapper.find('va-alert-expandable').prop('trigger');
      expect(triggerText).to.equal(
        'Need help with VA debt after a natural disaster?',
      );
    });
  });
  describe('LoadingSpinner helper: ', () => {
    let wrapper;

    beforeEach(() => {
      // Shallow render the component before each test
      wrapper = shallow(<LoadingSpinner margin={3} />);
    });

    it('should render without crashing', () => {
      // Test if the component renders successfully
      expect(wrapper.exists()).to.be.true;
    });

    it('should render va-loading-indicator element', () => {
      // Check that the va-loading-indicator is rendered
      expect(wrapper.find('va-loading-indicator')).to.have.lengthOf(1);
    });

    it('should render the correct message in va-loading-indicator', () => {
      // Check that the correct message is displayed in the va-loading-indicator
      const loadingIndicatorMessage = wrapper
        .find('va-loading-indicator')
        .prop('message');
      expect(loadingIndicatorMessage).to.equal(
        'Please wait while we load the application for you.',
      );
    });
  });

  describe('OtherVADebts helper: ', () => {
    it('should render the correct heading and body for VA debt', () => {
      const wrapper = shallow(<OtherVADebts module={APP_TYPES.DEBT} />);

      // Test the heading text
      expect(wrapper.find('h2').text()).to.equal('Overpayment balances');

      // Test the body content for VA debt
      expect(
        wrapper.find('[data-testid="other-va-debt-body"]'),
      ).to.have.lengthOf(1);
      expect(
        wrapper.find('[data-testid="other-va-debt-body"]').text(),
      ).to.include('VA benefit overpayments.');

      // Test the link for VA debt
      expect(
        wrapper.find('[data-testid="other-va-debts-link"]').prop('href'),
      ).to.equal('/manage-va-debt/summary/debt-balances');
      wrapper.unmount();
    });
    it('should render the correct heading and body for VA copay bills', () => {
      const wrapper = shallow(<OtherVADebts module={APP_TYPES.COPAY} />);

      // Test the heading text
      expect(wrapper.find('h2').text()).to.equal('VA copay bills');

      // Test the body content for VA copay
      expect(
        wrapper.find('[data-testid="other-va-copay-body"]'),
      ).to.have.lengthOf(1);
      expect(
        wrapper.find('[data-testid="other-va-copay-body"]').text(),
      ).to.include('VA health care copay bills.');
      wrapper.unmount();
    });
  });
  describe('ZeroBalanceCard helper: ', () => {
    it('should render the correct title and content for VA debt', () => {
      const wrapper = shallow(<ZeroBalanceCard appType={APP_TYPES.DEBT} />);

      // Test the card title
      expect(wrapper.find('[data-testid="card-title"]').text()).to.equal(
        "You don't have any outstanding overpayments",
      );

      // Test the content for VA debt
      expect(
        wrapper.find('[data-testid="balance-card-zero-debt"]'),
      ).to.have.lengthOf(1);
      expect(
        wrapper.find('[data-testid="balance-card-zero-debt"] p').text(),
      ).to.include(
        'If you think this is incorrect, call the Debt Management Center at',
      );
      wrapper.unmount();
    });
  });
});
