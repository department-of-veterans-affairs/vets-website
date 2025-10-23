import React from 'react';
import { formatReadableDate } from '../helpers';

export default function CustomReviewDOBField({ children }) {
  return (
    <div className="review-row">
      <dt>Your date of birth</dt>
      <dd>{formatReadableDate(children?.props.formData)}</dd>
    </div>
  );
}
