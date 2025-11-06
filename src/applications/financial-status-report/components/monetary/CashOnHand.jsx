import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import FormNavButtons from 'platform/forms-system/src/js/components/FormNavButtons';
import { focusElement } from 'platform/utilities/ui';
import { VaTextInput } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { isValidCurrency } from '../../utils/validations';

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
  useWebComponents,
}) => {
  const headerRef = useRef(null);
  const { assets } = data;
  const {
    reviewNavigation = false,
    'view:reviewPageNavigationToggle': showReviewNavigation,
  } = data;
  const { monetaryAssets = [] } = assets;

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

  const [cash, setCash] = useState(cashOnHandTotal?.amount);
  const ERR_MSG = 'Please enter a valid dollar amount';
  const [error, setError] = useState(null);

  const updateFormData = () => {
    if (!isValidCurrency(cash)) {
      return setError(ERR_MSG);
    }

    const filteredMonetaryAssets = monetaryAssets.filter(
      asset => asset.name !== CASH_ON_HAND,
    );

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
        <VaTextInput
          currency
          error={error}
          hint={null}
          id="cash"
          inputmode="decimal"
          type="decimal"
          label="What is the dollar amount of available cash (not in a bank) you currently have?"
          name="cash"
          onBlur={onBlur}
          onInput={({ target }) => setCash(target.value)}
          required
          value={cash}
          width="md"
        />
        {contentBeforeButtons}
        <FormNavButtons
          goBack={handleBackNavigation}
          goForward={updateFormData}
          submitToContinue
          useWebComponents={useWebComponents}
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
      monetaryAssets: PropTypes.array,
    }),
    reviewNavigation: PropTypes.bool,
    'view:reviewPageNavigationToggle': PropTypes.bool,
  }),
  goBack: PropTypes.func,
  goForward: PropTypes.func,
  goToPath: PropTypes.func,
  setFormData: PropTypes.func,
};

export { CashOnHand };
