import React from 'react';
import { useLocation, NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import recordEvent from 'platform/monitoring/record-event';
import { selectFeatureStatusImprovement } from '../../redux/selectors';
import { GA_PREFIX } from '../../utils/constants';

export default function AppointmentListNavigation({ count, callback }) {
  const location = useLocation();
  const featureStatusImprovement = useSelector(state =>
    selectFeatureStatusImprovement(state),
  );

  if (featureStatusImprovement) {
    const isPending = location.pathname.endsWith('/pending');
    const isPast = location.pathname.endsWith('/past');
    const isUpcoming = location.pathname.endsWith('/');

    return (
      <nav
        aria-label="Appointment list navigation"
        className={`vaos-appts__breadcrumb xsmall-screen:${
          isPast ? 'vads-u-margin-bottom--2' : 'vads-u-margin-bottom--3'
        } small-screen:vads-u-margin-bottom--4`}
      >
        <ul>
          <li>
            <NavLink
              id="upcoming"
              to="/"
              onClick={() => callback(true)}
              // eslint-disable-next-line jsx-a11y/aria-proptypes
              aria-current={isUpcoming}
            >
              Upcoming
            </NavLink>
          </li>
          <li>
            <NavLink
              id="pending"
              to="/pending"
              onClick={() => {
                callback(true);
                recordEvent({
                  event: `${GA_PREFIX}-status-pending-link-clicked`,
                });
              }}
              // eslint-disable-next-line jsx-a11y/aria-proptypes
              aria-current={isPending}
            >
              {`Pending (${count})`}
            </NavLink>
          </li>
          <li>
            <NavLink
              id="past"
              to="/past"
              onClick={() => {
                callback(true);
                recordEvent({
                  event: `${GA_PREFIX}-status-past-link-clicked`,
                });
              }}
              // eslint-disable-next-line jsx-a11y/aria-proptypes
              aria-current={isPast}
            >
              Past
            </NavLink>
          </li>
        </ul>
      </nav>
    );
  }

  return null;
}

AppointmentListNavigation.propTypes = {
  callback: PropTypes.func.isRequired,
  count: PropTypes.number.isRequired,
};
