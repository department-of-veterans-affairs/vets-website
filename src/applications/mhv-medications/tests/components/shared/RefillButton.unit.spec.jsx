import { expect } from 'chai';
import React from 'react';
import { renderWithStoreAndRouterV6 } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { fireEvent, waitFor } from '@testing-library/dom';
import {
  mockFetch,
  resetFetch,
} from '@department-of-veterans-affairs/platform-testing/helpers';
import { prescriptionsApi } from '../../../api/prescriptionsApi';
import reducer from '../../../reducers';
import RefillButton from '../../../components/shared/RefillButton';
import { dataDogActionNames } from '../../../util/dataDogConstants';

describe('Refill Button component', () => {
  const rx = {
    cmopDivisionPhone: '1234567890',
    prescriptionId: 1234567890,
    refillRemaining: 1,
    dispStatus: 'Active',
    isRefillable: true,
  };
  const setup = (rxOverrides = {}) => {
    return renderWithStoreAndRouterV6(
      <RefillButton {...{ ...rx, ...rxOverrides }} />,
      {
        initialState: {},
        reducers: reducer,
        initialEntries: ['/1234567890'],
        additionalMiddlewares: [prescriptionsApi.middleware],
      },
    );
  };

  beforeEach(() => {
    mockFetch();
  });

  afterEach(() => {
    resetFetch();
  });

  it('renders without errors', () => {
    const screen = setup();
    expect(screen);
  });

  it('renders the refill button when prescription is refillable', () => {
    const screen = setup();
    const button = screen.getByTestId('refill-request-button');
    expect(button).to.exist;
    expect(button).to.have.property('text', 'Request a refill');
  });

  it('renders the button with correct attributes', () => {
    const screen = setup();
    const button = screen.getByTestId('refill-request-button');
    expect(button).to.have.attribute('secondary');
    expect(button).to.have.attribute('id', 'refill-button-1234567890');
    expect(button).to.have.attribute(
      'aria-describedby',
      'card-header-1234567890',
    );
    expect(button).to.have.attribute(
      'data-dd-action-name',
      dataDogActionNames.medicationsListPage.REFILL_BUTTON,
    );
  });

  it('dispatches refillPrescription action and shows correct loading message', () => {
    const screen = setup();
    const refillButton = screen.getByTestId('refill-request-button');
    fireEvent.click(refillButton);
    expect(refillButton).to.exist;
    waitFor(() => {
      expect(screen.getByTestId('refill-loader')).to.exist;
      expect(screen.getByText('Submitting your request...')).to.exist;
    });
  });

  it('does not render the refill button when the prescription is NOT refillable', () => {
    const screen = setup({ isRefillable: false });
    expect(screen.queryByTestId('refill-request-button')).to.not.exist;
  });

  it('does not render the refill button when isRefillable is undefined', () => {
    const screen = setup({ isRefillable: undefined });
    expect(screen.queryByTestId('refill-request-button')).to.not.exist;
  });

  describe('15-day suppression period', () => {
    it('does not render the refill button when refillSubmitDate is within 15 days', () => {
      const today = new Date().toISOString();
      const screen = setup({ refillSubmitDate: today });
      expect(screen.queryByTestId('refill-request-button')).to.not.exist;
    });

    it('does not render the refill button when refillSubmitDate is exactly 14 days ago', () => {
      const fourteenDaysAgo = new Date(
        Date.now() - 14 * 24 * 60 * 60 * 1000,
      ).toISOString();
      const screen = setup({ refillSubmitDate: fourteenDaysAgo });
      expect(screen.queryByTestId('refill-request-button')).to.not.exist;
    });

    it('renders the refill button when refillSubmitDate is exactly 15 days ago', () => {
      const fifteenDaysAgo = new Date(
        Date.now() - 15 * 24 * 60 * 60 * 1000,
      ).toISOString();
      const screen = setup({ refillSubmitDate: fifteenDaysAgo });
      const button = screen.getByTestId('refill-request-button');
      expect(button).to.exist;
    });

    it('renders the refill button when refillSubmitDate is more than 15 days ago', () => {
      const twentyDaysAgo = new Date(
        Date.now() - 20 * 24 * 60 * 60 * 1000,
      ).toISOString();
      const screen = setup({ refillSubmitDate: twentyDaysAgo });
      const button = screen.getByTestId('refill-request-button');
      expect(button).to.exist;
    });

    it('renders the refill button when refillSubmitDate is null', () => {
      const screen = setup({ refillSubmitDate: null });
      const button = screen.getByTestId('refill-request-button');
      expect(button).to.exist;
    });

    it('renders the refill button when refillSubmitDate is undefined', () => {
      const screen = setup({ refillSubmitDate: undefined });
      const button = screen.getByTestId('refill-request-button');
      expect(button).to.exist;
    });

    it('renders the refill button when refillSubmitDate is an invalid date string', () => {
      const screen = setup({ refillSubmitDate: 'invalid-date' });
      const button = screen.getByTestId('refill-request-button');
      expect(button).to.exist;
    });

    it('renders the refill button for cross-tab duplicate prevention', () => {
      const testRx = { ...rx, prescriptionId: 123456789 };
      const screen = setup(testRx);
      const button = screen.getByTestId('refill-request-button');

      expect(button).to.exist;
      expect(button).to.not.have.attribute('disabled');
    });
  });
});
