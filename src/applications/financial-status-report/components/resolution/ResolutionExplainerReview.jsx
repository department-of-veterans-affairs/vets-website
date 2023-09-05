import React from 'react';
import PropTypes from 'prop-types';
import ReviewPageHeader from '../shared/ReviewPageHeader';

const ResolutionExplainerReview = ({ goToPath }) => {
  return (
    <ReviewPageHeader
      title="repayment or relief options"
      goToPath={() => goToPath('/option-explainer')}
    />
  );
};

ResolutionExplainerReview.propTypes = {
  goToPath: PropTypes.func,
};

export default ResolutionExplainerReview;
