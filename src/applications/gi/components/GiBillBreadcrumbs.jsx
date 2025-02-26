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
  const giCtCollab = useToggleValue(TOGGLE_NAMES.giCtCollab);
  const location = useLocation();

  const schoolsEmployersMatch = useRouteMatch('/schools-and-employers');
  const profileMatch = useRouteMatch(
    '/institution/:facilityCode' ||
      '/schools-and-employers/institution/:facilityCode',
  );
  const compareMatch = location.pathname.includes('/compare');
  const ProgramsTypeMatch = useRouteMatch(
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
      label: `Schools and employers ${
        searchByName && !location.pathname.includes('institution')
          ? '(Search by name)'
          : ''
      }${searchByLocationPage ? '(Search by location}' : ''}`,
    });
  }

  if (profileMatch) {
    crumbs.push({
      href: `/education/gi-bill-comparison-tool/${
        giCtCollab ? 'schools-and-employers/' : ''
      }institution/${profileMatch.params.facilityCode}`,
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
  if (ProgramsTypeMatch) {
    crumbs.push({
      href: `${giCtCollab ? '/schools-and-employers' : ''}/institution/${
        ProgramsTypeMatch.params.facilityCode
      }/${ProgramsTypeMatch.params.programType}`,
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
