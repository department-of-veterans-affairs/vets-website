import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import FormNavButtons from 'platform/forms-system/src/js/components/FormNavButtons';
import { focusElement } from 'platform/utilities/ui';
import { VaNumberInput } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { setData } from 'platform/forms-system/src/js/actions';
import { isValidCurrency } from '../../utils/validations';
import { currency as currencyFormatter } from '../../utils/helpers';
import { safeNumber } from '../../utils/calculateIncome';

import ReviewPageHeader from '../shared/ReviewPageHeader';
import ReviewPageNavigationAlert from '../alerts/ReviewPageNavigationAlert';

const CASH_ON_HAND = 'Cash on hand (not in bank)';

const CashOnHand = ({
  contentBeforeButtons,
  contentAfterButtons,
  data,
  goBack,
  goForward,
  goToPath,
  setFormData,
}) => {
  const headerRef = useRef(null);
  const { assets, gmtData } = data;
  const {
    reviewNavigation = false,
    'view:reviewPageNavigationToggle': showReviewNavigation,
  } = data;
  const { cashOnHand, monetaryAssets = [] } = assets;

  useEffect(
    () => {
      if (headerRef?.current) {
        focusElement(headerRef?.current);
      }
    },
    [headerRef],
  );

  const cashOnHandTotal = monetaryAssets.find(f => f.name === CASH_ON_HAND) ?? {
    amount: '',
  };

  const [cash, setCash] = useState(
    data['view:streamlinedWaiverAssetUpdate']
      ? cashOnHandTotal.amount
      : cashOnHand,
  );
  const ERR_MSG = 'Please enter a valid dollar amount';
  const [error, setError] = useState(null);

  const updateFormData = () => {
    if (!isValidCurrency(cash)) {
      return setError(ERR_MSG);
    }

    const filteredMonetaryAssets = monetaryAssets.filter(
      asset => asset.name !== CASH_ON_HAND,
    );

    // New asset caclulation adds cash on hand to monetary assets array.
    // secondary condition can be removed when feature flag is disabled
    if (data['view:streamlinedWaiverAssetUpdate']) {
      setFormData({
        ...data,
        assets: {
          ...data.assets,
          monetaryAssets: [
            ...filteredMonetaryAssets,
            { name: CASH_ON_HAND, amount: cash },
          ],
        },
      });
    } else {
      // update form data & gmtIsShort
      setFormData({
        ...data,
        assets: {
          ...data.assets,
          cashOnHand: cash,
        },
        gmtData: {
          ...gmtData,
          cashBelowGmt: safeNumber(cash) < gmtData?.assetThreshold,
        },
      });
    }
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

  const handleBackNavigation = () => {
    if (reviewNavigation) {
      setFormData({
        ...data,
        reviewNavigation: false,
      });
      goToPath('/review-and-submit');
    } else {
      goBack();
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <fieldset className="vads-u-margin-y--2">
        <legend className="schemaform-block-title">
          <h3 className="vads-u-margin--0" ref={headerRef}>
            Cash on hand
          </h3>
        </legend>
        {reviewNavigation && showReviewNavigation ? (
          <ReviewPageNavigationAlert data={data} title="household assets" />
        ) : null}
        <VaNumberInput
          currency
          error={error}
          hint={null}
          id="cash"
          inputmode="decimal"
          label="What is the dollar amount of available cash (not in a bank) you currently have?"
          name="cash"
          onBlur={onBlur}
          onInput={({ target }) => setCash(target.value)}
          required
          value={cash}
          width="md"
          uswds
        />
        {contentBeforeButtons}
        <FormNavButtons
          goBack={handleBackNavigation}
          goForward={updateFormData}
          submitToContinue
        />
        {contentAfterButtons}
      </fieldset>
    </form>
  );
};

CashOnHand.propTypes = {
  contentAfterButtons: PropTypes.object,
  contentBeforeButtons: PropTypes.object,
  data: PropTypes.shape({
    assets: PropTypes.shape({
      cashOnHand: PropTypes.string,
      monetaryAssets: PropTypes.array,
    }),
    'view:streamlinedWaiverAssetUpdate': PropTypes.bool,
    gmtData: PropTypes.shape({
      assetThreshold: PropTypes.number,
    }),
    reviewNavigation: PropTypes.bool,
    'view:reviewPageNavigationToggle': PropTypes.bool,
  }),
  goBack: PropTypes.func,
  goForward: PropTypes.func,
  goToPath: PropTypes.func,
  setFormData: PropTypes.func,
};

// Cash on hand review component won't be necessary after feature flag is disabled
//  because cash on hand will be added to monetary assets array
const CashOnHandReview = ({ data, goToPath }) => {
  const dispatch = useDispatch();
  const {
    assets,
    'view:reviewPageNavigationToggle': showReviewNavigation,
  } = data;
  const { cashOnHand } = assets;

  // set reviewNavigation to true to show the review page alert
  const onReviewClick = () => {
    dispatch(
      setData({
        ...data,
        reviewNavigation: true,
      }),
    );
    goToPath('/cash-on-hand');
  };

  return data['view:streamlinedWaiverAssetUpdate'] ? null : (
    <>
      {showReviewNavigation ? (
        <ReviewPageHeader
          title="household assets"
          goToPath={() => onReviewClick()}
        />
      ) : null}
      <div className="form-review-panel-page">
        <div className="form-review-panel-page-header-row">
          <h4 className="form-review-panel-page-header vads-u-font-size--h5">
            Cash on hand
          </h4>
        </div>
        <dl className="review">
          <div className="review-row">
            <dt>Available cash (not in a bank)</dt>
            <dd>{currencyFormatter(cashOnHand)}</dd>
          </div>
        </dl>
      </div>
    </>
  );
};

CashOnHandReview.propTypes = {
  data: PropTypes.shape({
    assets: PropTypes.shape({
      cashOnHand: PropTypes.string,
    }),
    'view:streamlinedWaiverAssetUpdate': PropTypes.bool,
    'view:reviewPageNavigationToggle': PropTypes.bool,
  }),
  goToPath: PropTypes.func,
};

export { CashOnHand, CashOnHandReview };
