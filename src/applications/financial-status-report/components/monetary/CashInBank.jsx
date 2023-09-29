import React, { useState } from 'react';
import PropTypes from 'prop-types';
import FormNavButtons from 'platform/forms-system/src/js/components/FormNavButtons';
import { VaNumberInput } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { isValidCurrency } from '../../utils/validations';
import { safeNumber } from '../../utils/calculateIncome';

const CASH_IN_BANK = 'Cash in a bank (savings and checkings)';
const CASH_ON_HAND = 'Cash on hand (not in bank)';

const CashInBank = ({
  contentBeforeButtons,
  contentAfterButtons,
  data,
  goBack,
  goForward,
  setFormData,
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

    const liquidCash = safeNumber(cash) + safeNumber(cashOnHandTotal);

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
        <VaNumberInput
          currency
          error={error}
          hint={null}
          id="cash"
          inputmode="decimal"
          label="What is the dollar amount of all checkings and savings accounts?"
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
  setFormData: PropTypes.func,
};

export default CashInBank;
