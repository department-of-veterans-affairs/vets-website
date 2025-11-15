import React from 'react';
import PropTypes from 'prop-types';
import { FormLabels, RxRenewalText } from '../../util/constants';

/**
 * Displays a locked (read-only) category field during RX renewal flow.
 * Shows "Medication renewal request" in bold text with PII masking.
 * 
 * @component
 * @returns {JSX.Element} Static display of locked category
 */
const LockedCategoryDisplay = () => {
  return (
    <div className="vads-u-margin-bottom--3">
      <div className="vads-u-margin-bottom--0p5">{FormLabels.CATEGORY}</div>
      <div
        className="vads-u-font-weight--bold"
        data-dd-privacy="mask"
        data-dd-action-name="Locked Category Display"
        data-testid="locked-category-display"
      >
        {RxRenewalText.LOCKED_CATEGORY_DISPLAY}
      </div>
    </div>
  );
};

// Even though it takes no props, document the intent
LockedCategoryDisplay.propTypes = {};

export default LockedCategoryDisplay;
