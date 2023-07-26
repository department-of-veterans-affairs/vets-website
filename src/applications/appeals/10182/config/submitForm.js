import { submitToUrl } from 'platform/forms-system/src/js/actions';
import { transformForSubmit } from 'platform/forms-system/src/js/helpers';
import environment from 'platform/utilities/environment';

import { SHOW_PART3 } from '../constants';

// Analytics event
export const buildEventData = () => {};

const submitForm = (form, formConfig) => {
  const { trackingPrefix } = formConfig;
  // update once v2 (add part III data) is available
  const submitUrl = form.data[SHOW_PART3]
    ? `${environment.API_URL}/v0/notice_of_disagreements`
    : formConfig.submitUrl;
  const body = formConfig.transformForSubmit
    ? formConfig.transformForSubmit(formConfig, form)
    : transformForSubmit(formConfig, form);

  // eventData for analytics
  const eventData = buildEventData(form.data);
  return submitToUrl(body, submitUrl, trackingPrefix, eventData);
};

export default submitForm;
