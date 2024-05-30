import {
  VaAlert,
  VaSelect,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import { sortRecipients } from '../../util/helpers';
import { Prompts } from '../../util/constants';

const RecipientsSelect = ({
  recipientsList,
  onValueChange,
  defaultValue,
  error,
  isSignatureRequired,
}) => {
  const alertRef = useRef(null);
  const [alertDisplayed, setAlertDisplayed] = useState(false);

  useEffect(
    () => {
      if (isSignatureRequired === true) {
        setAlertDisplayed(true);
        if (alertRef.current) {
          setTimeout(() => {
            focusElement(alertRef.current.shadowRoot.querySelector('button'));
          }, 500);
        }
      }
    },
    [alertRef, isSignatureRequired],
  );

  const handleRecipientSelect = useCallback(
    e => {
      const recipient = recipientsList.find(
        r => r.id.toString() === e.detail.value,
      );
      onValueChange(recipient);
    },
    [recipientsList, onValueChange],
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
        onVaSelect={handleRecipientSelect}
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
      {alertDisplayed && (
        <VaAlert
          aria-live="polite"
          ref={alertRef}
          class="vads-u-margin-y--4"
          closeBtnAriaLabel="Close notification"
          closeable
          onCloseEvent={() => {
            setAlertDisplayed(false);
          }}
          status="info"
          visible
          data-testid="signature-alert"
        >
          <p className="vads-u-margin-y--0">
            {isSignatureRequired === true
              ? Prompts.Compose.SIGNATURE_REQUIRED
              : Prompts.Compose.SIGNATURE_NOT_REQUIRED}
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
};

export default RecipientsSelect;
