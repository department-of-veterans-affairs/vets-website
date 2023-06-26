import { submitToUrl } from 'platform/forms-system/src/js/actions';
import { transformForSubmit } from 'platform/forms-system/src/js/helpers';
import { DEBT_TYPES } from '../constants';

// Analytics event
export const buildEventData = ({
  selectedDebtsAndCopays,
  'view:enhancedFinancialStatusReport': enhancedFlag,
}) => {
  const eventData = {
    'enhanced-submission': enhancedFlag,
  };

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
  const { submitUrl, trackingPrefix } = formConfig;
  const body = formConfig.transformForSubmit
    ? formConfig.transformForSubmit(formConfig, form)
    : transformForSubmit(formConfig, form);

  // eventData for analytics
  const eventData = buildEventData(form.data);
  return submitToUrl(body, submitUrl, trackingPrefix, eventData);
};

export default submitForm;
