import React from 'react';
import PropTypes from 'prop-types';
import { shallowEqual, useSelector } from 'react-redux';
import { useMediaQuery } from 'react-responsive';
import AppointmentListItem from './AppointmentListItem';
import AppointmentRow from './AppointmentRow';
import { AppointmentColumnLayout } from './AppointmentColumnLayout';
import { getUpcomingAppointmentListInfo } from '../../redux/selectors';
import { getVAAppointmentLocationId } from '../../../services/appointment';

function getTotalAppointmentsForMonth(monthBucket) {
  return monthBucket.reduce((accum, value) => {
    return value.length + accum;
  }, 0);
}

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
  const totalAppointmentsForMonth = getTotalAppointmentsForMonth(monthBucket);

  return monthBucket.map((collection, monthIndex) => {
    if (collection.length > 1) {
      return (
        <li key={monthIndex} style={{ listStyle: 'none', marginBottom: 0 }}>
          <ul className="vads-u-margin--0 vads-u-padding-left--0">
            {collection.map((appointment, dayIndex) => {
              const facility =
                facilityData[getVAAppointmentLocationId(appointment)];

              return (
                <AppointmentListItem
                  key={appointment.id}
                  appointment={appointment}
                  grouped
                  first={dayIndex === 0}
                  last={
                    dayIndex === collection.length - 1 &&
                    monthBucket.length === monthIndex + 1
                  }
                >
                  <AppointmentRow appointment={appointment} facility={facility}>
                    {data => (
                      <AppointmentColumnLayout
                        data={data}
                        first={dayIndex === 0}
                        grouped
                        last={
                          dayIndex === collection.length - 1 &&
                          monthBucket.length === monthIndex + 1
                        }
                      />
                    )}
                  </AppointmentRow>
                </AppointmentListItem>
              );
            })}
          </ul>
        </li>
      );
    }

    return collection.map(appointment => {
      const facility = facilityData[getVAAppointmentLocationId(appointment)];

      return (
        <AppointmentListItem
          key={appointment.id}
          id="not grouped"
          appointment={appointment}
          last={
            (!isMobile &&
              monthIndex + 1 < monthBucket.length &&
              monthBucket[monthIndex].length === 1 &&
              monthBucket[monthIndex + 1].length === 1) ||
            monthIndex === totalAppointmentsForMonth - 1
          }
        >
          <AppointmentRow appointment={appointment} facility={facility}>
            {data => <AppointmentColumnLayout data={data} first />}
          </AppointmentRow>
        </AppointmentListItem>
      );
    });
  });
}

AppointmentGridLayout.propTypes = {
  monthBucket: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
};
