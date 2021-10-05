import React from 'react';

export default function EmailReviewField({ children }) {
  return (
    <div className="review-row">
      <dt>Email</dt>
      <dd>{children.props.formData}</dd>
    </div>
  );
}
