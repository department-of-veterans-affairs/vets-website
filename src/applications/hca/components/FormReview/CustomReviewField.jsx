import React from 'react';
import PropTypes from 'prop-types';

const CustomReviewField = ({
  children: {
    props: { uiSchema, formData },
  },
}) => (
  <div className="review-row">
    <dt>{uiSchema['ui:title']}</dt>
    <dd className="dd-privacy-hidden" data-dd-action-name="data value">
      {formData}
    </dd>
  </div>
);

CustomReviewField.propTypes = {
  children: PropTypes.oneOfType([PropTypes.object, PropTypes.node]),
};

export default CustomReviewField;
