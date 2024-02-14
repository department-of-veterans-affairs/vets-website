import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { NavLink, useLocation } from 'react-router-dom';
import { recordEvent } from '@department-of-veterans-affairs/platform-monitoring/exports';
import { useSelector } from 'react-redux';
import { selectFeatureBreadcrumbUrlUpdate } from '../redux/selectors';
import { GA_PREFIX } from '../utils/constants';

export default function VAOSBreadcrumbs({ children }) {
  const featureBreadcrumbUrlUpdate = useSelector(state =>
    selectFeatureBreadcrumbUrlUpdate(state),
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
      uswds={false}
    >
      <a href="/" key="home" onClick={handleClick('home')}>
        {featureBreadcrumbUrlUpdate ? 'VA.gov home' : 'Home'}
      </a>
      <a
        href={featureBreadcrumbUrlUpdate ? '/my-health' : '/health-care'}
        key={featureBreadcrumbUrlUpdate ? '/my-health' : 'health-care'}
        onClick={handleClick(
          featureBreadcrumbUrlUpdate ? '/my-health' : 'health-care',
        )}
      >
        {featureBreadcrumbUrlUpdate ? 'My HealtheVet' : 'Health care'}
      </a>
      {!featureBreadcrumbUrlUpdate && (
        <a
          href="/health-care/schedule-view-va-appointments"
          key="schedule-view-va-appointments"
          onClick={handleClick('schedule-managed')}
        >
          Schedule and manage health appointments
        </a>
      )}
      <NavLink to="/" id="vaos-home">
        Appointments
      </NavLink>

      {isPast && (
        <li className="va-breadcrumbs-li">
          <NavLink to="/past" id="past">
            {featureBreadcrumbUrlUpdate ? 'Past appointments' : 'Past'}
          </NavLink>
        </li>
      )}

      {isPending && (
        <li className="va-breadcrumbs-li">
          <NavLink to="/pending" id="pending">
            {featureBreadcrumbUrlUpdate ? 'Pending appointments' : 'Pending'}
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
