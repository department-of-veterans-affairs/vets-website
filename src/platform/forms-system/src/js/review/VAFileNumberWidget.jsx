import React from 'react';
import PropTypes from 'prop-types';

import { srSubstitute } from '../utilities/ui/mask-string';

export default function VAFileNumberWidget({ value }) {
  if (value && value.length === 9) {
    const lastFour = value.slice(-4);
    return (
      <span className="dd-privacy-hidden" data-dd-action-name="VA file number">
        {srSubstitute(
          `●●●-●●-${lastFour}`,
          `ending with ${lastFour.split('').join(' ')}`,
        )}
      </span>
    );
  }

  return (
    <span className="dd-privacy-hidden" data-dd-action-name="VA file number">
      {value}
    </span>
  );
}

VAFileNumberWidget.propTypes = {
  value: PropTypes.string,
};
