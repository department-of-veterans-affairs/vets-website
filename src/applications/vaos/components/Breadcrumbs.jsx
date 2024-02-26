import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';
import { VaBreadcrumbs } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { useSelector } from 'react-redux';
import manifest from '../manifest.json';
import {
  getFormPageInfo,
  getTypeOfCare,
  getFacilityPageV2Info,
} from '../new-appointment/redux/selectors';
import { lowerCase } from '../utils/formatters';
import { getUrlLabel } from '../new-appointment/newAppointmentFlow';
import { getCovidUrlLabel } from '../covid-19-vaccine/flow';

export default function VAOSBreadcrumbs({ children }) {
  const location = useLocation();
  // get boolean if single va location
  const { singleValidVALocation } = useSelector(state =>
    getFacilityPageV2Info(state),
  );
  // get form data that contains selected type of care
  const { data } = useSelector(state => getFormPageInfo(state));
  const typeOfCare = getTypeOfCare(data);
  const { facilityType } = data;
  const [breadcrumb, setBreadcrumb] = useState([]);

  const label = useSelector(state => getUrlLabel(state, location));
  const covidLabel = useSelector(state => getCovidUrlLabel(state, location));
  const newLabel = label === undefined || label === null ? covidLabel : label;

  useEffect(
    () => {
      setBreadcrumb(newLabel);
    },
    [location, newLabel],
  );

  const getBreadcrumbList = () => {
    const isPast = location.pathname.includes('/past');
    const isPending = location.pathname.includes('/pending');
    const isPreferredProvider = location.pathname.includes(
      '/preferred-provider',
    );

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
    if (window.location.pathname === `${manifest.rootUrl}/`) {
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
    if (isPreferredProvider) {
      return [
        ...BREADCRUMB_BASE,
        {
          href: window.location.href,
          label: `Request a ${lowerCase(typeOfCare.name)} provider`,
        },
      ];
    }
    if (singleValidVALocation && breadcrumb === 'Choose a VA location') {
      return [
        ...BREADCRUMB_BASE,
        { href: window.location.href, label: 'Your appointment location' },
      ];
    }
    // community care's reason page is text entry only
    if (
      facilityType === 'communityCare' &&
      breadcrumb === 'Choose a reason for this appointment'
    ) {
      return [
        ...BREADCRUMB_BASE,
        {
          href: window.location.href,
          label: 'Tell us the reason for this appointment',
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
        class="vaos-hide-for-print xsmall-screen:vads-u-margin-bottom--0 small-screen:vads-u-margin-bottom--1 medium-screen:vads-u-margin-bottom--2"
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
};
