import classNames from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';
import { getLink } from '../../../services/appointment';
import AppointmentColumnLayout from './AppointmentColumnLayout';
import AppointmentFlexGrid from './AppointmentFlexGrid';
import AppointmentListItem from './AppointmentListItem';
import AppointmentRow from './AppointmentRow';

export default function UpcomingAppointmentLayout({
  featureStatusImprovement,
  hashTable,
}) {
  const keys = Object.keys(hashTable);

  return keys.map((key, i) => {
    const isLastInMonth = i === keys.length - 1;

    if (hashTable[key].length > 1) {
      // Group by day
      return (
        <li
          key={key}
          className={classNames(
            'small-screen:vads-u-border-top--0',
            'vaos-appts__listItem',
            {
              'vads-u-border-bottom--1px': !isLastInMonth,
              'vads-u-border-color--gray-medium': !isLastInMonth,
            },
          )}
        >
          <ul className="usa-unstyled-list vaos-appts__list">
            {hashTable[key].map((appt, j) => {
              const isFirstInDay = j === 0;
              const link = getLink({
                featureStatusImprovement,
                appointment: appt,
              });
              const idClickable = `id-${appt.id.replace('.', '\\.')}`;

              return (
                <AppointmentListItem
                  key={`${key}-${j + 1}`}
                  id={appt.id}
                  className="vaos-appts__listItem--clickable"
                >
                  <AppointmentFlexGrid
                    idClickable={idClickable}
                    link={link}
                    className="vaos-appts__column-gap--2"
                  >
                    <AppointmentRow className="xsmall-screen:vads-u-flex-direction--row">
                      <AppointmentColumnLayout
                        data={appt}
                        first={isFirstInDay}
                        grouped
                        link={link}
                      />
                    </AppointmentRow>
                  </AppointmentFlexGrid>
                </AppointmentListItem>
              );
            })}
          </ul>
        </li>
      );
    }

    return hashTable[key].map(appt => {
      const idClickable = `id-${appt.id.replace('.', '\\.')}`;

      const link = getLink({
        featureStatusImprovement,
        appointment: appt,
      });

      return (
        <AppointmentListItem
          key={appt.id}
          id={appt.id}
          className={classNames(
            'small-screen:vads-u-border-top--0',
            'vaos-appts__listItem',
            'vaos-appts__listItem--clickable',
            {
              'vads-u-border-bottom--1px': !isLastInMonth,
              'vads-u-border-color--gray-medium': !isLastInMonth,
            },
          )}
        >
          <AppointmentFlexGrid idClickable={idClickable} link={link}>
            <AppointmentRow className="xsmall-screen:vads-u-flex-direction--row">
              <AppointmentColumnLayout first data={appt} link={link} />
            </AppointmentRow>
          </AppointmentFlexGrid>
        </AppointmentListItem>
      );
    });
  });
}

UpcomingAppointmentLayout.propTypes = {
  featureStatusImprovement: PropTypes.bool,
  hashTable: PropTypes.object,
};
