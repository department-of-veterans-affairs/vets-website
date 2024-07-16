import React from 'react';
import {
  BASE_URL,
  BENEFITS_PROFILE_URL_SEGMENT,
  BENEFITS_PROFILE_URL,
  VERIFICATION_PROFILE_URL,
  VERIFICATION_REVIEW_URL_SEGMENT,
} from '../constants';

export default function EnrollmentVerificationBreadcrumbs() {
  const breadcrumbs = [
    { href: '/', label: 'Home' },
    { href: '/education/', label: 'Education and training' },
    {
      href: '/education/verify-school-enrollment/',
      label: 'Verify your school enrollment for GI Bill benefits',
    },
    {
      href: BASE_URL,
      label: 'Montgomery GI Bill enrollment verification',
    },
  ];

  // Get the last non-empty segment of the URL.
  const page = window.location.href
    .split('/')
    .reverse()
    .find(s => !!s.trim() && !s.startsWith('?'));
  if ([BENEFITS_PROFILE_URL_SEGMENT].includes(page)) {
    breadcrumbs.push({
      href: BENEFITS_PROFILE_URL,
      label: 'Your Montgomery GI Bill benefits information',
    });
  }

  if ([VERIFICATION_REVIEW_URL_SEGMENT].includes(page)) {
    breadcrumbs.push({
      href: VERIFICATION_PROFILE_URL,
      label: 'Verify your enrollment',
    });
  }

  const bcString = JSON.stringify(breadcrumbs);
  return (
    <div className="bread-crumbs-container">
      <va-breadcrumbs breadcrumb-list={bcString} label="Breadcrumb" wrapping />;
    </div>
  );
}
