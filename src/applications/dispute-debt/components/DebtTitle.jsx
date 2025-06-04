import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { currency } from '../utils';
import { deductionCodes } from '../constants';

function DebtTitle({ formContext }) {
  const formData = useSelector(state => state.form.data);
  const { selectedDebts = [] } = formData;
  const currentDebt = selectedDebts[formContext.pagePerItemIndex];

  if (!currentDebt) {
    return (
      <legend className="schemaform-block-title">
        <h3 className="vads-u-margin--0">
          Debt {parseInt(formContext.pagePerItemIndex, 10) + 1} of{' '}
          {selectedDebts.length}: Reason for dispute
        </h3>
      </legend>
    );
  }

  const amount = currentDebt.currentAr || currentDebt.originalAr || 0;
  const debtTitle =
    currentDebt.label || deductionCodes[currentDebt.deductionCode] || 'VA debt';
  const total = selectedDebts.length;
  const debtNumber = parseInt(formContext.pagePerItemIndex, 10) + 1;

  return (
    <legend className="schemaform-block-title">
      <h3 className="vads-u-margin--0 vads-u-font-size--h2">
        Debt {debtNumber} of {total}:{' '}
        {currentDebt.label || `${currency(amount)} for ${debtTitle}`}
      </h3>
    </legend>
  );
}

DebtTitle.propTypes = {
  formContext: PropTypes.shape({
    pagePerItemIndex: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
      .isRequired,
  }),
};

export default DebtTitle;
