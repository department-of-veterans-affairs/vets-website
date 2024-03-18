import React from 'react';
import PropTypes from 'prop-types';
import { FACILITY_TYPES, FLOW_TYPES } from '../../../../utils/constants';
import TypeOfAppointmentSection from './TypeOfAppointmentSection';
import VAAppointmentSection from './VAAppointmentSection';
import CommunityCareSection from './CommunityCareSection/CommunityCareSection';
import Description from './ReviewDirectScheduleInfo/Description';

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
      <h1 className="vaos-review__header vads-u-font-size--h2">{pageTitle}</h1>
      <Description data={data} flowType={FLOW_TYPES.REQUEST} />
      <TypeOfAppointmentSection data={data} flowType={FLOW_TYPES.REQUEST} />
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
