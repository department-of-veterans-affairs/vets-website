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
import FillRefillButton from '../../../components/shared/FillRefillButton';

describe('Fill Refill Button component', () => {
  const rx = {
    cmopDivisionPhone: '1234567890',
    dispensedDate: '2023-08-04T04:00:00.000Z',
    error: true,
    prescriptionId: 1234567890,
    refillRemaining: 1,
    dispStatus: 'Active',
    success: true,
    isRefillable: true,
  };
  const setup = () => {
    return renderWithStoreAndRouterV6(<FillRefillButton {...rx} />, {
      initialState: {},
      reducers: reducer,
      initialEntries: ['/1234567890'],
      additionalMiddlewares: [prescriptionsApi.middleware],
    });
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

  it('renders a success message', () => {
    const screen = setup();
    const successMessage = screen.getByText(
      'We got your request to refill this prescription.',
    );
    expect(successMessage).to.exist;
  });

  it('renders an error message', () => {
    const screen = setup();
    const errorMessage = screen.getByText(
      'We didn’t get your request. Try again.',
    );
    expect(errorMessage).to.exist;
  });

  it('dispatches fillPrescription action and shows correct loading message', async () => {
    const screen = setup();
    const fillButton = await screen.findByTestId('refill-request-button');
    fireEvent.click(fillButton);
    expect(fillButton).to.exist;
    waitFor(() => {
      expect(screen.getByTestId('refill-loader')).to.exist;
      expect(screen.getByText('Submitting your request...')).to.exist;
    });
  });

  it('does not render the fill button when the prescription is NOT fillable', () => {
    const nonRefillableRx = {
      cmopDivisionPhone: '1234567890',
      dispensedDate: '2023-08-04T04:00:00.000Z',
      error: true,
      prescriptionId: 1234567890,
      refillRemaining: 1,
      dispStatus: 'Active',
      success: true,
      isRefillable: false,
    };
    const screen = renderWithStoreAndRouterV6(
      <FillRefillButton {...nonRefillableRx} />,
      {
        initialState: {},
        reducers: reducer,
        initialEntries: ['/1234567890'],
        additionalMiddlewares: [prescriptionsApi.middleware],
      },
    );
    expect(screen.queryByTestId('refill-request-button')).to.not.exist;
  });

  it('renders the correct text when dispensedDate is null', () => {
    const screen = renderWithStoreAndRouterV6(
      <FillRefillButton {...{ ...rx, dispensedDate: null }} />,
      {
        initialState: {},
        reducers: reducer,
        initialEntries: ['/1234567890'],
        additionalMiddlewares: [prescriptionsApi.middleware],
      },
    );
    const button = screen.getByTestId('refill-request-button');
    expect(button).to.have.property('text', 'Request the first fill');
  });

  it('renders the correct text when dispensedDate exists', () => {
    const screen = renderWithStoreAndRouterV6(<FillRefillButton {...rx} />, {
      initialState: {},
      reducers: reducer,
      initialEntries: ['/1234567890'],
      additionalMiddlewares: [prescriptionsApi.middleware],
    });
    const button = screen.getByTestId('refill-request-button');
    expect(button).to.have.property('text', 'Request a refill');
  });
});
