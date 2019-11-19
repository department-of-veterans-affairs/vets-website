import React from 'react';
import { getTypeOfCare } from '../../utils/selectors';
import TypeOfAppointmentSection from './TypeOfAppointmentSection';
import VAAppointmentSection from './VAAppointmentSection';
import CommunityCareSection from './CommunityCareSection';

export default function ReviewRequestInfo({ data }) {
  const isCommunityCare = data.facilityType === 'communityCare';
  const isVAAppointment = data.facilityType === 'vamc';

  return (
    <div>
      <h1 className="vads-u-font-size--h2">Review your appointment details</h1>
      <TypeOfAppointmentSection data={data} />
      <hr />
      <h3 className="vaos-appts__block-label">{getTypeOfCare(data)?.name}</h3>
      <hr />
      {isCommunityCare && <CommunityCareSection data={data} />}
      {isVAAppointment && <VAAppointmentSection data={data} />}
    </div>
  );
}
