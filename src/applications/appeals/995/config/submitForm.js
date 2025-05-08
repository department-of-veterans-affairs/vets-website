import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import { submitToUrl } from '@department-of-veterans-affairs/platform-forms-system/actions';
import { transform } from './submit-transformer';

// Analytics event
export const buildEventData = () => {};

const submitForm = (form, formConfig) => {
  const { submitUrl, trackingPrefix } = formConfig;
  const body = transform(formConfig, form);

  const url = `${environment.API_URL}${submitUrl}`;

  // eventData for analytics
  const eventData = buildEventData(form.data);
  return submitToUrl(body, url, trackingPrefix, eventData);
};

export default submitForm;
