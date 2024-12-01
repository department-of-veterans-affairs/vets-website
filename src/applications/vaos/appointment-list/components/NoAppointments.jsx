import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import NewTabAnchor from '../../components/NewTabAnchor';
import { startNewAppointmentFlow } from '../redux/actions';
// eslint-disable-next-line import/no-restricted-paths
import getNewAppointmentFlow from '../../new-appointment/newAppointmentFlow';

function handleClick(dispatch) {
  return () => {
    dispatch(startNewAppointmentFlow());
  };
}
export default function NoAppointments({
  showScheduleButton,
  showAdditionalRequestDescription,
  description = 'appointments',
  level = 3,
}) {
  const dispatch = useDispatch();
  const { root, typeOfCare } = useSelector(getNewAppointmentFlow);

  const Heading = `h${level}`;

  return (
    <>
      <Heading className="vads-u-margin--0 vads-u-margin-bottom--2p5 vads-u-font-size--md">
        You don’t have any {description}
      </Heading>
      {showScheduleButton && (
        <>
          {showAdditionalRequestDescription ? (
            <p>
              If you request an appointment it will show here until staff review
              and schedule it. You can schedule an appointment online now, or
              call your{' '}
              <NewTabAnchor href="/find-locations">
                VA health facility
              </NewTabAnchor>{' '}
              to schedule an appointment.
            </p>
          ) : (
            <p>
              You can schedule an appointment online now, or call your{' '}
              <NewTabAnchor href="/find-locations">
                VA health facility
              </NewTabAnchor>{' '}
              to schedule an appointment.
            </p>
          )}
          <div className="vaos-hide-for-print">
            <va-link
              onClick={handleClick(dispatch)}
              text="Schedule an appointment"
              data-testid="schedule-appointment-link"
              href={`${root.url}${typeOfCare.url}`}
            />
          </div>
        </>
      )}
      {!showScheduleButton && (
        <>
          <p>
            To schedule an appointment, call your{' '}
            <NewTabAnchor href="/find-locations">
              VA Medical center
            </NewTabAnchor>
            .
          </p>
        </>
      )}
    </>
  );
}

NoAppointments.propTypes = {
  showScheduleButton: PropTypes.bool.isRequired,
  startNewAppointmentFlow: PropTypes.func.isRequired,
  description: PropTypes.string,
  level: PropTypes.number,
  showAdditionalRequestDescription: PropTypes.bool,
};

NoAppointments.defaultProps = {
  showAdditionalRequestDescription: false,
};
