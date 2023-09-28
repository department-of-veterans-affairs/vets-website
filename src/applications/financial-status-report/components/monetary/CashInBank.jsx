import React, { useState } from 'react';
import PropTypes from 'prop-types';
import FormNavButtons from 'platform/forms-system/src/js/components/FormNavButtons';
import { VaNumberInput } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { isValidCurrency } from '../../utils/validations';
import { safeNumber } from '../../utils/calculateIncome';

const CashInBank = ({
  contentBeforeButtons,
  contentAfterButtons,
  data,
  goBack,
  goForward,
  setFormData,
}) => {
  const { assets, gmtData } = data;
  const { cashOnHand = 0, monetaryAssets = [] } = assets;

  const cashInBankTotal = monetaryAssets.find(
    f => f.name === 'Cash in a bank (savings and checkings)',
  ) ?? { name: 'Cash in a bank (savings and checkings)', amount: '' };

  const [cash, setCash] = useState(cashInBankTotal.amount);
  const ERR_MSG = 'Please enter a valid dollar amount';
  const [error, setError] = useState(null);

  const updateFormData = () => {
    if (!isValidCurrency(cash)) {
      return setError(ERR_MSG);
    }

    const totalLiquidCash = safeNumber(cash) + safeNumber(cashOnHand);

    const newMonetaryAssetsArray = monetaryAssets.filter(
      asset => asset.name !== 'Cash in a bank (savings and checkings)',
    );

    // update form data & gmtIsShort
    setFormData({
      ...data,
      assets: {
        ...data.assets,
        monetaryAssets: [
          ...newMonetaryAssetsArray,
          { name: 'Cash in a bank (savings and checkings)', amount: cash },
        ],
      },
      gmtData: {
        ...gmtData,
        assetsBelowGmt: totalLiquidCash < gmtData?.assetThreshold,
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
      cashInBank: PropTypes.string,
    }),
    gmtData: PropTypes.shape({
      assetThreshold: PropTypes.number,
    }),
  }),
  goBack: PropTypes.func,
  goForward: PropTypes.func,
  setFormData: PropTypes.func,
};

// const CashInBankReview = ({ data }) => {
//   const { assets } = data;
//   const { cashInBank } = assets;

//   return (
//     <div className="form-review-panel-page">
//       <div className="form-review-panel-page-header-row">
//         <h4 className="form-review-panel-page-header vads-u-font-size--h5">
//           Cash in bank
//         </h4>
//       </div>
//       <dl className="review">
//         <div className="review-row">
//           <dt>Cash in a bank (savings and checkings)</dt>
//           <dd>{currencyFormatter(cashInBank)}</dd>
//         </div>
//       </dl>
//     </div>
//   );
// };

// CashInBankReview.propTypes = {
//   data: PropTypes.shape({
//     assets: PropTypes.shape({
//       cashInBank: PropTypes.string,
//     }),
//   }),
// };

export { CashInBank };
