import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import CancelAppointmentSucceededModal from '../CancelAppointmentSucceededModal';

describe('VAOS Component: CancelAppointmentSucceededModal', () => {
  const initialState = {
    featureToggles: {},
  };

  it('should display statement for canceled appointment', async () => {
    const screen = render(<CancelAppointmentSucceededModal isConfirmed />, {
      initialState,
    });
    await screen.findByRole('alertdialog');
    expect(screen.baseElement).to.contain.text(
      'If you want to reschedule, call us or schedule a new appointment online',
    );
    expect(screen.findByRole, 'button', { name: /continue/i });
  });

  it('should display statement for canceled request', async () => {
    const screen = render(
      <CancelAppointmentSucceededModal isConfirmed={false} />,
      { initialState },
    );
    await screen.findByRole('alertdialog');
    expect(screen.baseElement).to.contain.text(
      'If you still need an appointment, call us or request a new appointment online.',
    );
    expect(screen.findByRole, 'button', { name: /continue/i });
  });
});
