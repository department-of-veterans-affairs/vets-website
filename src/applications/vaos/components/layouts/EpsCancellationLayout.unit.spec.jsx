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

  beforeEach(() => {
    onConfirmCancellation = sandbox.spy();
    onAbortCancellation = sandbox.spy();
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
      />,
    );

    const doNotCancelButton = getByTestId('do-not-cancel-button');
    expect(doNotCancelButton).to.have.attribute('text', 'No, do not cancel');
    expect(doNotCancelButton).to.have.attribute('secondary');
  });
});
