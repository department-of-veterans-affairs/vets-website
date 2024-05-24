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
    <a href="/" key="home">
      Home
    </a>,
    <a href="/education/" key="education-and-training">
      Education and training
    </a>,
    <a
      href="/education/verify-school-enrollment/"
      key="verify-school-enrollment"
    >
      Verify your school enrollment for GI Bill benefits
    </a>,
    <a href={BASE_URL} key="enrollment-verification-page">
      Montgomery GI Bill enrollment verification
    </a>,
  ];

  // Get the last non-empty segment of the URL.
  const page = window.location.href
    .split('/')
    .reverse()
    .find(s => !!s.trim() && !s.startsWith('?'));

  if ([BENEFITS_PROFILE_URL_SEGMENT].includes(page)) {
    breadcrumbs.push(
      <a href={BENEFITS_PROFILE_URL} key="BenefitsProfilePage">
        Your Montgomery GI Bill benefits information
      </a>,
    );
  }

  if ([VERIFICATION_REVIEW_URL_SEGMENT].includes(page)) {
    breadcrumbs.push(
      <a href={VERIFICATION_PROFILE_URL} key="VerificationReviewPage">
        Verify your enrollment
      </a>,
    );
  }
  return <va-breadcrumbs uswds="false">{breadcrumbs}</va-breadcrumbs>;
}
