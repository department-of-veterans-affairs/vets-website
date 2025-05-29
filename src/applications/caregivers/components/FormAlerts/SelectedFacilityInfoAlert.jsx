import React from 'react';
import PropTypes from 'prop-types';
import FacilityAddress from '../FacilityAddress';

const SelectedFacilityInfoAlert = ({ plannedClinic }) => (
  <va-alert status="info">
    <h2 slot="headline" className="vads-u-font-size--h3">
      Your current facility selection
    </h2>
    <div>
      You selected this VA medical center or clinic location where the Veteran
      receives or will receive care.
    </div>
    <FacilityAddress facility={plannedClinic?.veteranSelected} />
    <p>
      If you want to keep this facility, select <strong>Continue</strong>.
    </p>
    <p className="vads-u-margin-bottom--0">
      If you want a different facility, use the <strong>Search</strong> box to
      select a new facility.
    </p>
  </va-alert>
);

SelectedFacilityInfoAlert.propTypes = {
  plannedClinic: PropTypes.object,
};

export default React.memo(SelectedFacilityInfoAlert);
