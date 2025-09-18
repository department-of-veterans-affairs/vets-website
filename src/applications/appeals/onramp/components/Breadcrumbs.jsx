import React from 'react';
import PropTypes from 'prop-types';
import { VaBreadcrumbs } from '@department-of-veterans-affairs/web-components/react-bindings';
import manifest from '../manifest.json';
import { QUESTION_CONTENT } from '../constants/question-data-map';
import { getShortNameFromRoute, ROUTES } from '../constants';
import { isNonDR } from '../constants/results-data-map';
import {
  DR_HEADING,
  NON_DR_HEADING,
} from '../constants/results-content/common';

export const defaultBreadcrumbs = [
  {
    href: '/',
    label: 'Home',
  },
  {
    href: '/decision-reviews',
    label: 'Decision Reviews',
  },
  {
    href: manifest.rootUrl,
    label: 'Explore decision reviews for your disability claim',
  },
];

export const makeBreadcrumbs = (h1ForRoute, resultPage, route) => {
  const breadcrumbs = [...defaultBreadcrumbs];

  if (route !== ROUTES.INTRODUCTION && route !== ROUTES.RESULTS && h1ForRoute) {
    breadcrumbs.push({
      href: '#',
      label: h1ForRoute,
    });
  }

  if (route === ROUTES.RESULTS && resultPage) {
    const isNonDrResults = isNonDR.includes(resultPage);

    breadcrumbs.push({
      href: '#',
      label: isNonDrResults ? NON_DR_HEADING : DR_HEADING,
    });
  }

  return breadcrumbs;
};

const Breadcrumbs = ({ resultPage, route }) => {
  const shortNameForRoute = getShortNameFromRoute(route);
  const h1ForRoute = QUESTION_CONTENT?.[shortNameForRoute]?.h1 || '';
  const breadcrumbs = makeBreadcrumbs(h1ForRoute, resultPage, route);

  return (
    <VaBreadcrumbs
      class="vads-u-margin-left--1p5"
      label="Breadcrumbs"
      breadcrumbList={breadcrumbs}
    />
  );
};

Breadcrumbs.propTypes = {
  route: PropTypes.string.isRequired,
  resultPage: PropTypes.string,
};

export default Breadcrumbs;
