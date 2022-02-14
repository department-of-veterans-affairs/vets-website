import React from 'react';
import Breadcrumbs from '@department-of-veterans-affairs/component-library/Breadcrumbs';

export default function EnrollmentVerificationBreadcrumbs() {
  const breadcrumbs = [
    <a href="/" key="home">
      Home
    </a>,
    <a href="/" key="education-and-training">
      Education and training
    </a>,
  ];

  // Get the last non-empty segment of the URL.
  const page = window.location.href
    .split('/')
    .reverse()
    .find(s => !!s.trim());

  if (page === 'enrollment-history' || page === 'verify-enrollments') {
    breadcrumbs.push(
      <a href="/" key="enrollment-history">
        Verify your school enrollments
      </a>,
    );
  } else if (page === 'review-enrollments') {
    breadcrumbs.push(
      <a href="/" key="review-enrollments">
        Enrollment verifications
      </a>,
    );
  }
  if (page === 'verify-enrollments') {
    breadcrumbs.push(
      <a href="/" key="verify-enrollments">
        Verify your enrollments
      </a>,
    );
  }

  return <Breadcrumbs>{breadcrumbs}</Breadcrumbs>;
}
