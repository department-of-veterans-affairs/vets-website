import React from 'react';
import { useSelector } from 'react-redux';

export const useSelectorCallback = state => {
  return state?.form?.data || {};
};

const BenefitsDisclaimerCustomReviewField = () => {
  const formData = useSelector(useSelectorCallback);
  return (
    <>
      {formData?.primaryOfficialBenefitStatus?.['view:benefitsDisclaimer'] && (
        <div className="review-row">
          <>
            <dt>I understand</dt>
            <dd className="dd-privacy-hidden" data-dd-action-name="data value">
              Yes
            </dd>
          </>
        </div>
      )}
    </>
  );
};

export default BenefitsDisclaimerCustomReviewField;
