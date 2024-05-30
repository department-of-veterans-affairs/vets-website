import {
  VaAlert,
  VaSelect,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import { sortRecipients } from '../../util/helpers';

const RecipientsSelect = props => {
  const {
    recipientsList,
    onValueChange,
    defaultValue,
    error,
    isSignatureRequired,
    onAlertClose,
  } = props;
  const SIGNATURE_REQUIRED =
    'Messages to this team require a signature. We added a signature box to this page.';
  const SIGNATURE_NOT_REQUIRED =
    "Messages to this team don't require a signature. We removed the signature box from this page.";
  const alertRef = useRef(null);

  useEffect(
    () => {
      if (isSignatureRequired !== null && alertRef.current) {
        setTimeout(() => {
          focusElement(alertRef.current.shadowRoot.querySelector('button'));
        }, 500);
      }
    },
    [alertRef, isSignatureRequired],
  );

  return (
    <>
      <VaSelect
        uswds={false}
        enable-analytics
        id="recipient-dropdown"
        label="To"
        name="to"
        value={defaultValue}
        onVaSelect={onValueChange}
        class="composeSelect"
        data-testid="compose-recipient-select"
        error={error}
        data-dd-privacy="mask"
        data-dd-action-name="Compose Recipient Dropdown List"
      >
        {sortRecipients(recipientsList)?.map(item => (
          <option key={item.id} value={item.id}>
            {item.name}
          </option>
        ))}
      </VaSelect>
      {isSignatureRequired !== null && (
        <VaAlert
          aria-live="polite"
          ref={alertRef}
          class="vads-u-margin-y--4"
          closeBtnAriaLabel="Close notification"
          closeable
          onCloseEvent={onAlertClose}
          status="info"
          visible
          data-testid="signature-alert"
        >
          <p className="vads-u-margin-y--0">
            {isSignatureRequired === true
              ? SIGNATURE_REQUIRED
              : SIGNATURE_NOT_REQUIRED}
          </p>
        </VaAlert>
      )}
    </>
  );
};

RecipientsSelect.propTypes = {
  recipientsList: PropTypes.array.isRequired,
  onValueChange: PropTypes.func.isRequired,
  defaultValue: PropTypes.string,
  error: PropTypes.string,
  isSignatureRequired: PropTypes.bool,
  onAlertClose: PropTypes.func,
};

export default RecipientsSelect;
