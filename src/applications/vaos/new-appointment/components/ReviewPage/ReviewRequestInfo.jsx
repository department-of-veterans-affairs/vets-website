import React from 'react';
import { FACILITY_TYPES, FLOW_TYPES } from '../../../utils/constants';
import TypeOfAppointmentSection from './TypeOfAppointmentSection';
import VAAppointmentSection from './VAAppointmentSection';
import CommunityCareSection from './CommunityCareSection';
import Description from './Description';

export default function ReviewRequestInfo({
  data,
  facility,
  vaCityState,
  pageTitle,
  useProviderSelection,
}) {
  const isCommunityCare = data.facilityType === FACILITY_TYPES.COMMUNITY_CARE;
  const isVAAppointment = data.facilityType === FACILITY_TYPES.VAMC;

  return (
    <div>
      <h1 className="vaos-review__header vads-u-font-size--h2">{pageTitle}</h1>
      <Description data={data} flowType={FLOW_TYPES.REQUEST} />
      <TypeOfAppointmentSection data={data} />
      <hr aria-hidden="true" className="vads-u-margin-y--2" />
      {isCommunityCare && (
        <CommunityCareSection
          data={data}
          facility={facility}
          vaCityState={vaCityState}
          useProviderSelection={useProviderSelection}
        />
      )}
      {isVAAppointment && (
        <VAAppointmentSection facility={facility} data={data} />
      )}
    </div>
  );
}
