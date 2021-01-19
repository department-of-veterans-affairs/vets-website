import React from 'react';
import Breadcrumbs from '@department-of-veterans-affairs/component-library/Breadcrumbs';
import { useRouteMatch, Link } from 'react-router-dom';
import appendQuery from 'append-query';
import { useQueryParams } from '../../utils/helpers';

export default function GiBillBreadcrumbs({ searchQuery }) {
  const profileMatch = useRouteMatch('/profile/:facilityCode');
  const searchMatch = useRouteMatch('/search');
  const programSearchMatch = useRouteMatch('/program-search');
  const queryParams = useQueryParams();
  const version = queryParams.get('version');

  const root = version
    ? {
        pathname: '/',
        search: queryParams.toString(),
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

  const onSearchPage = searchMatch || programSearchMatch;
  const onProfilePage = profileMatch;

  if (searchQuery && (onSearchPage || onProfilePage)) {
    const searchResultsPath =
      onProfilePage && profileMatch.params.facilityCode.substr(1, 1) === 'V'
        ? 'program-search'
        : 'search';

    crumbs.push(
      <Link
        to={appendQuery(`/${searchResultsPath}/`, searchQuery)}
        key="search-results"
      >
        Search results
      </Link>,
    );
  }

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
}
