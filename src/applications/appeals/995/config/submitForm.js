import environment from 'platform/utilities/environment';
import { submitToUrl } from 'platform/forms-system/src/js/actions';
import { transform } from './submit-transformer';

import { NEW_API, SUBMIT_URL_NEW } from '../constants/apis';

// Analytics event
export const buildEventData = () => {};

const submitForm = (form, formConfig) => {
  const { submitUrl, trackingPrefix } = formConfig;
  const body = transform(formConfig, form);

  const url = `${environment.API_URL}${
    form.data[NEW_API] ? `/${SUBMIT_URL_NEW.join('')}` : submitUrl
  }`;

  // eventData for analytics
  const eventData = buildEventData(form.data);
  return submitToUrl(body, url, trackingPrefix, eventData);
};

export default submitForm;
