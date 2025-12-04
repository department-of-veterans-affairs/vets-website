import React from 'react';
import PropTypes from 'prop-types';
import { VaModal } from '@department-of-veterans-affairs/web-components/react-bindings';
import { FIELD_NAMES } from '~/platform/user/profile/vap-svc/constants';

const ConfirmRemoveModal = ({
  cancelAction,
  deleteAction,
  title,
  fieldName,
  isEnrolledInVAHealthCare,
  isVisible,
  onHide,
}) => {
  if (!isVisible) {
    return null;
  }
  let modalContent = (
    <>
      <div>
        This will remove your {title.toLowerCase()} across these VA benefits and
        services:
      </div>
      <ul>
        {isEnrolledInVAHealthCare && (
          <li>
            VA health care (including prescriptions, appointment reminders, lab
            and test results, and communications from your VA medical center)
          </li>
        )}
        <li>Disability compensation</li>
        <li>Pension benefits</li>
        <li>Claims and appeals</li>
        <li>Veteran Readiness and Employment (VR&E)</li>
        {(fieldName === FIELD_NAMES.EMAIL ||
          fieldName === FIELD_NAMES.MOBILE_PHONE) && (
          <li>
            Some VA notifications. This means you’ll stop getting any VA{' '}
            {fieldName === FIELD_NAMES.EMAIL ? 'email' : 'text'} notifications
            you signed up for.
          </li>
        )}
      </ul>
      <p className="vads-u-margin-top--1">
        {`You can always add another ${title.toLowerCase()} any time.`}
      </p>
    </>
  );
  if (fieldName === FIELD_NAMES.MESSAGING_SIGNATURE) {
    modalContent = (
      <>
        <p className="vads-u-margin-top--1">
          Your signature will no longer appear on outgoing secure messages.
        </p>
        <p className="vads-u-margin-top--1">
          You can always come back to your profile later if you want to add this
          signature again.
        </p>
      </>
    );
  }
  return (
    <VaModal
      modalTitle={`Remove your ${title.toLowerCase()}?`}
      className="overflow-auto"
      status="warning"
      visible={isVisible}
      onCloseEvent={onHide}
      primaryButtonText="Remove"
      secondaryButtonText="Cancel change"
      onPrimaryButtonClick={deleteAction}
      onSecondaryButtonClick={cancelAction}
      uswds
    >
      {modalContent}
    </VaModal>
  );
};

ConfirmRemoveModal.propTypes = {
  cancelAction: PropTypes.func.isRequired,
  deleteAction: PropTypes.func.isRequired,
  fieldName: PropTypes.string.isRequired,
  isEnrolledInVAHealthCare: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool.isRequired,
  isVisible: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  onHide: PropTypes.func.isRequired,
};

export default ConfirmRemoveModal;
