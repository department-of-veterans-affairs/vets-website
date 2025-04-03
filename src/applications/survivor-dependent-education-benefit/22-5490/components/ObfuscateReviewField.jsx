import React from 'react';
import PropTypes from 'prop-types';
import { obfuscate, obfuscateAriaLabel } from '../helpers';

function ObfuscateReviewField({ children, uiSchema }) {
  const { formData } = children.props; // Extract form data
  const maskedValue = obfuscate(formData); // Generate obfuscated value

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
        aria-label={obfuscateAriaLabel(formData)}
        className="survivor-benefit-definition-list_definition"
        id="obfuscate-review-value"
      >
        {maskedValue}
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
