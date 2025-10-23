import React from 'react';
import PropTypes from 'prop-types';

import { srSubstitute } from '../utilities/ui/mask-string';

/**
 * ServiceNumberWidget component
 * This component formats a service number by masking all but the first two characters.
 * @param {Object} props - The component props
 * @param {string} props.value - The service number value to format
 * @return {JSX.Element} The formatted service number wrapped in a span with accessibility attributes
 * @example Service numbers:
 * - "O-662062"
 * - "0 765 497"
 * - "39 563 856"
 * - "ER 11 229 770""
 */
export default function ServiceNumberWidget({ value }) {
  if (value && typeof value === 'string') {
    const startPosition = ['-', ' '].includes(value[1]) ? 3 : 2;
    // Remove dashes and spaces, then mask all but the first two characters
    const beginning = value.substring(0, startPosition);
    const mask = value.substring(startPosition).replace(/\S/g, '●');
    return (
      <span className="dd-privacy-hidden" data-dd-action-name="Service number">
        {srSubstitute(
          `${beginning}${mask}`,
          `starting with ${beginning.split('').join(' ')}`,
        )}
      </span>
    );
  }

  return (
    <span className="dd-privacy-hidden" data-dd-action-name="Service number">
      {value}
    </span>
  );
}

ServiceNumberWidget.propTypes = {
  name: PropTypes.string,
  value: PropTypes.string,
};
