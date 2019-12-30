import React from 'react';
import { getTypeOfCare } from '../../utils/selectors';
import { FACILITY_TYPES } from '../../utils/constants';
import TypeOfAppointmentSection from './TypeOfAppointmentSection';
import VAAppointmentSection from './VAAppointmentSection';
import CommunityCareSection from './CommunityCareSection';

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
      <h1 className="vads-u-font-size--h2">{pageTitle}</h1>
      <TypeOfAppointmentSection data={data} />
      <hr />
      <h3 className="vaos-appts__block-label">{getTypeOfCare(data)?.name}</h3>
      <hr />
      {isCommunityCare && (
        <CommunityCareSection
          data={data}
          facility={facility}
          vaCityState={vaCityState}
        />
      )}
      {isVAAppointment && <VAAppointmentSection data={data} />}
    </div>
  );
}
