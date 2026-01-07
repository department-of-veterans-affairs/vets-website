import React from 'react';
import PropTypes from 'prop-types';
import FacilityPhone from '../../../components/FacilityPhone';

import { getFacilityPhone } from '../../../services/location';

function FacilityInfo({ selectedFacility }) {
  const facilityPhone = getFacilityPhone(selectedFacility);
  return (
    <>
      <p>We're sorry. There's a problem with our system. Try again later.</p>
      <p>If you need to schedule now, call your VA facility.</p>

      <p className="vaos-u-word-break--break-word">
        {selectedFacility.name}
        <br />
        Main phone: <FacilityPhone contact={facilityPhone} icon={false} />
      </p>
    </>
  );
}

export default FacilityInfo;

FacilityInfo.propTypes = {
  selectedFacility: PropTypes.object.isRequired,
};
