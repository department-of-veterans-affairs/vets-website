import React from 'react';
import { VaModal } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import PropTypes from 'prop-types';

const CancelExpenseModal = ({
  visible,
  onCloseEvent,
  onPrimaryButtonClick,
  onSecondaryButtonClick,
  isEditMode,
}) => {
  const cancelModalText = isEditMode ? 'editing' : 'adding';
  return (
    <>
      <VaModal
        modalTitle={`Cancel ${cancelModalText} this expense`}
        onCloseEvent={onCloseEvent}
        onPrimaryButtonClick={onPrimaryButtonClick}
        onSecondaryButtonClick={onSecondaryButtonClick}
        primaryButtonText={`Cancel ${cancelModalText}`}
        secondaryButtonText={`Keep ${cancelModalText}`}
        status="warning"
        visible={visible}
      >
        <p>
          If you cancel, you’ll lose any changes you made on this screen. And
          you’ll be returned to your unsubmitted expenses.
        </p>
      </VaModal>
    </>
  );
};

CancelExpenseModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onCloseEvent: PropTypes.func.isRequired,
  onPrimaryButtonClick: PropTypes.func.isRequired,
  onSecondaryButtonClick: PropTypes.func.isRequired,
  isEditMode: PropTypes.bool,
};

export default CancelExpenseModal;
