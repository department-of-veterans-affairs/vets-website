import React from 'react';
import { VaModal } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import PropTypes from 'prop-types';

import { EXPENSE_TYPE_KEYS, EXPENSE_TYPES } from '../../../constants';

const DeleteExpenseModal = ({
  expenseCardTitle,
  expenseType,
  visible,
  onCloseEvent,
  onPrimaryButtonClick,
  onSecondaryButtonClick,
}) => {
  const isMileage = expenseType === EXPENSE_TYPE_KEYS.MILEAGE;
  const expensePageText = EXPENSE_TYPES[expenseType]?.expensePageText;
  const description = isMileage ? (
    <>
      This will delete your <strong>{expenseType}</strong> expense.
    </>
  ) : (
    <>
      This will delete your <strong>{expenseCardTitle}</strong>{' '}
      {expensePageText?.toLowerCase()} expense.
    </>
  );
  return (
    <VaModal
      data-testid="delete-expense-modal"
      modalTitle="Delete this expense?"
      onCloseEvent={onCloseEvent}
      onPrimaryButtonClick={onPrimaryButtonClick}
      onSecondaryButtonClick={onSecondaryButtonClick}
      primaryButtonText="Delete"
      secondaryButtonText="Keep expense"
      status="warning"
      visible={visible}
    >
      <p>{description}</p>
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
