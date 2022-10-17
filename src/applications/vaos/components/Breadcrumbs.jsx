import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { VaBreadcrumbs } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectFeatureStatusImprovement } from '../redux/selectors';

export default function VAOSBreadcrumbs({ children }) {
  const featureStatusImprovement = useSelector(state =>
    selectFeatureStatusImprovement(state),
  );
  const location = useLocation();
  const isPast = location.pathname.includes('/past');
  const isPending = location.pathname.includes('/pending');
  const breadcrumbsRef = useRef(null);

  useEffect(
    () => {
      const updateBreadcrumbs = () => {
        const anchorNodes = Array.from(
          breadcrumbsRef.current.querySelectorAll('a'),
        );

        anchorNodes.forEach((crumb, index) => {
          crumb.removeAttribute('aria-current');

          if (index === anchorNodes.length - 1) {
            crumb.setAttribute('aria-current', 'page');
          }
        });
      };
      updateBreadcrumbs();
    },
    [location, breadcrumbsRef],
  );

  return (
    <VaBreadcrumbs
      role="navigation"
      aria-label="Breadcrumbs"
      ref={breadcrumbsRef}
      className="vaos-hide-for-print"
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
          <Link to="/pending" key="pending">
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
