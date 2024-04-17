import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router';
import upperFirst from 'lodash/upperFirst';
import lowerCase from 'lodash/lowerCase';
import kebabCase from 'lodash/kebabCase';

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

const Breadcrumbs = ({ pathname }) => {
  const pathSegments = pathname.split('/').filter(Boolean);
  let pathAccumulator = '';
  const breadcrumbs = pathSegments.map((segment, index) => {
    if (!index) {
      return {
        link: '/',
        label: 'Home',
      };
    }

    if (index === pathSegments.length - 1) {
      return {
        link: null,
        label: formatSegment(segment),
      };
    }

    pathAccumulator += `/${segment}`;
    return {
      link: pathAccumulator,
      label: formatSegment(segment),
    };
  });

  return (
    <va-breadcrumbs
      data-testid="breadcrumbs"
      home-veterans-affairs={false}
      uswds="false"
    >
      {breadcrumbs.map(({ link, label }) => (
        <li key={label}>
          <Link data-testid={`breadcrumbs-${kebabCase(label)}`} to={link}>
            {label}
          </Link>
        </li>
      ))}
    </va-breadcrumbs>
  );
};

Breadcrumbs.propTypes = {
  pathname: PropTypes.string.isRequired,
};

export default Breadcrumbs;
