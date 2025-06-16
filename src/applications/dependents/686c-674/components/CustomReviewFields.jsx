import React from 'react';
import PropTypes from 'prop-types';

const NoHintReviewField = ({
  children: {
    props: { uiSchema, formData },
  },
}) => (
  <div className="review-row">
    <dt>{uiSchema['ui:title']}</dt>
    <dd className="dd-privacy-hidden" data-dd-privacy="mask">
      {formData}
    </dd>
  </div>
);

NoHintReviewField.propTypes = {
  children: PropTypes.shape({
    props: PropTypes.shape({
      uiSchema: PropTypes.object.isRequired,
      formData: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default NoHintReviewField;
