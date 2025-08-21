import React from 'react';
import PropTypes from 'prop-types';

const NoHintReviewField = ({
  children: {
    props: { uiSchema, formData },
  },
}) => (
  <div className="review-row">
    <dt>{uiSchema['ui:title']}</dt>
    <dd>{formData}</dd>
  </div>
);

NoHintReviewField.propTypes = {
  children: PropTypes.shape({
    props: PropTypes.shape({
      uiSchema: PropTypes.object.isRequired,
      formData: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    }),
  }).isRequired,
};

export default NoHintReviewField;
