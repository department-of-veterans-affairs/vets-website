import PropTypes from 'prop-types';
import React from 'react';

const ConditionReviewField = props => {
  const { renderedProperties, defaultEditButton, formData } = props;
  if (!renderedProperties) {
    return null;
  }
  return (
    <dl className="vads-u-width--full">
      <div className="review-row vads-u-display--flex vads-u-justify-content--space-between vads-u-align-items--center">
        <dt className="capitalize-first-letter">{renderedProperties}</dt>
        <dd>{defaultEditButton({ label: `Edit ${formData.condition}` })}</dd>
      </div>
    </dl>
  );
};

ConditionReviewField.propTypes = {
  defaultEditButton: PropTypes.any,
  formData: PropTypes.shape({
    condition: PropTypes.string,
  }),
  renderedProperties: PropTypes.any,
};

export default ConditionReviewField;
