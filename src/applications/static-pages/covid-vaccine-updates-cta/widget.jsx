import React from 'react';
import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';
import LoadingIndicator from '@department-of-veterans-affairs/component-library/LoadingIndicator';
import { connect } from 'react-redux';

import OnState from './On';
import OffState from './Off';

function CovidVaccineUpdatesCTA({ showLinkToOnlineForm }) {
  if (showLinkToOnlineForm) {
    return <OnState />;
  }

  if (showLinkToOnlineForm === false) {
    return <OffState />;
  }

  return <LoadingIndicator message="Loading..." />;
}

const mapStateToProps = store => ({
  showLinkToOnlineForm: toggleValues(store)[
    FEATURE_FLAG_NAMES.covidVaccineUpdatesCTA
  ],
});

export default connect(mapStateToProps)(CovidVaccineUpdatesCTA);
