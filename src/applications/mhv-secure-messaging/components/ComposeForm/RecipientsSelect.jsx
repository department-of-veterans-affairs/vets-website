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
import { useSelector } from 'react-redux';
import {
  VaAlert,
  VaSelect,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import PropTypes from 'prop-types';
import FEATURE_FLAG_NAMES from '@department-of-veterans-affairs/platform-utilities/featureFlagNames';
import { getVamcSystemNameFromVhaId } from 'platform/site-wide/drupal-static-data/source-files/vamc-ehr/utils';
import { selectEhrDataByVhaId } from 'platform/site-wide/drupal-static-data/source-files/vamc-ehr/selectors';
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
  const [recipientsListSorted, setRecipientsListSorted] = useState([]);
  const ehrDataByVhaId = useSelector(selectEhrDataByVhaId);
  const mhvSecureMessagingTriageGroupPlainLanguage = useSelector(
    state =>
      state.featureToggles[
        FEATURE_FLAG_NAMES.mhvSecureMessagingTriageGroupPlainLanguage
      ],
  );

  useEffect(
    () => {
      if (mhvSecureMessagingTriageGroupPlainLanguage) {
        setRecipientsListSorted(() => {
          return recipientsList
            .map(item => {
              return {
                id: item.id,
                vamcSystemName: getVamcSystemNameFromVhaId(
                  ehrDataByVhaId,
                  item.stationNumber,
                ),
                ...item,
              };
            })
            .sort((a, b) => a.vamcSystemName.localeCompare(b.vamcSystemName));
        });
      }
    },
    [mhvSecureMessagingTriageGroupPlainLanguage, recipientsList],
  );

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
    value => {
      const recipient = recipientsList.find(r => +r.id === +value);
      setSelectedRecipient(recipient);
      if (recipient.signatureRequired || isSignatureRequired) {
        setAlertDisplayed(true);
      }
    },
    [recipientsList, isSignatureRequired],
  );

  const VaSelectGrouped = ({ recipients, value }) => {
    VaSelectGrouped.propTypes = {
      recipients: PropTypes.array,
    };

    let currentVamcSystemName = null;
    const options = [];
    let groupedOptions = [];

    recipients.forEach(item => {
      if (item.vamcSystemName !== currentVamcSystemName) {
        if (currentVamcSystemName !== null) {
          options.push(
            <optgroup key={currentVamcSystemName} label={currentVamcSystemName}>
              {groupedOptions}
            </optgroup>,
          );
        }
        currentVamcSystemName = item.vamcSystemName;
        groupedOptions = [];
      }
      groupedOptions.push(
        <option key={item.id} value={item.id} selected={value === item.id}>
          {item.patientDisplay}
        </option>,
      );
    });

    // Push the last group
    if (currentVamcSystemName !== null) {
      options.push(
        <optgroup key={currentVamcSystemName} label={currentVamcSystemName}>
          {groupedOptions}
        </optgroup>,
      );
    }

    const labelStyle = {
      fontFamily:
        '"Source Sans Pro Web", "Source Sans Pro", "Helvetica Neue", Helvetica, Arial, sans-serif',
      fontSize: '1.06rem',
      lineHeight: '1.3',
      display: 'block',
      marginTop: '1.5rem',
      maxWidth: '30rem',
      fontWeight: `${error ? '700' : 'normal'}`,
    };

    return (
      <>
        <CantFindYourTeam />
        {/* <VaSelect
         enable-analytics
         id="recipient-dropdown"
         label="To"
         name="to"
         value={defaultValue !== undefined ? defaultValue : ''}
         onVaSelect={e => handleRecipientSelect(e.detail.value)}
         class="composeSelect"
         data-testid="compose-recipient-select"
         error={error}
         data-dd-privacy="mask"
         data-dd-action-name="Compose Recipient Dropdown List"
         > */}
        <div
          className="vads-u-padding--1"
          style={{
            ...(error && {
              borderLeft: '0.25rem solid #b50909',
              paddingLeft: '1rem',
              position: 'relative',
            }),
          }}
        >
          <label
            htmlFor="recipient-dropdown"
            style={labelStyle}
            // className={`usa-label ${error ? 'usa-label--error' : ''}`}
            part="label"
          >
            To
            <span className="usa-label--required vads-u-color--error-dark">
              {' (*Required)'}
            </span>
          </label>
          <select
            id="recipient-dropdown"
            label="To"
            name="to"
            className="composeSelect"
            style={{
              width: '100%',
              maxWidth: '100%',
              ...(error && {
                borderWidth: '0.25rem',
                borderColor: 'rgb(181, 9, 9)',
                borderStyle: 'solid',
                paddingTop: '0.25rem',
                paddingBottom: '0.25rem',
              }),
            }}
            value={value}
            onChange={e => handleRecipientSelect(e.target.value)}
          >
            <option value="">Select a recipient</option>
            {options}
          </select>
        </div>
        {/* </VaSelect> */}
      </>
    );
  };

  return (
    <>
      {mhvSecureMessagingTriageGroupPlainLanguage ? (
        <VaSelectGrouped
          recipients={recipientsListSorted}
          value={selectedRecipient?.id}
        />
      ) : (
        <VaSelect
          enable-analytics
          id="recipient-dropdown"
          label="To"
          name="to"
          value={defaultValue !== undefined ? defaultValue : ''}
          onVaSelect={e => handleRecipientSelect(e.detail.value)}
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
      )}
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
