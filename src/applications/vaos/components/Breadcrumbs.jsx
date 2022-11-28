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
  // const breadcrumbsRef = useRef(null);

  //   useEffect(
  //     () => {
  //       const updateBreadcrumbs = () => {
  //         const anchorNodes = Array.from(
  //           breadcrumbsRef.current.querySelectorAll('va-link'),
  //         );
  //
  //         anchorNodes.forEach((node, index) => {
  //           const crumb = node.shadowRoot.querySelector('a');
  //
  //           crumb.removeAttribute('aria-current');
  //
  //           if (index === anchorNodes.length - 1) {
  //             crumb.setAttribute('aria-current', 'page');
  //           }
  //         });
  //       };
  //       updateBreadcrumbs();
  //     },
  //     [location, breadcrumbsRef],
  //   );

  return (
    <va-breadcrumbs
      role="navigation"
      aria-label="Breadcrumbs"
      // ref={breadcrumbsRef}
      className="vaos-hide-for-print"
    >
      <a href="/" key="home">
        Home
      </a>
      <a
        href="/health-care"
        key="health-care"
        data-testid="vaos-healthcare-link"
      >
        Health care
      </a>
      <a
        href="/health-care/schedule-view-va-appointments"
        key="schedule-view-va-appointments"
        text="Schedule and manage health appointments"
        data-testid="vaos-home-link"
      >
        Schedule and manage health appointments
      </a>
      {!featureStatusImprovement && (
        <li className="va-breadcrumbs-li">
          <va-link
            href="/health-care/schedule-view-va-appointments/appointments/"
            key="vaos-home"
            text="VA online scheduling"
          />
        </li>
      )}
      {featureStatusImprovement && (
        <li className="va-breadcrumbs-li">
          <va-link
            href="/health-care/schedule-view-va-appointments/appointments/"
            key="vaos-home"
            text="Your appointments"
          />
        </li>
      )}

      {isPast && (
        <li className="va-breadcrumbs-li">
          <va-link
            href="/health-care/schedule-view-va-appointments/appointments/past"
            key="past"
            text="Past"
          />
        </li>
      )}

      {isPending && (
        <li className="va-breadcrumbs-li">
          <va-link
            href="/health-care/schedule-view-va-appointments/appointments/pending"
            key="pending"
            text="Pending"
          />
        </li>
      )}

      {children}
    </va-breadcrumbs>
  );
}

VAOSBreadcrumbs.propTypes = {
  children: PropTypes.object,
};
