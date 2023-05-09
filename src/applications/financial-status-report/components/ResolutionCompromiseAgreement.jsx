import React, { useState, useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';
import FormNavButtons from 'platform/forms-system/src/js/components/FormNavButtons';
import { CurrentDebtTitle } from './CurrentDebtTitle';

const ResolutionCompromiseAgreement = ({
  goToPath,
  contentBeforeButtons,
  contentAfterButtons,
  formContext,
}) => {
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
    currentDebt.resolutionComment = event.target.value;
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

  const goBack = () => {
    return goToPath(`/resolution-option/${currentDebt.pagePerItemIndex}`);
  };

  const goForward = () => {
    return goToPath('/resolution-comments');
  };

  const getLabel =
    currentDebt.resolutionOption === 'monthly'
      ? 'How much can you afford to pay monthly on this debt?'
      : 'How much can you afford to pay as a one-time payment?';

  const getParagraphText =
    currentDebt.resolutionOption === 'monthly' ? (
      <div>
        <CurrentDebtTitle
          formContext={formContext || { pagePerItemIndex: 0 }}
        />
        <div className="vads-u-margin-y--0">
          <p className="vads-u-display--block">
            You selected:{' '}
            <span className="vads-u-font-weight--bold">
              Extended monthly payments
            </span>
          </p>

          <span className="vads-u-display--block vads-u-font-size--sm vads-u-margin-bottom--1">
            If we approve your request, you can make smaller monthly payments
            for up to 5 years with either monthly offsets or a monthly payment
            plan.
          </span>
        </div>
      </div>
    ) : (
      <div>
        <CurrentDebtTitle
          formContext={formContext || { pagePerItemIndex: 0 }}
        />
        <div className="vads-u-margin-y--0">
          <p className="vads-u-display--block">
            You selected:{' '}
            <span className="vads-u-font-weight--bold">Compromise</span>
          </p>

          <span className="vads-u-display--block vads-u-font-size--sm vads-u-margin-bottom--1">
            If you can’t pay the debt in full or make smaller monthly payments,
            we can consider a smaller, one-time payment to resolve your debt.
          </span>
        </div>
      </div>
    );

  return (
    <>
      <p>{getParagraphText}</p>
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
      {contentBeforeButtons}
      <FormNavButtons goBack={goBack} goForward={goForward} submitToContinue />
      {contentAfterButtons}
    </>
  );
};

export default ResolutionCompromiseAgreement;
