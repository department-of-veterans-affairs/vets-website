import React, { useState } from 'react';
import PropTypes from 'prop-types';
import FormNavButtons from 'platform/forms-system/src/js/components/FormNavButtons';
import { VaNumberInput } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { isValidCurrency } from '../../utils/validations';
import { currency as currencyFormatter } from '../../utils/helpers';

const CashOnHand = ({
  contentBeforeButtons,
  contentAfterButtons,
  data,
  goBack,
  goForward,
  setFormData,
}) => {
  const { assets } = data;
  const { cashOnHand } = assets;

  const [cash, setCash] = useState(cashOnHand);
  const ERR_MSG = 'Please enter a valid dollar amount';
  const [error, setError] = useState(null);

  const updateFormData = () => {
    if (!isValidCurrency(cash)) {
      return setError(ERR_MSG);
    }

    // update form data & gmtIsShort
    setFormData({
      ...data,
      assets: {
        ...data.assets,
        cashOnHand: cash,
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
          <h3 className="vads-u-margin--0">Cash on hand</h3>
        </legend>
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
        />
        {contentBeforeButtons}
        <FormNavButtons
          goBack={goBack}
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
    }),
  }),
  goBack: PropTypes.func,
  goForward: PropTypes.func,
  setFormData: PropTypes.func,
};

const CashOnHandReview = ({ data }) => {
  const { assets } = data;
  const { cashOnHand } = assets;

  return (
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
  );
};

CashOnHandReview.propTypes = {
  data: PropTypes.shape({
    assets: PropTypes.shape({
      cashOnHand: PropTypes.string,
    }),
  }),
};

export { CashOnHand, CashOnHandReview };
