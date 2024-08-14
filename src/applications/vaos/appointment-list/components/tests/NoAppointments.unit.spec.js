import React from 'react';
import { expect } from 'chai';
import userEvent from '@testing-library/user-event';
import { renderWithStoreAndRouter } from '~/platform/testing/unit/react-testing-library-helpers';
import NoAppointments from '../NoAppointments';

describe('VAOS Component: NoAppointments', () => {
  const initialState = {
    featureToggles: {
      featureBreadcrumbUrlUpdate: true,
    },
  };

  it('should display no appointment info', async () => {
    const screen = renderWithStoreAndRouter(
      <NoAppointments
        showScheduleButton
        showAdditionalRequestDescription={false}
      />,
      { initialState },
    );
    // Assert
    expect(
      screen.getByRole('heading', {
        level: 3,
        name: 'You don’t have any appointments',
      }),
    ).to.exist;

    expect(screen.queryByText(/You can schedule an appointment online now/)).to
      .to.exist;
    expect(screen.queryByTestId('schedule-appointment-link')).to.exist;
    userEvent.click(screen.queryByTestId('schedule-appointment-link'));
  });
  it('should display additional detail', async () => {
    const screen = renderWithStoreAndRouter(
      <NoAppointments showScheduleButton showAdditionalRequestDescription />,
      { initialState },
    );
    // Assert
    expect(
      screen.getByRole('heading', {
        level: 3,
        name: 'You don’t have any appointments',
      }),
    ).to.exist;

    expect(
      screen.queryByText(/If you request an appointment it will show here/),
    ).to.exist;
    expect(screen.queryByTestId('schedule-appointment-link')).to.exist;
    userEvent.click(screen.queryByTestId('schedule-appointment-link'));
  });
  it('should not display schedule an appointment link', async () => {
    const screen = renderWithStoreAndRouter(
      <NoAppointments
        showScheduleButton={false}
        showAdditionalRequestDescription
      />,
      { initialState },
    );
    // Assert
    expect(
      screen.getByRole('heading', {
        level: 3,
        name: 'You don’t have any appointments',
      }),
    ).to.exist;
    expect(screen.queryByTestId('schedule-appointment-link')).to.be.null;
  });
});
