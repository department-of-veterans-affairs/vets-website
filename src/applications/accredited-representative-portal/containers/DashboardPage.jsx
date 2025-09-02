import React, { useEffect } from 'react';
import { useLocation, useLoaderData } from 'react-router-dom';
import { VaBreadcrumbs } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { dashboardBC, DASHBOARD_BC_LABEL } from '../utilities/poaRequests';
import Unauthorized from '../components/Dashboard/Unauthorized';
import Authorized from '../components/Dashboard/Authorized';
import api from '../utilities/api';

const DashboardPage = props => {
  const { title } = props || {};
  const location = useLocation();
  const loaderData = useLoaderData();
  const params = new URLSearchParams(location.search);
  const unauthorizedParam = (params.get('unauthorized') || '').toLowerCase();
  const isUnauthorizedQuery = ['1', 'true', 'yes'].includes(unauthorizedParam);
  const isAuthorized = loaderData?.authorized === true;

  useEffect(
    () => {
      if (title) document.title = title;
    },
    [title],
  );
  return (
    <section className="dashboard">
      <div className="arp-container">
        <VaBreadcrumbs
          breadcrumbList={dashboardBC}
          label={DASHBOARD_BC_LABEL}
          homeVeteransAffairs={false}
        />
        {isUnauthorizedQuery || !isAuthorized ? (
          <Unauthorized />
        ) : (
          <Authorized />
        )}
      </div>
    </section>
  );
};

DashboardPage.loader = async ({ request }) => {
  // If explicitly marked unauthorized in query params, skip server call
  const { searchParams } = new URL(request.url);
  const unauthorizedParam = (
    searchParams.get('unauthorized') || ''
  ).toLowerCase();
  const isUnauthorizedQuery = ['1', 'true', 'yes'].includes(unauthorizedParam);
  if (isUnauthorizedQuery) return { authorized: false };

  const res = await api.checkAuthorized();
  // Bubble up 401 to the route guard so it can redirect to sign-in
  if (res.status === 401) throw res;
  // 403 → unauthorized
  if (res.status === 403) return { authorized: false };
  // 204 → authorized
  if (res.status === 204) return { authorized: true };
  // On other/unexpected status, render Unauthorized to be safe
  return { authorized: false };
};

export default DashboardPage;
