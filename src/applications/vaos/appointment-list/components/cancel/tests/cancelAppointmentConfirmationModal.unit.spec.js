import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import CancelAppointmentConfirmationModal from '../CancelAppointmentConfirmationModal';
import { FETCH_STATUS } from '../../../../utils/constants';

describe('Cancel appointment confirmation modal', () => {
  const initialState = {
    featureToggles: {},
  };

  it('Should hide the cancel appointment button when fetch is loading', async () => {
    const screen = render(
      <CancelAppointmentConfirmationModal
        isConfirmed
        onClose={() => {}}
        onConfirm={() => {}}
        status={FETCH_STATUS.loading}
      />,
      {
        initialState,
      },
    );
    await screen.findByRole('alertdialog');
    expect(screen.baseElement).to.contain.text(
      'If you want to reschedule, you’ll need to call us',
    );
    expect(screen.container.querySelector('.fa-spin')).to.exist;
    expect(
      screen.queryByRole('button', { name: /Yes, cancel this appointment/i }),
    ).to.be.null;
  });
  it('Should show the cancel appointment button when fetch has not started', async () => {
    const screen = render(
      <CancelAppointmentConfirmationModal
        isConfirmed
        onClose={() => {}}
        onConfirm={() => {}}
        status={FETCH_STATUS.notStarted}
      />,
      {
        initialState,
      },
    );
    await screen.findByRole('alertdialog');
    expect(screen.baseElement).to.contain.text(
      'If you want to reschedule, you’ll need to call us',
    );
    expect(
      screen.getByRole('button', { name: /Yes, cancel this appointment/i }),
    ).to.exist;
    expect(screen.container.querySelector('va-button')).to.exist;
    expect(screen.container.querySelector('va-button')).to.have.attribute(
      'text',
      "No, don't cancel",
    );
  });
  it('Should hide cancel request button when fetch is loading', async () => {
    const screen = render(
      <CancelAppointmentConfirmationModal
        isConfirmed={false}
        onClose={() => {}}
        onConfirm={() => {}}
        status={FETCH_STATUS.loading}
      />,
      {
        initialState,
      },
    );
    await screen.findByRole('alertdialog');
    expect(screen.baseElement).to.contain.text(
      'If you still need an appointment, you’ll need to call us',
    );
    expect(screen.queryByRole('button', { name: /Yes, cancel this request/i }))
      .to.be.null;
  });
  it('Should show the cancel request button when fetch has not started', async () => {
    const screen = render(
      <CancelAppointmentConfirmationModal
        isConfirmed={false}
        onClose={() => {}}
        onConfirm={() => {}}
        status={FETCH_STATUS.notStarted}
      />,
      {
        initialState,
      },
    );
    await screen.findByRole('alertdialog');
    expect(screen.baseElement).to.contain.text(
      'If you still need an appointment, you’ll need to call us',
    );
    expect(screen.getByRole('button', { name: /Yes, cancel this request/i })).to
      .exist;
    expect(screen.container.querySelector('va-button')).to.exist;
    expect(screen.container.querySelector('va-button')).to.have.attribute(
      'text',
      "No, don't cancel",
    );
  });
});
