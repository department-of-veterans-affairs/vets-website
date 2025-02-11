import React from 'react';
import { VaBreadcrumbs } from '@department-of-veterans-affairs/web-components/react-bindings';
import { useRouteMatch } from 'react-router-dom';
import { giDocumentTitle, formatProgramType } from '../utils/helpers';

const GiBillBreadcrumbs = () => {
  const ProgramsTypeMatch = useRouteMatch(
    '/institution/:facilityCode/:programType',
  );
  const profileMatch = useRouteMatch('/institution/:facilityCode');
  const compareMatch = useRouteMatch('/compare');
  const lcMatch = useRouteMatch('/lc-search');
  const lcResultsMatch = useRouteMatch('/lc-search/results');
  const lcResultInfoMatch = useRouteMatch('/lc-search/:type/:id');
  const crumbLiEnding = giDocumentTitle();
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
      label: crumbLiEnding,
    },
  ];

  if (profileMatch) {
    crumbs.push({
      href: `/education/gi-bill-comparison-tool/institution/${
        profileMatch.params.facilityCode
      }`,
      label: 'Institution details',
    });
  }
  if (ProgramsTypeMatch) {
    crumbs.push({
      href: `/institution/${ProgramsTypeMatch.params.facilityCode}/${
        ProgramsTypeMatch.params.programType
      }`,
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
