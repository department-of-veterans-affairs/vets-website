import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import { $ } from 'platform/forms-system/src/js/utilities/ui';
import DeleteExpenseModal from '../../../../components/complex-claims/pages/DeleteExpenseModal';
import { EXPENSE_TYPE_KEYS } from '../../../../constants';

describe('DeleteExpenseModal', () => {
  const defaultProps = {
    expenseCardTitle: 'Parking',
    expenseType: 'Mileage',
    visible: true,
    onCloseEvent: sinon.spy(),
    onPrimaryButtonClick: sinon.spy(),
    onSecondaryButtonClick: sinon.spy(),
  };

  it('renders the modal with correct title and body text', () => {
    const { container } = render(<DeleteExpenseModal {...defaultProps} />);

    // Check modal visibility
    expect($('va-modal[visible="true"]', container)).to.exist;

    // Check modal title
    expect($('va-modal[modal-title="Delete this expense?"]', container)).to
      .exist;

    // Check primary and secondary buttons
    expect($('va-modal[primary-button-text="Delete"]', container)).to.exist;
    expect($('va-modal[secondary-button-text="Keep expense"]', container)).to
      .exist;

    // Check description content
    const description = container.querySelector('p');
    expect(description).to.exist;
    if (defaultProps.expenseType === EXPENSE_TYPE_KEYS.MILEAGE) {
      const strong = description.querySelector('strong');
      expect(strong).to.exist;
      expect(strong.textContent).to.equal('Mileage');
      expect(description.textContent).to.include('This will delete your');
      expect(description.textContent).to.include('expense.');
    }
  });

  it('renders bold expenseCardTitle for non-Mileage expenses', () => {
    const props = { ...defaultProps, expenseType: 'Parking' };
    const { container } = render(<DeleteExpenseModal {...props} />);

    const description = container.querySelector('p');
    expect(description).to.exist;

    const strong = description.querySelector('strong');
    expect(strong).to.exist;
    expect(strong.textContent).to.equal('Parking');
    expect(description.textContent).to.include('parking expense');
  });

  it('calls onPrimaryButtonClick when Delete button is clicked', async () => {
    const onPrimary = sinon.spy();
    const { container } = render(
      <DeleteExpenseModal {...defaultProps} onPrimaryButtonClick={onPrimary} />,
    );

    $('va-modal', container).__events.primaryButtonClick();

    await waitFor(() => {
      expect(onPrimary.calledOnce).to.be.true;
    });
  });

  it('calls onSecondaryButtonClick when Keep expense button is clicked', async () => {
    const onSecondary = sinon.spy();
    const { container } = render(
      <DeleteExpenseModal
        {...defaultProps}
        onSecondaryButtonClick={onSecondary}
      />,
    );

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

    const modal = container.querySelector('va-modal');
    modal.dispatchEvent(new CustomEvent('closeEvent'));

    expect(onClose.calledOnce).to.be.true;
  });

  it('does not render content when visible is false', () => {
    const { queryByTestId } = render(
      <DeleteExpenseModal {...defaultProps} visible={false} />,
    );

    const modal = queryByTestId('delete-expense-modal');
    expect(modal.getAttribute('visible')).to.equal('false');
  });
});
