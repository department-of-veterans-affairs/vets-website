import React from 'react';
import PropTypes from 'prop-types';

const CommunityCareWarningBanner = ({ shouldShow = false }) => {
  if (!shouldShow) {
    return null;
  }
  return (
    <va-alert
      full-width
      status="warning"
      class="vads-u-margin-bottom--1"
      data-testid="community-care-warning-banner"
      id="community-care-warning-banner"
    >
      <h2 slot="headline">
        What to know about community health care facilities
      </h2>
      <div>
        If you go to a community care facility, call first to confirm they can
        provide the care you need. Because facilities may move or experience
        other changes, we may not always have the most current information.
      </div>
    </va-alert>
  );
};

CommunityCareWarningBanner.propTypes = {
  shouldShow: PropTypes.bool,
};

export default CommunityCareWarningBanner;
