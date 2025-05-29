import React from 'react';
import PropTypes from 'prop-types';
import FacilityAddress from '../FacilityAddress';

const SelectedFacilityInfoAlert = ({ plannedClinic }) => (
  <va-alert status="info">
    <h2 slot="headline" className="vads-u-font-size--h3">
      VA medical center or clinic selected
    </h2>
    <div>
      You’ve previously selected in this application the VA medical center or
      clinic where the Veteran receives or plans to receive care.
    </div>
    <FacilityAddress facility={plannedClinic?.veteranSelected} />
    <p>
      Select <strong>"Continue"</strong> without searching to keep your
      selection
    </p>
  </va-alert>
);

SelectedFacilityInfoAlert.propTypes = {
  plannedClinic: PropTypes.object,
};

export default React.memo(SelectedFacilityInfoAlert);
