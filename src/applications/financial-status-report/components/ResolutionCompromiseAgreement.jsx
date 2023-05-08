import React, { useState, useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';

const ResolutionWaiverAgreement = props => {
  const { formContext } = props;
  const formData = useSelector(state => state.form.data);

  const { selectedDebtsAndCopays = [] } = formData;
  const currentDebt =
    selectedDebtsAndCopays[formContext?.pagePerItemIndex || 0];

  const [compromiseAmount, setCompromiseAmount] = useState({
    value: currentDebt.resolutionComment,
    dirty: false,
  });

  const setNewCompromiseAmount = event => {
    setCompromiseAmount({ value: event.target.value, dirty: true });
  };

  const [compromiseAmountError, setCompromiseAmountError] = useState(false);

  const validateCompromiseAmount = useCallback(
    () => {
      const regex = /(?=.*?\d)^\$?(([1-9]\d{0,2}(,\d{3})*)|\d+)?(\.\d{1,2})?$/;

      if (
        !compromiseAmount.value ||
        (compromiseAmount.value &&
          (!regex.test(compromiseAmount.value) ||
            Number(compromiseAmount.value) < 0))
      ) {
        setCompromiseAmountError(true);
      } else {
        setCompromiseAmountError(false);
      }
    },
    [compromiseAmount],
  );

  useEffect(
    () => {
      validateCompromiseAmount();
    },
    [compromiseAmountError, compromiseAmount, validateCompromiseAmount],
  );

  const getLabel =
    currentDebt.resolutionOption === 'monthly'
      ? 'How much can you afford to pay monthly on this debt?'
      : 'How much can you afford to pay as a one-time payment?';

  return (
    <>
      <va-number-input
        inputmode="numeric"
        id="compromise-amount"
        currency
        required
        label={getLabel}
        data-testid="compromise-amount"
        name="compromise-amount"
        onInput={setNewCompromiseAmount}
        type="text"
        value={compromiseAmount.value}
        aria-describedby="compromise-amount-description"
        error={
          compromiseAmountError && compromiseAmount.dirty
            ? `Please enter a valid number.`
            : ''
        }
      />
    </>
  );
};

export default ResolutionWaiverAgreement;
