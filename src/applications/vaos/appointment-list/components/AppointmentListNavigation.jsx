import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { updateBreadcrumb } from '../redux/actions';
import { selectFeatureStatusImprovement } from '../../redux/selectors';

function handleClick({ id, history, dispatch, callback }) {
  return () => {
    if (id === 'pending') {
      history.push('/requested');
      callback(true);
      dispatch(updateBreadcrumb({ title: 'Pending', path: 'requested' }));
    }
    if (id === 'past') {
      history.push('/past');
      callback(true);
      dispatch(updateBreadcrumb({ title: 'Past', path: 'past' }));
    }
    return () => {};
  };
}

export default function AppointmentListNavigation({ count, callback }) {
  const history = useHistory();
  const dispatch = useDispatch();
  const location = useLocation();
  const featureStatusImprovement = useSelector(state =>
    selectFeatureStatusImprovement(state),
  );

  if (featureStatusImprovement) {
    // Only display navigation on upcoming appointments page
    if (
      location.pathname.endsWith('requested') ||
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
              type="button"
              className="va-button-link"
              onClick={handleClick({
                id: 'pending',
                history,
                dispatch,
                callback,
              })}
            >
              {`Pending (${count})`}
            </button>
          </li>
          <li>
            <button
              type="button"
              className="va-button-link"
              onClick={handleClick({
                id: 'past',
                history,
                dispatch,
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
