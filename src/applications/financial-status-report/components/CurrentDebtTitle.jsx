import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { deductionCodes } from '../constants/deduction-codes';
import { currency } from '../utils/helpers';

export const CurrentDebtTitle = ({ formContext }) => {
  const formData = useSelector(state => state.form.data);
  const { selectedDebtsAndCopays = [] } = formData;
  const currentDebt = selectedDebtsAndCopays[formContext.pagePerItemIndex];
  const { deductionCode, benefitType } = currentDebt;

  return (
    <div>
      <h3 className="vads-u-margin-top--neg1p5">
        Debt {parseInt(formContext.pagePerItemIndex, 10) + 1} of{' '}
        {selectedDebtsAndCopays.length}:{' '}
        {currentDebt.debtType === 'COPAY'
          ? `${currency(currentDebt.pHAmtDue)} Copay debt for ${
              currentDebt.station.facilityName
            }`
          : `${currency(currentDebt.currentAr)} ${deductionCodes[
              deductionCode
            ] || benefitType}`}
      </h3>{' '}
    </div>
  );
};

export const CurrentDebtDescription = ({ formContext }) => {
  const formData = useSelector(state => state.form.data);
  const { selectedDebtsAndCopays = [] } = formData;
  const currentDebt = selectedDebtsAndCopays[formContext.pagePerItemIndex];

  let formattedDebtTitleDescription = <></>;

  if (currentDebt.resolutionOption === 'monthly') {
    formattedDebtTitleDescription = (
      <p className="vads-u-margin-y--0">
        <p className="vads-u-display--block">
          You selected:{' '}
          <span className="vads-u-font-weight--bold">
            Extended monthly payments
          </span>
        </p>

        <span className="vads-u-display--block vads-u-font-size--sm vads-u-margin-bottom--1">
          If we approve your request, you can make smaller monthly payments for
          up to 5 years with either monthly offsets or a monthly payment plan.
        </span>

        <span className="vads-u-display--block vads-u-font-size--sm vads-u-margin-bottom--1">
          How much can you afford to pay monthly on this debt?
        </span>
      </p>
    );
  } else if (currentDebt.resolutionOption === 'compromise') {
    formattedDebtTitleDescription = (
      <p className="vads-u-margin-y--0">
        <p className="vads-u-display--block">
          You selected:{' '}
          <span className="vads-u-font-weight--bold">Compromise</span>
        </p>

        <span className="vads-u-display--block vads-u-font-size--sm vads-u-margin-bottom--1">
          If you can’t pay the debt in full or make smaller monthly payments, we
          can consider a smaller, one-time payment to resolve your debt.
        </span>
      </p>
    );
  } else {
    formattedDebtTitleDescription = (
      <p>Which repayment or relief option would you like for your</p>
    );
  }
  return <p>{formattedDebtTitleDescription}</p>;
};

// pagePerItemIndex is string in form, and populates as number in reivew page edit mode
CurrentDebtTitle.propTypes = {
  formContext: PropTypes.shape({
    pagePerItemIndex: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
      .isRequired,
  }),
};

CurrentDebtDescription.propTypes = {
  formContext: PropTypes.shape({
    pagePerItemIndex: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
      .isRequired,
    pageTitle: PropTypes.string.isRequired,
  }),
};
