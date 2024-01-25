import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  VaTextInput,
  VaNumberInput,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { isValidCurrency } from '../../utils/validations';
import { MAX_ASSET_NAME_LENGTH } from '../../constants/checkboxSelections';

const SUMMARY_PATH = '/spouse-other-income-summary';
const CHECKLIST_PATH = '/spouse-additional-income-checklist';
const MAXIMUM_ASSET_AMOUNT = 12000;

const SpouseAddIncome = ({ data, goToPath, setFormData }) => {
  const { additionalIncome } = data;
  const { spouse } = additionalIncome;
  const { spAddlIncome = [] } = spouse;

  // Borrowed from 995 AddIssue
  // get index from url '/add-issue?index={index}'
  const searchIndex = new URLSearchParams(window.location.search);
  let index = parseInt(searchIndex.get('index'), 10);
  if (Number.isNaN(index)) {
    index = spAddlIncome.length;
  }

  const currentAsset = spAddlIncome[index] || {};

  // Asset name data/flags
  const [assetName, setAssetName] = useState(currentAsset.name || null);
  const [otherAssetIncomeError, setOtherAssetAmountError] = useState(null);
  const nameError = !assetName ? 'Enter valid text' : null;

  // Asset amount data/flags
  const [assetAmount, setAssetAmount] = useState(currentAsset.amount || null);
  const amountError = !isValidCurrency(assetAmount)
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
      if (!nameError && !amountError && !otherAssetIncomeError) {
        goToPath(SUMMARY_PATH);
      }
    },
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

      if (spAddlIncome.length) {
        return goToPath(SUMMARY_PATH);
      }
      return goToPath(CHECKLIST_PATH);
    },
    onUpdate: () => {
      // handle validation, update form data
      setSubmitted(true);

      // Check for errors
      if (!nameError && !amountError && !otherAssetIncomeError) {
        // Update form data
        const newAssets = [...spAddlIncome];
        // update new or existing index
        newAssets[index] = {
          name: assetName,
          amount: assetAmount,
        };

        setFormData({
          ...data,
          additionalIncome: {
            ...additionalIncome,
            spouse: {
              spAddlIncome: newAssets,
            },
          },
        });
      }
    },
  };

  return (
    <>
      <form onSubmit={handlers.onSubmit}>
        <fieldset className="vads-u-margin-y--2">
          <legend
            id="decision-date-description"
            className="schemaform-block-title"
            name="addOrUpdateIncome"
          >
            <h3 className="vads-u-margin--0">
              Add your spouse’s additional sources of income
            </h3>
          </legend>
          <VaTextInput
            className="no-wrap input-size-3"
            error={(submitted && nameError) || null}
            id="add-other-income-name"
            label="What is the income source?"
            maxlength={MAX_ASSET_NAME_LENGTH}
            name="add-other-income-name"
            onInput={handlers.onAssetNameChange}
            required
            type="text"
            value={assetName || ''}
            uswds
          />
          <VaNumberInput
            className="no-wrap input-size-3"
            error={otherAssetIncomeError}
            id="add-other-asset-amount"
            inputmode="decimal"
            label="Other monthly income amount?"
            min={0}
            max={MAXIMUM_ASSET_AMOUNT}
            name="add-other-income-amount"
            onInput={handlers.onAssetAmountChange}
            required
            type="text"
            value={assetAmount || ''}
            uswds
          />
          <br />
          <p>
            <button
              type="button"
              id="cancel"
              className="usa-button-secondary vads-u-width--auto"
              onClick={handlers.onCancel}
            >
              Cancel
            </button>
            <button
              type="submit"
              id="submit"
              className="vads-u-width--auto"
              onClick={handlers.onUpdate}
            >
              {`${
                spAddlIncome.length === index ? 'Add' : 'Update'
              } other income`}
            </button>
          </p>
        </fieldset>
      </form>
    </>
  );
};

SpouseAddIncome.propTypes = {
  data: PropTypes.shape({
    additionalIncome: PropTypes.shape({
      spouse: PropTypes.shape({
        spAddlIncome: PropTypes.arrayOf(
          PropTypes.shape({
            name: PropTypes.string,
            amount: PropTypes.string,
          }),
        ),
      }),
    }),
  }),
  goToPath: PropTypes.func,
  setFormData: PropTypes.func,
};

export default SpouseAddIncome;
