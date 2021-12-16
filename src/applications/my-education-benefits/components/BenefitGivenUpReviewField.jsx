import React from 'react';

export default function BenefitGivenUpReviewField({ children, uiSchema }) {
  if (!children || !uiSchema) {
    return <></>;
  }

  return (
    <>
      <div className="review-row">
        <dt>Benefit selected</dt>
        <dd>Post-9/11 GI Bill (Chapter 33)</dd>
      </div>
      <div className="review-row">
        <dt>Benefit given up</dt>
        <dd>{uiSchema['ui:options'].labels[children.props.formData]}</dd>
      </div>
    </>
  );
}
