import React from 'react';
import { useSelector } from 'react-redux';

export const useSelectorCallback = state => {
  return state?.form?.data || {};
};

const TrainingExemptCustomReviewField = () => {
  const formData = useSelector(useSelectorCallback);
  return (
    <>
      {formData?.primaryOfficialTraining?.trainingExempt && (
        <div className="review-row">
          <dt>
            Enter the date the required annual Section 305 training was
            completed.
          </dt>
          <dd className="dd-privacy-hidden" data-dd-action-name="data value">
            Exempt
          </dd>
        </div>
      )}
    </>
  );
};

export default TrainingExemptCustomReviewField;
