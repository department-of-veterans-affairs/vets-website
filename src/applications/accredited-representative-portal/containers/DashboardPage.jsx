import React, { useEffect } from 'react';
import { useLocation, useLoaderData } from 'react-router-dom';
import { VaBreadcrumbs } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { focusElement } from 'platform/utilities/ui';
import { dashboardBC, DASHBOARD_BC_LABEL } from '../utilities/poaRequests';
import Unauthorized from '../components/Dashboard/Unauthorized';
import Authorized from '../components/Dashboard/Authorized';
import api from '../utilities/api';

const DashboardPage = props => {
  const { title } = props || {};
  const location = useLocation();
  const loaderData = useLoaderData();
  const params = new URLSearchParams(location.search);
  const unauthorizedParam = params.has('unauthorized');
  const isAuthorized = loaderData?.authorized === true;
  localStorage.setItem('userAuthorized', isAuthorized);
  useEffect(
    () => {
      if (title) document.title = title;
      focusElement('h1');
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
        {unauthorizedParam || !isAuthorized ? <Unauthorized /> : <Authorized />}
      </div>
    </section>
  );
};

DashboardPage.loader = async ({ request }) => {
  // If explicitly marked unauthorized in query params, skip server call
  const { searchParams } = new URL(request.url);
  const unauthorizedParam = searchParams.has('unauthorized');
  if (unauthorizedParam) return { authorized: false };

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
