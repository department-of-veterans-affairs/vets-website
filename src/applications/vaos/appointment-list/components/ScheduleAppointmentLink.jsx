import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { startNewAppointmentFlow } from '../redux/actions';
// eslint-disable-next-line import/no-restricted-paths
import getNewAppointmentFlow from '../../new-appointment/newAppointmentFlow';

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
