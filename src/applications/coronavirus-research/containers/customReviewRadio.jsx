import React from 'react';

export default function CustomReviewRadio({ children, uiSchema }) {
  return (
    <div className="review-row">
      <dt>
        {uiSchema['ui:title'].props.children[0]
          ? uiSchema['ui:title'].props.children[0].props.children
          : uiSchema['ui:title'].props.children.props.children}
      </dt>
      <dd>{uiSchema['ui:options'].labels[(children?.props.formData)]}</dd>
    </div>
  );
}
