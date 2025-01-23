import React from 'react';
import { useSelector } from 'react-redux';
import { formatCurrency } from '../../utils/helpers/general';

// eslint-disable-next-line react/prop-types
const PreviousGrossIncome = ({ isVeteranIncome = true }) => {
  const { parsedData } = useSelector(state => state.veteranPrefillData);
  const grossIncome =
    isVeteranIncome === true
      ? `${parsedData?.veteranIncome?.grossIncome}`
      : `${parsedData?.spouseIncome?.grossIncome}`;

  return (
    <>
      <div className="vads-u-background-color--gray-lightest">
        <va-card background>
          <h4 className="vads-u-margin-y--0 vads-u-font-weight--bold">
            Gross income last year
          </h4>
          <p className="vads-u-margin-y--0">{formatCurrency(grossIncome)}</p>
        </va-card>
      </div>
    </>
  );
};

export const GrossIncomeDescription = () => {
  return (
    <>
      <va-additional-info
        trigger="What we consider gross annual income"
        class="vads-u-margin-top--1 vads-u-margin-bottom--4 hydrated"
        uswds
      >
        <div>
          <p className="vads-u-font-weight--bold vads-u-margin-top--0">
            Gross income includes these types of income from a job:
          </p>
          <ul className="vads-u-margin-bottom--0">
            <li>Wages</li>
            <li>Bonuses</li>
            <li>Tips</li>
            <li>Severance pay</li>
          </ul>
        </div>
      </va-additional-info>
      <PreviousGrossIncome />
    </>
  );
};

export const OtherIncomeDescription = (
  <va-additional-info
    trigger="What we consider other annual income"
    class="vads-u-margin-top--1 vads-u-margin-bottom--4 hydrated"
    uswds
  >
    <div>
      <p className="vads-u-font-weight--bold vads-u-margin-top--0">
        Other income includes things like this:
      </p>
      <ul className="vads-u-margin-bottom--0">
        <li>Retirement benefits</li>
        <li>Unemployment</li>
        <li>VA benefit compensation</li>
        <li>Money from the sale of a house</li>
        <li>Interest from investments</li>
      </ul>
    </div>
  </va-additional-info>
);
