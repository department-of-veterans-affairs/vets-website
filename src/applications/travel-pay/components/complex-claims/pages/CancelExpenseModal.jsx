import React from 'react';
import {
  VaModal,
  VaButton,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import PropTypes from 'prop-types';

const CancelExpenseModal = ({
  visible,
  onCloseEvent,
  onPrimaryButtonClick,
  onSecondaryButtonClick,
  onOpenModal,
}) => {
  return (
    <>
      <VaModal
        modalTitle="Cancel adding this expense"
        onCloseEvent={onCloseEvent}
        onPrimaryButtonClick={onPrimaryButtonClick}
        onSecondaryButtonClick={onSecondaryButtonClick}
        primaryButtonText="Yes, cancel"
        secondaryButtonText="No, continue adding this expense"
        status="warning"
        visible={visible}
      >
        <p>
          If you cancel, you’ll lose the information you entered about this
          expense and will be returned to the review page.
        </p>
      </VaModal>
      <VaButton
        secondary
        text="Cancel adding this expense"
        onClick={onOpenModal}
        className="vads-u-display--flex vads-u-margin-y--2 travel-pay-complex-expense-cancel-btn"
      />
    </>
  );
};

CancelExpenseModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onCloseEvent: PropTypes.func.isRequired,
  onOpenModal: PropTypes.func.isRequired,
  onPrimaryButtonClick: PropTypes.func.isRequired,
  onSecondaryButtonClick: PropTypes.func.isRequired,
};

export default CancelExpenseModal;
