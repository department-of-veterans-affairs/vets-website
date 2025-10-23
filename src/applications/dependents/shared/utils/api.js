import recordEvent from 'platform/monitoring/record-event';
import { removeFormApi } from 'platform/forms/save-in-progress/api';

export async function deleteInProgressForm(formId) {
  return removeFormApi(formId)
    .then(() => {
      recordEvent({
        event: 'dependents-verification-delete-in-progress-form-success',
      });
    })
    .catch(() => {
      recordEvent({
        event: 'dependents-verification-delete-in-progress-form-failure',
      });
    });
}
