import React from 'react';
import PropTypes from 'prop-types';
import { VaModal } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

/**
 * Modal component that warns users about leaving the form
 *
 * @param {Object} props Component props
 * @param {boolean} props.visible - Whether the modal is visible
 * @param {Function} props.onClose - Handler for closing the modal (cancel navigation)
 * @param {Function} props.onConfirm - Handler for confirming navigation
 * @param {string} props.title - Modal title
 * @param {string} props.message - Warning message to display
 * @param {string} props.confirmText - Text for the confirm button
 * @param {string} props.cancelText - Text for the cancel button
 * @returns {JSX.Element} The modal component
 */
const NavigationGuardModal = ({
  visible,
  onClose,
  onConfirm,
  title = 'Leave this page?',
  message = 'If you leave this page now, your progress will not be saved.',
  confirmText = 'Leave page',
  cancelText = 'Stay on page',
}) => {
  return (
    <VaModal
      modalTitle={title}
      visible={visible}
      onCloseEvent={onClose}
      onPrimaryButtonClick={onClose}
      onSecondaryButtonClick={onConfirm}
      primaryButtonText={cancelText}
      secondaryButtonText={confirmText}
      status="warning"
      data-testid="navigation-guard-modal"
    >
      <p className="vads-u-margin-y--0">{message}</p>
    </VaModal>
  );
};

NavigationGuardModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  title: PropTypes.string,
  message: PropTypes.string,
  confirmText: PropTypes.string,
  cancelText: PropTypes.string,
};

export default NavigationGuardModal;
