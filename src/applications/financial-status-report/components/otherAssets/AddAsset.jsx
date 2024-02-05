import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  VaTextInput,
  VaNumberInput,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { isValidCurrency } from '../../utils/validations';
import { MAX_ASSET_NAME_LENGTH } from '../../constants/checkboxSelections';

const SUMMARY_PATH = '/other-assets-summary';
const CHECKLIST_PATH = '/other-assets-checklist';

const AddAsset = ({ data, goToPath, setFormData }) => {
  const { assets } = data;
  const { otherAssets = [] } = assets;

  // Borrowed from 995 AddIssue
  // get index from url '/add-issue?index={index}'
  const searchIndex = new URLSearchParams(window.location.search);
  let index = parseInt(searchIndex.get('index'), 10);
  if (Number.isNaN(index)) {
    index = otherAssets.length;
  }

  const currentAsset = otherAssets[index] || {};

  // Asset name data/flags
  const [assetName, setAssetName] = useState(currentAsset.name || null);
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
      if (!nameError && !amountError) {
        goToPath(SUMMARY_PATH);
      }
    },
    onAssetNameChange: ({ target }) => {
      setAssetName(target.value);
    },
    onAssetAmountChange: event => {
      setAssetAmount(event.target.value);
    },
    onCancel: event => {
      event.preventDefault();

      if (otherAssets.length) {
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
        const newAssets = [...otherAssets];
        // update new or existing index
        newAssets[index] = {
          name: assetName,
          amount: assetAmount,
        };

        setFormData({
          ...data,
          assets: {
            ...assets,
            otherAssets: newAssets,
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
            name="addOrUpdateAsset"
          >
            Add your additional assets
          </legend>
          <VaTextInput
            className="no-wrap input-size-3"
            error={(submitted && nameError) || null}
            id="add-other-asset-name"
            label="What is the asset?"
            maxlength={MAX_ASSET_NAME_LENGTH}
            name="add-other-asset-name"
            onInput={handlers.onAssetNameChange}
            required
            type="text"
            value={assetName || ''}
            uswds
          />
          <VaNumberInput
            className="no-wrap input-size-3"
            error={(submitted && amountError) || null}
            id="add-other-asset-amount"
            inputmode="decimal"
            label="How much is your asset worth?"
            min={0}
            name="add-other-asset-amount"
            onInput={handlers.onAssetAmountChange}
            required
            type="text"
            value={assetAmount || ''}
            uswds
          />
          <br />
          <va-additional-info
            class="vads-u-margin-top--4"
            trigger="Why do I need to provide this information?"
            uswds
          >
            We ask for details about items of value such as jewelry and art
            because it gives us a picture of your financial situation and allows
            us to make a more informed decision regarding your request.
          </va-additional-info>
          <va-additional-info
            trigger="What if I don’t know the estimated value of an asset?"
            uswds
          >
            Don’t worry. We just want to get an idea of items of value you may
            own so we can better understand your financial situation. Include
            the amount of money you think you would get if you sold the asset.
            To get an idea of prices, you can check these places:
            <ul>
              <li>Online forums for your community</li>
              <li>Classified ads in local newspapers</li>
              <li>
                Websites or forums that appraise the value of items like jewelry
                and art
              </li>
            </ul>
          </va-additional-info>
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
              {`${otherAssets.length === index ? 'Add' : 'Update'} asset`}
            </button>
          </p>
        </fieldset>
      </form>
    </>
  );
};

AddAsset.propTypes = {
  data: PropTypes.shape({
    assets: PropTypes.shape({
      otherAssets: PropTypes.arrayOf(
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

export default AddAsset;
