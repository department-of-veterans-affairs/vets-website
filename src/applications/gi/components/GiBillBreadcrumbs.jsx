import React from 'react';
import { VaBreadcrumbs } from '@department-of-veterans-affairs/web-components/react-bindings';
import { useLocation, useRouteMatch } from 'react-router-dom';
import {
  isSearchByNamePage,
  isSearchByLocationPage,
  formatProgramType,
} from '../utils/helpers';

const GiBillBreadcrumbs = () => {
  const location = useLocation();

  const schoolsEmployersMatch = useRouteMatch('/schools-and-employers');
  const seProfileMatch = useRouteMatch(
    '/schools-and-employers/institution/:facilityCode',
  );
  const profileMatch = useRouteMatch('/institution/:facilityCode');
  const compareMatch = location.pathname.includes('/compare');
  const seProgramsTypeMatch = useRouteMatch(
    '/schools-and-employers/institution/:facilityCode/:programType',
  );
  const programsTypeMatch = useRouteMatch(
    '/institution/:facilityCode/:programType',
  );
  const lcMatch = useRouteMatch('/licenses-certifications-and-prep-courses');
  const lcResultsMatch = useRouteMatch(
    '/licenses-certifications-and-prep-courses/results',
  );
  const lcResultInfoMatch = useRouteMatch(
    '/licenses-certifications-and-prep-courses/results/:id/:name',
  );
  const nationalExamsMatch = useRouteMatch('/national-exams');
  const nationalExamsDetailMatch = useRouteMatch('/national-exams/:examId');

  const query = new URLSearchParams(location.search);
  const selectedExamName = query.get('examName') || '';
  const searchByName = isSearchByNamePage();
  const searchByLocationPage = isSearchByLocationPage();

  const formatedProgramType = formatProgramType(
    programsTypeMatch?.params?.programType ||
      seProgramsTypeMatch?.params?.programType,
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
      label: `GI Bill® Comparison Tool ${
        searchByName &&
        !schoolsEmployersMatch &&
        !location.pathname.includes('institution')
          ? '(Search by name)'
          : ''
      }${
        searchByLocationPage &&
        !schoolsEmployersMatch &&
        !location.pathname.includes('institution')
          ? '(Search by location}'
          : ''
      }`,
    },
  ];

  if (schoolsEmployersMatch) {
    crumbs.push({
      href: '/education/gi-bill-comparison-tool/schools-and-employers',
      label: `Schools and employers ${
        searchByName && !location.pathname.includes('institution')
          ? '(Search by name)'
          : ''
      }${searchByLocationPage ? '(Search by location}' : ''}`,
    });
  }
  if (profileMatch || programsTypeMatch) {
    crumbs.push({
      href: `/education/gi-bill-comparison-tool/institution/${profileMatch
        ?.params?.facilityCode || programsTypeMatch?.params?.facilityCode}`,
      label: 'Institution details',
    });
  }
  if (seProfileMatch || seProgramsTypeMatch) {
    crumbs.push({
      href: `/education/gi-bill-comparison-tool/schools-and-employers/institution/${seProfileMatch
        ?.params?.facilityCode || seProgramsTypeMatch?.params?.facilityCode}`,
      label: 'Institution details',
    });
  }
  if (nationalExamsMatch) {
    crumbs.push({
      href: '/education/gi-bill-comparison-tool/national-exams',
      label: 'National exams',
    });
  }
  if (nationalExamsDetailMatch) {
    crumbs.push({
      href: '/education/gi-bill-comparison-tool/national-exams',
      label: selectedExamName || 'National exam details',
    });
  }
  if (programsTypeMatch) {
    crumbs.push({
      href: `/institution/${programsTypeMatch.params.facilityCode}/${
        programsTypeMatch.params.programType
      }`,
      label: `${formatedProgramType} programs`,
    });
  }
  if (seProgramsTypeMatch) {
    crumbs.push({
      href: `/schools-and-employers/institution/${
        seProgramsTypeMatch.params.facilityCode
      }/${seProgramsTypeMatch.params.programType}`,
      label: `${formatedProgramType} programs`,
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
      href:
        '/education/gi-bill-comparison-tool/licenses-certifications-and-prep-courses',
      label: 'Licenses, certifications, and prep courses',
    });
  }
  if (lcResultsMatch) {
    crumbs.push({
      href:
        '/education/gi-bill-comparison-tool/licenses-certifications-and-prep-courses/results',
      label: 'Search results',
    });
  }
  if (lcResultInfoMatch) {
    crumbs.push({
      href: `/education/gi-bill-comparison-tool/licenses-certifications-and-prep-courses/results/${
        lcResultInfoMatch.params.type
      }/${lcResultInfoMatch.params.id}/${lcResultInfoMatch.params.name}`,
      label: lcResultInfoMatch.params.name,
    });
  }

  return (
    <div className="row">
      <VaBreadcrumbs uswds breadcrumbList={crumbs} />
    </div>
  );
};

export default GiBillBreadcrumbs;
