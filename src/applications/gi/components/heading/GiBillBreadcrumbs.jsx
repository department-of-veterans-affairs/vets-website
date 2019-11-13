import { Link } from 'react-router';
import React from 'react';
import Breadcrumbs from '@department-of-veterans-affairs/formation-react/Breadcrumbs';

export default function GiBillBreadcrumbs({
  searchQuery,
  facilityCode,
  location,
}) {
  const { pathname, query } = location;

  const root = {
    pathname: '',
    query: query && query.version ? { version: query.version } : {},
  };

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

  const onSearchPage =
    pathname.match(/search/) || pathname.match(/program-search/);
  const onProfilePage = pathname.match(/profile/);

  if (searchQuery && (onSearchPage || onProfilePage)) {
    crumbs.push(
      <Link
        to={{ pathname: 'search', query: searchQuery }}
        key="search-results"
      >
        Search results
      </Link>,
    );
  }

  if (onProfilePage) {
    crumbs.push(
      <Link to={`profile/${facilityCode}`} key="result-detail">
        School details
      </Link>,
    );
  }

  return <Breadcrumbs>{crumbs}</Breadcrumbs>;
}
