import React from 'react';
import PropTypes from 'prop-types';

const CustomYesNoReviewField = ({ children }) => {
  const { formData, uiSchema } = children.props;
  return (
    <div className="review-row">
      <dt>{uiSchema['ui:title']}</dt>
      <dd className="dd-privacy-hidden" data-dd-action-name="data value">
        {formData ? 'Yes' : 'No'}
      </dd>
    </div>
  );
};

CustomYesNoReviewField.propTypes = {
  children: PropTypes.shape({
    props: PropTypes.shape({
      formData: PropTypes.bool,
      uiSchema: PropTypes.object,
    }),
  }),
};

export default CustomYesNoReviewField;
