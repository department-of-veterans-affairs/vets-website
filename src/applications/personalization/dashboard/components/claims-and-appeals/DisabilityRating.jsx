import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import CTALink from '../CTALink';
import { hasTotalDisabilityServerError } from '../../../common/selectors/ratedDisabilities';

const DisabilityRating = ({
  totalDisabilityRating,
  totalDisabilityRatingClientError,
  totalDisabilityRatingServerError,
}) => {
  const hasError =
    totalDisabilityRatingClientError || totalDisabilityRatingServerError;
  const hasRating = totalDisabilityRating >= 0;

  // eslint-disable-next-line no-console
  console.log('totalDisabilityRating', totalDisabilityRating);

  const ErrorResponse = () => (
    <>
      <va-alert status="warning" slim>
        We can’t show your disability rating right now. Refresh this page or try
        again later.
      </va-alert>
      <p className="vads-u-margin-top--0">
        <va-link
          href="/disability/view-disability-rating"
          text="Review disability rating information"
        />
      </p>
    </>
  );
  const NoRating = () => (
    <>
      <p>We don’t have a combined disability rating on file for you.</p>
      <p className="vads-u-margin-y--0 vads-u-margin-top--0p5 vads-u-padding-y--1">
        <CTALink
          href="/disability/view-disability-rating"
          text="Review your VA disability rating"
          className="vads-u-font-weight--bold"
          showArrow
        />
      </p>
    </>
  );
  const RatingResponse = () => (
    <va-card>
      <h4 className="vads-u-margin-y--0 vads-u-padding-bottom--1">
        Your combined disability rating is {totalDisabilityRating}%
      </h4>

      <p className="vads-u-margin-y--0 vads-u-margin-top--0p5 vads-u-padding-y--1">
        <CTALink
          href="/disability/view-disability-rating"
          text="Review your VA disability rating"
          className="vads-u-font-weight--bold"
          showArrow
        />
      </p>
    </va-card>
  );

  return (
    <>
      <h3 className="vads-u-margin-top--0 vads-u-margin-bottom--2">
        Disability rating
      </h3>
      {hasError && <ErrorResponse />}
      {!hasRating && !hasError && <NoRating />}
      {hasRating && !hasError && <RatingResponse />}
    </>
  );
};

DisabilityRating.propTypes = {
  totalDisabilityRating: PropTypes.number,
  totalDisabilityRatingServerError: PropTypes.bool,
};

const mapStateToProps = state => ({
  totalDisabilityRating: state.totalRating?.totalDisabilityRating,
  totalDisabilityRatingServerError: hasTotalDisabilityServerError(state),
});

export default connect(mapStateToProps)(DisabilityRating);
