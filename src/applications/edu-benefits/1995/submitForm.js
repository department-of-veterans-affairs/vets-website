import { submitToUrl } from 'platform/forms-system/src/js/actions';
import { transformForSubmit } from 'platform/forms-system/src/js/helpers';
import { display1995StemFlow, buildSubmitEventData } from './helpers';

const submitForm = (form, formConfig) => {
  const body = formConfig.transformForSubmit
    ? formConfig.transformForSubmit(formConfig, form)
    : transformForSubmit(formConfig, form);

  const submitUrl = display1995StemFlow(form.data)
    ? formConfig.submitUrl.replace('1995', '1995s')
    : formConfig.submitUrl;

  return submitToUrl(
    body,
    submitUrl,
    formConfig.trackingPrefix,
    buildSubmitEventData(form.data),
  );
};

export default submitForm;
