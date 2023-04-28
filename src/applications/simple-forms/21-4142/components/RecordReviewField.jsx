import React from 'react';

export const RecordReviewField = ({ children }) => {
  return (
    <dl className="review">
      <div className="review-row">
        <dt>{children.props.name}</dt>
        <dd>{children}</dd>
      </div>
    </dl>
  );
};
