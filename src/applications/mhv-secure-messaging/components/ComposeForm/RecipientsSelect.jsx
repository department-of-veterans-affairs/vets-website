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
// import USWDS from '@uswds/uswds/js';
// import { comboBox } from 'uswds';
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
  // const { comboBox } = USWDS;
  const alertRef = useRef(null);
  const isSignatureRequiredRef = useRef();
  isSignatureRequiredRef.current = isSignatureRequired;

  const [alertDisplayed, setAlertDisplayed] = useState(false);
  const [selectedRecipient, setSelectedRecipient] = useState(null);

  // useEffect(() => {
  //   comboBox.init();
  //   comboBox.on();
  //   return () => {
  //     comboBox.off();
  //   };
  // }, []);

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

  const ComboBox = () => {
    return (
      <>
        <label className="usa-label" htmlFor="fruit">
          Select a fruit
        </label>
        <div className="usa-combo-box">
          <select className="usa-select" name="fruit" id="fruit">
            <option value>Select a fruit</option>
            <option value="apple">Apple</option>
            <option value="apricot">Apricot</option>
            <option value="avocado">Avocado</option>
            <option value="banana">Banana</option>
            <option value="blackberry">Blackberry</option>
            <option value="blood orange">Blood orange</option>
            <option value="blueberry">Blueberry</option>
            <option value="boysenberry">Boysenberry</option>
            <option value="breadfruit">Breadfruit</option>
            <option value="buddhas hand citron">Buddha’s hand citron</option>
            <option value="cantaloupe">Cantaloupe</option>
            <option value="clementine">Clementine</option>
            <option value="crab apple">Crab apple</option>
            <option value="currant">Currant</option>
            <option value="cherry">Cherry</option>
            <option value="custard apple">Custard apple</option>
            <option value="coconut">Coconut</option>
            <option value="cranberry">Cranberry</option>
            <option value="date">Date</option>
            <option value="dragonfruit">Dragonfruit</option>
            <option value="durian">Durian</option>
            <option value="elderberry">Elderberry</option>
            <option value="fig">Fig</option>
            <option value="gooseberry">Gooseberry</option>
            <option value="grape">Grape</option>
            <option value="grapefruit">Grapefruit</option>
            <option value="guava">Guava</option>
            <option value="honeydew melon">Honeydew melon</option>
            <option value="jackfruit">Jackfruit</option>
            <option value="kiwifruit">Kiwifruit</option>
            <option value="kumquat">Kumquat</option>
            <option value="lemon">Lemon</option>
            <option value="lime">Lime</option>
            <option value="lychee">Lychee</option>
            <option value="mandarine">Mandarine</option>
            <option value="mango">Mango</option>
            <option value="mangosteen">Mangosteen</option>
            <option value="marionberry">Marionberry</option>
            <option value="nectarine">Nectarine</option>
            <option value="orange">Orange</option>
            <option value="papaya">Papaya</option>
            <option value="passionfruit">Passionfruit</option>
            <option value="peach">Peach</option>
            <option value="pear">Pear</option>
            <option value="persimmon">Persimmon</option>
            <option value="plantain">Plantain</option>
            <option value="plum">Plum</option>
            <option value="pineapple">Pineapple</option>
            <option value="pluot">Pluot</option>
            <option value="pomegranate">Pomegranate</option>
            <option value="pomelo">Pomelo</option>
            <option value="quince">Quince</option>
            <option value="raspberry">Raspberry</option>
            <option value="rambutan">Rambutan</option>
            <option value="soursop">Soursop</option>
            <option value="starfruit">Starfruit</option>
            <option value="strawberry">Strawberry</option>
            <option value="tamarind">Tamarind</option>
            <option value="tangelo">Tangelo</option>
            <option value="tangerine">Tangerine</option>
            <option value="ugli fruit">Ugli fruit</option>
            <option value="watermelon">Watermelon</option>
            <option value="white currant">White currant</option>
            <option value="yuzu">Yuzu</option>
          </select>
        </div>
      </>
    );
  };

  return (
    <>
      <ComboBox />

      {/* <ul className="usa-button-group">
        <li className="usa-button-group__item">
          <a href="#" className="usa-button usa-button--outline">
            Back
          </a>
        </li>
        <li className="usa-button-group__item">
          <button type="button" className="usa-button">
            Continue
          </button>
        </li>
      </ul> */}
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
