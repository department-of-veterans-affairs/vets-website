import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { setData } from 'platform/forms-system/src/js/actions';
import FormNavButtons from 'platform/forms-system/src/js/components/FormNavButtons';
import { VaTextInput } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { isValidCurrency } from '../../utils/validations';
import { safeNumber } from '../../utils/calculateIncome';
import { currency as currencyFormatter } from '../../utils/helpers';
import { isStreamlinedShortForm } from '../../utils/streamlinedDepends';
import ReviewPageHeader from '../shared/ReviewPageHeader';

const CASH_IN_BANK = 'Cash in a bank (savings and checkings)';
const CASH_ON_HAND = 'Cash on hand (not in bank)';

const CashInBank = ({
  contentBeforeButtons,
  contentAfterButtons,
  data,
  goBack,
  goForward,
  setFormData,
  useWebComponents,
}) => {
  const { assets, gmtData } = data;
  const { monetaryAssets = [] } = assets;

  const cashInBankTotal = monetaryAssets.find(f => f.name === CASH_IN_BANK) ?? {
    amount: '',
  };
  const cashOnHandTotal = monetaryAssets.find(f => f.name === CASH_ON_HAND) ?? {
    amount: '',
  };

  const [cash, setCash] = useState(cashInBankTotal.amount);
  const ERR_MSG = 'Please enter a valid dollar amount';
  const [error, setError] = useState(null);

  const updateFormData = () => {
    if (!isValidCurrency(cash)) {
      return setError(ERR_MSG);
    }

    const newMonetaryAssetsArray = monetaryAssets.filter(
      asset => asset.name !== CASH_IN_BANK,
    );

    const liquidCash = safeNumber(cash) + safeNumber(cashOnHandTotal.amount);

    // update form data & gmtIsShort
    setFormData({
      ...data,
      assets: {
        ...assets,
        monetaryAssets: [
          ...newMonetaryAssetsArray,
          { name: CASH_IN_BANK, amount: cash },
        ],
      },
      gmtData: {
        ...gmtData,
        liquidAssetsBelowGmt: liquidCash < gmtData?.assetThreshold,
      },
    });

    return setError(null);
  };

  const onBlur = () => {
    if (!isValidCurrency(cash)) {
      setError(ERR_MSG);
    } else {
      setError(null);
    }
  };

  const onSubmit = event => {
    event.preventDefault();
    if (!error) {
      goForward(data);
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <fieldset className="vads-u-margin-y--2">
        <legend className="schemaform-block-title">
          <h3 className="vads-u-margin--0">Cash in bank</h3>
        </legend>
        <VaTextInput
          currency
          error={error}
          hint={null}
          id="cash"
          inputmode="decimal"
          type="decimal"
          label="What is the total amount you have in all checking and savings accounts?"
          name="cash"
          onBlur={onBlur}
          onInput={({ target }) => setCash(target.value)}
          required
          value={cash}
          width="md"
        />
        {contentBeforeButtons}
        <FormNavButtons
          goBack={goBack}
          goForward={updateFormData}
          submitToContinue
          useWebComponents={useWebComponents}
        />
        {contentAfterButtons}
      </fieldset>
    </form>
  );
};

CashInBank.propTypes = {
  contentAfterButtons: PropTypes.object,
  contentBeforeButtons: PropTypes.object,
  data: PropTypes.shape({
    assets: PropTypes.shape({
      monetaryAssets: PropTypes.array,
    }),
    gmtData: PropTypes.shape({
      assetThreshold: PropTypes.number,
    }),
  }),
  goBack: PropTypes.func,
  goForward: PropTypes.func,
  goToPath: PropTypes.func,
  setFormData: PropTypes.func,
};

// This review section should only show for SW short form
//  otherwise the assets will show in the monetary assets section
const CashInBankReview = ({ data, goToPath }) => {
  const dispatch = useDispatch();
  const {
    assets,
    gmtData,
    'view:reviewPageNavigationToggle': showReviewNavigation,
  } = data;
  const { monetaryAssets = [] } = assets;

  // we want this to show if a short form exited early and they have no other monetary assets where it
  //  would normally render the monetary asset list
  const noOtherMonetaryAssets =
    monetaryAssets.filter(
      asset =>
        asset?.name?.toLowerCase() !== 'cash on hand (not in bank)' &&
        asset?.name?.toLowerCase() !== 'cash in a bank (savings and checkings)',
    ).length === 0;

  // set reviewNavigation to true to show the review page alert
  const onReviewClick = () => {
    dispatch(
      setData({
        ...data,
        reviewNavigation: true,
      }),
    );

    // if the user saw cash on hand/in bank, they should be routed to
    //  cash on hand page since it's the head of the chapter
    const gmtDepends =
      (gmtData?.isEligibleForStreamlined && gmtData?.incomeBelowGmt) ||
      (gmtData?.isEligibleForStreamlined && gmtData?.incomeBelowOneFiftyGmt);

    if (gmtDepends || data['view:reviewPageNavigationToggle']) {
      return goToPath('/cash-on-hand');
    }
    return goToPath('/monetary-asset-checklist');
  };

  return isStreamlinedShortForm(data) || noOtherMonetaryAssets ? (
    <>
      {showReviewNavigation ? (
        <ReviewPageHeader title="household assets" goToPath={onReviewClick} />
      ) : null}
      <div className="form-review-panel-page">
        <div className="form-review-panel-page-header-row">
          <h4 className="form-review-panel-page-header vads-u-font-size--h5">
            Monetary assets
          </h4>
        </div>
        <dl className="review">
          {monetaryAssets.map((income, index) => {
            return (
              <div
                className="review-row"
                key={income.name + income.amount + index}
              >
                <dt>{income.name}</dt>
                <dd>{currencyFormatter(income.amount)}</dd>
              </div>
            );
          })}
        </dl>
      </div>
    </>
  ) : null;
};

CashInBankReview.propTypes = {
  data: PropTypes.shape({
    'view:reviewPageNavigationToggle': PropTypes.bool,
    assets: PropTypes.shape({
      monetaryAssets: PropTypes.array,
    }),
    gmtData: PropTypes.shape({
      incomeBelowGmt: PropTypes.bool,
      isEligibleForStreamlined: PropTypes.bool,
      incomeBelowOneFiftyGmt: PropTypes.bool,
    }),
  }),
};

export { CashInBank, CashInBankReview };
