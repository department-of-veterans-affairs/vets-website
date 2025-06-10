import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import CTALink from './CTALink';
import { hasTotalDisabilityServerError } from '../../common/selectors/ratedDisabilities';

const CombinedDisabilityRatingWidget = ({
  totalDisabilityRating,
  totalDisabilityRatingServerError,
}) => {
  return (
    <va-card>
      {!totalDisabilityRatingServerError && (
        <h4 className="vads-u-margin-top--0">
          Your combined disability rating is {totalDisabilityRating}%
        </h4>
      )}
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

CombinedDisabilityRatingWidget.propTypes = {
  totalDisabilityRating: PropTypes.number,
  totalDisabilityRatingServerError: PropTypes.bool,
};

const mapStateToProps = state => ({
  totalDisabilityRating: state.totalRating?.totalDisabilityRating,
  totalDisabilityRatingServerError: hasTotalDisabilityServerError(state),
});

export default connect(mapStateToProps)(CombinedDisabilityRatingWidget);
