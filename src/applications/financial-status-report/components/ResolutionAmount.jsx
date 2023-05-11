import React, { useState } from 'react';
import PropTypes from 'prop-types';
import FormNavButtons from 'platform/forms-system/src/js/components/FormNavButtons';
import { VaNumberInput } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { CurrentDebtTitle } from './CurrentDebtTitle';
import { setFocus } from '../utils/fileValidation';
import { isValidCurrency } from '../utils/validations';

const ResolutionAmount = ({
  contentBeforeButtons,
  contentAfterButtons,
  goBack,
  goForward,
  pagePerItemIndex,
  data,
  setFormData,
}) => {
  const { selectedDebtsAndCopays = [] } = data;
  const currentDebt = selectedDebtsAndCopays[pagePerItemIndex || 0];
  const errorMessage = 'Please enter a valid dollar amount.';

  const [resolutionAmount, setResolutionAmount] = useState(
    currentDebt.resolutionComment,
  );
  const [error, setError] = useState(
    isValidCurrency(resolutionAmount) ? null : errorMessage,
  );
  const [submitted, setSubmitted] = useState(false);

  const onChange = ({ target }) => {
    setResolutionAmount(target.value);
    setError(isValidCurrency(target.value) ? null : errorMessage);
  };

  const nextPage = event => {
    setSubmitted(true);
    event.preventDefault();

    if (!error) {
      const newDebts = selectedDebtsAndCopays.map((debt, index) => {
        if (index === Number(pagePerItemIndex)) {
          return {
            ...debt,
            resolutionComment: resolutionAmount,
          };
        }
        return debt;
      });

      setFormData({
        ...data,
        selectedDebtsAndCopays: [...newDebts],
      });
      return goForward(data);
    }

    setFocus('[name="resolution-amount"]');
    return null;
  };

  const getLabel =
    currentDebt.resolutionOption === 'monthly'
      ? 'How much can you afford to pay monthly on this debt?'
      : 'How much can you afford to pay as a one-time payment?';

  const getParagraphText =
    currentDebt.resolutionOption === 'monthly' ? (
      <div>
        <CurrentDebtTitle formContext={{ pagePerItemIndex }} />
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
        <CurrentDebtTitle formContext={{ pagePerItemIndex }} />
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
      {getParagraphText}
      <VaNumberInput
        inputmode="numeric"
        id="resolution-amount"
        currency
        required
        label={getLabel}
        data-testid="resolution-amount"
        name="resolution-amount"
        onInput={onChange}
        type="text"
        value={resolutionAmount}
        aria-describedby="resolution-amount-description"
        error={(submitted && error) || null}
      />
      {contentBeforeButtons}
      <FormNavButtons goBack={goBack} goForward={nextPage} submitToContinue />
      {contentAfterButtons}
    </>
  );
};

ResolutionAmount.propTypes = {
  contentAfterButtons: PropTypes.node,
  contentBeforeButtons: PropTypes.node,
  data: PropTypes.shape({
    selectedDebtsAndCopays: PropTypes.arrayOf(
      PropTypes.shape({
        resolutionComment: PropTypes.string,
      }),
    ),
  }),
  goBack: PropTypes.func,
  goForward: PropTypes.func,
  goToPath: PropTypes.func,
  pagePerItemIndex: PropTypes.string,
  setFormData: PropTypes.func,
};

export default ResolutionAmount;
