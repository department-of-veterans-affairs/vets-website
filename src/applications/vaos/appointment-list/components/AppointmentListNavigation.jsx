import React from 'react';
import { useLocation, NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import { recordEvent } from '@department-of-veterans-affairs/platform-monitoring/exports';
import classNames from 'classnames';
import { GA_PREFIX } from '../../utils/constants';
import PrintButton from '../pages/UpcomingAppointmentsDetailsPage/PrintButton';

export default function AppointmentListNavigation({
  count,
  callback,
  hidePendingTab = false,
}) {
  const location = useLocation();

  const isPending = location.pathname.endsWith('/pending');
  const isPast = location.pathname.endsWith('/past');
  const isUpcoming = location.pathname.endsWith('/');

  return (
    <div
      className={classNames(
        `vaos-hide-for-print vads-l-row mobile:vads-u-border-bottom--0
           vads-u-margin-bottom--3 small-screen:${
             isPast ? 'vads-u-margin-bottom--3' : 'vads-u-margin-bottom--4'
           } mobile-lg:vads-u-border-bottom--1px vads-u-color--gray-medium`,
      )}
    >
      <nav
        aria-label="Appointment list"
        className="vaos-appts__breadcrumb vads-u-flex--1 vads-u-padding-top--0p5"
      >
        <ul>
          <li>
            <NavLink
              to="/"
              onClick={() => callback(true)}
              aria-current={
                Boolean(isUpcoming).toString() // eslint-disable-next-line jsx-a11y/aria-proptypes
              }
            >
              Upcoming
            </NavLink>
          </li>
          {!hidePendingTab && (
            <li>
              <NavLink
                to="/pending"
                style={{ whiteSpace: 'nowrap' }}
                onClick={() => {
                  callback(true);
                  recordEvent({
                    event: `${GA_PREFIX}-status-pending-link-clicked`,
                  });
                }}
                aria-current={
                  Boolean(isPending).toString() // eslint-disable-next-line jsx-a11y/aria-proptypes
                }
              >
                {`Pending (${count})`}
              </NavLink>
            </li>
          )}
          <li>
            <NavLink
              to="/past"
              onClick={() => {
                callback(true);
                recordEvent({
                  event: `${GA_PREFIX}-status-past-link-clicked`,
                });
              }}
              aria-current={
                Boolean(isPast).toString() // eslint-disable-next-line jsx-a11y/aria-proptypes
              }
            >
              Past
            </NavLink>
          </li>
        </ul>
      </nav>{' '}
      <div className="vads-u-margin-bottom--1">
        <PrintButton className="vads-u-flex--auto " />
      </div>
    </div>
  );
}

AppointmentListNavigation.propTypes = {
  callback: PropTypes.func.isRequired,
  count: PropTypes.number.isRequired,
  hidePendingTab: PropTypes.bool,
};
