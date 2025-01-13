import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import getNewAppointmentFlow from '../new-appointment/newAppointmentFlow';
import { startNewAppointmentFlow } from '../new-appointment/redux/actions';

const ScheduleAppointmentLink = () => {
  const dispatch = useDispatch();
  const { root, typeOfCare } = useSelector(getNewAppointmentFlow);

  const handleClick = () => {
    return () => {
      dispatch(startNewAppointmentFlow());
    };
  };

  return (
    <div className="vaos-hide-for-print">
      <va-link
        onClick={handleClick()}
        text="Schedule an appointment"
        data-testid="schedule-appointment-link"
        href={`${root.url}${typeOfCare.url}`}
      />
    </div>
  );
};

export default ScheduleAppointmentLink;
