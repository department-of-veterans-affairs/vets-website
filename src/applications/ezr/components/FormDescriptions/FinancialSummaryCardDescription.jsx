import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { LAST_YEAR } from '../../utils/constants';
import { includeSpousalInformation } from '../../utils/helpers/form-config';

const SpousalFinancialInformation = item => {
  return (
    <>
      <h4>Spouse’s annual income from {LAST_YEAR}</h4>
      <p className="vads-u-margin-bottom--0">
        Gross annual income: {item['view:spouseGrossIncome'].spouseGrossIncome}
      </p>
      <p className="vads-u-margin-y--0">
        Net annual income: {item['view:spouseNetIncome'].spouseNetIncome}
      </p>
      <p className="vads-u-margin-top--0">
        Other income: {item['view:spouseOtherIncome'].spouseOtherIncome}
      </p>
    </>
  );
};

const FinancialSummaryCardDescription = item => {
  // Hide the 'Delete' button within the summary card
  useEffect(() => {
    const deleteButton = document.querySelector(
      'va-card va-button-icon[data-action="remove"]',
    );

    if (deleteButton) {
      deleteButton.style.display = 'none';
    }
  });

  const spouseHasIncomes =
    item?.['view:spouseGrossIncome'] !== null &&
    item?.['view:spouseNetIncome'] !== null &&
    item?.['view:spouseOtherIncome'] !== null;

  return item !== null ? (
    <>
      <h4>Your annual income from {LAST_YEAR}</h4>
      <p className="vads-u-margin-bottom--0">
        Gross annual income:{' '}
        {item['view:veteranGrossIncome'].veteranGrossIncome}
      </p>
      <p className="vads-u-margin-y--0">
        Net annual income: {item['view:veteranNetIncome'].veteranNetIncome}
      </p>
      <p className="vads-u-margin-top--0">
        Other income: {item['view:veteranOtherIncome'].veteranOtherIncome}
      </p>
      {includeSpousalInformation(item) && spouseHasIncomes ? (
        <SpousalFinancialInformation item={item} />
      ) : (
        ''
      )}
      <h4>Deductible expenses from {LAST_YEAR}</h4>
      <p className="vads-u-margin-bottom--0">
        Gross annual income:{' '}
        {item['view:deductibleMedicalExpenses'].deductibleMedicalExpenses}
      </p>
      <p className="vads-u-margin-y--0">
        Net annual income:{' '}
        {item['view:deductibleEducationExpenses'].deductibleEducationExpenses}
      </p>
      <p className="vads-u-margin-top--0">
        Other income:{' '}
        {item['view:deductibleFuneralExpenses'].deductibleFuneralExpenses}
      </p>
    </>
  ) : null;
};

FinancialSummaryCardDescription.propTypes = {
  formData: PropTypes.object,
};

export default FinancialSummaryCardDescription;
