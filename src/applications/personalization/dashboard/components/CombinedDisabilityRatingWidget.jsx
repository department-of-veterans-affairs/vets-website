import React from 'react';
import CTALink from './CTALink';

const CombinedDisabilityRatingWidget = () => {
  const totalDisabilityRating = 0;
  return (
    <va-card>
      <h4 className="vads-u-margin-top--0">
        Your combined disability rating is {totalDisabilityRating}%
      </h4>
      <p>
        <CTALink
          href="/disability/view-disability-rating"
          text="Review your VA disability rating"
          className="vads-u-font-weight--bold"
          showArrow
        />
        {/*
        <va-link
          href="/disability/view-disability-rating"
          text="Review your VA disability rating"
        />
        */}
      </p>
    </va-card>
  );
};

export default CombinedDisabilityRatingWidget;
