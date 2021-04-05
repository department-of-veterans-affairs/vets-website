import { submitToUrl } from 'platform/forms-system/src/js/actions';
import { transform } from '../utils/transform';

const submitForm = (form, formConfig) => {
  const { submitUrl, trackingPrefix } = formConfig;
  const body = transform(form);
  return submitToUrl(body, submitUrl, trackingPrefix);
};

export default submitForm;
