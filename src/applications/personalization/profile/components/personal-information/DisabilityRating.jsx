import React from 'react';
import { useSelector } from 'react-redux';
import { hasTotalDisabilityServerError } from '~/applications/personalization/rated-disabilities/selectors';

const ErrorAlert = () => (
  <va-alert status="warning" visible background-only>
    We’re sorry. Something went wrong on our end and we can’t load your
    disability information. Please try again later.
  </va-alert>
);

const DisabilityRating = () => {
  const hasError = useSelector(state => hasTotalDisabilityServerError(state));
  const rating = useSelector(state => state.totalRating?.totalDisabilityRating);

  return (
    <div>
      <p className="vads-u-margin-top--0 vads-u-margin-bottom--0p5">
        {!rating && !hasError
          ? `${rating}% service connected`
          : 'Our records show that you don’t have a disability rating.'}
        {hasError && <ErrorAlert />}
      </p>

      <p className="vads-u-margin--0">
        <a href="/disability/view-disability-rating/rating">
          {rating
            ? 'Learn more about your disability rating'
            : 'Learn more about VA disability ratings'}
        </a>
      </p>

      <p>
        <a href="/resources/the-pact-act-and-your-va-benefits">
          PACT Act: Eligibility updates based on toxic exposure
        </a>
      </p>
    </div>
  );
};

export default DisabilityRating;
