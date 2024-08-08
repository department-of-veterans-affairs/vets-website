import React from 'react';
import { VaBreadcrumbs } from '@department-of-veterans-affairs/web-components/react-bindings';

import {
  REVIEW_ENROLLMENTS_URL,
  REVIEW_ENROLLMENTS_URL_SEGMENT,
  VERIFY_ENROLLMENTS_ERROR_URL_SEGMENT,
  VERIFY_ENROLLMENTS_RELATIVE_URL,
  VERIFY_ENROLLMENTS_URL_SEGMENT,
} from '../constants';

export default function EnrollmentVerificationBreadcrumbs() {
  const breadcrumbsArray = [
    {
      href: '/',
      label: 'Home',
    },
    {
      href: '/education/',
      label: 'Education and Training',
    },
    {
      href: '/education/verify-school-enrollment/',
      label: 'Verify your school enrollment',
    },
  ];

  // Get the last non-empty segment of the URL.
  const page = window.location.href
    .split('/')
    .reverse()
    .find(s => !!s.trim() && !s.startsWith('?'));

  if (
    [REVIEW_ENROLLMENTS_URL_SEGMENT, VERIFY_ENROLLMENTS_URL_SEGMENT].includes(
      page,
    )
  ) {
    breadcrumbsArray.push({
      href: `${REVIEW_ENROLLMENTS_URL}`,
      label: 'Post-9/11 GI Bill enrollment verifications',
    });
  }

  if (
    [
      VERIFY_ENROLLMENTS_URL_SEGMENT,
      VERIFY_ENROLLMENTS_ERROR_URL_SEGMENT,
    ].includes(page)
  ) {
    breadcrumbsArray.push({
      href: `${VERIFY_ENROLLMENTS_RELATIVE_URL}`,
      label: 'Verify your enrollments',
    });
  }

  return (
    <>
      <div className="row">
        <div className="vads-u-margin-bottom--4">
          <VaBreadcrumbs
            breadcrumbList={[...breadcrumbsArray]}
            label="Breadcrumb"
            wrapping
          />
        </div>
      </div>
    </>
  );
}
