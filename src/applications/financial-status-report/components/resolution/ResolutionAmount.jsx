import React from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { setData } from 'platform/forms-system/src/js/actions';
import { VaNumberInput } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { isValidCurrency } from '../../utils/validations';

// Desciptions and labels for the two resolution options
const content = {
  debtMonthly: {
    type: 'Extended Monthly Payments',
    description:
      'If we approve your request, you can make smaller monthly payments for up to 5 years with either monthly offsets or a monthly payment plan.',
    label: 'How much can you afford to pay monthly on this debt?',
  },
  debtCompromise: {
    type: 'Compromise',
    description: `If you can't pay the debt in full or make smaller monthly payments, we can consider a smaller, one-time payment to resolve your debt.`,
    label: 'How much can you afford to pay as a one-time payment?',
  },
  copayCompromise: {
    type: 'Compromise',
    description: `If you can't pay the debt in full, we can consider a smaller, one-time payment to resolve your debt.`,
    label: 'How much can you afford to pay as a one-time payment?',
  },
};

const getError = (debt, resolutionAmount, submitted) => {
  // Copays and debts have current balances in different locations
  //  check type of debt and cooresponding current balance
  const overCurrent =
    (debt.debtType === 'DEBT' && debt?.currentAr <= debt.resolutionComment) ||
    (debt.debtType === 'COPAY' && debt?.pHAmtDue <= debt.resolutionComment);

  if (submitted) {
    if (!isValidCurrency(resolutionAmount)) {
      return 'Please enter valid dollar amount';
    }
    if (overCurrent) {
      return 'Please enter a dollar amount less than the current balance';
    }
  }
  return null;
};

const ResolutionAmount = ({ formContext }) => {
  const dispatch = useDispatch();
  const formData = useSelector(state => state.form.data);

  const { selectedDebtsAndCopays = [] } = formData;
  const currentDebt =
    selectedDebtsAndCopays[formContext?.pagePerItemIndex || 0];

  const resolutionAmount = currentDebt?.resolutionComment ?? 0;
  const { resolutionOption } = currentDebt;

  const onAmountChange = ({ target }) => {
    const newlySelectedDebtsAndCopays = selectedDebtsAndCopays.map(debt => {
      if (debt.id === currentDebt.id) {
        return {
          ...debt,
          resolutionComment: target.value,
        };
      }
      return debt;
    });

    return dispatch(
      setData({
        ...formData,
        selectedDebtsAndCopays: newlySelectedDebtsAndCopays,
      }),
    );
  };

  const errorMessage = getError(
    currentDebt,
    resolutionAmount,
    formContext.submitted,
  );

  const getResolutionText = () => {
    if (currentDebt.debtType === 'COPAY') {
      return content.copayCompromise.description;
    }
    if (currentDebt.debtType === 'DEBT' && resolutionOption === 'monthly') {
      return content.debtMonthly.description;
    }

    return content.debtCompromise.description;
  };

  return (
    <div>
      <div className="vads-u-margin-y--0">
        <p className="vads-u-display--block">
          You selected:{' '}
          <span className="vads-u-font-weight--bold">
            {resolutionOption === 'monthly'
              ? content.debtMonthly.type
              : content.debtCompromise.type}
          </span>
        </p>
        <span className="vads-u-display--block vads-u-font-size--sm vads-u-margin-bottom--1">
          {getResolutionText()}
        </span>
      </div>
      <VaNumberInput
        className="no-wrap input-size-3"
        data-testid="resolution-amount"
        error={errorMessage}
        id={currentDebt.id}
        inputmode="decimal"
        label={
          resolutionOption === 'monthly'
            ? content.debtMonthly.label
            : content.debtCompromise.label
        }
        min={0}
        max={
          currentDebt.debtType === 'DEBT'
            ? currentDebt?.currentAr
            : currentDebt.pHAmtDue
        }
        name="resolution-amount"
        onInput={onAmountChange}
        required
        currency
        type="text"
        value={resolutionAmount || ''}
        uswds
      />
    </div>
  );
};

// pagePerItemIndex is string in form, and populates as number in reivew page edit mode
ResolutionAmount.propTypes = {
  formContext: PropTypes.shape({
    pagePerItemIndex: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    submitted: PropTypes.bool,
  }),
};

export default ResolutionAmount;
