import * as Sentry from '@sentry/browser';
import { apiRequest } from 'platform/utilities/api';
import recordEvent from 'platform/monitoring/record-event';
import { handlePdfGeneration } from '../utils/pdfHelpers';

// only capturing counts here, no PII
const buildEventData = ({ education = {}, compAndPen = {} }) => {
  const educationDebtCount = education?.selectedDebts?.length;
  const compAndPenDebtCount = compAndPen?.selectedDebts?.length;
  return {
    'dispute-education-count': educationDebtCount,
    'dispute-compAndPen-count': compAndPenDebtCount,
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
      // Log the unsuccessful submission event
      recordEvent({
        event: `${trackingPrefix}-submit-failure`,
        ...eventData,
      });

      Sentry.withScope(scope => {
        scope.setExtra('error', error);

        // Capturing specific error messages for better debugging
        if (error?.errors?.files) {
          Sentry.captureMessage(
            `Dispute Debt - PDF - handlePdfGeneration files failed: ${
              error.errors.files[0]
            }`,
          );
        } else {
          Sentry.captureMessage(
            `Dispute Debt - PDF - generation failed in submitForm: ${error}`,
          );
        }
      });
    });
};

export default submitForm;
