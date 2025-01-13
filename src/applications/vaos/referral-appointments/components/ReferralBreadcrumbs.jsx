import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useHistory } from 'react-router-dom';
import { VaBreadcrumbs } from '@department-of-veterans-affairs/web-components/react-bindings';

import manifest from '../../manifest.json';
import { selectCurrentPage } from '../redux/selectors';
import { useGetReferralById } from '../hooks/useGetReferralById';
import { getReferralBreadcumb, routeToPreviousReferralPage } from '../flow';

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

export default function ReferralBreadcrumbs() {
  const location = useLocation();
  const history = useHistory();
  const currentPage = useSelector(selectCurrentPage);
  const params = new URLSearchParams(location.search);
  const id = params.get('id');
  const { currentReferral } = useGetReferralById(id);

  const [breadcrumb, setBreadcrumb] = useState(
    getReferralBreadcumb(
      location,
      currentPage,
      id,
      currentPage?.CategoryOfCare,
    ),
  );

  useEffect(
    () => {
      setBreadcrumb(() =>
        getReferralBreadcumb(
          location,
          currentPage,
          id,
          currentReferral?.CategoryOfCare,
        ),
      );
    },
    [location, currentPage, currentReferral?.CategoryOfCare, id],
  );

  const content = breadcrumb?.useBackBreadcrumb ? (
    <nav aria-label="backlink" className="vads-u-padding-y--2 ">
      <va-link
        back
        aria-label="Back link"
        data-testid="back-link"
        text={breadcrumb.label}
        href={breadcrumb.href}
        onClick={e => {
          e.preventDefault();
          routeToPreviousReferralPage(history, currentPage, id);
        }}
      />
    </nav>
  ) : (
    <VaBreadcrumbs
      role="navigation"
      data-testid="breadcrumbs"
      aria-label="Breadcrumbs"
      breadcrumbList={[...BREADCRUMB_BASE, breadcrumb]}
      home-veterans-affairs
      uswds
    />
  );

  return (
    <div className="vaos-hide-for-print mobile:vads-u-margin-bottom--0 mobile-lg:vads-u-margin-bottom--1 medium-screen:vads-u-margin-bottom--2">
      {content}
    </div>
  );
}
