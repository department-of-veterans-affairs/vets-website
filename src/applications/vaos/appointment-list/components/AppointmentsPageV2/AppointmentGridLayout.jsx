import React from 'react';
import PropTypes from 'prop-types';
import { shallowEqual, useSelector } from 'react-redux';
import { useMediaQuery } from 'react-responsive';
import classNames from 'classnames';
import AppointmentListItem from './AppointmentListItem';
import AppointmentRow from './AppointmentRow';
import { AppointmentColumnLayout } from './AppointmentColumnLayout';
import { getUpcomingAppointmentListInfo } from '../../redux/selectors';
import { getVAAppointmentLocationId } from '../../../services/appointment';

function AppointmentListGroup({ children }) {
  return (
    <li className="vads-u-margin-bottom--0">
      <ul className="usa-unstyled-list vads-u-margin--0 vads-u-padding-left--0">
        {children}
      </ul>
    </li>
  );
}
AppointmentListGroup.propTypes = {
  children: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
};

/**
 * Function to render appointment data in a table/grid layout.
 *
 * @param {*} collection A collection of appointments grouped by month and day.
 * @returns
 */
export default function AppointmentGridLayout({ monthBucket }) {
  const isMobile = useMediaQuery({ query: '(max-width: 360px)' });
  const { facilityData } = useSelector(
    state => getUpcomingAppointmentListInfo(state),
    shallowEqual,
  );
  const totalForMonth = monthBucket.length - 1;

  let key = 0;

  return monthBucket.map((appointmentsForMonth, monthIndex) => {
    const isFirstInMonth = monthIndex === 0;
    const isLastInMonth = monthIndex === totalForMonth;

    if (appointmentsForMonth.length > 1) {
      key += 1;

      // Group appointments in nested list when there a are multiple groups of
      // appointments.
      return (
        <AppointmentListGroup key={key}>
          {appointmentsForMonth.map((appointment, appointmentIndex) => {
            const facility =
              facilityData[getVAAppointmentLocationId(appointment)];
            const isFirst = appointmentIndex === 0;
            const isLast = appointmentIndex === appointmentsForMonth.length - 1;

            return (
              <AppointmentListItem
                key={appointment.id}
                appointment={appointment}
                className={classNames(
                  'vaos-appts__listItem--clickable',
                  'vads-u-margin--0',
                  {
                    'vads-u-border-top--1px':
                      isMobile && isFirst && isFirstInMonth,
                    'vads-u-border-bottom--1px': isLast,
                  },
                )}
              >
                <AppointmentRow appointment={appointment} facility={facility}>
                  <AppointmentColumnLayout
                    first={isFirst}
                    grouped
                    last={isLast && isLastInMonth}
                  />
                </AppointmentRow>
              </AppointmentListItem>
            );
          })}
        </AppointmentListGroup>
      );
    }

    return appointmentsForMonth.map((appointment, appointmentIndex) => {
      const facility = facilityData[getVAAppointmentLocationId(appointment)];
      const isFirst = appointmentIndex === 0;
      const isLast = appointmentIndex === appointmentsForMonth.length - 1;

      return (
        <AppointmentListItem
          key={appointment.id}
          id={appointment.id}
          appointment={appointment}
          className={classNames(
            'vaos-appts__listItem--clickable',
            'vads-u-margin--0',
            {
              'vads-u-border-top--1px': isMobile && isFirst && isFirstInMonth,
              'vads-u-border-bottom--1px': isLast,
            },
          )}
        >
          <AppointmentRow appointment={appointment} facility={facility}>
            <AppointmentColumnLayout first />
          </AppointmentRow>
        </AppointmentListItem>
      );
    });
  });
}

AppointmentGridLayout.propTypes = {
  monthBucket: PropTypes.array,
};
