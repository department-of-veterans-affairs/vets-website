import React from 'react';
import { expect } from 'chai';
import userEvent from '@testing-library/user-event';
import { renderWithStoreAndRouter } from '../../tests/mocks/setup';
import AfterVisitSummary from '../AfterVisitSummary';

describe('VAOS Component: AfterVisitSummary', () => {
  const initialState = {
    featureToggles: {
      vaOnlineSchedulingAppointmentDetailsRedesign: true,
    },
  };

  it('should display after visit summary link', async () => {
    // Arrange
    const appointment = {
      avsPath: '/test-avs-path',
    };

    // Act
    const screen = renderWithStoreAndRouter(
      <AfterVisitSummary data={appointment} />,
      {
        initialState,
      },
    );

    // Assert
    expect(screen.queryByTestId('after-vist-summary-link')).to.exist;
  });

  it('Should display after visit summary link error message', async () => {
    // Arrange
    const appointment = {
      avsPath: '/Error retrieving AVS link',
    };

    // Act
    const screen = renderWithStoreAndRouter(
      <AfterVisitSummary data={appointment} />,
      {
        initialState,
      },
    );

    await screen.findByRole('heading', {
      name: /We can't access after-visit summaries at this time./i,
    });
  });

  it('Should record google analytics when after visit summary link is clicked ', () => {
    // Arrange
    const appointment = {
      avsPath: '/test-avs-path',
    };

    // Act
    const screen = renderWithStoreAndRouter(
      <AfterVisitSummary data={appointment} />,
      {
        initialState,
      },
    );

    // Assert
    expect(screen.queryByTestId('after-vist-summary-link')).to.exist;

    userEvent.click(screen.queryByTestId('after-vist-summary-link'));
    expect(window.dataLayer[0]).to.deep.equal({
      event: 'vaos-after-visit-summary-link-clicked',
    });
  });

  it('Should display after visit summary link unavailable message', async () => {
    // Arrange
    const appointment = {};

    // Act
    const screen = renderWithStoreAndRouter(
      <AfterVisitSummary data={appointment} />,
      {
        initialState,
      },
    );

    // Assert
    expect(
      screen.getByText(
        'An after-visit summary is not available at this time.',
        {
          exact: true,
          selector: 'p',
        },
      ),
    );
  });
});
