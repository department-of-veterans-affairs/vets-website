import React from 'react';

export default function reviewField({ children, _schema, uiSchema }) {
  return (
    <div className="review-row">
      <dt>{uiSchema['ui:title']}</dt>
      <dd>{children}</dd>
    </div>
  );
}
