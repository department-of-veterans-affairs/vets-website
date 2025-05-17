import { submitToUrl } from 'platform/forms-system/src/js/actions';

export const buildEventData = formData => {
  const debtCount = formData?.selectedDebts?.length;
  return {
    'debt-count': debtCount,
  };
};

const submitForm = (form, formConfig) => {
  const { submitUrl, trackingPrefix } = formConfig;

  const body = formConfig.transformForSubmit(formConfig, form);

  const stringyFormData = JSON.stringify(body);

  // eventData for analytics
  const eventData = buildEventData(body);
  return submitToUrl(stringyFormData, submitUrl, trackingPrefix, eventData);
};

export default submitForm;
