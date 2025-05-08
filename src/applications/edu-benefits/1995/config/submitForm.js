import { submitToUrl } from '@department-of-veterans-affairs/platform-forms-system/actions';
import { buildSubmitEventData } from '../helpers';

const submitForm = (form, formConfig) => {
  const body = formConfig.transformForSubmit(formConfig, form);

  return submitToUrl(
    body,
    formConfig.submitUrl,
    formConfig.trackingPrefix,
    buildSubmitEventData(form.data),
  );
};

export default submitForm;
