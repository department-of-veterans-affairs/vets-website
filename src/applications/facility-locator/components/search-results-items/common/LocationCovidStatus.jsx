/* eslint-disable jsx-a11y/no-noninteractive-tabindex */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import createCommonStore from 'platform/startup/store';
import { connectFeatureToggle } from 'platform/utilities/feature-toggles';
import { FeatureToggleReducer } from 'platform/site-wide/feature-toggles/reducers';
import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';

const store = createCommonStore({
  FeatureToggleReducer,
});

const LocationCovidStatus = ({ supplementalStatus }) => {
  const [showVamcAlert, setShowVamcAlert] = useState(true);
  const covidStatus = supplementalStatus?.find(status =>
    status.status_id.includes('COVID'),
  );

  useEffect(() => {
    connectFeatureToggle(store.dispatch);
    store.subscribe(() => {
      const flags = toggleValues(store.getState());
      if (
        flags?.showExpandableVamcAlert === 'undefined' ||
        flags?.showExpandableVamcAlert === false
      ) {
        setShowVamcAlert(false);
      }
    });
  }, []);

  if (!covidStatus || !showVamcAlert) {
    return <></>;
  }

  return (
    <va-alert-expandable
      class="vads-u-margin-x--0"
      status="info"
      trigger={covidStatus.name}
      data-testid={`${covidStatus.status_id.toLowerCase()}-message`}
    >
      {/* eslint-disable react/no-danger */}
      <div
        dangerouslySetInnerHTML={{
          __html: covidStatus.description,
        }}
      />
    </va-alert-expandable>
  );
};

LocationCovidStatus.propTypes = {
  supplementalStatus: PropTypes.array,
};

export default LocationCovidStatus;
