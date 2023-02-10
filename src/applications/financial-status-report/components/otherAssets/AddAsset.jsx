import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
// import { VaTextInput } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
// import recordEvent from 'platform/monitoring/record-event';
import { setData } from 'platform/forms-system/src/js/actions';
import { VaTextInput } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { isValidCurrency } from '../../utils/validations';

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
  const [nameError, setNameError] = useState(false);

  // Asset amount data/flags
  const [assetAmount, setAssetAmount] = useState(currentAsset.amount || '');
  const [amountError, setAmountError] = useState(false);

  // shared fun
  const [submitted, setSubmitted] = useState(false);

  // submit issue with validation
  const addOrUpdateAsset = () => {
    setSubmitted(true);

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
    onAssetNameChange: event => {
      setAssetName(event.target.value);
      setNameError(!event.target.value);
    },
    onAssetAmountChange: event => {
      setAssetAmount(event.target.value);
      setAmountError(!isValidCurrency(event.target.value));
    },
    onCancel: event => {
      event.preventDefault();
      // recordEvent({
      //   event: 'cta-button-click',
      //   'button-type': 'secondary',
      //   'button-click-label': 'Cancel',
      //   'button-background-color': 'white',
      // });
      goToPath(RETURN_PATH);
    },
    onUpdate: event => {
      event.preventDefault();
      // recordEvent({
      //   event: 'cta-button-click',
      //   'button-type': 'primary',
      //   'button-click-label': 'Add issue',
      //   'button-background-color': 'blue',
      // });
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
            id="add-other-asset-name"
            name="add-other-asset-name"
            type="text"
            label="What is the asset?"
            required
            value={assetName}
            onInput={handlers.onAssetNameChange}
            error={submitted && nameError ? 'Enter valid text' : ''}
          />
          <VaTextInput
            id="add-other-asset-amount"
            name="add-other-asset-amount"
            type="text"
            label="How much is your asset worth?"
            required
            value={assetAmount}
            onInput={handlers.onAssetAmountChange}
            error={(submitted && amountError && 'Enter valid number') || null}
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
              Update or Add (depends on index?)
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
