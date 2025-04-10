import React from 'react';
import { obfuscate, obfuscateAriaLabel } from './helpers';

export default function ObfuscateReviewField({ children, uiSchema }) {
  return (
    <div className="review-row">
      <dt>{uiSchema['ui:title']}</dt>
      <dd>
        <span aria-hidden="true">{obfuscate(children.props.formData)}</span>
        <span className="sr-only">
          {obfuscateAriaLabel(children.props.formData)}
        </span>
      </dd>
    </div>
  );
}
