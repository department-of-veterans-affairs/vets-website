import React from 'react';
import { expect } from 'chai';
import { renderInReduxProvider } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';

import CardLayout from '../../components/CardLayout';
import { MHV_ACCOUNT_CARDS } from '../../constants';
import reducers from '../../reducers';

const createCardData = (titles = []) => {
  return titles.map(title => ({
    title,
    icon: 'calendar_today',
    links: [{ href: '/test-link', text: 'Test Link' }],
  }));
};

const stateFn = ({
  mhvAccountStatusErrors = [],
  mhvAccountStatusLoading = false,
} = {}) => ({
  myHealth: {
    accountStatus: {
      loading: mhvAccountStatusLoading,
      data: {
        errors: mhvAccountStatusErrors,
      },
    },
  },
});

const setup = ({ initialState = stateFn(), props = {} } = {}) =>
  renderInReduxProvider(<CardLayout {...props} />, {
    initialState,
    reducers,
  });

describe('CardLayout component', () => {
  describe('error card rendering', () => {
    it('renders ErrorNavCard when mhvAccountStatusSortedErrors.length > 0 and card title is in MHV_ACCOUNT_CARDS', () => {
      const errors = [{ code: 801 }];
      const initialState = stateFn({ mhvAccountStatusErrors: errors });
      const cardData = createCardData(['Messages']); // Messages is in MHV_ACCOUNT_CARDS

      const { container, getByText } = setup({
        initialState,
        props: { data: cardData },
      });

      // ErrorNavCard should show error message (when userActionable=true, shows error code format)
      expect(getByText(/Error 801:/)).to.exist;
      // Verify error message is displayed (check for key phrase, not entire content)
      const paragraph = container.querySelector('p');
      expect(paragraph.textContent).to.include('give you access to');
      expect(getByText('Messages')).to.exist;
    });

    it('renders ErrorNavCard for all MHV_ACCOUNT_CARDS titles when errors exist', () => {
      const errors = [{ code: 801 }];
      const initialState = stateFn({ mhvAccountStatusErrors: errors });
      const cardData = createCardData(MHV_ACCOUNT_CARDS); // Messages, Medications, Medical records

      const { getAllByText } = setup({
        initialState,
        props: { data: cardData },
      });

      // All three error cards should be rendered (when userActionable=true, shows error code format)
      const errorMessages = getAllByText(/Error 801:/);
      expect(errorMessages.length).to.equal(3);
    });

    it('renders NavCard for cards not in MHV_ACCOUNT_CARDS even when errors exist', () => {
      const errors = [{ code: 801 }];
      const initialState = stateFn({ mhvAccountStatusErrors: errors });
      const cardData = createCardData(['Appointments']); // Appointments is NOT in MHV_ACCOUNT_CARDS

      const { getByText, queryByText } = setup({
        initialState,
        props: { data: cardData },
      });

      // Should render NavCard, not ErrorNavCard
      expect(queryByText(/We've run into a problem/)).to.not.exist;
      expect(getByText('Appointments')).to.exist;
      expect(getByText('Test Link')).to.exist;
    });

    it('renders NavCard when mhvAccountStatusSortedErrors.length is 0', () => {
      const initialState = stateFn({ mhvAccountStatusErrors: [] });
      const cardData = createCardData(['Messages']); // Even though Messages is in MHV_ACCOUNT_CARDS

      const { getByText, queryByText } = setup({
        initialState,
        props: { data: cardData },
      });

      // Should render NavCard, not ErrorNavCard
      expect(queryByText(/We've run into a problem/)).to.not.exist;
      expect(getByText('Messages')).to.exist;
      expect(getByText('Test Link')).to.exist;
    });
  });

  describe('userActionable prop', () => {
    it('sets userActionable to true when mhvAccountStatusUserErrors.length > 0', () => {
      // User actionable error codes are: 801, 805, 806, 807
      const errors = [{ code: 801 }]; // 801 is a user actionable error
      const initialState = stateFn({ mhvAccountStatusErrors: errors });
      const cardData = createCardData(['Messages']);

      const { getByText } = setup({
        initialState,
        props: { data: cardData },
      });

      // ErrorNavCard with userActionable=true shows error code and phone number
      expect(getByText(/Error 801:/)).to.exist;
      expect(getByText(/Call us at/)).to.exist;
    });

    it('sets userActionable to false when mhvAccountStatusUserErrors.length is 0', () => {
      // Error code 900 is NOT a user actionable error (not in [801, 805, 806, 807])
      const errors = [{ code: 900 }];
      const initialState = stateFn({ mhvAccountStatusErrors: errors });
      const cardData = createCardData(['Messages']);

      const { container, queryByText } = setup({
        initialState,
        props: { data: cardData },
      });

      // ErrorNavCard with userActionable=false shows generic message (no error code, no phone)
      expect(queryByText(/Error \d+:/)).to.not.exist;
      expect(queryByText(/Call us at/)).to.not.exist;
      // Verify generic error message is displayed (check for key phrase, not entire content)
      const paragraph = container.querySelector('p');
      expect(paragraph.textContent).to.include('run into a problem');
    });

    it('sorts errors and prioritizes user actionable errors', () => {
      // Multiple errors, user actionable should be first
      const errors = [
        { code: 900 }, // Non-user actionable
        { code: 801 }, // User actionable
      ];
      const initialState = stateFn({ mhvAccountStatusErrors: errors });
      const cardData = createCardData(['Messages']);

      const { getByText } = setup({
        initialState,
        props: { data: cardData },
      });

      // Should use the first error after sorting (user actionable 801 should be first)
      expect(getByText(/Error 801:/)).to.exist;
      expect(getByText(/Call us at/)).to.exist;
    });
  });

  describe('card layout with different data array lengths', () => {
    it('renders correctly with empty array', () => {
      const initialState = stateFn();
      const cardData = [];

      const { container } = setup({
        initialState,
        props: { data: cardData },
      });

      // Should render no cards
      const cards = container.querySelectorAll(
        '[data-testid^="mhv-link-group-card-"]',
      );
      expect(cards.length).to.equal(0);
    });

    it('renders correctly with 1 card (odd count)', () => {
      const initialState = stateFn();
      const cardData = createCardData(['Appointments']);

      const { container, getByText } = setup({
        initialState,
        props: { data: cardData },
      });

      // Should render 1 card in 1 row
      const cards = container.querySelectorAll(
        '[data-testid^="mhv-link-group-card-"]',
      );
      expect(cards.length).to.equal(1);
      expect(getByText('Appointments')).to.exist;
    });

    it('renders correctly with 2 cards (even count)', () => {
      const initialState = stateFn();
      const cardData = createCardData(['Appointments', 'Messages']);

      const { container, getByText } = setup({
        initialState,
        props: { data: cardData },
      });

      // Should render 2 cards in 1 row (offset = 2)
      const cards = container.querySelectorAll(
        '[data-testid^="mhv-link-group-card-"]',
      );
      expect(cards.length).to.equal(2);
      expect(getByText('Appointments')).to.exist;
      expect(getByText('Messages')).to.exist;
    });

    it('renders correctly with 3 cards (odd count)', () => {
      const initialState = stateFn();
      const cardData = createCardData([
        'Appointments',
        'Messages',
        'Medications',
      ]);

      const { container, getByText } = setup({
        initialState,
        props: { data: cardData },
      });

      // Should render 3 cards in 2 rows (2 in first row, 1 in second row)
      const cards = container.querySelectorAll(
        '[data-testid^="mhv-link-group-card-"]',
      );
      expect(cards.length).to.equal(3);
      expect(getByText('Appointments')).to.exist;
      expect(getByText('Messages')).to.exist;
      expect(getByText('Medications')).to.exist;
    });

    it('renders correctly with 4 cards (even count)', () => {
      const initialState = stateFn();
      const cardData = createCardData([
        'Appointments',
        'Messages',
        'Medications',
        'Medical records',
      ]);

      const { container, getByText } = setup({
        initialState,
        props: { data: cardData },
      });

      // Should render 4 cards in 2 rows (2 in each row)
      const cards = container.querySelectorAll(
        '[data-testid^="mhv-link-group-card-"]',
      );
      expect(cards.length).to.equal(4);
      expect(getByText('Appointments')).to.exist;
      expect(getByText('Messages')).to.exist;
      expect(getByText('Medications')).to.exist;
      expect(getByText('Medical records')).to.exist;
    });

    it('renders correctly with 5 cards (odd count)', () => {
      const initialState = stateFn();
      const cardData = createCardData([
        'Appointments',
        'Messages',
        'Medications',
        'Medical records',
        'Payments',
      ]);

      const { container, getByText } = setup({
        initialState,
        props: { data: cardData },
      });

      // Should render 5 cards in 3 rows (2, 2, 1)
      const cards = container.querySelectorAll(
        '[data-testid^="mhv-link-group-card-"]',
      );
      expect(cards.length).to.equal(5);
      expect(getByText('Appointments')).to.exist;
      expect(getByText('Messages')).to.exist;
      expect(getByText('Medications')).to.exist;
      expect(getByText('Medical records')).to.exist;
      expect(getByText('Payments')).to.exist;
    });

    it('renders mixed error and normal cards correctly', () => {
      const errors = [{ code: 801 }];
      const initialState = stateFn({ mhvAccountStatusErrors: errors });
      // Mix of MHV_ACCOUNT_CARDS and non-MHV_ACCOUNT_CARDS
      const cardData = createCardData([
        'Appointments', // Not in MHV_ACCOUNT_CARDS - should render NavCard
        'Messages', // In MHV_ACCOUNT_CARDS - should render ErrorNavCard
        'Medications', // In MHV_ACCOUNT_CARDS - should render ErrorNavCard
        'Medical records', // In MHV_ACCOUNT_CARDS - should render ErrorNavCard
        'Payments', // Not in MHV_ACCOUNT_CARDS - should render NavCard
      ]);

      const { container, getAllByText, getByText } = setup({
        initialState,
        props: { data: cardData },
      });

      // Should render 5 cards
      const cards = container.querySelectorAll(
        '[data-testid^="mhv-link-group-card-"]',
      );
      expect(cards.length).to.equal(5);

      // Should have 3 error cards (Messages, Medications, Medical records)
      // When userActionable=true, shows error code format
      const errorMessages = getAllByText(/Error 801:/);
      expect(errorMessages.length).to.equal(3);

      // Should have 2 normal cards (Appointments, Payments)
      expect(getByText('Appointments')).to.exist;
      const testLinks = getAllByText('Test Link'); // From NavCard
      expect(testLinks.length).to.equal(2); // Should have 2 NavCards with Test Link
      expect(getByText('Payments')).to.exist;
    });
  });
});
