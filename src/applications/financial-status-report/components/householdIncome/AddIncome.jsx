import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { VaTextInput } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { isValidCurrency } from '../../utils/validations';
import { MAX_ASSET_NAME_LENGTH } from '../../constants/checkboxSelections';
import ButtonGroup from '../shared/ButtonGroup';

const SUMMARY_PATH = '/other-income-summary';
const CHECKLIST_PATH = '/additional-income-checklist';
const MAXIMUM_ASSET_AMOUNT = 12000;

const AddIncome = ({ data, goToPath, setFormData }) => {
  const { additionalIncome } = data;
  const { addlIncRecords = [] } = additionalIncome;

  // Borrowed from 995 AddIssue
  // get index from url '/add-issue?index={index}'
  const searchIndex = new URLSearchParams(window.location.search);
  let index = parseInt(searchIndex.get('index'), 10);
  if (Number.isNaN(index)) {
    index = addlIncRecords.length;
  }

  const currentAsset = addlIncRecords[index] || {};

  // Asset name data/flags
  const [assetName, setAssetName] = useState(currentAsset.name || null);
  const nameError = !assetName ? 'Enter valid text' : null;
  const [otherAssetAmountError, setOtherAssetAmountError] = useState(null);

  // Asset amount data/flags
  const [assetAmount, setAssetAmount] = useState(currentAsset.amount || null);
  const amountError = !isValidCurrency(assetAmount)
    ? 'Enter valid amount'
    : null;

  // shared fun
  const [submitted, setSubmitted] = useState(false);

  const handlers = {
    onAssetNameChange: ({ target }) => {
      setAssetName(target.value);
    },
    onAssetAmountChange: event => {
      setAssetAmount(event.target.value);

      if (event.target.value >= MAXIMUM_ASSET_AMOUNT) {
        setOtherAssetAmountError('Amount must be less than $12,000');
      } else {
        setOtherAssetAmountError(null);
      }
    },
    onCancel: event => {
      event.preventDefault();

      if (addlIncRecords.length) {
        return goToPath(SUMMARY_PATH);
      }
      return goToPath(CHECKLIST_PATH);
    },
    onUpdate: () => {
      // handle validation, update form data
      setSubmitted(true);

      // Check for errors
      if (!nameError && !amountError && !otherAssetAmountError) {
        // Update form data
        const newAssets = [...addlIncRecords];
        // update new or existing index
        newAssets[index] = {
          name: assetName,
          amount: assetAmount,
        };

        setFormData({
          ...data,
          additionalIncome: {
            ...additionalIncome,
            addlIncRecords: newAssets,
          },
        });

        goToPath(SUMMARY_PATH);
      }
    },
  };

  const labelText = addlIncRecords.length === index ? 'Add' : 'Update';

  return (
    <>
      <form>
        <fieldset className="vads-u-margin-y--2">
          <legend
            id="decision-date-description"
            className="schemaform-block-title"
            name="addOrUpdateIncome"
          >
            Add your additional sources of income
          </legend>
          <VaTextInput
            width="md"
            error={(submitted && nameError) || null}
            id="add-other-income-name"
            label="What is the income source?"
            maxlength={MAX_ASSET_NAME_LENGTH}
            name="add-other-income-name"
            onInput={handlers.onAssetNameChange}
            required
            type="text"
            value={assetName || ''}
            charcount
          />
          <VaTextInput
            width="md"
            error={otherAssetAmountError}
            id="add-other-asset-amount"
            inputmode="decimal"
            label="Other monthly income amount?"
            min={0}
            max={MAXIMUM_ASSET_AMOUNT}
            name="add-other-income-amount"
            onInput={handlers.onAssetAmountChange}
            required
            type="decimal"
            value={assetAmount || ''}
          />
          <br />
          <ButtonGroup
            buttons={[
              {
                label: 'Cancel',
                onClick: handlers.onCancel, // Define this function based on page-specific logic
                isSecondary: true,
              },
              {
                label: `${labelText} other income`,
                onClick: handlers.onUpdate,
              },
            ]}
          />
        </fieldset>
      </form>
    </>
  );
};

AddIncome.propTypes = {
  data: PropTypes.shape({
    additionalIncome: PropTypes.shape({
      addlIncRecords: PropTypes.arrayOf(
        PropTypes.shape({
          name: PropTypes.string,
          amount: PropTypes.string,
        }),
      ),
    }),
  }),
  goToPath: PropTypes.func,
  setFormData: PropTypes.func,
};

export default AddIncome;
