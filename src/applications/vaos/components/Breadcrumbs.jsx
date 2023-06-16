import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { NavLink, useLocation } from 'react-router-dom';
import recordEvent from 'platform/monitoring/record-event';
import { useSelector } from 'react-redux';
import { selectFeatureStatusImprovement } from '../redux/selectors';
import { GA_PREFIX } from '../utils/constants';

export default function VAOSBreadcrumbs({ children }) {
  const featureStatusImprovement = useSelector(state =>
    selectFeatureStatusImprovement(state),
  );
  const location = useLocation();
  const isPast = location.pathname.includes('/past');
  const isPending =
    location.pathname.includes('/pending') ||
    location.pathname.includes('/requests');
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

  const handleClick = gaEvent => {
    return () => {
      recordEvent({
        event: `${GA_PREFIX}-breadcrumb-${gaEvent}-clicked`,
      });
    };
  };

  // The va-breadcrumbs component only allows for either Link components or anchor links,
  // it will not work with the va-link component currently
  return (
    <va-breadcrumbs
      role="navigation"
      aria-label="Breadcrumbs"
      ref={breadcrumbsRef}
      class="vaos-hide-for-print"
    >
      <a href="/" key="home" onClick={handleClick('home')}>
        Home
      </a>
      <a
        href="/health-care"
        key="health-care"
        onClick={handleClick('health-care')}
      >
        Health care
      </a>
      <a
        href="/health-care/schedule-view-va-appointments"
        key="schedule-view-va-appointments"
        onClick={handleClick('schedule-managed')}
      >
        Schedule and manage health appointments
      </a>
      {!featureStatusImprovement && (
        <NavLink to="/" id="vaos-home">
          VA online scheduling
        </NavLink>
      )}
      {featureStatusImprovement && (
        <NavLink to="/" id="vaos-home">
          Appointments
        </NavLink>
      )}

      {isPast && (
        <li className="va-breadcrumbs-li">
          <NavLink to="/past" id="past">
            Past
          </NavLink>
        </li>
      )}

      {featureStatusImprovement &&
        isPending && (
          <li className="va-breadcrumbs-li">
            <NavLink to="/pending" id="pending">
              Pending
            </NavLink>
          </li>
        )}

      {children}
    </va-breadcrumbs>
  );
}

VAOSBreadcrumbs.propTypes = {
  children: PropTypes.object,
};
