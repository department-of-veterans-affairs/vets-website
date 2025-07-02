import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useHistory, useLocation } from 'react-router-dom';
import { VaBreadcrumbs } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { useSelector } from 'react-redux';
import manifest from '../manifest.json';
import { getUrlLabel } from '../new-appointment/newAppointmentFlow';
import { getCovidUrlLabel } from '../covid-19-vaccine/flow';
import { getPageFlow } from '../referral-appointments/flow';

export default function VAOSBreadcrumbs({ children, labelOverride }) {
  const location = useLocation();
  const [breadcrumb, setBreadcrumb] = useState([]);
  const covidLabel = getCovidUrlLabel(location) || null;
  const label = useSelector(state => getUrlLabel(state, location));
  const isCovid = location.pathname.includes('covid-vaccine/');

  const history = useHistory();

  // Only handles breadcrumb isRouterLink:true items
  function handleRouteChange({ detail }) {
    const { href } = detail;
    history.push(href);
  }

  let newLabel = labelOverride || label;
  if (isCovid) newLabel = covidLabel;

  // get referrer query param
  const searchParams = new URLSearchParams(location.search);
  const referrer = searchParams.get('referrer');

  useEffect(
    () => {
      setBreadcrumb(newLabel);
    },
    [location, newLabel],
  );

  const getBreadcrumbList = () => {
    const isPast = location.pathname.includes('/past');
    const isPending = location.pathname.includes('/pending');

    const BREADCRUMB_BASE = [
      {
        href: '/',
        label: 'Home',
      },
      {
        href: '/my-health',
        label: 'My HealtheVet',
      },
      {
        // For Breadcrumb objects that are router links, the href is relative to the manifest.rootUrl
        href: '/',
        label: 'Appointments',
        isRouterLink: true,
      },
    ];
    if (
      window.location.pathname === `${manifest.rootUrl}/` ||
      window.location.pathname === manifest.rootUrl
    ) {
      return BREADCRUMB_BASE;
    }

    if (isPast) {
      return [
        ...BREADCRUMB_BASE,
        {
          href: window.location.href,
          label: 'Past appointments',
        },
      ];
    }
    if (isPending) {
      return [
        ...BREADCRUMB_BASE,
        {
          href: window.location.href,
          label: 'Pending appointments',
        },
      ];
    }

    if (referrer) {
      const referralsRequest = getPageFlow('referralsAndRequests')
        .referralsAndRequests;

      return [
        ...BREADCRUMB_BASE,
        {
          href: `${manifest.rootUrl}/${referrer}`,
          label: referralsRequest.label,
        },
        {
          href: window.location.href,
          label: breadcrumb,
        },
      ];
    }

    return [
      ...BREADCRUMB_BASE,
      {
        href: window.location.href,
        label: breadcrumb,
      },
    ];
  };

  return (
    <>
      <VaBreadcrumbs
        data-testid="vaos-breadcrumbs"
        class="vaos-hide-for-print mobile:vads-u-margin-bottom--0 mobile-lg:vads-u-margin-bottom--1 medium-screen:vads-u-margin-bottom--2"
        breadcrumbList={getBreadcrumbList()}
        onRouteChange={handleRouteChange}
        uswds
      >
        {children}
      </VaBreadcrumbs>
    </>
  );
}

VAOSBreadcrumbs.propTypes = {
  children: PropTypes.object,
  labelOverride: PropTypes.string,
};
