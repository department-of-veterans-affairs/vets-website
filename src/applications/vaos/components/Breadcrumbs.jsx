import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { NavLink, useLocation } from 'react-router-dom';
import { recordEvent } from '@department-of-veterans-affairs/platform-monitoring/exports';
import { GA_PREFIX } from '../utils/constants';

export default function VAOSBreadcrumbs({ children }) {
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
      uswds={false}
    >
      <a href="/" key="home" onClick={handleClick('home')}>
        VA.gov home
      </a>
      <a href="/my-health" key="/my-health" onClick={handleClick('/my-health')}>
        'My HealtheVet'
      </a>
      <NavLink to="/" id="vaos-home">
        Appointments
      </NavLink>

      {isPast && (
        <li className="va-breadcrumbs-li">
          <NavLink to="/past" id="past">
            Past appointments
          </NavLink>
        </li>
      )}

      {isPending && (
        <li className="va-breadcrumbs-li">
          <NavLink to="/pending" id="pending">
            Pending appointments
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
