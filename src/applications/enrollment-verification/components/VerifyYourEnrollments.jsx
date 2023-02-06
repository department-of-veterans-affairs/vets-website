import React, { useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import {
  VERIFY_ENROLLMENTS_RELATIVE_URL,
  VERIFY_ENROLLMENTS_URL,
} from '../constants';

export default function VerifyYourEnrollments() {
  const history = useHistory();

  const onVerifyAllEnrollments = useCallback(
    event => {
      if (history) {
        event.preventDefault();
        history.push(VERIFY_ENROLLMENTS_RELATIVE_URL);
      }
    },
    [history],
  );

  return (
    <a
      className="vads-c-action-link--blue ev-action-link"
      href={VERIFY_ENROLLMENTS_URL}
      onClick={onVerifyAllEnrollments}
    >
      Verify your enrollment
    </a>
  );
}
