import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { VaTextInput } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { isValidCurrency } from '../../utils/validations';
import { MAX_ASSET_NAME_LENGTH } from '../../constants/checkboxSelections';
import ButtonGroup from '../shared/ButtonGroup';

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

        goToPath(SUMMARY_PATH);
      }
    },
  };

  const labelText = otherAssets.length === index ? 'Add' : 'Update';

  return (
    <>
      <form>
        <fieldset className="vads-u-margin-y--2">
          <legend
            id="decision-date-description"
            className="schemaform-block-title"
            name="addOrUpdateAsset"
          >
            Add your additional assets
          </legend>
          <VaTextInput
            width="md"
            error={(submitted && nameError) || null}
            id="add-other-asset-name"
            label="What is the asset?"
            maxlength={MAX_ASSET_NAME_LENGTH}
            name="add-other-asset-name"
            onInput={handlers.onAssetNameChange}
            required
            type="text"
            value={assetName || ''}
            charcount
          />
          <VaTextInput
            width="md"
            error={(submitted && amountError) || null}
            id="add-other-asset-amount"
            inputmode="decimal"
            label="How much is your asset worth?"
            min={0}
            name="add-other-asset-amount"
            onInput={handlers.onAssetAmountChange}
            required
            type="decimal"
            value={assetAmount || ''}
          />
          <br />
          <va-additional-info
            class="vads-u-margin-top--4"
            trigger="Why do I need to provide this information?"
          >
            We ask for details about items of value such as jewelry and art
            because it gives us a picture of your financial situation and allows
            us to make a more informed decision regarding your request.
          </va-additional-info>
          <va-additional-info trigger="What if I don’t know the estimated value of an asset?">
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
          <ButtonGroup
            buttons={[
              {
                label: 'Cancel',
                onClick: handlers.onCancel, // Define this function based on page-specific logic
                isSecondary: true,
              },
              {
                label: `${labelText} asset`,
                onClick: handlers.onUpdate,
              },
            ]}
          />
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
