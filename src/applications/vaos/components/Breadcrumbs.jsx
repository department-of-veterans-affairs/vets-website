import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';
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

  // The va-breadcrumbs component only allows for either Link components or anchor links,
  // it will not work with the va-link component currently
  return (
    <va-breadcrumbs
      role="navigation"
      aria-label="Breadcrumbs"
      ref={breadcrumbsRef}
      class="vaos-hide-for-print"
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
        <a
          href="/health-care/schedule-view-va-appointments/appointments"
          key="vaos-home"
        >
          VA online scheduling
        </a>
      )}
      {featureStatusImprovement && (
        <a
          href="/health-care/schedule-view-va-appointments/appointments"
          key="vaos-home"
        >
          Your appointments
        </a>
      )}

      {isPast && (
        <li className="va-breadcrumbs-li">
          <a
            href="/health-care/schedule-view-va-appointments/appointments/past"
            key="past"
          >
            Past
          </a>
        </li>
      )}

      {isPending && (
        <li className="va-breadcrumbs-li">
          <a
            href="/health-care/schedule-view-va-appointments/appointments/pending"
            key="pending"
          >
            Pending
          </a>
        </li>
      )}

      {children}
    </va-breadcrumbs>
  );
}

VAOSBreadcrumbs.propTypes = {
  children: PropTypes.object,
};
