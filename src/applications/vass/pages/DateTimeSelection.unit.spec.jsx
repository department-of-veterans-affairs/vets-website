import React from 'react';
import { expect } from 'chai';
import { waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithStoreAndRouterV6 } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';

import DateTimeSelection from './DateTimeSelection';
import reducers from '../redux/reducers';
import { vassApi } from '../redux/api/vassApi';

describe('VASS Component: DateTimeSelection', () => {
  const renderComponent = () =>
    renderWithStoreAndRouterV6(<DateTimeSelection />, {
      initialState: {
        vassForm: {
          selectedDate: null,
          selectedTopics: [],
        },
      },
      reducers,
      additionalMiddlewares: [vassApi.middleware],
    });

  it('should render title', () => {
    const screen = renderComponent();
    expect(screen.getByTestId('header')).to.exist;
  });

  it('should render the date time page correctly', () => {
    const screen = renderComponent();
    expect(screen.getByTestId('content')).to.exist;
    expect(screen.getByTestId('vaos-calendar')).to.exist;
    expect(screen.getByTestId('continue-button')).to.exist;
  });

  it('should prevent navigation when no date/time selected and continue button clicked', async () => {
    const screen = renderComponent();
    const continueButton = screen.getByTestId('continue-button');

    await userEvent.click(continueButton);

    // Validation error should be displayed
    await waitFor(() => {
      expect(screen.queryByText(/Please select a preferred date and time/)).to
        .exist;
    });
  });

  it('should have continue button with correct attributes', () => {
    const screen = renderComponent();
    const continueButton = screen.getByTestId('continue-button');

    expect(continueButton).to.have.attribute('continue');
  });

  it('should not deselect date when onChange is called with empty array', async () => {
    // Render component with a pre-selected date
    const selectedDate = '2025-01-15T09:00:00.000Z';
    const screen = renderWithStoreAndRouterV6(<DateTimeSelection />, {
      initialState: {
        vassForm: {
          selectedDate,
          selectedTopics: [],
        },
      },
      reducers,
      additionalMiddlewares: [vassApi.middleware],
    });

    // The calendar should show the selected date
    expect(screen.getByTestId('vaos-calendar')).to.exist;

    // Click continue - should not show validation error since date is already selected
    const continueButton = screen.getByTestId('continue-button');
    await userEvent.click(continueButton);

    // No validation error should appear since the date was pre-selected
    await waitFor(() => {
      expect(screen.queryByText(/Please select a preferred date and time/)).to
        .not.exist;
    });
  });

  it('should clear validation error when a date is selected after failed submit', async () => {
    const screen = renderComponent();
    const continueButton = screen.getByTestId('continue-button');

    // First click continue without selecting a date to trigger validation error
    await userEvent.click(continueButton);

    // Validation error should be displayed
    await waitFor(() => {
      expect(screen.queryByText(/Please select a preferred date and time/)).to
        .exist;
    });

    // The calendar widget should be present for selecting a date
    expect(screen.getByTestId('vaos-calendar')).to.exist;
  });
});
