import React from 'react';
import { useLocation } from 'react-router-dom-v5-compat';
import upperFirst from 'lodash/upperFirst';
import lowerCase from 'lodash/lowerCase';

const acronymMapping = {
  poa: 'POA',
  va: 'VA',
};

const formatSegment = segment => {
  const words = segment.split('-');

  const acronymsFixed = words.map(word => {
    if (acronymMapping[word]) {
      return acronymMapping[word];
    }
    return lowerCase(word);
  });
  return upperFirst(acronymsFixed.join(' '));
};

const Breadcrumbs = () => {
  const { pathname } = useLocation();
  const pathSegments = pathname.split('/').filter(Boolean);
  let pathAccumulator = '';
  const breadcrumbs = pathSegments.map(segment => {
    pathAccumulator += `/${segment}`;
    return {
      href: pathAccumulator,
      label: formatSegment(segment),
    };
  });
  breadcrumbs.unshift({ href: '/', label: 'Home' });
  const bcString = JSON.stringify(breadcrumbs);

  return (
    <va-breadcrumbs
      breadcrumb-list={bcString}
      data-testid="breadcrumbs"
      home-veterans-affairs={false}
    />
  );
};

export default Breadcrumbs;
