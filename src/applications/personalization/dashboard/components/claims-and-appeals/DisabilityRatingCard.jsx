import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { hasTotalDisabilityError } from '../../../common/selectors/ratedDisabilities';

const DisabilityRatingCard = ({
  totalDisabilityRating,
  totalDisabilityRatingError,
}) => {
  const Heading = () => (
    <h3 className="vads-u-margin-top--3 vads-u-margin-bottom--2">
      Disability rating
    </h3>
  );
  const noRatingReviewLink = (
    <p className="vads-u-margin-top--2 vads-u-margin-bottom--0">
      <va-link
        href="/disability/view-disability-rating"
        text="Review disability rating information"
      />
    </p>
  );

  if (!totalDisabilityRatingError) {
    if (totalDisabilityRating != null) {
      // User has a disability rating
      return (
        <>
          <Heading />
          <va-card>
            <h4 className="vads-u-margin-y--0 vads-u-padding-bottom--1 dd-privacy-mask">
              Your combined disability rating is {totalDisabilityRating}%
            </h4>
            <div className="vads-u-margin-top--0p5 vads-u-padding-y--1">
              <va-link
                active
                text="Review your VA disability rating"
                href="/disability/view-disability-rating/rating"
              />
            </div>
          </va-card>
        </>
      );
    }

    // User does not have a disability rating
    return (
      <>
        <Heading />
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
      <Heading />
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
  totalDisabilityRatingError: PropTypes.bool,
};

const mapStateToProps = state => ({
  totalDisabilityRating: state.totalRating?.totalDisabilityRating,
  totalDisabilityRatingError: hasTotalDisabilityError(state),
});

export default connect(mapStateToProps)(DisabilityRatingCard);
