import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import recordEvent from 'platform/monitoring/record-event';
import { selectFeatureStatusImprovement } from '../../redux/selectors';
import { GA_PREFIX } from '../../utils/constants';

function handleClick({ history, callback }) {
  return event => {
    if (event.target.id === 'upcoming') {
      history.push('/');
      callback(true);
    }

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
    return (
      <nav
        aria-label="Appointment list navigation"
        className="vaos-appts__breadcrumb"
      >
        <ul>
          <li>
            <button
              id="upcoming"
              type="button"
              className="va-button-link"
              onClick={handleClick({
                history,
                callback,
              })}
              // eslint-disable-next-line jsx-a11y/aria-proptypes
              aria-current={`${
                location.pathname.endsWith('/') ? 'page' : null
              }`}
            >
              Upcoming
            </button>
          </li>
          <li>
            <button
              id="pending"
              type="button"
              className="va-button-link"
              onClick={handleClick({
                history,
                callback,
              })}
              // eslint-disable-next-line jsx-a11y/aria-proptypes
              aria-current={`${
                location.pathname.endsWith('pending') ? 'page' : null
              }`}
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
              // eslint-disable-next-line jsx-a11y/aria-proptypes
              aria-current={`${
                location.pathname.endsWith('past') ? 'page' : null
              }`}
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
