import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { deductionCodes } from '../../constants/deduction-codes';
import { currency } from '../../utils/helpers';

export const CurrentDebtTitle = ({ formContext }) => {
  const formData = useSelector(state => state.form.data);
  const { selectedDebtsAndCopays = [] } = formData;
  const currentDebt = selectedDebtsAndCopays[formContext.pagePerItemIndex];

  const invalidPagesForTitleSubtext = [
    'Select resolution option',
    'Resolution Amount',
  ];

  const formattedDebtTitle =
    currentDebt.debtType === 'COPAY'
      ? `${currency(currentDebt.pHAmtDue)} copay debt  ${
          currentDebt.station ? `for ${currentDebt.station.facilityName}` : ''
        }`
      : `${currency(currentDebt.currentAr)} debt for ${
          deductionCodes[currentDebt.deductionCode]
        }` || currentDebt.benefitType;

  return (
    <legend className="schemaform-block-title">
      <h3 className="vads-u-margin--0">
        Debt {parseInt(formContext.pagePerItemIndex, 10) + 1} of{' '}
        {selectedDebtsAndCopays.length}: {formattedDebtTitle}
      </h3>{' '}
      {!invalidPagesForTitleSubtext.includes(formContext.pageTitle) && (
        <div>
          <p className="vads-u-margin-bottom--neg1 vads-u-margin-top--3 vads-u-padding-bottom--0p25 vads-u-margin-top--3 vads-u-font-family--sans vads-u-font-weight--normal vads-u-font-size--base">
            Which repayment or relief option would you like for your{' '}
            <strong>{formattedDebtTitle}</strong>?
          </p>
        </div>
      )}
    </legend>
  );
};

// pagePerItemIndex is string in form, and populates as number in reivew page edit mode
CurrentDebtTitle.propTypes = {
  formContext: PropTypes.shape({
    pagePerItemIndex: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
      .isRequired,
  }),
};
