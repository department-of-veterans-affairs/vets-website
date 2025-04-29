import React from 'react';
import { useSelector } from 'react-redux';
import { calculatedPercentage } from '../utilities';

export const useSelectorCallback = state => {
  return state?.form?.data || {};
};

const CustomReviewField = () => {
  const formData = useSelector(useSelectorCallback);
  return (
    <div className="review-row">
      <dt>VA beneficiary students percentage (calculated)</dt>
      <dd className="dd-privacy-hidden" data-dd-action-name="data value">
        {calculatedPercentage(formData)}
      </dd>
    </div>
  );
};

export default CustomReviewField;
