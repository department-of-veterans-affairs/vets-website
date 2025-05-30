import React from 'react';
import PropTypes from 'prop-types';
import FacilityAddress from '../FacilityAddress';

const SelectedFacilityInfoAlert = ({ facility }) => {
  if (!facility) return null;

  return (
    <va-alert status="info">
      <h3 slot="headline">Your current selection</h3>
      <p>
        You selected this VA medical center or clinic location where the Veteran
        receives or will receive care.
      </p>
      <FacilityAddress facility={facility} />
      <p>
        If you want to keep this facility, select <strong>Continue</strong>.
      </p>
      <p className="vads-u-margin-bottom--0">
        If you want a different facility, use the <strong>Search</strong> box to
        select a new facility.
      </p>
    </va-alert>
  );
};

SelectedFacilityInfoAlert.propTypes = {
  facility: PropTypes.object,
};

export default React.memo(SelectedFacilityInfoAlert);
