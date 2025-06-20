import * as Sentry from '@sentry/browser';
import { apiRequest } from 'platform/utilities/api';
import recordEvent from 'platform/monitoring/record-event';
import { handlePdfGeneration } from '../utils/pdfHelpers';

export const buildEventData = formData => {
  const debtCount = formData?.selectedDebts?.length;
  return {
    'debt-count': debtCount,
  };
};

const submitForm = (form, formConfig) => {
  const { submitUrl, trackingPrefix } = formConfig;
  const body = formConfig.transformForSubmit(formConfig, form);
  const eventData = buildEventData(body);

  return handlePdfGeneration(body)
    .then(response => {
      // response should be a FormData object with the generated PDFs
      return apiRequest(submitUrl, {
        method: 'POST',
        body: response,
      }).then(apiResponse => {
        // let's find a cleaner way to send the success event
        if (apiResponse.errors) {
          throw new Error('API submission failed', apiResponse.errors);
        }

        // Log the successful submission event
        recordEvent({
          event: `${trackingPrefix}-submit-success`,
          ...eventData,
        });
        return apiResponse;
      });
    })
    .catch(error => {
      Sentry.withScope(scope => {
        scope.setExtra('error', error);
        Sentry.captureMessage(
          `Dispute Debt pdf generation failed in submitForm: ${error.detail}`,
        );
      });
    });
};

export default submitForm;
