import { submitToUrl } from 'platform/forms-system/src/js/actions';
import { transformForSubmit } from 'platform/forms-system/src/js/helpers';
import { DEBT_TYPES } from '../constants';
import {
  isStreamlinedShortForm,
  isStreamlinedLongForm,
} from '../utils/streamlinedDepends';
// Analytics event
export const buildEventData = ({
  selectedDebtsAndCopays,
  'view:enhancedFinancialStatusReport': enhancedFlag,
  isStreamlinedShort,
  isStreamlinedLong,
}) => {
  const eventData = {
    'enhanced-submission': enhancedFlag,
  };

  // If the form is a streamlined short form, set the streamlined property accordingly
  if (isStreamlinedShort) {
    return {
      ...eventData,
      streamlined: 'streamlined-short',
    };
  }

  // If the form is a streamlined long form, set the streamlined property accordingly
  if (isStreamlinedLong) {
    return {
      ...eventData,
      streamlined: 'streamlined-long',
    };
  }

  // If the form is neither streamlined short nor long, set the streamlined property to false
  if (!isStreamlinedLong && !isStreamlinedShort) {
    return {
      ...eventData,
      streamlined: 'streamlined-false',
    };
  }

  // temp - Handling empty selectedDebtsAndCopays
  if (!selectedDebtsAndCopays.length) {
    return {
      ...eventData,
      'submission-type': 'debt-submission',
    };
  }

  // Check types of debts and copays selected
  const hasDebts = selectedDebtsAndCopays.some(
    selected => selected.debtType === DEBT_TYPES.DEBT,
  );
  const hasCopays = selectedDebtsAndCopays.some(
    selected => selected.debtType === DEBT_TYPES.COPAY,
  );

  if (hasDebts && hasCopays) {
    return {
      ...eventData,
      'submission-type': 'combo-submission',
    };
  }

  if (hasDebts && !hasCopays) {
    return {
      ...eventData,
      'submission-type': 'debt-submission',
    };
  }

  if (!hasDebts && hasCopays) {
    return {
      ...eventData,
      'submission-type': 'copay-submission',
    };
  }

  // This should never happen
  return {
    ...eventData,
    'submission-type': 'err-submission',
  };
};

const submitForm = (form, formConfig) => {
  // Determine if the form is a streamlined short or long form
  const isStreamlinedShort = isStreamlinedShortForm(form.data);
  const isStreamlinedLong = isStreamlinedLongForm(form.data);

  // Destructure the formConfig object to get the URL and tracking prefix
  const { submitUrl, trackingPrefix } = formConfig;

  // Transform the form data for submission
  // If a custom transform function is provided in formConfig, use that; otherwise, use the default
  const body = formConfig.transformForSubmit
    ? formConfig.transformForSubmit(formConfig, form)
    : transformForSubmit(formConfig, form);

  // Build the eventData object, including the streamlined property
  // This object is used for analytics tracking
  const eventData = buildEventData({
    ...form.data,
    isStreamlinedShort,
    isStreamlinedLong,
  });

  // Submit the form data to the specified URL, with the tracking prefix and eventData
  return submitToUrl(body, submitUrl, trackingPrefix, eventData);
};

export default submitForm;
