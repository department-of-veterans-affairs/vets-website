import React from 'react';
import { FormLabels, RxRenewalText } from '../../util/constants';

/**
 * LockedCategoryDisplay Component
 *
 * Displays a read-only category field for medication renewal requests.
 * Used in ComposeForm when user is composing a prescription renewal message,
 * preventing category selection per RX renewal business rules.
 *
 * The locked category displays "Medication" in bold text,
 * replacing the standard category dropdown that appears in normal message composition.
 *
 * PII Masking: All display text is masked for Datadog RUM privacy protection.
 *
 * @component
 * @example
 * // Rendered when renewalPrescription exists or rxError is present
 * <LockedCategoryDisplay />
 *
 * @returns {JSX.Element} Static display of locked category with label and bold text
 */
const LockedCategoryDisplay = () => {
  return (
    <div
      className="vads-u-margin-bottom--3"
      data-testid="locked-category-display"
    >
      <div>{FormLabels.CATEGORY}</div>
      <div
        className="vads-u-font-weight--bold"
        data-dd-privacy="mask"
        data-dd-action-name="Locked Category Display"
      >
        {RxRenewalText.LOCKED_CATEGORY_DISPLAY}
      </div>
    </div>
  );
};

export default LockedCategoryDisplay;
