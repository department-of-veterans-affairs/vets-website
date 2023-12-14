import React from 'react';
import { BASE_URL } from '../constants';

export default function EnrollmentVerificationBreadcrumbs() {
  const breadcrumbs = [
    <a href="/" key="home">
      Home
    </a>,
    <a href="/education/" key="education-and-training">
      Education and training
    </a>,
    <a href={BASE_URL} key="enrollment-history">
      Verify your school enrollments for [BENEFIT TYPE] benefits
    </a>,
  ];

  return <va-breadcrumbs>{breadcrumbs}</va-breadcrumbs>;
}
