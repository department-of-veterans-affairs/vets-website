import React from 'react';
import { VaBreadcrumbs } from '@department-of-veterans-affairs/web-components/react-bindings';
import { useRouteMatch, Link } from 'react-router-dom';
import { giDocumentTitle, useQueryParams } from '../utils/helpers';

const GiBillBreadcrumbs = () => {
  const profileMatch = useRouteMatch('/institution/:facilityCode');
  const compareMatch = useRouteMatch('/compare');
  const queryParams = useQueryParams();
  const version = queryParams.get('version');
  const crumbLiEnding = giDocumentTitle();

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
      {crumbLiEnding}
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
        Institution comparison
      </Link>,
    );
  }

  return <VaBreadcrumbs>{crumbs}</VaBreadcrumbs>;
};

export default GiBillBreadcrumbs;
