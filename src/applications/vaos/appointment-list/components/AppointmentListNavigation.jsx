import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import recordEvent from 'platform/monitoring/record-event';
import { selectFeatureStatusImprovement } from '../../redux/selectors';
import { GA_PREFIX } from '../../utils/constants';

function handleClick({ history, callback }) {
  return event => {
    if (event.target.id === 'pending') {
      history.push('/pending');
      callback(true);
      recordEvent({
        event: `${GA_PREFIX}-status-pending-link-clicked`,
      });
    }
    if (event.target.id === 'past') {
      recordEvent({
        event: `${GA_PREFIX}-status-past-link-clicked`,
      });
      history.push('/past');
      callback(true);
    }
  };
}

export default function AppointmentListNavigation({ count, callback }) {
  const history = useHistory();
  const location = useLocation();
  const featureStatusImprovement = useSelector(state =>
    selectFeatureStatusImprovement(state),
  );

  if (featureStatusImprovement) {
    // Only display navigation on upcoming appointments page
    if (
      location.pathname.endsWith('pending') ||
      location.pathname.endsWith('past')
    ) {
      return null;
    }

    return (
      <nav
        aria-label="Appointment list navigation"
        className="vaos-appts__breadcrumb"
      >
        <ul>
          <li>
            <button
              id="pending"
              type="button"
              className="va-button-link"
              onClick={handleClick({
                history,
                callback,
              })}
            >
              {`Pending (${count})`}
            </button>
          </li>
          <li>
            <button
              id="past"
              type="button"
              className="va-button-link"
              onClick={handleClick({
                history,
                callback,
              })}
            >
              Past
            </button>
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
