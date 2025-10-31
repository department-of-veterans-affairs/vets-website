import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import EpsCancellationLayout from './EpsCancellationLayout';

describe('EpsCancellationLayout', () => {
  const sandbox = sinon.createSandbox();
  let onConfirmCancellation;
  let onAbortCancellation;
  let mockAppointment;

  beforeEach(() => {
    onConfirmCancellation = sandbox.spy();
    onAbortCancellation = sandbox.spy();
    mockAppointment = {
      start: '2024-11-15T10:00:00Z',
      typeOfCare: 'Primary Care',
      reason: 'Routine checkup',
      comments: 'Please bring medical records',
      provider: {
        name: 'Dr. John Smith',
        phone: '555-123-4567',
        location: {
          name: 'Community Medical Center',
          timezone: 'America/New_York',
          address: {
            street: '123 Main St',
            city: 'Springfield',
            state: 'MA',
            zipCode: '01101',
          },
        },
      },
    };
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should show both action buttons when cancellation is not confirmed', () => {
    const { getByTestId } = render(
      <EpsCancellationLayout
        cancellationConfirmed={false}
        onConfirmCancellation={onConfirmCancellation}
        onAbortCancellation={onAbortCancellation}
        appointment={mockAppointment}
      />,
    );

    expect(getByTestId('cancel-button')).to.exist;
    expect(getByTestId('do-not-cancel-button')).to.exist;
  });

  it('should hide action buttons when cancellation is confirmed', () => {
    const { queryByTestId } = render(
      <EpsCancellationLayout
        cancellationConfirmed
        onConfirmCancellation={onConfirmCancellation}
        onAbortCancellation={onAbortCancellation}
        appointment={mockAppointment}
      />,
    );

    expect(queryByTestId('cancel-button')).to.not.exist;
    expect(queryByTestId('do-not-cancel-button')).to.not.exist;
  });

  it('should call onConfirmCancellation when "Yes, cancel appointment" button is clicked', async () => {
    const { getByTestId } = render(
      <EpsCancellationLayout
        cancellationConfirmed={false}
        onConfirmCancellation={onConfirmCancellation}
        onAbortCancellation={onAbortCancellation}
        appointment={mockAppointment}
      />,
    );

    const cancelButton = getByTestId('cancel-button');
    await userEvent.click(cancelButton);

    expect(onConfirmCancellation.calledOnce).to.be.true;
    expect(onAbortCancellation.called).to.be.false;
  });

  it('should call onAbortCancellation when "No, do not cancel" button is clicked', async () => {
    const { getByTestId } = render(
      <EpsCancellationLayout
        cancellationConfirmed={false}
        onConfirmCancellation={onConfirmCancellation}
        onAbortCancellation={onAbortCancellation}
        appointment={mockAppointment}
      />,
    );

    const doNotCancelButton = getByTestId('do-not-cancel-button');
    await userEvent.click(doNotCancelButton);

    expect(onAbortCancellation.calledOnce).to.be.true;
    expect(onConfirmCancellation.called).to.be.false;
  });

  it('should render "Yes, cancel appointment" button with correct text', () => {
    const { getByTestId } = render(
      <EpsCancellationLayout
        cancellationConfirmed={false}
        onConfirmCancellation={onConfirmCancellation}
        onAbortCancellation={onAbortCancellation}
        appointment={mockAppointment}
      />,
    );

    const cancelButton = getByTestId('cancel-button');
    expect(cancelButton).to.have.attribute('text', 'Yes, cancel appointment');
  });

  it('should render "No, do not cancel" button with correct text and secondary style', () => {
    const { getByTestId } = render(
      <EpsCancellationLayout
        cancellationConfirmed={false}
        onConfirmCancellation={onConfirmCancellation}
        onAbortCancellation={onAbortCancellation}
        appointment={mockAppointment}
      />,
    );

    const doNotCancelButton = getByTestId('do-not-cancel-button');
    expect(doNotCancelButton).to.have.attribute('text', 'No, do not cancel');
    expect(doNotCancelButton).to.have.attribute('secondary');
  });

  describe('appointment content rendering', () => {
    it('should render type of care when available', () => {
      const { getByText } = render(
        <EpsCancellationLayout
          cancellationConfirmed={false}
          onConfirmCancellation={onConfirmCancellation}
          onAbortCancellation={onAbortCancellation}
          appointment={mockAppointment}
        />,
      );

      expect(getByText('Primary Care')).to.exist;
    });

    it('should show "Type of care not available" when typeOfCare is missing', () => {
      const appointmentWithoutTypeOfCare = {
        ...mockAppointment,
        typeOfCare: null,
      };

      const { getByText } = render(
        <EpsCancellationLayout
          cancellationConfirmed={false}
          onConfirmCancellation={onConfirmCancellation}
          onAbortCancellation={onAbortCancellation}
          appointment={appointmentWithoutTypeOfCare}
        />,
      );

      expect(getByText('Type of care not available')).to.exist;
    });

    it('should render provider name when available', () => {
      const { getByText } = render(
        <EpsCancellationLayout
          cancellationConfirmed={false}
          onConfirmCancellation={onConfirmCancellation}
          onAbortCancellation={onAbortCancellation}
          appointment={mockAppointment}
        />,
      );

      expect(getByText('Dr. John Smith')).to.exist;
    });

    it('should show "Provider name not available" when provider name is missing', () => {
      const appointmentWithoutProviderName = {
        ...mockAppointment,
        provider: {
          ...mockAppointment.provider,
          name: null,
        },
      };

      const { getByText } = render(
        <EpsCancellationLayout
          cancellationConfirmed={false}
          onConfirmCancellation={onConfirmCancellation}
          onAbortCancellation={onAbortCancellation}
          appointment={appointmentWithoutProviderName}
        />,
      );

      expect(getByText('Provider name not available')).to.exist;
    });

    it('should show "Provider name not available" when provider object is missing', () => {
      const appointmentWithoutProvider = {
        ...mockAppointment,
        provider: {
          ...mockAppointment.provider,
          name: undefined,
        },
      };

      const { getByText } = render(
        <EpsCancellationLayout
          cancellationConfirmed={false}
          onConfirmCancellation={onConfirmCancellation}
          onAbortCancellation={onAbortCancellation}
          appointment={appointmentWithoutProvider}
        />,
      );

      expect(getByText('Provider name not available')).to.exist;
    });

    it('should render location name when available', () => {
      const { getByText } = render(
        <EpsCancellationLayout
          cancellationConfirmed={false}
          onConfirmCancellation={onConfirmCancellation}
          onAbortCancellation={onAbortCancellation}
          appointment={mockAppointment}
        />,
      );

      expect(getByText('Community Medical Center')).to.exist;
    });

    it('should render appointment card header', () => {
      const { getByTestId } = render(
        <EpsCancellationLayout
          cancellationConfirmed={false}
          onConfirmCancellation={onConfirmCancellation}
          onAbortCancellation={onAbortCancellation}
          appointment={mockAppointment}
        />,
      );

      const header = getByTestId('cc-appointment-card-header');
      expect(header).to.exist;
      expect(header.textContent).to.include('Community care appointment');
    });
  });
});
