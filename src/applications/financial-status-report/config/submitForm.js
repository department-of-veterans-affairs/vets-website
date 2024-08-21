import { submitToUrl } from 'platform/forms-system/src/js/actions';
import environment from 'platform/utilities/environment';
import { transformForSubmit } from 'platform/forms-system/src/js/helpers';
import { DEBT_TYPES } from '../constants';
import {
  isStreamlinedShortForm,
  isStreamlinedLongForm,
} from '../utils/streamlinedDepends';

// Helper function to determine the streamlined value based on the provided flags
const getStreamlinedValue = (isStreamlinedShort, isStreamlinedLong) => {
  if (isStreamlinedShort) return 'streamlined-short';
  if (isStreamlinedLong) return 'streamlined-long';
  return 'streamlined-false';
};

// Helper function to determine the submission type based on selected debts and copays
const getSubmissionType = selectedDebtsAndCopays => {
  if (!selectedDebtsAndCopays.length) return 'debt-submission';

  const hasDebts = selectedDebtsAndCopays.some(
    selected => selected.debtType === DEBT_TYPES.DEBT,
  );
  const hasCopays = selectedDebtsAndCopays.some(
    selected => selected.debtType === DEBT_TYPES.COPAY,
  );

  if (hasDebts && hasCopays) return 'combo-submission';
  if (hasDebts && !hasCopays) return 'debt-submission';
  if (!hasDebts && hasCopays) return 'copay-submission';

  return 'err-submission'; // Default error type if no matching conditions
};

// Main function to build the event data object
export const buildEventData = ({
  selectedDebtsAndCopays,
  'view:enhancedFinancialStatusReport': enhancedFlag,
  isStreamlinedShort,
  isStreamlinedLong,
}) => {
  return {
    'enhanced-submission': enhancedFlag,
    streamlined: getStreamlinedValue(isStreamlinedShort, isStreamlinedLong), // Get the streamlined value
    'submission-type': getSubmissionType(selectedDebtsAndCopays), // Get the submission type
  };
};

// Function to handle form submission
const submitForm = (form, formConfig) => {
  // Destructure the formConfig object to get the URL and tracking prefix
  const { submitUrl, trackingPrefix } = formConfig;
  const { flippers = {} } = form.data;
  const { serverSideTransform = false } = flippers;

  // Transform the form data for submission
  const body = formConfig.transformForSubmit
    ? formConfig.transformForSubmit(formConfig, form)
    : transformForSubmit(formConfig, form);

  const isStreamlinedShort = isStreamlinedShortForm(form.data);
  const isStreamlinedLong = isStreamlinedLongForm(form.data);

  // Build the eventData object, including the streamlined property
  const eventData = buildEventData({
    ...form.data,
    isStreamlinedShort,
    isStreamlinedLong,
  });

  // adjusting the submitUrl based on feature flag
  const newSubmitUrl = serverSideTransform
    ? `${
        environment.API_URL
      }/debts_api/v0/financial_status_reports/transform_and_submit`
    : submitUrl;

  // transform_and_submit is expecting the whole striingified formData
  const formDataBody = JSON.stringify(form.data);
  const submitBody = serverSideTransform ? formDataBody : body;

  // Submit the form data to the specified URL, with the tracking prefix and eventData
  return submitToUrl(submitBody, newSubmitUrl, trackingPrefix, eventData);
};

export default submitForm;
