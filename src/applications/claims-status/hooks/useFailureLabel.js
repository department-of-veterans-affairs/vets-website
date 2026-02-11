import { useMemo } from 'react';
import { getFailedSubmissionsWithinLast30Days } from '../utils/helpers';
import { useSlimAlertRegistration } from '../contexts/Type2FailureAnalyticsContext';

export default function useFailureLabel(evidenceSubmissions, alertKey) {
  const failedSubmissions = useMemo(
    () => getFailedSubmissionsWithinLast30Days(evidenceSubmissions),
    [evidenceSubmissions],
  );

  const hasFailures = failedSubmissions.length > 0;
  useSlimAlertRegistration({ alertKey, hasFailures });

  return {
    failureLabel: hasFailures ? 'Resubmit Needed' : null,
    failedSubmissions,
  };
}
