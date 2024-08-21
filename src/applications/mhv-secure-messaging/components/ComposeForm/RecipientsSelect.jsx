/**
 * Renders a select dropdown for selecting recipients in the compose form.
 *  - If a recipient requires a signature or switching from a recipient that does not 
 *    require a signature to one that does, an alert is displayed notifying that signature is required.
 *  - If switching from a recipient that requires a signature to one that does not, 
 *    the alert is displayed notifying that signature is no longer required.
 *  - If switching from a recipient that does not require a signature to another that does not,
 *    the alert is not displayed.
 *  - When alert is rendered or content of alert has changed, focus is set to the alert.
 *
 * @component
 * @example

 * const recipientsList = [
 *   { id: 1, name: 'Recipient 1', signatureRequired: true },
 *   { id: 2, name: 'Recipient 2', signatureRequired: false },
 *   // ...
 * ];
 *
 * @param {Object} props - The component props.
 * @param {Array} props.recipientsList - The list of recipients to populate the dropdown.
 * @param {Function} props.onValueChange - The callback function to handle selected recipient change.
 * @param {string} [props.defaultValue] - The default value for the dropdown.
 * @param {string} [props.error] - The error message to display.
 * @param {boolean} [props.isSignatureRequired] - Indicates if a signature is required for the selected recipient.
 * @returns {JSX.Element} The rendered RecipientsSelect component.
 */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  VaAlert,
  VaSelect,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import PropTypes from 'prop-types';
import { sortRecipients } from '../../util/helpers';
import { Prompts } from '../../util/constants';
import CantFindYourTeam from './CantFindYourTeam';

const RecipientsSelect = ({
  recipientsList,
  onValueChange,
  defaultValue,
  error,
  isSignatureRequired,
  setCheckboxMarked,
  setElectronicSignature,
}) => {
  const alertRef = useRef(null);
  const isSignatureRequiredRef = useRef();
  isSignatureRequiredRef.current = isSignatureRequired;

  const [alertDisplayed, setAlertDisplayed] = useState(false);
  const [selectedRecipient, setSelectedRecipient] = useState(null);

  useEffect(
    () => {
      if (isSignatureRequired === true) {
        setAlertDisplayed(true);
      }
    },
    [isSignatureRequired],
  );

  useEffect(
    () => {
      if (selectedRecipient) {
        onValueChange(selectedRecipient);
        setCheckboxMarked(false);
        setElectronicSignature('');
      }
    },
    [
      onValueChange,
      selectedRecipient,
      setCheckboxMarked,
      setElectronicSignature,
    ],
  );

  const handleRecipientSelect = useCallback(
    e => {
      const recipient = recipientsList.find(r => +r.id === +e.detail.value);
      setSelectedRecipient(recipient);
      if (recipient.signatureRequired || isSignatureRequired) {
        setAlertDisplayed(true);
      }
    },
    [recipientsList, isSignatureRequired],
  );

  return (
    <>
      <VaSelect
        enable-analytics
        id="recipient-dropdown"
        label="To"
        name="to"
        value={defaultValue !== undefined ? defaultValue : ''}
        onVaSelect={handleRecipientSelect}
        class="composeSelect"
        data-testid="compose-recipient-select"
        error={error}
        data-dd-privacy="mask"
        data-dd-action-name="Compose Recipient Dropdown List"
      >
        <CantFindYourTeam />
        {sortRecipients(recipientsList)?.map(item => (
          <option key={item.id} value={item.id}>
            {item.name}
          </option>
        ))}
      </VaSelect>
      {alertDisplayed && (
        <VaAlert
          role="alert"
          aria-live="polite"
          ref={alertRef}
          class="vads-u-margin-y--2"
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
  defaultValue: PropTypes.number,
  error: PropTypes.string,
  isSignatureRequired: PropTypes.bool,
};

export default RecipientsSelect;
