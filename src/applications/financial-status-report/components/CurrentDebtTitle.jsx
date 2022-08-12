import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { deductionCodes } from '../../debt-letters/const/deduction-codes';
import { currency } from '../utils/helpers';

const CurrentDebtTitle = ({ formContext }) => {
  const formData = useSelector(state => state.form.data);

  const { selectedDebtsAndCopays = [] } = formData;
  const currentDebt = selectedDebtsAndCopays[formContext.pagePerItemIndex];
  const { deductionCode, benefitType } = currentDebt;
  const formattedDebtTitle =
    currentDebt.debtType === 'COPAY'
      ? `${currency(currentDebt.pHAmtDue)} copay debt for ${
          currentDebt.station.facilityName
        }`
      : `${currency(currentDebt.originalAr - currentDebt.currentAr)} debt for${
          deductionCodes[deductionCode]
        }` || benefitType;

  return (
    <div>
      <h3>
        Debt {parseInt(formContext.pagePerItemIndex, 10) + 1} of{' '}
        {selectedDebtsAndCopays.length}:{' '}
        {currentDebt.debtType === 'COPAY'
          ? `Copay debt for ${currentDebt.station.facilityName}`
          : deductionCodes[deductionCode] || benefitType}
      </h3>
      <p>
        Which repayment or relief option would you like for your{' '}
        <strong>{formattedDebtTitle}</strong>?{' '}
        <span className="required-text">(*Required)</span>
      </p>
    </div>
  );
};

CurrentDebtTitle.propTypes = {
  formContext: PropTypes.shape({
    pagePerItemIndex: PropTypes.string.isRequired,
  }),
};

export default CurrentDebtTitle;
