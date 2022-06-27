import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link, useLocation } from 'react-router-dom';
import { VaBreadcrumbs } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { useSelector } from 'react-redux';
import { selectFeatureStatusImprovement } from '../redux/selectors';

export default function VAOSBreadcrumbs({ children }) {
  const featureStatusImprovement = useSelector(state =>
    selectFeatureStatusImprovement(state),
  );
  const location = useLocation();
  const isPast = location.pathname.includes('/past');
  const isPending = location.pathname.includes('/pending');

  useEffect(
    () => {
      const updateBreadcrumbs = () => {
        // TODO: handle the aria-current on the last breadcrumb
      };
      updateBreadcrumbs();
    },
    [location],
  );

  return (
    <VaBreadcrumbs
      className="medium-screen:vads-u-padding-x--0 vaos-appts__breadcrumbs"
      role="navigation"
      aria-label="Breadcrumb"
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
        <Link to="/" key="vaos-home">
          Your appointments
        </Link>
      )}

      {isPast && (
        <li className="va-breadcrumbs-li">
          <Link to="/past" key="past">
            Past
          </Link>
        </li>
      )}

      {isPending && (
        <li className="va-breadcrumbs-li">
          <Link to="/pending" key="past">
            Pending
          </Link>
        </li>
      )}

      {children}
    </VaBreadcrumbs>
  );
}

VAOSBreadcrumbs.propTypes = {
  children: PropTypes.object,
};
