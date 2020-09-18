import React from 'react';

const ConditionReviewField = props => {
  const { renderedProperties, defaultEditButton } = props;
  if (!renderedProperties) {
    return null;
  }
  return (
    <dl className="vads-u-width--full">
      <div className="review-row vads-u-display--flex vads-u-justify-content--space-between vads-u-align-items--center">
        <dt className="capitalize-first-letter">{renderedProperties}</dt>
        <dd>{defaultEditButton()}</dd>
      </div>
    </dl>
  );
};

export default ConditionReviewField;
