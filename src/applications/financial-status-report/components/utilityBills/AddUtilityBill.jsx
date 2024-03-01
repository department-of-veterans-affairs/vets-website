import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  VaTextInput,
  VaNumberInput,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { isValidCurrency } from '../../utils/validations';
import { MAX_UTILITY_NAME_LENGTH } from '../../constants/checkboxSelections';
import ButtonGroup from '../shared/ButtonGroup';

const SUMMARY_PATH = '/utility-bill-summary';
const CHECKLIST_PATH = '/utility-bill-checklist';

const AddUtilityBill = ({ data, goToPath, setFormData }) => {
  const { utilityRecords = [] } = data;

  // Borrowed from 995 AddIssue
  // get index from url '/add-issue?index={index}'
  const searchIndex = new URLSearchParams(window.location.search);
  let index = parseInt(searchIndex.get('index'), 10);
  if (Number.isNaN(index)) {
    index = utilityRecords.length;
  }

  const currentUtility = utilityRecords[index] || {};

  // Utility name data/flags
  const [utilityName, setUtilityName] = useState(currentUtility.name || null);
  const nameError = !utilityName ? 'Enter valid text' : null;

  // Utility amount data/flags
  const [utilityAmount, setUtilityAmount] = useState(
    currentUtility.amount || null,
  );
  const amountError = !isValidCurrency(utilityAmount)
    ? 'Enter valid amount'
    : null;

  // shared fun
  const [submitted, setSubmitted] = useState(false);

  const handlers = {
    onSubmit: event => {
      // handle page navigation
      // goToPath needs to be encapsulated separately from setFormData
      // or data updates won't be reflected when page navigation occurs
      event.preventDefault();
      if (!nameError && !amountError) {
        goToPath(SUMMARY_PATH);
      }
    },
    onUtilityNameChange: ({ target }) => {
      setUtilityName(target.value);
    },
    onUtilityAmountChange: event => {
      setUtilityAmount(event.target.value);
    },
    onCancel: event => {
      event.preventDefault();

      if (utilityRecords.length) {
        return goToPath(SUMMARY_PATH);
      }
      return goToPath(CHECKLIST_PATH);
    },
    onUpdate: () => {
      // handle validation, update form data
      setSubmitted(true);

      // Check for errors
      if (!nameError && !amountError) {
        // Update form data
        const newUtility = [...utilityRecords];
        // update new or existing index
        newUtility[index] = {
          name: utilityName,
          amount: utilityAmount,
        };

        setFormData({
          ...data,
          utilityRecords: newUtility,
        });
      }
      handlers.onSubmit(event);
    },
  };

  const headerText =
    utilityRecords.length === index
      ? 'Add your additional utility bill'
      : 'Update your utility bill';

  const labelText = utilityRecords.length === index ? 'Add' : 'Update';

  return (
    <>
      <form onSubmit={handlers.onSubmit}>
        <fieldset className="vads-u-margin-y--2">
          <legend
            id="decision-date-description"
            className="schemaform-block-title"
            name="addOrUpdateUtility"
          >
            {headerText}
          </legend>
          <VaTextInput
            className="no-wrap input-size-3"
            error={(submitted && nameError) || null}
            id="add-utility-bill-name"
            label="What is the utility bill?"
            maxlength={MAX_UTILITY_NAME_LENGTH}
            name="add-utility-bill-name"
            onInput={handlers.onUtilityNameChange}
            required
            type="text"
            value={utilityName || ''}
            charcount
            uswds
          />
          <VaNumberInput
            className="no-wrap input-size-3"
            error={(submitted && amountError) || null}
            id="add-utility-bill-amount"
            inputmode="decimal"
            label="How much do you pay for this utility bill every month?"
            min={0}
            name="add-utility-bill-amount"
            onInput={handlers.onUtilityAmountChange}
            required
            type="text"
            value={utilityAmount || ''}
            uswds
          />

          <ButtonGroup
            buttons={[
              {
                label: 'Cancel',
                onClick: handlers.onCancel, // Define this function based on page-specific logic
                isSecondary: true,
              },
              {
                label: `${labelText} utility bill`,
                onClick: handlers.onUpdate,
                isSubmitting: true, // If this button submits a form
              },
            ]}
          />
        </fieldset>
      </form>
    </>
  );
};

AddUtilityBill.propTypes = {
  data: PropTypes.shape({
    utilityRecords: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string,
        amount: PropTypes.string,
      }),
    ),
  }),
  goToPath: PropTypes.func,
  setFormData: PropTypes.func,
};

export default AddUtilityBill;
