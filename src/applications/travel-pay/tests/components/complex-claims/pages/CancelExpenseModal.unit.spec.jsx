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
    expect($('va-modal[status="warning"]', container)).to.exist;
    expect(
      getByText(
        'If you cancel, you’ll lose any changes you made on this screen. And you’ll be returned to your unsubmitted expenses.',
      ),
    ).to.exist;
  });

  it('renders the modal with buttons', () => {
    const { container } = render(<CancelExpenseModal {...defaultProps} />);
    const modal = container.querySelector('va-modal');
    expect(modal).to.exist;
    expect(modal.getAttribute('primary-button-text')).to.equal('Cancel adding');
    expect(modal.getAttribute('secondary-button-text')).to.equal('Keep adding');
  });

  it('calls onPrimaryButtonClick when "Cancel adding" button is clicked', async () => {
    const onPrimary = sinon.spy();

    const { container } = render(
      <CancelExpenseModal {...defaultProps} onPrimaryButtonClick={onPrimary} />,
    );

    expect($('va-modal[primary-button-text="Cancel adding"]', container)).to
      .exist;
    $('va-modal', container).__events.primaryButtonClick();

    await waitFor(() => {
      expect(onPrimary.calledOnce).to.be.true;
    });
  });

  it('calls onSecondaryButtonClick when "Keep adding" button is clicked', async () => {
    const onSecondary = sinon.spy();

    const { container } = render(
      <CancelExpenseModal
        {...defaultProps}
        onSecondaryButtonClick={onSecondary}
      />,
    );

    expect($('va-modal[secondary-button-text="Keep adding"]', container)).to
      .exist;
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
});
