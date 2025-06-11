import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import CTALink from '../CTALink';
import { hasTotalDisabilityServerError } from '../../../common/selectors/ratedDisabilities';

const CombinedDisabilityRatingCard = ({
  totalDisabilityRating,
  totalDisabilityRatingServerError,
}) => {
  return (
    <va-card>
      {totalDisabilityRatingServerError ? (
        <span>We can’t currently display your disability rating.</span>
      ) : (
        <h4 className="vads-u-margin-y--0 vads-u-padding-bottom--1">
          Your combined disability rating is {totalDisabilityRating}%
        </h4>
      )}
      <p className="vads-u-margin-y--0 vads-u-margin-top--0p5 vads-u-padding-y--1">
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

CombinedDisabilityRatingCard.propTypes = {
  totalDisabilityRating: PropTypes.number,
  totalDisabilityRatingServerError: PropTypes.bool,
};

const mapStateToProps = state => ({
  totalDisabilityRating: state.totalRating?.totalDisabilityRating,
  totalDisabilityRatingServerError: hasTotalDisabilityServerError(state),
});

export default connect(mapStateToProps)(CombinedDisabilityRatingCard);
