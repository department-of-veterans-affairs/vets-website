import React from 'react';

export default function CheckboxReviewWidget({ value }) {
  return <span>{value === true ? 'Yes' : 'No'}</span>;
}
