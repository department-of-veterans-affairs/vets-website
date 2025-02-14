import React from 'react';
import { VaBreadcrumbs } from '@department-of-veterans-affairs/web-components/react-bindings';
import { useLocation, useRouteMatch } from 'react-router-dom';
import { useFeatureToggle } from 'platform/utilities/feature-toggles';
import {
  isSearchByNamePage,
  isSearchByLocationPage,
  formatProgramType,
} from '../utils/helpers';

const GiBillBreadcrumbs = () => {
  const { useToggleValue, TOGGLE_NAMES } = useFeatureToggle();
  const isUpdatedGi = useToggleValue(TOGGLE_NAMES.isUpdatedGi);
  const location = useLocation();
  const ProgramsTypeMatch = useRouteMatch(
    '/institution/:facilityCode/:programType',
  );
  const schoolsEmployersMatch = useRouteMatch('/schools-and-employers');
  const profileMatch = useRouteMatch('/institution/:facilityCode');
  const compareMatch = location.pathname.includes('/compare');
  const lcMatch = useRouteMatch('/lc-search');
  const lcResultsMatch = useRouteMatch('/lc-search/results');
  const lcResultInfoMatch = useRouteMatch('/lc-search/:type/:id');

  const formatedProgramType = formatProgramType(
    ProgramsTypeMatch?.params?.programType,
  );
  const crumbs = [
    {
      href: '/',
      label: 'Home',
    },
    {
      href: '/education',
      label: 'Education and training',
    },
    {
      href: '/education/gi-bill-comparison-tool/',
      label: 'GI Bill® Comparison Tool',
    },
  ];

  if (schoolsEmployersMatch) {
    const searchByName = isSearchByNamePage();
    const searchByLocationPage = isSearchByLocationPage();
    crumbs.push({
      href: '/education/gi-bill-comparison-tool/schools-and-employers',
      label: `Schools and employers ${searchByName ? '(Search by name)' : ''}${
        searchByLocationPage ? '(Search by location}' : ''
      }`,
    });
  }

  if (profileMatch) {
    crumbs.push({
      href: `/education/gi-bill-comparison-tool/${
        isUpdatedGi ? 'schools-and-employers/' : ''
      }institution/${profileMatch.params.facilityCode}`,
      label: 'Institution details',
    });
  }
  if (ProgramsTypeMatch) {
    crumbs.push({
      href: `${isUpdatedGi ? '/schools-and-employers' : ''}/institution/${
        ProgramsTypeMatch.params.facilityCode
      }/${ProgramsTypeMatch.params.programType}`,
      label: `${formatedProgramType}`,
    });
  }
  if (compareMatch) {
    crumbs.push({
      href: '/',
      label: 'Institution comparison',
    });
  }
  if (lcMatch) {
    crumbs.push({
      href: '/education/gi-bill-comparison-tool/lc-search',
      label: 'Licenses & Certifications',
    });
  }
  if (lcResultsMatch) {
    crumbs.push({
      href: '/education/gi-bill-comparison-tool/lc-search/results',
      label: 'Search Results',
    });
  }
  if (lcResultInfoMatch) {
    crumbs.push({
      href: `/education/gi-bill-comparison-tool/lc-search/results/${
        lcResultInfoMatch.params.type
      }/${lcResultInfoMatch.params.id}`,
      label: 'Result Details',
    });
  }

  return (
    <div className="row">
      <VaBreadcrumbs uswds breadcrumbList={crumbs} />
    </div>
  );
};

export default GiBillBreadcrumbs;
