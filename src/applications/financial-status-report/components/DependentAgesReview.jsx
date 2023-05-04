import React from 'react';
import PropTypes from 'prop-types';
import DependentAges from './DependentAges';

const DependentAgesReview = ({ isReviewMode = true, ...props }) => {
  return <DependentAges isReviewMode={isReviewMode} {...props} />;
};

DependentAgesReview.propTypes = {
  isReviewMode: PropTypes.bool,
};

export default DependentAgesReview;
