import React from 'react';
import PropTypes from 'prop-types';
import Modal from '@department-of-veterans-affairs/component-library/Modal';
import LoadingButton from '~/platform/site-wide/loading-button/LoadingButton';
import { FIELD_NAMES } from '@@vap-svc/constants';
import VAPServiceEditModalErrorMessage from '~/platform/user/profile/vap-svc/components/base/VAPServiceEditModalErrorMessage';

const ConfirmRemoveModal = ({
  cancelAction,
  deleteAction,
  title,
  fieldName,
  isEnrolledInVAHealthCare,
  isLoading,
  isVisible,
  onHide,
  error,
}) => {
  return (
    <Modal
      title={`Are you sure?`}
      cssClass="overflow-auto"
      status="warning"
      visible={isVisible}
      onClose={onHide}
    >
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
        {fieldName === FIELD_NAMES.EMAIL ||
        fieldName === FIELD_NAMES.MOBILE_PHONE ? (
          <li>
            Some VA notifications. This means you’ll stop getting any VA{' '}
            {fieldName === FIELD_NAMES.EMAIL ? 'email' : 'text'} notifications
            you signed up for.
          </li>
        ) : (
          undefined
        )}
      </ul>
      <div className="vads-u-margin-top--1">
        You can always come back to your profile later if you want to add this{' '}
        {}
        {title.toLowerCase()} again.
      </div>
      {error && (
        <div
          role="alert"
          className="vads-u-margin-bottom--2"
          data-testid="delete-error-alert"
        >
          <VAPServiceEditModalErrorMessage error={error} />
        </div>
      )}
      <div>
        <LoadingButton
          isLoading={isLoading}
          onClick={deleteAction}
          aria-label={`Remove ${title}`}
          loadingText="Removing your information"
        >
          Yes, remove my information
        </LoadingButton>

        {!isLoading && (
          <button
            type="button"
            className="usa-button-secondary"
            onClick={cancelAction}
          >
            Cancel
          </button>
        )}
      </div>
    </Modal>
  );
};

ConfirmRemoveModal.propTypes = {
  cancelAction: PropTypes.func.isRequired,
  deleteAction: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  fieldName: PropTypes.string.isRequired,
  isEnrolledInVAHealthCare: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool.isRequired,
  isVisible: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  error: PropTypes.string,
};

export default ConfirmRemoveModal;
