import { submitToUrl } from 'platform/forms-system/src/js/actions';
import environment from 'platform/utilities/environment';

import { SHOW_PART3 } from '../constants';

// Analytics event
export const buildEventData = () => {};

const submitForm = (form, formConfig) => {
  const { trackingPrefix } = formConfig;
  // v1 (add part III data)
  const apiVer = form.data[SHOW_PART3] ? 'v1' : 'v0';
  const submitUrl = `${environment.API_URL}/${apiVer}/${formConfig.submitUrl}`;
  const body = formConfig.transformForSubmit(formConfig, form);

  // eventData for analytics
  const eventData = buildEventData(form.data);
  return submitToUrl(body, submitUrl, trackingPrefix, eventData);
};

export default submitForm;
