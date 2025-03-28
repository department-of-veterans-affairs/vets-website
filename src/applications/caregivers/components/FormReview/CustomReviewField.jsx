import React from 'react';
import PropTypes from 'prop-types';

const CustomReviewField = ({ children }) => {
  const { formData, uiSchema } = children.props;
  return (
    <div className="review-row">
      <dt>{uiSchema['ui:title']}</dt>
      <dd className="dd-privacy-hidden" data-dd-action-name="data value">
        {formData}
      </dd>
    </div>
  );
};

CustomReviewField.propTypes = {
  children: PropTypes.shape({
    props: PropTypes.shape({
      formData: PropTypes.string,
      uiSchema: PropTypes.object,
    }),
  }),
};

export default CustomReviewField;
