import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { LAST_YEAR } from '../../utils/constants';
import { includeSpousalInformation } from '../../utils/helpers/form-config';

const SpousalFinancialOverviewInformation = props => {
  const { data } = props;
  return (
    <>
      <h4>Spouse’s annual income from {LAST_YEAR}</h4>
      <p className="vads-u-margin-bottom--0">
        Gross annual income:{' '}
        {data?.['view:spouseGrossIncome']?.spouseGrossIncome}
      </p>
      <p className="vads-u-margin-y--0">
        Net annual income: {data?.['view:spouseNetIncome']?.spouseNetIncome}
      </p>
      <p className="vads-u-margin-top--0">
        Other income: {data?.['view:spouseOtherIncome']?.spouseOtherIncome}
      </p>
    </>
  );
};

SpousalFinancialOverviewInformation.propTypes = {
  data: PropTypes.any,
};

const FinancialOverviewDescription = item => {
  const { data } = useSelector(state => state?.form);

  return (
    <>
      <h4>Your annual income from {LAST_YEAR}</h4>
      <p className="vads-u-margin-bottom--0">
        Gross annual income:{' '}
        {item?.['view:veteranGrossIncome']?.veteranGrossIncome}
      </p>
      <p className="vads-u-margin-y--0">
        Net annual income: {item?.['view:veteranNetIncome']?.veteranNetIncome}
      </p>
      <p className="vads-u-margin-top--0">
        Other income: {item?.['view:veteranOtherIncome']?.veteranOtherIncome}
      </p>
      {includeSpousalInformation(data) &&
      data?.financialInformation[0]?.['view:spouseGrossIncome'] ? (
        <SpousalFinancialOverviewInformation data={item} />
      ) : (
        ''
      )}
      <h4>Deductible expenses from {LAST_YEAR}</h4>
      <p className="vads-u-margin-bottom--0">
        Gross annual income:{' '}
        {item?.['view:deductibleMedicalExpenses']?.deductibleMedicalExpenses}
      </p>
      <p className="vads-u-margin-y--0">
        Net annual income:{' '}
        {
          item?.['view:deductibleEducationExpenses']
            ?.deductibleEducationExpenses
        }
      </p>
      <p className="vads-u-margin-top--0">
        Other income:{' '}
        {item?.['view:deductibleFuneralExpenses']?.deductibleFuneralExpenses}
      </p>
    </>
  );
};

export default FinancialOverviewDescription;
