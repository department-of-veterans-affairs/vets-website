import React from 'react';
import {
  BASE_URL,
  REVIEW_ENROLLMENTS_URL,
  REVIEW_ENROLLMENTS_URL_SEGMENT,
  VERIFY_ENROLLMENTS_RELATIVE_URL,
  VERIFY_ENROLLMENTS_URL_SEGMENT,
} from '../constants';

export default function EnrollmentVerificationBreadcrumbs() {
  const breadcrumbs = [
    <a href="/" key="home">
      Home
    </a>,
    <a href="/education/" key="education-and-training">
      Education and training
    </a>,
    <a href={BASE_URL} key="enrollment-history">
      Verify your school enrollments
    </a>,
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
    breadcrumbs.push(
      <a href={REVIEW_ENROLLMENTS_URL} key="review-enrollments">
        Post-9/11 GI Bill enrollment verifications
      </a>,
    );
  }

  if (page === VERIFY_ENROLLMENTS_URL_SEGMENT) {
    breadcrumbs.push(
      <a href={VERIFY_ENROLLMENTS_RELATIVE_URL} key="verify-enrollments">
        Verify your enrollments
      </a>,
    );
  }

  return <va-breadcrumbs>{breadcrumbs}</va-breadcrumbs>;
}
