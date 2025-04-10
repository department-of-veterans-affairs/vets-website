import React from 'react';
import PropTypes from 'prop-types';
import { obfuscate, obfuscateAriaLabel } from '../helpers';

function ObfuscateReviewField({ children, uiSchema }) {
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

ObfuscateReviewField.propTypes = {
  children: PropTypes.node.isRequired,
  uiSchema: PropTypes.shape({
    'ui:title': PropTypes.string.isRequired,
  }).isRequired,
};
export default ObfuscateReviewField;
