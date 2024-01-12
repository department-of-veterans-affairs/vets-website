import React from 'react';
import { obfuscate } from '../helpers';

export default function ObfuscateReviewField({ children, uiSchema }) {
  return (
    <div className="review-row">
      <dt>{uiSchema['ui:title']}</dt>
      <dd>{obfuscate(children.props.formData)}</dd>
    </div>
  );
}
