import React from 'react';
import { formatCurrency } from '../../utils/helpers/general';

// eslint-disable-next-line react/prop-types
const PreviousGrossIncome = (veteranData, { isVeteranIncome = true }) => {
  const grossIncome =
    isVeteranIncome === true
      ? `${veteranData?.veteranIncome?.grossIncome}`
      : `${veteranData?.spouseIncome?.grossIncome}`;

  return (
    <>
      <div className="vads-u-background-color--gray-lightest">
        <va-card background>
          <h4 className="vads-u-margin-y--0 vads-u-font-weight--bold">
            Your {isVeteranIncome ? '' : "spouse's"} gross annual income from{' '}
            {isVeteranIncome
              ? veteranData.incomeYear
              : veteranData.spouseIncomeYear}
          </h4>
          <p className="vads-u-margin-y--0">{formatCurrency(grossIncome)}</p>
        </va-card>
      </div>
    </>
  );
};

export const GrossIncomeDescription = (props, { isVeteranIncome = true }) => {
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
      <PreviousGrossIncome
        isVeteranIncome={isVeteranIncome}
        veteranData={props.veteranPrefillData.parsedData}
      />
    </>
  );
};

// const PreviousNetIncome = (veteranData, { isVeteranIncome = true }) => {
//   const netIncome =
//     isVeteranIncome === true
//       ? `${veteranData?.veteranIncome?.netIncome}`
//       : `${veteranData?.spouseIncome?.netIncome}`;
//
//   return (
//     <>
//       <div className="vads-u-background-color--gray-lightest">
//         <va-card background>
//           <h4 className="vads-u-margin-y--0 vads-u-font-weight--bold">
//             Your {isVeteranIncome ? '' : "spouse's"} net income from{' '}
//             {isVeteranIncome
//               ? veteranData.incomeYear
//               : veteranData.spouseIncomeYear}
//           </h4>
//           <p className="vads-u-margin-y--0">{formatCurrency(netIncome)}</p>
//         </va-card>
//       </div>
//     </>
//   );
// };

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
