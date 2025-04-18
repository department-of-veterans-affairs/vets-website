import { submitToUrl } from 'platform/forms-system/src/js/actions';

const submitForm = (form, formConfig) => {
  const body = formConfig.transformForSubmit(formConfig, form);

  return submitToUrl(
    body,
    formConfig.submitUrl,
    formConfig.trackingPrefix,
    // buildSubmitEventData(form.data),
  );
};
export default submitForm;
