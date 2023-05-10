import React from 'react';
import { useSelector } from 'react-redux';
import { getDebtName, currency } from '../utils/helpers';

export const CustomResolutionReviewContent = ({ debt }) => {
  const compromiseAmount = debt?.resolutionComment || 0;

  return (
    <div className="review-row">
      <dt>
        Resolution amount for <strong>{getDebtName(debt)}</strong>
      </dt>
      <dd>{currency(compromiseAmount)}</dd>
    </div>
  );
};

const CustomResolutionReview = () => {
  const formData = useSelector(state => state.form.data);
  const { selectedDebtsAndCopays = [] } = formData;

  return selectedDebtsAndCopays
    .filter(debt => debt.isSelected) // Only consider the selected debt
    .map((debt, index) => (
      <CustomResolutionReviewContent debt={debt} key={index} />
    ));
};

export default CustomResolutionReview;
