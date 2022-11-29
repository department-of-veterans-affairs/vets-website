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

  // add function given a node to remove the attribute
  // add function given a node to add an attribute

  useEffect(
    () => {
      const updateBreadcrumbs = () => {
        const anchorNodes = Array.from(
          breadcrumbsRef.current.querySelectorAll('a'),
        );

        const nodes = anchorNodes.concat(
          Array.from(breadcrumbsRef.current.querySelectorAll('va-link')),
        );

        console.log(nodes);

        nodes.forEach(node => {
          console.log(node.nodeName);
        });

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
        <va-link to="/" key="vaos-home" text="VA online scheduling" />
      )}
      {featureStatusImprovement && (
        <va-link to="/" key="vaos-home" text="Your appointments" />
      )}

      {isPast && (
        <li className="va-breadcrumbs-li">
          <va-link to="/past" key="past" text="Past" />
        </li>
      )}

      {isPending && (
        <li className="va-breadcrumbs-li">
          <va-link to="/pending" key="pending" text="Pending" />
        </li>
      )}

      {children}
    </VaBreadcrumbs>
  );
}

VAOSBreadcrumbs.propTypes = {
  children: PropTypes.object,
};
