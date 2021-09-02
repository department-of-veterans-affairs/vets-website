import React from 'react';
import Breadcrumbs from '@department-of-veterans-affairs/component-library/Breadcrumbs';
import { useRouteMatch, Link, useHistory } from 'react-router-dom';
import { useQueryParams } from '../utils/helpers';

const GiBillBreadcrumbs = () => {
  const profileMatch = useRouteMatch('/institution/:facilityCode');
  const compareMatch = useRouteMatch('/compare');
  const queryParams = useQueryParams();
  const version = queryParams.get('version');
  const history = useHistory();

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

  if (history.location?.state?.prevPath) {
    crumbs.push(
      <Link onClick={() => history.goBack()}>Compare institutions</Link>,
    );
  }

  if (profileMatch) {
    crumbs.push(
      <Link
        to={`/institution/${profileMatch.params.facilityCode}`}
        key="result-detail"
      >
        School details
      </Link>,
    );
  }

  if (compareMatch) {
    crumbs.push(
      <Link to={root} key="main">
        Compare schools
      </Link>,
    );
  }

  return <Breadcrumbs>{crumbs}</Breadcrumbs>;
};

export default GiBillBreadcrumbs;
