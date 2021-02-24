import React from 'react';
import Breadcrumbs from '@department-of-veterans-affairs/component-library/Breadcrumbs';
import { useRouteMatch, Link } from 'react-router-dom';
import { useQueryParams } from '../utils/helpers';

const GiBillBreadcrumbs = () => {
  const profileMatch = useRouteMatch('/profile/:facilityCode');
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

  const onProfilePage = profileMatch;

  if (onProfilePage) {
    crumbs.push(
      <Link
        to={`/profile/${profileMatch.params.facilityCode}`}
        key="result-detail"
      >
        School details
      </Link>,
    );
  }

  return <Breadcrumbs>{crumbs}</Breadcrumbs>;
};

export default GiBillBreadcrumbs;
