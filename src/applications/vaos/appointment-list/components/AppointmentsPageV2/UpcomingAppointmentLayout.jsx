import classNames from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';
import { getLink } from '../../../services/appointment';
import AppointmentColumnLayout from './AppointmentColumnLayout';
import AppointmentFlexGrid from './AppointmentFlexGrid';
import AppointmentListItem from './AppointmentListItem';

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
            'small-desktop-screen:vads-u-padding-left--1p5',
            'small-desktop-screen:vads-u-padding-right--1p5',
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
                  <AppointmentFlexGrid idClickable={idClickable} link={link}>
                    <AppointmentColumnLayout
                      data={appt}
                      first={isFirstInDay}
                      grouped
                      link={link}
                    />
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
            'small-desktop-screen:vads-u-padding-left--1p5',
            'small-desktop-screen:vads-u-padding-right--1p5',
            'vaos-appts__listItem',
            'vaos-appts__listItem--clickable',
            {
              'vads-u-border-bottom--1px': !isLastInMonth,
              'vads-u-border-color--gray-medium': !isLastInMonth,
            },
          )}
        >
          <AppointmentFlexGrid idClickable={idClickable} link={link}>
            <AppointmentColumnLayout first data={appt} link={link} />
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
