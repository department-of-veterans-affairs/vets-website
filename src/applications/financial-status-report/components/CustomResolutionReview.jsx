import React from 'react';
import { useSelector } from 'react-redux';
import { getDebtName, currency } from '../utils/helpers';

const CustomResolutionReview = () => {
  const formData = useSelector(state => state.form.data);
  const formContext = useSelector(state => state.form.formContext);
  const { selectedDebtsAndCopays = [] } = formData;

  const currentDebt =
    selectedDebtsAndCopays[formContext?.pagePerItemIndex || 0];
  const compromiseAmount = currentDebt?.resolutionComment || 0;

  return (
    <div className="review-row">
      <dt>
        Resolution amount for <strong>{getDebtName(currentDebt)}</strong>
      </dt>
      <dd>{currency(compromiseAmount)}</dd>
    </div>
  );
};

export default CustomResolutionReview;
