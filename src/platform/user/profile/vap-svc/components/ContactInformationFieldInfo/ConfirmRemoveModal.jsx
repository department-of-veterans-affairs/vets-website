import React from 'react';
import PropTypes from 'prop-types';
import { VaModal } from '@department-of-veterans-affairs/web-components/react-bindings';
import { FIELD_NAMES } from '~/platform/user/profile/vap-svc/constants';
import { FIELD_SECTION_HEADERS } from '../../constants/schedulingPreferencesConstants';
import {
  isInlineSchedulingPreference,
  isSubtaskSchedulingPreference,
} from '../../util/health-care-settings/schedulingPreferencesUtils';

const ConfirmRemoveModal = ({
  cancelAction,
  deleteAction,
  title,
  fieldName,
  isEnrolledInVAHealthCare,
  isVisible,
  onHide,
}) => {
  let modalTitle = `Remove your ${title.toLowerCase()}?`;
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
          This will remove your signature on outgoing messages.
        </p>
        <p className="vads-u-margin-top--1">
          You can always add another messages signature any time.
        </p>
      </>
    );
  }
  if (isInlineSchedulingPreference(fieldName)) {
    modalTitle = `Remove your ${FIELD_SECTION_HEADERS[fieldName]
      .toLowerCase()
      .replace(/s$/, '')}?`;
    modalContent = (
      <p className="vads-u-margin-top--1">
        You can always add another{' '}
        {FIELD_SECTION_HEADERS[fieldName].toLowerCase().replace(/s$/, '')} any
        time.
      </p>
    );
  }
  if (isSubtaskSchedulingPreference(fieldName)) {
    modalTitle = `Remove your ${FIELD_SECTION_HEADERS[
      fieldName
    ].toLowerCase()}?`;
    modalContent = (
      <>
        <p className="vads-u-margin-top--1">
          This will remove your{' '}
          {FIELD_SECTION_HEADERS[fieldName].toLowerCase().replace(/s$/, '')} for
          scheduling appointments. We won’t change your information in your VA
          profile.
        </p>
        <p className="vads-u-margin-top--1">
          You can always add another{' '}
          {FIELD_SECTION_HEADERS[fieldName].toLowerCase().replace(/s$/, '')} any
          time.
        </p>
      </>
    );
  }
  return (
    <VaModal
      modalTitle={modalTitle}
      className="overflow-auto"
      status="warning"
      visible={isVisible}
      onCloseEvent={onHide}
      primaryButtonText="Remove"
      secondaryButtonText="Cancel change"
      onPrimaryButtonClick={deleteAction}
      onSecondaryButtonClick={cancelAction}
      data-testid="confirm-remove-modal"
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
  isVisible: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  onHide: PropTypes.func.isRequired,
};

export default ConfirmRemoveModal;
