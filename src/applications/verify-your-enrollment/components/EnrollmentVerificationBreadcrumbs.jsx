import React from 'react';
import {
  BASE_URL,
  BENEFITS_PROFILE_URL_SEGMENT,
  BENEFITS_PROFILE_URL,
} from '../constants';

export default function EnrollmentVerificationBreadcrumbs() {
  const breadcrumbs = [
    <a href="/" key="home">
      Home
    </a>,
    <a href="/education/" key="education-and-training">
      Education and training
    </a>,
    <a href={BASE_URL} key="enrollment-verification-page">
      GI Bill® enrollment verifications
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
        Benefits profile
      </a>,
    );
  }
  return <va-breadcrumbs>{breadcrumbs}</va-breadcrumbs>;
}
