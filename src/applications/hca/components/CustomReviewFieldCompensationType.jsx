import React from 'react';
import PropTypes from 'prop-types';

const HIGH_DISABILITY = 'Yes (50% or higher rating)';
const LOW_DISABILITY = 'Yes (40% or lower rating)';
const NO_DISABILITY = 'No';

const CustomReviewFieldCompensationType = ({
  children: {
    props: { uiSchema, formData },
  },
}) => {
  let compensationType = NO_DISABILITY;
  if (formData === 'highDisability') {
    compensationType = HIGH_DISABILITY;
  } else if (formData === 'lowDisability') {
    compensationType = LOW_DISABILITY;
  }
  return (
    <div className="review-row">
      <dt>{uiSchema['ui:title']}</dt>
      <dd>{compensationType}</dd>
    </div>
  );
};

export default CustomReviewFieldCompensationType;

CustomReviewFieldCompensationType.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  formData: PropTypes.object,
  uiSchema: PropTypes.object,
};
