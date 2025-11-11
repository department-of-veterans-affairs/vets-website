import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import { $ } from 'platform/forms-system/src/js/utilities/ui';
import CancelExpenseModal from '../../../../components/complex-claims/pages/CancelExpenseModal';

describe('CancelExpenseModal', () => {
  const defaultProps = {
    visible: true,
    onCloseEvent: sinon.spy(),
    onOpenModal: sinon.spy(),
    onPrimaryButtonClick: sinon.spy(),
    onSecondaryButtonClick: sinon.spy(),
  };

  it('renders the modal with correct title and body text', () => {
    const { getByText, container } = render(
      <CancelExpenseModal {...defaultProps} />,
    );

    expect($('va-modal[visible="true"]', container)).to.exist;
    expect($('va-modal[modal-title="Cancel adding this expense"]', container))
      .to.exist;
    expect($('va-modal[primary-button-text="Yes, cancel"]', container)).to
      .exist;
    expect(
      $(
        'va-modal[secondary-button-text="No, continue adding this expense"]',
        container,
      ),
    ).to.exist;
    expect($('va-modal[status="warning"]', container)).to.exist;

    expect(
      getByText(
        'If you cancel, you’ll lose the information you entered about this expense and will be returned to the review page.',
      ),
    ).to.exist;
  });

  it('renders the cancel button', () => {
    const { container } = render(<CancelExpenseModal {...defaultProps} />);

    expect($('va-button[text="Cancel adding this expense"]', container)).to
      .exist;
  });

  it('calls onOpenModal when cancel button is clicked', async () => {
    const onOpen = sinon.spy();

    const { container } = render(
      <CancelExpenseModal {...defaultProps} onOpenModal={onOpen} />,
    );

    const button = $('va-button[text="Cancel adding this expense"]', container);
    expect(button).to.exist;
    button.click();

    await waitFor(() => {
      expect(onOpen.calledOnce).to.be.true;
    });
  });

  it('calls onPrimaryButtonClick when "Yes, cancel" button is clicked', async () => {
    const onPrimary = sinon.spy();

    const { container } = render(
      <CancelExpenseModal {...defaultProps} onPrimaryButtonClick={onPrimary} />,
    );

    expect($('va-modal[primary-button-text="Yes, cancel"]', container)).to
      .exist;
    $('va-modal', container).__events.primaryButtonClick();

    await waitFor(() => {
      expect(onPrimary.calledOnce).to.be.true;
    });
  });

  it('calls onSecondaryButtonClick when "No, continue adding this expense" button is clicked', async () => {
    const onSecondary = sinon.spy();

    const { container } = render(
      <CancelExpenseModal
        {...defaultProps}
        onSecondaryButtonClick={onSecondary}
      />,
    );

    expect(
      $(
        'va-modal[secondary-button-text="No, continue adding this expense"]',
        container,
      ),
    ).to.exist;
    $('va-modal', container).__events.secondaryButtonClick();

    await waitFor(() => {
      expect(onSecondary.calledOnce).to.be.true;
    });
  });

  it('calls onCloseEvent when modal is closed', () => {
    const onClose = sinon.spy();

    const { container } = render(
      <CancelExpenseModal {...defaultProps} onCloseEvent={onClose} />,
    );

    const modal = container.querySelector('va-modal');
    modal.dispatchEvent(new CustomEvent('closeEvent'));

    expect(onClose.calledOnce).to.be.true;
  });

  it('does not render modal content when visible is false', () => {
    const { container } = render(
      <CancelExpenseModal {...defaultProps} visible={false} />,
    );

    expect($('va-modal[visible="false"]', container)).to.exist;
  });

  it('cancel button has correct CSS classes', () => {
    const { container } = render(<CancelExpenseModal {...defaultProps} />);

    const button = $(
      'va-button.vads-u-display--flex.vads-u-margin-y--2.travel-pay-complex-expense-cancel-btn',
      container,
    );
    expect(button).to.exist;
  });

  it('cancel button is secondary styled', () => {
    const { container } = render(<CancelExpenseModal {...defaultProps} />);

    const button = $('va-button[secondary]', container);
    expect(button).to.exist;
  });
});
