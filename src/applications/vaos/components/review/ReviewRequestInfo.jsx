import React from 'react';
import { FACILITY_TYPES } from '../../utils/constants';
import TypeOfAppointmentSection from './TypeOfAppointmentSection';
import VAAppointmentSection from './VAAppointmentSection';
import CommunityCareSection from './CommunityCareSection';
import Description from './Description';

export default function ReviewRequestInfo({ data, facility, vaCityState }) {
  const isCommunityCare = data.facilityType === FACILITY_TYPES.COMMUNITY_CARE;
  const isVAAppointment = data.facilityType === FACILITY_TYPES.VAMC;

  return (
    <div>
      <h1 className="vads-u-font-size--h2">Review your appointment</h1>
      <Description data={data} />
      <TypeOfAppointmentSection data={data} />
      <hr className="vads-u-margin-y--2" />
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
