import React from 'react';
import PropTypes from 'prop-types';
import { obfuscate } from '../helpers';

function ObfuscateReviewField({ children, uiSchema }) {
  const { formData } = children.props; // Extract form data
  const maskedValue = obfuscate(formData); // Generate obfuscated value
  const visibleLastDigits = formData.slice(-4); // Extract last 4 digits for accessibility

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
        id="obfuscate-review-value"
        className="survivor-benefit-definition-list_definition"
      >
        <span aria-hidden="true">{maskedValue}</span>
        <span className="sr-only">Ending in {visibleLastDigits}</span>
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
