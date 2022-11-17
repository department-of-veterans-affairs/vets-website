import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useMediaQuery } from 'react-responsive';
import classNames from 'classnames';
import AppointmentColumn from './AppointmentColum';
import AppointmentRow from './AppointmentRow';

// export function PendingAppointmentLayout({ data }) {
export function PendingAppointmentLayout({ appointment, facility }) {
  const isMobile = useMediaQuery({ query: '(max-width: 360px)' });

  return (
    <AppointmentColumn
      id="column 1"
      classNameOverride={classNames('vads-l-col', 'vads-u-padding-y--2', {
        'vads-u-padding-right--1': !isMobile,
        'vads-u-border-bottom--1px': isMobile,
      })}
      style={{ minWidth: 60 }}
    >
      <AppointmentRow
        appointment={appointment}
        facility={facility}
        isMobile={isMobile}
      >
        {data => (
          <>
            <AppointmentColumn
              className={classNames('vaos-appts__text--truncate', {
                'vads-l-col--4': !isMobile,
                'vads-l-col--11': isMobile,
                'vads-u-margin-left--1': !isMobile,
              })}
              icon={data.icon}
              canceled={data.canceled}
            >
              {data.appointmentDetails}
            </AppointmentColumn>
            <AppointmentColumn canceled={data.canceled}>
              {data.typeOfCareName}
            </AppointmentColumn>
            <AppointmentColumn canceled={data.canceled}>
              {data.appointmentType}
            </AppointmentColumn>
            <AppointmentColumn
              classNameOverride={classNames(
                'vads-u-padding-top--0p25',
                'vaos-hide-for-print',
                {
                  'vads-l-col': !isMobile,
                  'vads-l-col--11': isMobile,
                  'vads-u-margin-right--1': !isMobile,
                  'vads-u-text-align--right': !isMobile,
                },
              )}
            >
              <Link
                className="vaos-appts__focus--hide-outline"
                aria-label={data.ariaLabel}
                to={data.link}
                onClick={e => e.preventDefault()}
              >
                Details
              </Link>
            </AppointmentColumn>
          </>
        )}
      </AppointmentRow>
    </AppointmentColumn>
  );
}

PendingAppointmentLayout.propTypes = {
  appointment: PropTypes.object,
  data: PropTypes.object,
  facility: PropTypes.object,
};
