import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';
import { VaBreadcrumbs } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { useSelector } from 'react-redux';
import manifest from '../manifest.json';
import { getUrlLabel } from '../new-appointment/newAppointmentFlow';
import { getCovidUrlLabel } from '../covid-19-vaccine/flow';
import { getPageFlow } from '../referral-appointments/flow';

export default function VAOSBreadcrumbs({ children, labelOverride }) {
  const location = useLocation();
  // get boolean if single va location

  const [breadcrumb, setBreadcrumb] = useState([]);

  const label = useSelector(state => getUrlLabel(state, location));
  const covidLabel = useSelector(state => getCovidUrlLabel(state, location));
  const newLabel = labelOverride || label || covidLabel;

  // get referrer query param
  const searchParams = new URLSearchParams(location.search);
  const referrer = searchParams.get('referrer');

  useEffect(() => {
    setBreadcrumb(newLabel);
  }, [location, newLabel]);

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
        href: manifest.rootUrl,
        label: 'Appointments',
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
        role="navigation"
        aria-label="Breadcrumbs"
        class="vaos-hide-for-print mobile:vads-u-margin-bottom--0 mobile-lg:vads-u-margin-bottom--1 medium-screen:vads-u-margin-bottom--2"
        breadcrumbList={getBreadcrumbList()}
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
