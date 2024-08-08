import React from 'react';
import { useSelector } from 'react-redux';
import { canAccess } from '../../../common/selectors';
import { totalDisabilityError } from '../../../common/selectors/ratedDisabilities';
import { SingleFieldLoadFailAlert } from '../alerts/LoadFail';
import { API_NAMES } from '~/applications/personalization/common/constants';

const DisabilityRating = () => {
  const hasError = useSelector(totalDisabilityError);
  const rating = useSelector(state => state.totalRating?.totalDisabilityRating);
  const canAccessRatingInfo = useSelector(canAccess)?.[API_NAMES.RATING_INFO];

  const shouldShowRating = canAccessRatingInfo && rating;

  return (
    <div>
      {canAccessRatingInfo && hasError ? (
        <SingleFieldLoadFailAlert sectionName="disability rating information" />
      ) : (
        <p
          className="vads-u-margin-top--0 vads-u-margin-bottom--0p5"
          data-testid="disabilityRatingField"
        >
          {shouldShowRating
            ? `${rating}% service connected`
            : 'Our records show that you don’t have a disability rating.'}
        </p>
      )}

      <p className="vads-u-margin--0">
        <va-link
          href="/disability/view-disability-rating/rating"
          text={
            shouldShowRating
              ? 'Learn more about your disability rating'
              : 'Learn more about VA disability ratings'
          }
        />
      </p>

      <p>
        <va-link
          href="/resources/the-pact-act-and-your-va-benefits"
          text="PACT Act: Eligibility updates based on toxic exposure"
        />
      </p>
    </div>
  );
};

export default DisabilityRating;
