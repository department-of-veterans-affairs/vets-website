import { submitToUrl } from 'platform/forms-system/src/js/actions';
import { transformForSubmit } from 'platform/forms-system/src/js/helpers';
import { SHOW_PART3 } from '../constants';

// Analytics event
export const buildEventData = () => {};

const submitForm = (form, formConfig) => {
  const { trackingPrefix } = formConfig;
  const submitUrl = form.data[SHOW_PART3]
    ? formConfig.submitUrlV2
    : formConfig.submitUrl;
  const body = formConfig.transformForSubmit
    ? formConfig.transformForSubmit(formConfig, form)
    : transformForSubmit(formConfig, form);

  // eventData for analytics
  const eventData = buildEventData(form.data);
  return submitToUrl(body, submitUrl, trackingPrefix, eventData);
};

export default submitForm;
