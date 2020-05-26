import React from 'react';
import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';
import { connect } from 'react-redux';

import OnState from './On';
import OffState from './Off';

function CaregiverContentToggle({ isFormAccessAllowed }) {
  if (isFormAccessAllowed) {
    return <OnState />;
  }

  return <OffState />;
}

const mapStateToProps = store => ({
  user: store.user,
  isFormAccessAllowed: toggleValues(store)[
    FEATURE_FLAG_NAMES.caregiver1010cgFormAccess
  ],
});

export default connect(mapStateToProps)(CaregiverContentToggle);
