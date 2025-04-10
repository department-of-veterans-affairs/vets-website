import React from 'react';
import PropTypes from 'prop-types';
import { obfuscate, obfuscateAriaLabel } from '../helpers';

function ObfuscateReviewField({ children, uiSchema }) {
  const { formData } = children.props; // Extract form data

  return (
    <dl
      className="survivor-benefit-definition-list survivor-benefit-obfuscate-review"
      aria-labelledby="obfuscate-review-title"
      aria-describedby="obfuscate-review-value"
    >
      <dt
        id="obfuscate-review-title"
        className="survivor-benefit-definition-list_term"
      >
        {uiSchema['ui:title']}
      </dt>
      <dd
        className="survivor-benefit-definition-list_definition"
        id="obfuscate-review-value"
      >
        <span aria-hidden="true">{obfuscate(formData)}</span>
        <span className="sr-only">{obfuscateAriaLabel(formData)}</span>
      </dd>
    </dl>
  );
}

ObfuscateReviewField.propTypes = {
  children: PropTypes.node.isRequired,
  uiSchema: PropTypes.shape({
    'ui:title': PropTypes.string.isRequired,
  }).isRequired,
};

export default ObfuscateReviewField;
