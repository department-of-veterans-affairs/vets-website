import React from 'react';
import PropTypes from 'prop-types';
import AppointmentListItem from './AppointmentListItem';
import AppointmentRow from './AppointmentRow';
import { AppointmentColumnLayout } from './AppointmentColumnLayout';

/**
 * Function to render appointment data in a table/grid layout.
 *
 * @param {*} collection A collection of appointments grouped by month and day.
 * @returns
 */
export default function AppointmentGridLayout({ monthBucket }) {
  return Object.values(monthBucket).map(collection => {
    if (collection.length > 1) {
      return (
        <li style={{ listStyle: 'none', marginBottom: 0 }}>
          <ul className="vads-u-margin--0 vads-u-padding-left--0">
            {collection.map((appointment, i) => {
              return (
                <AppointmentListItem
                  key={appointment.id}
                  appointment={appointment}
                  borderBottom={i === collection.length - 1}
                >
                  {facility => (
                    <AppointmentRow
                      appointment={appointment}
                      facility={facility}
                    >
                      {data => (
                        <AppointmentColumnLayout
                          data={data}
                          first={i === 0}
                          grouped
                          last={i === collection.length - 1}
                        />
                      )}
                    </AppointmentRow>
                  )}
                </AppointmentListItem>
              );
            })}
          </ul>
        </li>
      );
    }

    return collection.map(appointment => {
      return (
        <AppointmentListItem
          id="not grouped"
          key={appointment.id}
          appointment={appointment}
          borderBottom
        >
          {facility => (
            <AppointmentRow appointment={appointment} facility={facility}>
              {data => <AppointmentColumnLayout data={data} first />}
            </AppointmentRow>
          )}
        </AppointmentListItem>
      );
    });
  });
}

AppointmentGridLayout.propTypes = {
  monthBucket: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
};
