import React from 'react';

export default function ReceiveTextMessagesReviewField({ children, uiSchema }) {
  return (
    <div className="review-row">
      <dt>{uiSchema['ui:title']}</dt>
      <dd>{children.props.formData}</dd>
    </div>
  );
}
