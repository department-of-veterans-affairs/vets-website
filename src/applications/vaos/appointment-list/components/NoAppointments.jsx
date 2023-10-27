import React from 'react';
import PropTypes from 'prop-types';
import NewTabAnchor from '../../components/NewTabAnchor';

export default function NoAppointments({
  showScheduleButton,
  startNewAppointmentFlow,
  showAdditionalRequestDescription,
  description = 'appointments',
  level = 3,
}) {
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
              className="va-button-link vads-u-font-weight--bold vads-u-font-size--md "
              onClick={startNewAppointmentFlow}
              href="new-appointment"
              text="Schedule an appointment"
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
