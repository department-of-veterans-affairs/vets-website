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
          ? `Copay debt for ${currentDebt.station.facilityName}`
          : deductionCodes[deductionCode] || benefitType}
      </h3>{' '}
    </div>
  );
};

export const CurrentDebtDescription = ({ formContext }) => {
  const formData = useSelector(state => state.form.data);

  const { selectedDebtsAndCopays = [] } = formData;
  const currentDebt = selectedDebtsAndCopays[formContext.pagePerItemIndex];

  const formattedDebtTitle =
    currentDebt.debtType === 'COPAY'
      ? `${currency(currentDebt.pHAmtDue)} copay debt  ${
          currentDebt.station ? `for ${currentDebt.station.facilityName}` : ''
        }`
      : `${currency(currentDebt.currentAr)} debt for ${
          deductionCodes[currentDebt.deductionCode]
        }` || currentDebt.benefitType;

  return (
    <p>
      Which repayment or relief option would you like for your{' '}
      <strong>{formattedDebtTitle}</strong>?{' '}
      <span className="required-text">(*Required)</span>
    </p>
  );
};

CurrentDebtTitle.propTypes = {
  formContext: PropTypes.shape({
    pagePerItemIndex: PropTypes.number.isRequired,
  }),
};

CurrentDebtDescription.propTypes = {
  formContext: PropTypes.shape({
    pagePerItemIndex: PropTypes.number.isRequired,
  }),
};
