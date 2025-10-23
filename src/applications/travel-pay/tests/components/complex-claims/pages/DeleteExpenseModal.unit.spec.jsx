import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import { $ } from 'platform/forms-system/src/js/utilities/ui';
import DeleteExpenseModal from '../../../../components/complex-claims/pages/DeleteExpenseModal';

describe('DeleteExpenseModal', () => {
  const defaultProps = {
    expenseCardTitle: 'Mileage Expense',
    expenseType: 'Mileage',
    visible: true,
    onCloseEvent: sinon.spy(),
    onPrimaryButtonClick: sinon.spy(),
    onSecondaryButtonClick: sinon.spy(),
  };

  it('renders the modal with correct title and body text', () => {
    const { getByText, container } = render(
      <DeleteExpenseModal {...defaultProps} />,
    );

    // Check modal props
    expect($('va-modal[visible="true"]', container)).to.exist;
    expect($('va-modal[modal-title="Delete your mileage expense?"]', container))
      .to.exist;
    expect(
      $('va-modal[primary-button-text="Yes, delete this expense"]', container),
    ).to.exist;
    expect(
      $('va-modal[secondary-button-text="No, keep this expense"]', container),
    ).to.exist;

    // Check description
    expect(
      getByText(
        'This will delete your mileage expense from your list of expenses.',
      ),
    ).to.exist;
  });

  it('calls onPrimaryButtonClick when Yes button is clicked', async () => {
    const onPrimary = sinon.spy();

    const { container } = render(
      <DeleteExpenseModal {...defaultProps} onPrimaryButtonClick={onPrimary} />,
    );

    expect(
      $('va-modal[primary-button-text="Yes, delete this expense"]', container),
    ).to.exist;
    $('va-modal', container).__events.primaryButtonClick();

    await waitFor(() => {
      expect(onPrimary.calledOnce).to.be.true;
    });
  });

  it('calls onSecondaryButtonClick when No button is clicked', async () => {
    const onSecondary = sinon.spy();

    const { container } = render(
      <DeleteExpenseModal
        {...defaultProps}
        onSecondaryButtonClick={onSecondary}
      />,
    );

    expect(
      $('va-modal[secondary-button-text="No, keep this expense"]', container),
    ).to.exist;
    $('va-modal', container).__events.secondaryButtonClick();

    await waitFor(() => {
      expect(onSecondary.calledOnce).to.be.true;
    });
  });

  it('calls onCloseEvent when modal is closed', () => {
    const onClose = sinon.spy();

    const { container } = render(
      <DeleteExpenseModal {...defaultProps} onCloseEvent={onClose} />,
    );

    // Simulate close event manually since VaModal doesn’t have a native close button in the DOM
    const modal = container.querySelector('va-modal');
    modal.dispatchEvent(new CustomEvent('closeEvent'));

    expect(onClose.calledOnce).to.be.true;
  });

  it('does not render content when visible is false', () => {
    const { queryByText } = render(
      <DeleteExpenseModal {...defaultProps} visible={false} />,
    );

    expect(queryByText('Delete your mileage expense?')).to.not.exist;
  });
});
