import React from 'react';
import { VaModal } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import PropTypes from 'prop-types';

const DeleteExpenseModal = ({
  expenseCardTitle,
  expenseType,
  visible,
  onCloseEvent,
  onPrimaryButtonClick,
  onSecondaryButtonClick,
}) => {
  const header = `Delete your ${expenseCardTitle?.toLowerCase()}?`;

  return (
    <VaModal
      data-testid="delete-expense-modal"
      modalTitle={header}
      onCloseEvent={onCloseEvent}
      onPrimaryButtonClick={onPrimaryButtonClick}
      onSecondaryButtonClick={onSecondaryButtonClick}
      primaryButtonText="Yes, delete this expense"
      secondaryButtonText="No, keep this expense"
      status="warning"
      visible={visible}
    >
      <p>
        {`This will delete your ${expenseType?.toLowerCase()} expense from your list of expenses.`}
      </p>
    </VaModal>
  );
};

DeleteExpenseModal.propTypes = {
  expenseCardTitle: PropTypes.string.isRequired,
  expenseType: PropTypes.string.isRequired,
  visible: PropTypes.bool.isRequired,
  onCloseEvent: PropTypes.func.isRequired,
  onPrimaryButtonClick: PropTypes.func.isRequired,
  onSecondaryButtonClick: PropTypes.func.isRequired,
};

export default DeleteExpenseModal;
