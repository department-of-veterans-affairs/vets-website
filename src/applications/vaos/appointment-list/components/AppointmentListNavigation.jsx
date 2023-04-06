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
    return (
      <nav
        aria-label="Appointment list navigation"
        className="vaos-appts__breadcrumb"
      >
        <ul>
          <li>
            <NavLink
              id="upcoming"
              to="/"
              onClick={() => callback(true)}
              // eslint-disable-next-line jsx-a11y/aria-proptypes
              aria-current={`${
                location.pathname.endsWith('/') ? 'true' : false
              }`}
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
              aria-current={`${
                location.pathname.endsWith('pending') ? 'true' : false
              }`}
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
              aria-current={`${
                location.pathname.endsWith('past') ? 'true' : false
              }`}
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
