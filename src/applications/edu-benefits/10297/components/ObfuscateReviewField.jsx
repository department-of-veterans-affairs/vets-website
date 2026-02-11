import React from 'react';
import PropTypes from 'prop-types';
import { obfuscate } from '../helpers';

function ObfuscateReviewField({ children, uiSchema }) {
  return (
    <div className="review-row">
      <dt>{uiSchema?.['ui:title']}</dt>
      <dd>{obfuscate(children?.props?.formData)}</dd>
    </div>
  );
}

ObfuscateReviewField.propTypes = {
  children: PropTypes.node.isRequired,
  uiSchema: PropTypes.shape({
    'ui:title': PropTypes.string.isRequired,
  }).isRequired,
};
export default ObfuscateReviewField;
