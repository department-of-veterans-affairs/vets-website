import { submitToUrl } from 'platform/forms-system/src/js/actions';

export const buildEventData = formData => {
  const debtCount = formData?.selectedDebts?.length;
  return {
    'debt-count': debtCount,
  };
};

const submitForm = (form, formConfig) => {
  const { submitUrl, trackingPrefix } = formConfig;
  // Optional transform
  // const body = formConfig.transformForSubmit(formConfig, form);

  const stringyFormData = JSON.stringify(form.data);

  // eventData for analytics
  const eventData = buildEventData(form.data);
  return submitToUrl(stringyFormData, submitUrl, trackingPrefix, eventData);
};

export default submitForm;
