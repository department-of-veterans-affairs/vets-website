import React from 'react';
import { VERIFY_ENROLLMENTS_URL } from '../constants';

export default function VerifyYourEnrollments() {
  return (
    <a
      className="vads-c-action-link--blue ev-action-link"
      href={VERIFY_ENROLLMENTS_URL}
    >
      Verify all enrollments
    </a>
  );
}
