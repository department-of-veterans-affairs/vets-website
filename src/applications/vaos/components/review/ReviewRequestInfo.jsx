import React from 'react';
import { getTypeOfCare } from '../../utils/selectors';
import TypeOfCareSection from './TypeOfCareSection';
import VAAppointmentSection from './VAAppointmentSection';
import CommunityCareSection from './CommunityCareSection';

export default function ReviewRequestInfo({ data }) {
  const isCommunityCare = data.facilityType === 'communityCare';
  const isVAAppointment = data.facilityType === 'vamc';

  return (
    <div>
      <h1 className="vads-u-font-size--h2">
        Review your appointment
        <br />
        details
      </h1>
      <TypeOfCareSection data={data} />
      <hr />
      <h3 className="vaos-appts__block-label">{getTypeOfCare(data)?.name}</h3>
      <hr />
      {isCommunityCare && <CommunityCareSection data={data} />}
      {isVAAppointment && <VAAppointmentSection data={data} />}
    </div>
  );
}
