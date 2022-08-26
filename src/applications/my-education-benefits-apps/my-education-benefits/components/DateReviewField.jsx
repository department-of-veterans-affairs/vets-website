import React from 'react';
import { formatReadableDate } from '../helpers';

export default function DateReviewField({ children, uiSchema }) {
  return (
    <div className="review-row">
      <dt>{uiSchema['ui:title']}</dt>
      <dd>{formatReadableDate(children?.props.formData)}</dd>
    </div>
  );
}
