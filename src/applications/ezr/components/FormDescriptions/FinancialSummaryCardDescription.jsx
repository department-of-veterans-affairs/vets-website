import React from 'react';
import PropTypes from 'prop-types';
import { LAST_YEAR } from '../../utils/constants';
import { includeSpousalInformation } from '../../utils/helpers/form-config';

const SpousalFinancialInformation = formData => {
  return (
    <>
      <h4>Spouse’s annual income from {LAST_YEAR}</h4>
      <p className="vads-u-margin-bottom--0">
        Gross annual income:{' '}
        {formData['view:spouseGrossIncome']?.spouseGrossIncome}
      </p>
      <p className="vads-u-margin-y--0">
        Net annual income: {formData['view:spouseNetIncome']?.spouseNetIncome}
      </p>
      <p className="vads-u-margin-top--0">
        Other income: {formData['view:spouseOtherIncome']?.spouseOtherIncome}
      </p>
    </>
  );
};

const FinancialSummaryCardDescription = (item, props) => {
  const { formData } = props;
  const spouseHasIncomes =
    formData['view:spouseGrossIncome'] !== null &&
    formData['view:spouseNetIncome'] !== null &&
    formData['view:spouseOtherIncome'] !== null;

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
      {includeSpousalInformation(formData) && spouseHasIncomes ? (
        <SpousalFinancialInformation data={item} />
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
