/**
 * Renders a select dropdown for selecting recipients in the compose form.
 *  - Recipients are grouped by VAMC system name.
 *  - Recipients are sorted alphabetically by VAMC system name and then by name.
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
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useSelector } from 'react-redux';
import {
  VaAlert,
  VaComboBox,
  VaSelect,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import PropTypes from 'prop-types';
import FEATURE_FLAG_NAMES from '@department-of-veterans-affairs/platform-utilities/featureFlagNames';
import { getVamcSystemNameFromVhaId } from 'platform/site-wide/drupal-static-data/source-files/vamc-ehr/utils';
import { selectEhrDataByVhaId } from 'platform/site-wide/drupal-static-data/source-files/vamc-ehr/selectors';
import { sortRecipients } from '../../util/helpers';
import { Prompts } from '../../util/constants';
import CantFindYourTeam from './CantFindYourTeam';
import useFeatureToggles from '../../hooks/useFeatureToggles';

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

  const { isComboBoxEnabled, featureTogglesLoading } = useFeatureToggles();

  const [alertDisplayed, setAlertDisplayed] = useState(false);
  const [selectedRecipient, setSelectedRecipient] = useState(null);
  const [recipientsListSorted, setRecipientsListSorted] = useState([]);
  const ehrDataByVhaId = useSelector(selectEhrDataByVhaId);

  const optGroupEnabled = useSelector(
    state =>
      state.featureToggles[
        FEATURE_FLAG_NAMES.mhvSecureMessagingRecipientOptGroups
      ],
  );

  useEffect(
    () => {
      if (optGroupEnabled) {
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
            .sort((a, b) => {
              const aName = a.suggestedNameDisplay || a.name;
              const bName = b.suggestedNameDisplay || b.name;
              // If both vamcSystemName are undefined, sort alphabetically by name
              if (
                a.vamcSystemName === undefined &&
                b.vamcSystemName === undefined
              ) {
                return aName.localeCompare(bName);
              }
              // If only one vamcSystemName is undefined, sort it to the top
              if (a.vamcSystemName === undefined) return -1;
              if (b.vamcSystemName === undefined) return 1;
              // If both vamcSystemName are defined, sort by vamcSystemName first, then by name
              if (a.vamcSystemName !== b.vamcSystemName) {
                return a.vamcSystemName.localeCompare(b.vamcSystemName);
              }
              return aName.localeCompare(bName);
            });
        });
      }
    },
    [ehrDataByVhaId, recipientsList, optGroupEnabled],
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
    e => {
      const { value } = e.detail;
      if (!+value) {
        setSelectedRecipient({});
        return;
      }

      const recipient = recipientsList.find(r => +r.id === +value) || {};
      setSelectedRecipient(recipient);

      if (recipient.signatureRequired || isSignatureRequired) {
        setAlertDisplayed(true);
      }
    },
    [recipientsList, isSignatureRequired, setSelectedRecipient],
  );

  const optionsValues = useMemo(
    () => {
      if (!optGroupEnabled) {
        return sortRecipients(recipientsList)?.map(item => (
          <option key={item.id} value={item.id}>
            {item.suggestedNameDisplay || item.name}
          </option>
        ));
      }

      let currentVamcSystemName = null;
      const options = [];
      let groupedOptions = [];

      recipientsListSorted.forEach(item => {
        if (item.vamcSystemName === undefined) {
          options.push(
            <option key={item.id} value={item.id}>
              {item.suggestedNameDisplay || item.name}
            </option>,
          );
        } else if (item.vamcSystemName !== currentVamcSystemName) {
          if (currentVamcSystemName !== null) {
            options.push(
              <optgroup
                key={currentVamcSystemName}
                label={currentVamcSystemName}
              >
                {groupedOptions}
              </optgroup>,
            );
          }
          currentVamcSystemName = item.vamcSystemName;
          groupedOptions = [];
        }
        groupedOptions.push(
          <option key={item.id} value={item.id}>
            {item.suggestedNameDisplay || item.name}
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

      return options;
    },
    [recipientsListSorted, optGroupEnabled, recipientsList],
  );

  return (
    <>
      {!featureTogglesLoading && isComboBoxEnabled ? (
        <VaComboBox
          required
          label="Select a care team to send your message to"
          name="to"
          value={defaultValue !== undefined ? defaultValue : ''}
          onVaSelect={handleRecipientSelect}
          data-testid="compose-recipient-combobox"
          error={error}
          data-dd-privacy="mask"
          data-dd-action-name="Compose Recipient Combobox List"
        >
          <CantFindYourTeam />
          {optionsValues}
        </VaComboBox>
      ) : (
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
          {optionsValues}
        </VaSelect>
      )}

      {alertDisplayed && (
        <VaAlert
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
          <p className="vads-u-margin-y--0" role="alert" aria-live="polite">
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
  setCheckboxMarked: PropTypes.func,
  setElectronicSignature: PropTypes.func,
};

export default RecipientsSelect;
