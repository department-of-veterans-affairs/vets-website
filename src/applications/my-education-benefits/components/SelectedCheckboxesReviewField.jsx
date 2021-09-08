import React from 'react';
import { getSelectedCheckboxes } from '../helpers';

export default function SelectedCheckboxesReviewField({ uiSchema, formData }) {
  return (
    <>
      <div className="review-row">
        <dt>{uiSchema['ui:title']}</dt>
        <dd>{getSelectedCheckboxes(uiSchema, formData)}</dd>
      </div>
    </>
  );
}
