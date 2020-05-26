import React from 'react';
import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';
import { connect } from 'react-redux';

import OnState from './On';
import OffState from './Off';

function CaregiverContentToggle({ showLinkToOnlineForm }) {
  if (showLinkToOnlineForm) {
    return <OnState />;
  }

  return <OffState />;
}

const mapStateToProps = store => ({
  user: store.user,
  showLinkToOnlineForm: toggleValues(store)[
    FEATURE_FLAG_NAMES.allowOnline1010cgSubmissions
  ],
});

export default connect(mapStateToProps)(CaregiverContentToggle);
