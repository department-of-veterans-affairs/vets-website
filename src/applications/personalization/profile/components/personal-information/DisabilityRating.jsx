import React from 'react';
import { useSelector } from 'react-redux';
import { totalDisabilityError } from '~/applications/personalization/rated-disabilities/selectors';
import { SingleFieldLoadFailAlert } from '../alerts/LoadFail';

const DisabilityRating = () => {
  const hasError = useSelector(totalDisabilityError);
  const rating = useSelector(state => state.totalRating?.totalDisabilityRating);

  return (
    <div>
      {hasError ? (
        <SingleFieldLoadFailAlert sectionName="disability rating information" />
      ) : (
        <p className="vads-u-margin-top--0 vads-u-margin-bottom--0p5">
          {rating
            ? `${rating}% service connected`
            : 'Our records show that you don’t have a disability rating.'}
        </p>
      )}

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
