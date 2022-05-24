import React from 'react';
import { Link } from 'react-router-dom';
import { VaBreadcrumbs } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { selectFeatureStatusImprovement } from '../redux/selectors';
import { updateBreadcrumb } from '../appointment-list/redux/actions';

export default function VAOSBreadcrumbs({ children }) {
  const featureStatusImprovement = useSelector(state =>
    selectFeatureStatusImprovement(state),
  );
  const dispatch = useDispatch();
  const breadcrumbs = useSelector(state => state.appointments.breadcrumbs);

  return (
    <VaBreadcrumbs
      className="medium-screen:vads-u-padding-x--0 vaos-appts__breadcrumbs"
      aria-label="Breadcrumb"
      role="navigation"
    >
      <a href="/" key="home">
        Home
      </a>
      <a href="/health-care" key="health-care">
        Health care
      </a>
      <a
        href="/health-care/schedule-view-va-appointments"
        key="schedule-view-va-appointments"
      >
        Schedule and manage health appointments
      </a>
      {!featureStatusImprovement && (
        <Link to="/" key="vaos-home">
          VA online scheduling
        </Link>
      )}
      {featureStatusImprovement && (
        <Link
          to="/"
          key="vaos-home"
          onClick={() => dispatch(updateBreadcrumb())}
        >
          Your appointments
        </Link>
      )}
      {featureStatusImprovement &&
        breadcrumbs.map(breadcrumb => {
          return (
            <Link to={breadcrumb.path} key="breadcrumb.path">
              {breadcrumb.title}
            </Link>
          );
        })}
      {children}
    </VaBreadcrumbs>
  );
}
VAOSBreadcrumbs.propTypes = {
  children: PropTypes.object,
};
