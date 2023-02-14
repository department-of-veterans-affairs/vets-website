import classNames from 'classnames';
import moment from 'moment';
import React from 'react';
import PropTypes from 'prop-types';
import { groupAppointmentByDay } from '../../../services/appointment';
import AppointmentListItemGroup from './AppointmentListItemGroup';

export default function AppointmentListGroup({ data }) {
  const keys = Object.keys(data);

  return (
    <>
      {keys.map((key, i) => {
        const date = moment(key, 'YYYY-MM');
        const hashTable = groupAppointmentByDay(data[key]);
        const dayKeys = Object.keys(hashTable);

        return (
          <React.Fragment key={i}>
            <h2
              id={`appointment_list_${date.format('YYYY-MM')}`}
              data-cy="upcoming-appointment-list-header"
            >
              <span className="sr-only">Appointments in </span>
              {date.format('MMMM YYYY')}
            </h2>
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
              {dayKeys.map((dayKey, index) => {
                if (dayKeys.length > 1) {
                  return (
                    <ul
                      key={index}
                      className="vads-u-padding-left--0 vads-u-border-bottom--1px"
                      style={{ margin: 0 }}
                    >
                      <AppointmentListItemGroup
                        key={index}
                        data={hashTable[dayKey]}
                      />
                    </ul>
                  );
                }
                return (
                  <AppointmentListItemGroup
                    key={index}
                    data={hashTable[dayKey]}
                  />
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
