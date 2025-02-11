import { submitToUrl } from 'platform/forms-system/src/js/actions';
import environment from 'platform/utilities/environment';

// Analytics event
export const buildEventData = () => {};

const submitForm = (form, formConfig) => {
  const { submitUrl, trackingPrefix } = formConfig;
  const body = formConfig.transformForSubmit(formConfig, form);

  const url = `${environment.API_URL}${submitUrl}`;

  // eventData for analytics
  const eventData = buildEventData(form.data);
  return submitToUrl(body, url, trackingPrefix, eventData);
};

export default submitForm;
