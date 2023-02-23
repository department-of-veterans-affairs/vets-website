import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { setData } from 'platform/forms-system/src/js/actions';
import {
  VaTextInput,
  VaNumberInput,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { isValidCurrency } from '../../utils/validations';
import { MAX_ASSET_NAME_LENGTH } from '../../constants/checkboxSelections';

const AddAsset = props => {
  const { data, goToPath } = props;
  const { assets } = data;
  const { otherAssetsEnhanced = [] } = assets;
  const dispatch = useDispatch();

  const RETURN_PATH = '/other-assets-summary';

  // Borrowed from 995 AddIssue
  // get index from url '/add-issue?index={index}'
  const searchIndex = new URLSearchParams(window.location.search);
  let index = parseInt(searchIndex.get('index'), 10);
  if (Number.isNaN(index)) {
    index = otherAssetsEnhanced.length;
  }

  const currentAsset = otherAssetsEnhanced[index] || {};

  // Asset name data/flags
  const [assetName, setAssetName] = useState(currentAsset.name || '');
  const [nameError, setNameError] = useState(true);

  // Asset amount data/flags
  const [assetAmount, setAssetAmount] = useState(currentAsset.amount || '');
  const [amountError, setAmountError] = useState(true);

  // shared fun
  const [submitted, setSubmitted] = useState(false);

  // submit issue with validation
  const addOrUpdateAsset = () => {
    // Check for errors
    if (!nameError && !amountError) {
      // Update form data
      const newAssets = [...otherAssetsEnhanced];
      // update new or existing index
      newAssets[index] = {
        name: assetName,
        amount: assetAmount,
      };

      dispatch(
        setData({
          ...data,
          assets: {
            ...assets,
            otherAssetsEnhanced: newAssets,
          },
        }),
      );
      goToPath(RETURN_PATH);
    }
  };

  const handlers = {
    onSubmit: event => event.preventDefault(),
    onAssetNameChange: ({ target }) => {
      setAssetName(target.value);
      setNameError(!target.value);
    },
    onAssetAmountChange: event => {
      setAssetAmount(event.target.value);
      setAmountError(!isValidCurrency(event.target.value));
    },
    onCancel: event => {
      event.preventDefault();
      goToPath(RETURN_PATH);
    },
    onUpdate: event => {
      event.preventDefault();
      setSubmitted(true);
      addOrUpdateAsset();
    },
  };

  return (
    <>
      <form onSubmit={handlers.onSubmit}>
        <fieldset>
          <legend
            id="decision-date-description"
            className="vads-u-font-family--serif"
            name="addOrUpdateAsset"
          >
            Add your additional assets
          </legend>
          <VaTextInput
            className="input-size-6"
            error={(submitted && nameError && 'Enter valid text') || null}
            id="add-other-asset-name"
            label="What is the asset?"
            maxlength={MAX_ASSET_NAME_LENGTH}
            name="add-other-asset-name"
            onInput={handlers.onAssetNameChange}
            required
            type="text"
            value={assetName}
          />
          <VaNumberInput
            className="input-size-6"
            error={(submitted && amountError && 'Enter valid number') || null}
            id="add-other-asset-amount"
            inputmode="decimal"
            label="How much is your asset worth?"
            min={0}
            name="add-other-asset-amount"
            onInput={handlers.onAssetAmountChange}
            required
            type="text"
            value={assetAmount}
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
              type="button"
              id="submit"
              className="vads-u-width--auto"
              onClick={handlers.onUpdate}
            >
              {`${
                otherAssetsEnhanced.length === index ? 'Add' : 'Update'
              } asset`}
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
      otherAssetsEnhanced: PropTypes.arrayOf(
        PropTypes.shape({
          name: PropTypes.string,
          amount: PropTypes.string,
        }),
      ),
    }),
  }),
  goToPath: PropTypes.func,
  setFormData: PropTypes.func,
  testingIndex: PropTypes.number,
  onReviewPage: PropTypes.bool,
};

export default AddAsset;
