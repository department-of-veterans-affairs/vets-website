import React from 'react';
import PropTypes from 'prop-types';
import { clearReturnState } from 'platform/forms-system/src/js/utilities/data/profile';

export const ContactInfoSuccessAlerts = ({
  editState,
  prefillPatternEnabled,
}) => {
  const showSuccessAlert =
    prefillPatternEnabled && editState && editState?.includes('updated');

  if (showSuccessAlert) {
    clearReturnState();
  }

  return showSuccessAlert ? (
    <div>
      <va-alert status="success" class="vads-u-margin-bottom--0">
        <h2 className="vads-u-font-size--h3">
          We’ve updated your contact information.
        </h2>
        <div className="vads-u-font-size--base">
          We’ve made these changes to this form and your VA.gov profile.
        </div>
      </va-alert>
    </div>
  ) : null;
};

ContactInfoSuccessAlerts.propTypes = {
  editState: PropTypes.string,
  prefillPatternEnabled: PropTypes.bool,
};
