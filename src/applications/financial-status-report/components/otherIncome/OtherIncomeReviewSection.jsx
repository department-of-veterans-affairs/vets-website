import React from 'react';
import { currency as currencyFormatter } from '../../utils/helpers';

const OtherIncomeReviewSection = (recordArray, isSpouse) => {
  return (
    <>
      <h4>{isSpouse ? "Spouse's additional income" : 'Additional income'}</h4>
      <dl className="review">
        {recordArray.map((income, index) => {
          return (
            <div
              className="review-row"
              key={income.name + income.amount + index}
            >
              <dt>{income.name}</dt>
              <dd>{currencyFormatter(income.amount)}</dd>
            </div>
          );
        })}
      </dl>
    </>
  );
};

export default OtherIncomeReviewSection;
