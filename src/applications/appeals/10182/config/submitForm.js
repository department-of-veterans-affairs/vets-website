import { submitToUrl } from 'platform/forms-system/src/js/actions';
import environment from 'platform/utilities/environment';

// Analytics event
export const buildEventData = () => {};

const submitForm = (form, formConfig) => {
  const { trackingPrefix } = formConfig;
  // v1 (add part III data)
  const submitUrl = `${environment.API_URL}/v1/${formConfig.submitUrl}`;
  const body = formConfig.transformForSubmit(formConfig, form);

  // eventData for analytics
  const eventData = buildEventData(form.data);
  return submitToUrl(body, submitUrl, trackingPrefix, eventData);
};

export default submitForm;
