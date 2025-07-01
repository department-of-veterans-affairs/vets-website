import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import CTALink from '../CTALink';
import { hasTotalDisabilityServerError } from '../../../common/selectors/ratedDisabilities';

const DisabilityRatingCard = ({
  totalDisabilityRating,
  totalDisabilityRatingServerError,
}) => {
  const noRatingReviewLink = (
    <p className="vads-u-margin-top--2 vads-u-margin-bottom--0">
      <va-link
        href="/disability/view-disability-rating"
        text="Review your VA disability rating"
      />
    </p>
  );

  if (!totalDisabilityRatingServerError) {
    if (totalDisabilityRating != null) {
      // User has a disability rating
      return (
        <va-card>
          <h4 className="vads-u-margin-y--0 vads-u-padding-bottom--1">
            Your combined disability rating is {totalDisabilityRating}%
          </h4>
          <p className="vads-u-margin-y--0 vads-u-margin-top--0p5 vads-u-padding-y--1">
            <CTALink
              href="/disability/view-disability-rating/rating"
              text="Review your VA disability rating"
              className="vads-u-font-weight--bold"
              showArrow
            />
          </p>
        </va-card>
      );
    }

    // User does not have a disability rating
    return (
      <>
        <p className="vads-u-margin-y--neg1">
          We don’t have a combined disability rating on file for you.
        </p>
        {noRatingReviewLink}
      </>
    );
  }

  // The API that shows the disability rating is down
  // Default fallback
  return (
    <>
      <va-alert status="warning" slim className="vads-u-margin-bottom--2">
        We can’t show your disability rating right now. Refresh this page or try
        again later.
      </va-alert>
      {noRatingReviewLink}
    </>
  );
};

DisabilityRatingCard.propTypes = {
  totalDisabilityRating: PropTypes.number,
  totalDisabilityRatingServerError: PropTypes.bool,
};

const mapStateToProps = state => ({
  totalDisabilityRating: state.totalRating?.totalDisabilityRating,
  totalDisabilityRatingServerError: hasTotalDisabilityServerError(state),
});

export default connect(mapStateToProps)(DisabilityRatingCard);
