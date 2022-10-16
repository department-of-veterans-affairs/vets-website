import classNames from 'classnames';
import moment from 'moment';
import React from 'react';
import PropTypes from 'prop-types';
import { groupAppointmentByDay } from '../../../services/appointment';
import AppointmentListItemGroup from './AppointmentListItemGroup';

export default function AppointmentListGroup({ data }) {
  const groupedBy = groupAppointmentByDay(data);

  return (
    <>
      {groupedBy.map((group, monthIndex) => {
        const key = Object.keys(group);
        const appointments = Object.values(group);
        const date = moment(key, 'YYYY-MM-DD');

        return (
          <React.Fragment key={monthIndex}>
            <h3
              id={`appointment_list_${date.format('YYYY-MM')}`}
              data-cy="upcoming-appointment-list-header"
            >
              <span className="sr-only">Appointments in </span>
              {date.format('MMMM YYYY')}
            </h3>
            {/* eslint-disable-next-line jsx-a11y/no-redundant-roles */}
            <ul
              aria-labelledby={`appointment_list_${date.format('YYYY-MM')}`}
              className={classNames(
                'vads-u-padding-left--0',
                // 'vads-u-border-bottom--1px',
              )}
              data-cy="upcoming-appointment-list"
              role="list"
            >
              {appointments.map((collection, index) => {
                if (collection.length > 1) {
                  return (
                    <ul
                      className="vads-u-padding-left--0 vads-u-border-bottom--1px"
                      style={{ margin: 0 }}
                    >
                      <AppointmentListItemGroup key={index} data={collection} />
                    </ul>
                  );
                }
                return (
                  <AppointmentListItemGroup key={index} data={collection} />
                );
              })}
            </ul>
          </React.Fragment>
        );
      })}
    </>
  );
}

AppointmentListGroup.propTypes = {
  data: PropTypes.array,
};
