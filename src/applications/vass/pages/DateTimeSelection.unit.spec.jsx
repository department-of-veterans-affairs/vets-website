import React from 'react';
import { expect } from 'chai';
import { waitFor } from '@testing-library/react';
import { renderWithStoreAndRouterV6 } from '~/platform/testing/unit/react-testing-library-helpers';

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
    expect(screen.getByTestId('button-pair')).to.exist;
  });

  it('should prevent navigation when no date/time selected and continue button clicked', async () => {
    const screen = renderComponent();
    const buttonPair = screen.getByTestId('button-pair');

    // Trigger the onPrimaryClick event (continue button)
    const primaryClickEvent = new CustomEvent('primaryClick');
    buttonPair.dispatchEvent(primaryClickEvent);

    // Validation error should be displayed
    await waitFor(() => {
      expect(screen.queryByText(/Please select a preferred date and time/)).to
        .exist;
    });
  });

  it('should have button pair with correct attributes', () => {
    const screen = renderComponent();
    const buttonPair = screen.getByTestId('button-pair');

    expect(buttonPair).to.exist;
    expect(buttonPair.hasAttribute('continue')).to.be.true;
  });
});
