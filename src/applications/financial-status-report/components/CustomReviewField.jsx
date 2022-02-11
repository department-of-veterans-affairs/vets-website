import React from 'react';
import PropTypes from 'prop-types';

const CustomReviewField = ({
  children: {
    props: { uiSchema, formData },
  },
}) => (
  <div className="review-row">
    <dt>{uiSchema['ui:title']}</dt>
    <dd>{formData}</dd>
  </div>
);

CustomReviewField.propTypes = {
  children: PropTypes.object,
};

export default CustomReviewField;
