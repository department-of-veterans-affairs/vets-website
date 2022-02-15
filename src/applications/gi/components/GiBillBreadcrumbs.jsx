import React from 'react';
import Breadcrumbs from '@department-of-veterans-affairs/component-library/Breadcrumbs';
import { useRouteMatch, Link } from 'react-router-dom';
import environment from 'platform/utilities/environment';
import { useQueryParams } from '../utils/helpers';

const GiBillBreadcrumbs = () => {
  const profileMatch = useRouteMatch('/institution/:facilityCode');
  const compareMatch = useRouteMatch('/compare');
  const queryParams = useQueryParams();
  const version = queryParams.get('version');

  const root = version
    ? {
        pathname: '/',
      }
    : '/';

  const crumbs = [
    <a href="/" key="home">
      Home
    </a>,
    <a href="/education/" key="education">
      Education and training
    </a>,
    <Link to={root} key="main">
      GI Bill® Comparison Tool
    </Link>,
  ];

  if (profileMatch) {
    crumbs.push(
      <Link
        to={`/institution/${profileMatch.params.facilityCode}`}
        key="result-detail"
      >
        Institution details
      </Link>,
    );
  }

  if (compareMatch) {
    crumbs.push(
      <Link to={root} key="main">
        {environment.isProduction()
          ? 'Compare schools'
          : 'Institution comparison'}
      </Link>,
    );
  }

  return <Breadcrumbs>{crumbs}</Breadcrumbs>;
};

export default GiBillBreadcrumbs;
