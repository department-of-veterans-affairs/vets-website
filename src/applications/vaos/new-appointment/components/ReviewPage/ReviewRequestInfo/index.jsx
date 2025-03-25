import React from 'react';
import PropTypes from 'prop-types';
import { FACILITY_TYPES } from '../../../../utils/constants';
import TypeOfAppointmentSection from './TypeOfAppointmentSection';
import VAAppointmentSection from './VAAppointmentSection';
import CommunityCareSection from './CommunityCareSection/CommunityCareSection';

export default function ReviewRequestInfo({
  data,
  facility,
  vaCityState,
  pageTitle,
}) {
  const isCommunityCare = data.facilityType === FACILITY_TYPES.COMMUNITY_CARE;
  const isVAAppointment = data.facilityType === FACILITY_TYPES.VAMC;

  return (
    <div>
      <h1 className="vaos-review__header vaos__dynamic-font-size--h2">
        {pageTitle}
      </h1>
      <p>
        After you submit your request, we’ll contact you to finish scheduling
        your appointment.
      </p>
      <TypeOfAppointmentSection data={data} />
      <hr aria-hidden="true" className="vads-u-margin-y--2" />
      {isCommunityCare && (
        <CommunityCareSection
          data={data}
          facility={facility}
          vaCityState={vaCityState}
        />
      )}
      {isVAAppointment && (
        <VAAppointmentSection facility={facility} data={data} />
      )}
    </div>
  );
}

ReviewRequestInfo.propTypes = {
  data: PropTypes.object.isRequired,
  facility: PropTypes.object,
  pageTitle: PropTypes.string,
  vaCityState: PropTypes.string,
};
