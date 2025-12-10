import React from 'react';
import { FormLabels, RxRenewalText } from '../../util/constants';

/**
 * LockedCategoryDisplay Component
 *
 * Displays a read-only category field for medication renewal requests.
 * Used in ComposeForm when user is composing a prescription renewal message,
 * preventing category selection per RX renewal business rules.
 *
 * The locked category displays "Medication renewal request" in bold text,
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
    <dl
      className="vads-u-margin-bottom--3 vads-u-margin-top--0"
      aria-label="Message category"
    >
      <dt className="vads-u-margin-bottom--0p5">{FormLabels.CATEGORY}</dt>
      <dd
        className="vads-u-font-weight--bold vads-u-margin-left--0"
        data-dd-privacy="mask"
        data-dd-action-name="Locked Category Display"
        data-testid="locked-category-display"
      >
        {RxRenewalText.LOCKED_CATEGORY_DISPLAY}
      </dd>
    </dl>
  );
};

// Even though it takes no props, document the intent
LockedCategoryDisplay.propTypes = {};

export default LockedCategoryDisplay;
